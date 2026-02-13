import { BookingRepository } from "../repositories/booking.repository";
import { BookingPolicy } from "../utils/validation/booking.policy";
import { getCalendarAuth, deleteCalendarEvent, checkCalendarConflict, createBookingEvent } from "@/src/utils/google-calendar";
import { createZoomMeeting, deleteZoomMeeting } from "@/src/utils/zoom";
import { loadServerMessages } from "@/messages/server";
import { EmailService } from "./email.service";
import { generateICS } from "./generateEmail";
import { convertJSTToUserTimezone, hashCode, weeklySlots } from "../utils/slots";
import { query } from "../utils/neon";
import { BookingPayload } from "@/src/types/booking";

export const BookingService = {
	/**
	 * INITIAL BOOKING
	 */
	async createBooking(payload: BookingPayload, sessionId: string, locale: string = "ja") {
		try {
			// 1. Timing Logic (JST)
			const start = new Date(`${payload.date}T${payload.time}:00+09:00`);
			const end = new Date(start.getTime() + 30 * 60 * 1000);

			// 2. Policy Check
			const policy = BookingPolicy.canModify(start);
			if (!policy.allowed) throw new Error("NEW_TIME_TOO_SOON");

			// 🔒 ACQUIRE LOCK
			const lockKey = Math.abs(hashCode(`${payload.date}-${payload.time}`));
			await query(`SELECT pg_advisory_lock($1)`, [lockKey]);

			try {
				// 3. Conflict Check
				await checkCalendarConflict(start, end); // Throws or returns boolean

				// 4 & 5. External Events IN PARALLEL
				const zoomTopic = `(Profitize) Free Consultation X ${payload.firstName} ${payload.lastName}`;

				const [zoomData, gCalEvent] = await Promise.all([
					createZoomMeeting(zoomTopic, start, 30, [
						{
							email: payload.email,
							firstName: payload.firstName,
							lastName: payload.lastName,
						},
					]),
					createBookingEvent({
						summary: zoomTopic,
						description: `Free consultation with ${payload.firstName} ${payload.lastName}\nEmail: ${payload.email}\nPhone: ${payload.phone}`,
						start,
						end,
					}),
				]);

				const userZoomLink = zoomData.registrantLinks[payload.email];

				// 6. Save to DB
				const booking = await BookingRepository.createInitial({
					...payload,
					sessionId,
					zoomId: String(zoomData.meeting.id),
					zoomUrl: userZoomLink,
					calendarId: gCalEvent.id ?? undefined,
					eventDate: start.toISOString(),
				});

				// 7. Send Emails (Non-blocking)
				(async () => {
					try {
						const messages = await loadServerMessages(locale);
						const managementUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://profitize.jp"}/${locale}/free-consultation/manage/${booking.cancellation_token}`;

						const icsContent = generateICS({
							start,
							end,
							title: zoomTopic,
							description: "Your free consultation session",
							location: "Zoom Meeting",
						});

						await Promise.all([
							EmailService.sendUserConfirmation({
								locale,
								userData: payload,
								userZoomLink,
								managementUrl,
								messages,
								icsContent,
								fromEmail: process.env.FROM_EMAIL || "",
								toEmail: payload.email,
							}),
							EmailService.sendLecturerNotification({
								userData: payload,
								messages,
								fromEmail: process.env.FROM_EMAIL || "",
								toEmail: process.env.LECTURER_EMAIL || "",
							}),
						]);
					} catch (emailError) {
						console.error("Email Error:", emailError);
					}
				})();

				return { booking, sessionId };
			} finally {
				await query(`SELECT pg_advisory_unlock($1)`, [lockKey]);
			}
		} catch (error) {
			throw error;
		}
	},

	/**
	 * RESCHEDULE BOOKING
	 */
	async rescheduleBooking(token: string, date: string, time: string, locale: string = "ja") {
		const oldBooking = await BookingRepository.findByToken(token);
		if (!oldBooking) throw new Error("BOOKING_NOT_FOUND");
		if (oldBooking.status !== "confirmed") throw new Error("INVALID_STATUS");

		const oldPolicy = BookingPolicy.canModify(oldBooking.event_date);
		if (!oldPolicy.allowed) throw new Error("TOO_LATE_TO_RESCHEDULE");

		const newStart = new Date(`${date}T${time}:00+09:00`);
		const newEnd = new Date(newStart.getTime() + 30 * 60 * 1000);

		if (!BookingPolicy.canModify(newStart).allowed) throw new Error("NEW_TIME_TOO_SOON");

		const lockKey = Math.abs(hashCode(`${date}-${time}`));
		await query(`SELECT pg_advisory_lock($1)`, [lockKey]);

		try {
			const calendar = getCalendarAuth();
			const existing = await calendar.events.list({
				calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
				timeMin: newStart.toISOString(),
				timeMax: newEnd.toISOString(),
				singleEvents: true,
			});

			if (existing.data.items && existing.data.items.length > 0) {
				throw new Error("TIME_SLOT_OCCUPIED");
			}

			// Cleanup Old
			if (oldBooking.google_calendar_event_id) await deleteCalendarEvent(oldBooking.google_calendar_event_id).catch(console.error);
			if (oldBooking.zoom_meeting_id) await deleteZoomMeeting(oldBooking.zoom_meeting_id).catch(console.error);

			// Create New
			const zoomTopic = `(Profitize) Free Consultation X ${oldBooking.first_name} ${oldBooking.last_name}`;
			const { meeting, registrantLinks } = await createZoomMeeting(zoomTopic, newStart, 30, [
				{
					email: oldBooking.email,
					firstName: oldBooking.first_name,
					lastName: oldBooking.last_name,
				},
			]);
			const userZoomLink = registrantLinks[oldBooking.email];

			const calendarResponse = await calendar.events.insert({
				calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
				requestBody: {
					summary: zoomTopic,
					description: `Rescheduled from ${new Date(oldBooking.event_date).toLocaleString()}\nZoom: ${userZoomLink}`,
					start: { dateTime: newStart.toISOString(), timeZone: "Asia/Tokyo" },
					end: { dateTime: newEnd.toISOString(), timeZone: "Asia/Tokyo" },
				},
			});

			const newBooking = await BookingRepository.createRescheduled(oldBooking, {
				eventDate: newStart.toISOString(),
				calendarId: calendarResponse.data.id ?? undefined,
				zoomId: String(meeting.id),
				zoomUrl: userZoomLink,
			});

			await BookingRepository.updateStatus(oldBooking.id, "rescheduled");

			const messages = await loadServerMessages(locale);
			const managementUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/free-consultation/manage/${newBooking.cancellation_token}`;

			await Promise.all([
				EmailService.sendRescheduleUser({
					locale,
					firstName: oldBooking.first_name,
					lastName: oldBooking.last_name,
					email: oldBooking.email,
					oldEventDate: new Date(oldBooking.event_date),
					newStart,
					newEnd,
					userZoomLink,
					managementUrl,
					messages,
					fromEmail: process.env.FROM_EMAIL || "",
					toEmail: oldBooking.email,
				}),
				EmailService.sendRescheduleLecturer(oldBooking.first_name, oldBooking.last_name, new Date(oldBooking.event_date), newStart, process.env.FROM_EMAIL || "", process.env.LECTURER_EMAIL || ""),
			]);

			return newBooking;
		} finally {
			await query(`SELECT pg_advisory_unlock($1)`, [lockKey]);
		}
	},

	/**
	 * CANCEL BOOKING
	 */
	async cancelBooking(token: string, locale: string = "ja") {
		const baseBooking = await BookingRepository.findByToken(token);
		if (!baseBooking) throw new Error("BOOKING_NOT_FOUND");

		const latestBooking = (await BookingRepository.findLatestChild(baseBooking.id)) || baseBooking;
		if (latestBooking.status !== "confirmed") throw new Error(`CANNOT_CANCEL_STATUS_${latestBooking.status}`);

		const policy = BookingPolicy.canModify(latestBooking.event_date);
		if (!policy.allowed) throw new Error(policy.isPast ? "PAST_EVENT" : "POLICY_VIOLATION");

		await BookingRepository.updateStatus(latestBooking.id, "cancelled");

		const cleanupTasks: Promise<unknown>[] = [];
		if (latestBooking.google_calendar_event_id) cleanupTasks.push(deleteCalendarEvent(latestBooking.google_calendar_event_id));
		if (latestBooking.zoom_meeting_id) cleanupTasks.push(deleteZoomMeeting(latestBooking.zoom_meeting_id));

		try {
			const messages = await loadServerMessages(locale);
			await Promise.all([
				...cleanupTasks.map((p) => p.catch((err) => console.error("Cleanup Error:", err))),
				EmailService.sendCancelUser({
					locale,
					firstName: latestBooking.first_name,
					lastName: latestBooking.last_name,
					email: latestBooking.email,
					eventDate: new Date(latestBooking.event_date),
					messages,
					fromEmail: process.env.FROM_EMAIL || "",
					toEmail: latestBooking.email,
				}),
				EmailService.sendCancelLecturer(latestBooking.first_name, latestBooking.last_name, latestBooking.email, new Date(latestBooking.event_date), process.env.FROM_EMAIL || "", process.env.LECTURER_EMAIL || ""),
			]);
		} catch (criticalError) {
			console.error("Post-cancellation error:", criticalError);
		}

		return { success: true };
	},

	/**
	 * MANAGEMENT DATA
	 */
	async getBookingManagementData(token: string) {
		const base = await BookingRepository.findByToken(token);
		if (!base) throw new Error("BOOKING_NOT_FOUND");

		const latest = (await BookingRepository.findLatestChild(base.id)) || base;
		const policy = BookingPolicy.canModify(latest.event_date);
		const isAlreadyRescheduled = latest.original_booking_id !== null;

		return {
			booking: {
				id: latest.id,
				firstName: latest.first_name,
				lastName: latest.last_name,
				email: latest.email,
				phone: latest.phone_number,
				message: latest.message,
				eventDate: latest.event_date,
				status: latest.status,
				zoomJoinUrl: latest.zoom_join_url,
				isRescheduledBooking: isAlreadyRescheduled,
			},
			canReschedule: policy.allowed && latest.status === "confirmed" && !isAlreadyRescheduled,
			canCancel: policy.allowed && latest.status === "confirmed",
			isRedirectedFromOldBooking: latest.id !== base.id,
			hoursUntilEvent: Math.round(policy.hoursUntil * 10) / 10,
		};
	},

	/**
	 * SLOTS
	 */
	async getAvailableSlots(userDateStr: string, userTimezone: string = "Asia/Tokyo") {
		const calendar = getCalendarAuth();
		const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
		const now = new Date();
		const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

		const parts = userDateStr.split("-").map(Number);
		const baseDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

		const datesToCheck = [new Date(baseDate.getTime() - 86400000).toISOString().split("T")[0], userDateStr, new Date(baseDate.getTime() + 86400000).toISOString().split("T")[0]];

		const eventPromises = datesToCheck.map(async (jstDateStr) => {
			const res = await calendar.events.list({
				calendarId: CALENDAR_ID,
				timeMin: new Date(`${jstDateStr}T00:00:00+09:00`).toISOString(),
				timeMax: new Date(`${jstDateStr}T23:59:59+09:00`).toISOString(),
				singleEvents: true,
			});
			return { jstDateStr, events: res.data.items ?? [] };
		});

		const results = await Promise.all(eventPromises);
		const availableSlots: { displayTime: string; displayDate: string; jstTime: string; jstDate: string }[] = [];

		for (const { jstDateStr, events } of results) {
			const [y, m, d] = jstDateStr.split("-").map(Number);
			const jstDayOfWeek = new Date(y, m - 1, d).getDay();
			const jstSlots = weeklySlots[jstDayOfWeek] ?? [];

			for (const jstTime of jstSlots) {
				const [hour, min] = jstTime.split(":").map(Number);
				const slotStart = new Date(`${jstDateStr}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00+09:00`);
				const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

				if (slotStart.getTime() - now.getTime() < FOUR_HOURS_MS) continue;

				const hasConflict = events.some((ev) => {
					if (!ev.start?.dateTime || !ev.end?.dateTime) return false;
					return slotStart < new Date(ev.end.dateTime) && slotEnd > new Date(ev.start.dateTime);
				});
				if (hasConflict) continue;

				const { displayTime, displayDate } = convertJSTToUserTimezone(jstDateStr, jstTime, userTimezone);
				if (displayDate === userDateStr) {
					availableSlots.push({ displayTime, displayDate, jstTime, jstDate: jstDateStr });
				}
			}
		}
		return availableSlots.sort((a, b) => a.displayTime.localeCompare(b.displayTime));
	},
};

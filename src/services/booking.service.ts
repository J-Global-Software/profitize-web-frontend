import { BookingRepository } from "../repositories/booking.repository";
import { BookingPolicy } from "../utils/validation/booking.policy";
import { getCalendarAuth, deleteCalendarEvent, checkCalendarConflict, createBookingEvent } from "@/src/utils/google-calendar";
import { createZoomMeeting, deleteZoomMeeting } from "@/src/utils/zoom";
import { loadServerMessages } from "@/messages/server";
import { EmailService } from "./email.service";
import { generateICS } from "./generateEmail";
import { convertJSTToUserTimezone, hashCode, weeklySlots } from "../utils/slots";
import { query } from "../utils/neon";

export const BookingService = {
	/**
	 * INITIAL BOOKING
	 */

	async createBooking(payload: any, sessionId: string, locale: string = "ja") {
		try {
			// 1. Timing Logic (JST)
			const start = new Date(`${payload.date}T${payload.time}:00+09:00`);
			const end = new Date(start.getTime() + 30 * 60 * 1000);

			// 2. Policy Check
			const policy = BookingPolicy.canModify(start);
			if (!policy.allowed) throw new Error("NEW_TIME_TOO_SOON");

			// 🔒 ACQUIRE LOCK for this specific time slot
			const lockKey = Math.abs(hashCode(`${payload.date}-${payload.time}`));
			await query(`SELECT pg_advisory_lock($1)`, [lockKey]);

			try {
				// 3. Conflict Check (Google API)
				const calendar = getCalendarAuth();
				const hasConflict = await checkCalendarConflict(start, end);

				if (hasConflict) throw new Error("TIME_SLOT_OCCUPIED");

				// 4 & 5. Create Zoom & Google Event IN PARALLEL
				const zoomTopic = `(Profitize) Free Consultation X ${payload.firstName} ${payload.lastName}`;

				const [zoomData, gCalEvent] = await Promise.all([
					createZoomMeeting(zoomTopic, start, 30, [{ email: payload.email, firstName: payload.firstName, lastName: payload.lastName }]),
					createBookingEvent({
						summary: zoomTopic,
						description: `Free consultation session with ${payload.firstName} ${payload.lastName}\nEmail: ${payload.email}\nPhone: ${payload.phone}`,
						start,
						end,
					}),
				]);

				const { meeting, registrantLinks } = zoomData;
				const userZoomLink = registrantLinks[payload.email];

				// 6. Save to DB
				const booking = await BookingRepository.createInitial({
					...payload,
					sessionId,
					zoomId: String(meeting.id),
					zoomUrl: userZoomLink,
					calendarId: gCalEvent.id,
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
					} catch (emailError) {}
				})();

				return { booking, sessionId };
			} finally {
				// ALWAYS release the lock
				await query(`SELECT pg_advisory_unlock($1)`, [lockKey]);
			}
		} catch (error) {
			throw error;
		}
	},

	async rescheduleBooking(token: string, date: string, time: string, locale: string = "ja") {
		// 1. Fetch Original Booking
		const oldBooking = await BookingRepository.findByToken(token);
		if (!oldBooking) throw new Error("BOOKING_NOT_FOUND");
		if (oldBooking.status !== "confirmed") throw new Error("INVALID_STATUS");

		// 2. Validate Policy (4-hour rule for OLD event)
		const oldPolicy = BookingPolicy.canModify(oldBooking.event_date);
		if (!oldPolicy.allowed) throw new Error("TOO_LATE_TO_RESCHEDULE");

		// 3. Prepare New Timing (JST)
		const newStart = new Date(`${date}T${time}:00+09:00`);
		const newEnd = new Date(newStart.getTime() + 30 * 60 * 1000);

		// Validate Policy (4-hour rule for NEW event)
		const newPolicy = BookingPolicy.canModify(newStart);
		if (!newPolicy.allowed) throw new Error("NEW_TIME_TOO_SOON");

		// 🔒 ACQUIRE LOCK for new slot
		const lockKey = Math.abs(hashCode(`${date}-${time}`));
		await query(`SELECT pg_advisory_lock($1)`, [lockKey]);

		try {
			// 4. Check for Google Calendar Conflicts
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

			// 5. Cleanup Old External Events (Best effort)
			if (oldBooking.google_calendar_event_id) {
				await deleteCalendarEvent(oldBooking.google_calendar_event_id).catch(console.error);
			}
			if (oldBooking.zoom_meeting_id) {
				await deleteZoomMeeting(oldBooking.zoom_meeting_id).catch(console.error);
			}

			// 6. Create New Zoom Meeting
			const zoomTopic = `(Profitize) Free Consultation X ${oldBooking.first_name} ${oldBooking.last_name}`;
			const { meeting, registrantLinks } = await createZoomMeeting(zoomTopic, newStart, 30, [{ email: oldBooking.email, firstName: oldBooking.first_name, lastName: oldBooking.last_name }]);
			const userZoomLink = registrantLinks[oldBooking.email];

			// 7. Create New Google Calendar Event
			const calendarResponse = await calendar.events.insert({
				calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
				requestBody: {
					summary: zoomTopic,
					description: `Rescheduled from ${new Date(oldBooking.event_date).toLocaleString()}\nZoom: ${userZoomLink}`,
					start: { dateTime: newStart.toISOString(), timeZone: "Asia/Tokyo" },
					end: { dateTime: newEnd.toISOString(), timeZone: "Asia/Tokyo" },
				},
			});

			// 8. Update DB (Atomic-like operation)
			const newBooking = await BookingRepository.createRescheduled(oldBooking, {
				eventDate: newStart.toISOString(),
				calendarId: calendarResponse.data.id,
				zoomId: String(meeting.id),
				zoomUrl: userZoomLink,
			});

			await BookingRepository.updateStatus(oldBooking.id, "rescheduled");

			// 9. Send Notifications (Async)
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
			// ALWAYS release the lock
			await query(`SELECT pg_advisory_unlock($1)`, [lockKey]);
		}
	},

	async cancelBooking(token: string, locale: string = "ja") {
		// 1. Fetch & Validate (Source of Truth)
		const baseBooking = await BookingRepository.findByToken(token);
		if (!baseBooking) throw new Error("BOOKING_NOT_FOUND");

		const latestBooking = (await BookingRepository.findLatestChild(baseBooking.id)) || baseBooking;

		if (latestBooking.status !== "confirmed") {
			throw new Error(`CANNOT_CANCEL_STATUS_${latestBooking.status}`);
		}

		// 2. Validate Policy (Fast local logic)
		const policy = BookingPolicy.canModify(latestBooking.event_date);
		if (!policy.allowed) {
			throw new Error(policy.isPast ? "PAST_EVENT" : "POLICY_VIOLATION");
		}

		// 3. Update Database FIRST
		// Doing this before external calls makes the system "feel" faster and more reliable
		await BookingRepository.updateStatus(latestBooking.id, "cancelled");

		// 4. Parallel External Cleanups + Emails
		// We combine all network tasks into one single parallel block
		const cleanupTasks: Promise<any>[] = [];

		if (latestBooking.google_calendar_event_id) {
			cleanupTasks.push(deleteCalendarEvent(latestBooking.google_calendar_event_id));
		}
		if (latestBooking.zoom_meeting_id) {
			cleanupTasks.push(deleteZoomMeeting(latestBooking.zoom_meeting_id));
		}

		// 5. Wrap everything in a single wait to keep the serverless function alive
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
				}).catch((err) => console.error("User Email Error:", err)),
				EmailService.sendCancelLecturer(latestBooking.first_name, latestBooking.last_name, latestBooking.email, new Date(latestBooking.event_date), process.env.FROM_EMAIL || "", process.env.LECTURER_EMAIL || "").catch((err) => console.error("Lecturer Email Error:", err)),
			]);
		} catch (criticalError) {
			// This handles errors in loadServerMessages or other prep logic
			console.error("Post-cancellation processing error:", criticalError);
		}

		return { success: true };
	},

	async getBookingManagementData(token: string) {
		// 1. Get the base booking
		const base = await BookingRepository.findByToken(token);
		if (!base) throw new Error("BOOKING_NOT_FOUND");

		// 2. Follow the trail to the latest version if rescheduled
		const latest = (await BookingRepository.findLatestChild(base.id)) || base;
		const isRedirected = latest.id !== base.id;

		// 3. Apply Policy Rules
		const policy = BookingPolicy.canModify(latest.event_date);

		// A booking can only be rescheduled once in this logic
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
			isRedirectedFromOldBooking: isRedirected,
			hoursUntilEvent: Math.round(policy.hoursUntil * 10) / 10,
		};
	},

	async getAvailableSlots(userDateStr: string, userTimezone: string = "Asia/Tokyo") {
		const calendar = getCalendarAuth();
		const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
		const now = new Date();
		const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

		const parts = userDateStr.split("-").map(Number);
		const baseDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

		// Days around target to handle timezone rollovers
		const datesToCheck = [new Date(baseDate.getTime() - 86400000).toISOString().split("T")[0], userDateStr, new Date(baseDate.getTime() + 86400000).toISOString().split("T")[0]];

		// 🔥 PERFORMANCE FIX: Fetch all days in parallel
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
		const availableSlots: any[] = [];

		// Process results
		for (const { jstDateStr, events } of results) {
			const [y, m, d] = jstDateStr.split("-").map(Number);
			const jstDayOfWeek = new Date(y, m - 1, d).getDay();
			const jstSlots = weeklySlots[jstDayOfWeek] ?? [];

			for (const jstTime of jstSlots) {
				const [hour, min] = jstTime.split(":").map(Number);
				const slotStart = new Date(`${jstDateStr}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00+09:00`);
				const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

				// 1. Policy: 4-hour lead time
				if (slotStart.getTime() - now.getTime() < FOUR_HOURS_MS) continue;

				// 2. Conflict: Check overlaps
				const hasConflict = events.some((ev) => {
					if (!ev.start?.dateTime || !ev.end?.dateTime) return false;
					return slotStart < new Date(ev.end.dateTime) && slotEnd > new Date(ev.start.dateTime);
				});
				if (hasConflict) continue;

				// 3. Timezone: Convert
				const { displayTime, displayDate } = convertJSTToUserTimezone(jstDateStr, jstTime, userTimezone);

				if (displayDate === userDateStr) {
					availableSlots.push({
						displayTime,
						displayDate,
						jstTime,
						jstDate: jstDateStr,
					});
				}
			}
		}

		return availableSlots.sort((a, b) => a.displayTime.localeCompare(b.displayTime));
	},
};

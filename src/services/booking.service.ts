import { BookingRepository } from "../repositories/booking.repository";
import { BookingPolicy } from "../utils/validation/booking.policy";
import { getCalendarAuth, deleteCalendarEvent, checkCalendarConflict, createBookingEvent } from "@/src/utils/google-calendar";
import { createZoomMeeting, deleteZoomMeeting } from "@/src/utils/zoom";
import { loadServerMessages } from "@/messages/server";
import { EmailService } from "./email.service";
import { generateICS } from "./generateEmail";
import { convertJSTToUserTimezone, weeklySlots } from "../utils/slots";

export const BookingService = {
	/**
	 * INITIAL BOOKING
	 */
	async createBooking(payload: any, sessionId: string, locale: string = "ja") {
		// 1. Timing Logic (JST)
		const start = new Date(`${payload.date}T${payload.time}:00+09:00`);
		const end = new Date(start.getTime() + 30 * 60 * 1000);

		// 2. Policy Check
		const policy = BookingPolicy.canModify(start);
		if (!policy.allowed) throw new Error("NEW_TIME_TOO_SOON");

		// 3. Conflict Check
		const calendar = getCalendarAuth();
		const hasConflict = await checkCalendarConflict(start, end); // Clean!		if (hasConflict) throw new Error("TIME_SLOT_OCCUPIED");

		// 4. Create Zoom Meeting
		const zoomTopic = `(Profitize) Free Consultation X ${payload.firstName} ${payload.lastName}`;
		const { meeting, registrantLinks } = await createZoomMeeting(zoomTopic, start, 30, [{ email: payload.email, firstName: payload.firstName, lastName: payload.lastName }]);
		const userZoomLink = registrantLinks[payload.email];

		// 5. Create Google Calendar Event (FIXED: Added requestBody mapping)
		const gCalEvent = await createBookingEvent({
			summary: zoomTopic,
			description: `Free consultation session with ${payload.firstName} ${payload.lastName}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nZoom Link: ${userZoomLink}`,
			start,
			end,
		});

		// 6. Save to DB
		const booking = await BookingRepository.createInitial({
			...payload,
			sessionId,
			zoomId: String(meeting.id),
			zoomUrl: userZoomLink,
			calendarId: gCalEvent.id,
			eventDate: start.toISOString(),
		});

		// 7. Send Emails
		try {
			const messages = await loadServerMessages(locale);
			const managementUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://profitize.jp"}/${locale}/free-consultation/manage/${booking.cancellation_token}`;

			// Generate the ICS for the user
			const icsContent = generateICS({
				start,
				end,
				title: zoomTopic,
				description: "Your free consultation session",
				location: "Zoom Meeting",
			});

			// Use await to ensure the function doesn't finish before emails are sent
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
			// We log the error but don't crash the whole booking
			// since the Zoom/Calendar/DB parts succeeded
			console.error("Email Dispatch Error:", emailError);
		}
		return { booking, sessionId };
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

		// We don't 'await' these if we want the response to be fast, or await them to ensure delivery
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
	},

	async cancelBooking(token: string, locale: string = "ja") {
		// 1. Fetch the base booking
		const baseBooking = await BookingRepository.findByToken(token);
		if (!baseBooking) throw new Error("BOOKING_NOT_FOUND");

		// 2. If rescheduled, find the latest confirmed version
		const latestBooking = (await BookingRepository.findLatestChild(baseBooking.id)) || baseBooking;

		if (latestBooking.status !== "confirmed") {
			throw new Error(`CANNOT_CANCEL_STATUS_${latestBooking.status}`);
		}

		// 3. Validate Policy (The 4-hour rule)
		const policy = BookingPolicy.canModify(latestBooking.event_date);
		if (!policy.allowed) {
			throw new Error(policy.isPast ? "PAST_EVENT" : "POLICY_VIOLATION");
		}

		// 4. External Cleanups (Best Effort)
		if (latestBooking.google_calendar_event_id) {
			await deleteCalendarEvent(latestBooking.google_calendar_event_id).catch((err) => console.error("GCal Cleanup Error:", err));
		}
		if (latestBooking.zoom_meeting_id) {
			await deleteZoomMeeting(latestBooking.zoom_meeting_id).catch((err) => console.error("Zoom Cleanup Error:", err));
		}

		// 5. Update Database
		await BookingRepository.updateStatus(latestBooking.id, "cancelled");

		// 6. Emails
		try {
			const messages = await loadServerMessages(locale);

			// We MUST await this to ensure the serverless function stays alive
			await Promise.all([
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
			console.log("Cancellation emails sent successfully");
		} catch (emailError) {
			// Log the error but don't fail the cancellation since the DB/Zoom/Calendar are done
			console.error("⚠️ Cancellation Email Dispatch Error:", emailError);
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

		// Check days around the target to handle timezone rollovers
		const datesToCheck = [new Date(baseDate.getTime() - 86400000).toISOString().split("T")[0], userDateStr, new Date(baseDate.getTime() + 86400000).toISOString().split("T")[0]];

		const availableSlots: any[] = [];

		for (const jstDateStr of datesToCheck) {
			// Fetch events for this specific JST day
			const eventsRes = await calendar.events.list({
				calendarId: CALENDAR_ID,
				timeMin: new Date(`${jstDateStr}T00:00:00+09:00`).toISOString(),
				timeMax: new Date(`${jstDateStr}T23:59:59+09:00`).toISOString(),
				singleEvents: true,
			});

			const events = eventsRes.data.items ?? [];
			const [y, m, d] = jstDateStr.split("-").map(Number);
			const jstDayOfWeek = new Date(y, m - 1, d).getDay();
			const jstSlots = weeklySlots[jstDayOfWeek] ?? [];

			for (const jstTime of jstSlots) {
				const [hour, min] = jstTime.split(":").map(Number);
				const slotStart = new Date(`${jstDateStr}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00+09:00`);
				const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

				// 1. Policy: 4-hour lead time
				if (slotStart.getTime() - now.getTime() < FOUR_HOURS_MS) continue;

				// 2. Conflict: Check if any event overlaps this 30-min slot
				const hasConflict = events.some((ev) => {
					if (!ev.start?.dateTime || !ev.end?.dateTime) return false;
					return slotStart < new Date(ev.end.dateTime) && slotEnd > new Date(ev.start.dateTime);
				});
				if (hasConflict) continue;

				// 3. Timezone: Convert JST slot to User's local view
				const { displayTime, displayDate } = convertJSTToUserTimezone(jstDateStr, jstTime, userTimezone);

				// Only keep slots that appear on the user's selected date in their timezone
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

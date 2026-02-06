import { NextRequest } from "next/server";
import { loadServerMessages } from "@/messages/server";
import { query } from "@/src/utils/neon";
import { Validators } from "@/src/utils/validation/validators";
import { deleteCalendarEvent, getCalendarAuth } from "@/src/utils/google-calendar";
import { createZoomMeeting, deleteZoomMeeting } from "@/src/utils/zoom";
import { isValidationError } from "@/src/utils/validation/ErrorValidator";
import { sendRescheduleUserEmail, sendRescheduleLecturerEmail } from "@/src/utils/email/service";

export async function POST(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	const locale = req.headers.get("x-locale") || "ja";
	const messages = await loadServerMessages(locale);
	try {
		const { token } = await context.params;

		// Validate token
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(token)) {
			return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
		}

		// Parse request body
		const body = await req.json();
		const { date, time, timezone } = body;

		// Validation
		Validators.required(date, "Date");
		Validators.required(time, "Time");

		// Fetch original booking
		const result = await query(
			`SELECT 
        id, first_name, last_name, email, phone_number, message, event_date, status,
        google_calendar_event_id, zoom_meeting_id
      FROM profitize.bookings
      WHERE cancellation_token = $1`,
			[token],
		);

		if (result.rowCount === 0) {
			return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
		}

		const oldBooking = result.rows[0];

		// Validate status - can only reschedule confirmed bookings
		if (oldBooking.status !== "confirmed") {
			return new Response(JSON.stringify({ error: `Cannot reschedule a booking with status: ${oldBooking.status}. You can only reschedule once.` }), { status: 400 });
		}

		// Check 24-hour rule for ORIGINAL booking
		const oldEventDate = new Date(oldBooking.event_date);
		const now = new Date();
		const hoursUntilOldEvent = (oldEventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		if (hoursUntilOldEvent < 4) {
			return new Response(JSON.stringify({ error: "Cannot reschedule within 4 hours of the original event" }), { status: 400 });
		}

		if (oldEventDate < now) {
			return new Response(JSON.stringify({ error: "Cannot reschedule a past event" }), { status: 400 });
		}

		// ✅ FIXED: Create JST date from the date/time sent by client (which is already JST)
		const newStart = new Date(`${date}T${time}:00+09:00`);
		const newEnd = new Date(newStart.getTime() + 30 * 60 * 1000);

		if (newStart < now) {
			return new Response(JSON.stringify({ error: "Cannot schedule a booking in the past" }), { status: 400 });
		}

		// Check 4-hour advance notice
		const hoursUntilNewEvent = (newStart.getTime() - now.getTime()) / (1000 * 60 * 60);
		if (hoursUntilNewEvent < 4) {
			return new Response(JSON.stringify({ error: "New booking must be at least 4 hours in the future" }), { status: 400 });
		}

		// Check for conflicts
		const calendar = getCalendarAuth();
		const existing = await calendar.events.list({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			timeMin: newStart.toISOString(),
			timeMax: newEnd.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		const hasConflict = existing.data.items?.some((ev) => {
			if (!ev.start?.dateTime || !ev.end?.dateTime) return false;
			const evStart = new Date(ev.start.dateTime);
			const evEnd = new Date(ev.end.dateTime);
			return newStart < evEnd && newEnd > evStart;
		});

		if (hasConflict) {
			return new Response(JSON.stringify({ error: "The selected time slot is already booked. Please choose another time." }), { status: 409 });
		}

		// Delete old calendar event
		if (oldBooking.google_calendar_event_id) {
			try {
				await deleteCalendarEvent(oldBooking.google_calendar_event_id);
			} catch (error) {
				console.error("Failed to delete old calendar event:", error);
			}
		}

		// Delete old Zoom meeting
		if (oldBooking.zoom_meeting_id) {
			try {
				await deleteZoomMeeting(oldBooking.zoom_meeting_id);
			} catch (error) {
				console.error("Failed to delete old Zoom meeting:", error);
			}
		}

		// ✅ FIXED: Pass newStart directly (no timezone adjustment needed)
		const { meeting, registrantLinks } = await createZoomMeeting(
			`(Profitize) Free Consultation X ${oldBooking.first_name} ${oldBooking.last_name}`,
			newStart, // ✅ Pass the JST Date object directly
			30,
			[
				{
					email: oldBooking.email,
					firstName: oldBooking.first_name,
					lastName: oldBooking.last_name,
				},
			],
		);

		const userZoomLink = registrantLinks[oldBooking.email];

		// Create new Google Calendar event
		const newEvent = {
			summary: `Free Consultation X ${oldBooking.first_name} ${oldBooking.last_name}`,
			description: `Free Consultation session with ${oldBooking.first_name} ${oldBooking.last_name}
Email: ${oldBooking.email}
${oldBooking.phone_number ? `Phone: ${oldBooking.phone_number}\n` : ""}${oldBooking.message ? `Message: ${oldBooking.message}\n` : ""}
Zoom link: ${userZoomLink || ""}
(Rescheduled from ${oldEventDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })})`,
			start: { dateTime: newStart.toISOString(), timeZone: "Asia/Tokyo" },
			end: { dateTime: newEnd.toISOString(), timeZone: "Asia/Tokyo" },
			extendedProperties: {
				private: {
					firstName: oldBooking.first_name,
					lastName: oldBooking.last_name,
					email: oldBooking.email,
					phone: oldBooking.phone_number || "",
					message: oldBooking.message || "",
					userTimezone: timezone || "Asia/Tokyo", // ✅ Store user timezone
				},
			},
		};

		const responseEvent = await calendar.events.insert({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			requestBody: newEvent,
		});

		// Create NEW booking record
		const newBookingResult = await query<{ id: string; cancellation_token: string }>(
			`INSERT INTO profitize.bookings
      (first_name, last_name, email, phone_number, message, event_date,
       google_calendar_event_id, zoom_meeting_id, zoom_join_url, 
       status, original_booking_id, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id, cancellation_token`,
			[oldBooking.first_name, oldBooking.last_name, oldBooking.email, oldBooking.phone_number, oldBooking.message, newStart.toISOString(), responseEvent.data.id, String(meeting.id), userZoomLink, "confirmed", oldBooking.id, new Date().toISOString()],
		);

		const newCancellationToken = newBookingResult.rows[0].cancellation_token;

		// Update OLD booking status
		await query(`UPDATE profitize.bookings SET status = 'rescheduled', rescheduled_at = $1 WHERE id = $2`, [new Date().toISOString(), oldBooking.id]);

		// ============================================================
		// SEND EMAIL NOTIFICATIONS
		// ============================================================
		const managementUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://profitize.jp"}${locale === "ja" ? "" : `/${locale}`}/free-consultation/manage/${newCancellationToken}`;

		// Send user reschedule email
		await sendRescheduleUserEmail({
			locale,
			firstName: oldBooking.first_name,
			lastName: oldBooking.last_name,
			email: oldBooking.email,
			oldEventDate,
			newStart,
			newEnd,
			userZoomLink,
			managementUrl,
			messages,
			fromEmail: process.env.FROM_EMAIL || "",
			toEmail: oldBooking.email,
		});

		// Send lecturer reschedule notification
		await sendRescheduleLecturerEmail(oldBooking.first_name, oldBooking.last_name, oldEventDate, newStart, process.env.FROM_EMAIL || "", process.env.LECTURER_EMAIL || "");

		return new Response(
			JSON.stringify({
				success: true,
				message: "Booking rescheduled successfully",
				newBooking: {
					date: date,
					time: time,
					cancellationToken: newCancellationToken,
				},
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err) {
		if (isValidationError(err)) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: err.status,
			});
		}

		console.error("[Reschedule Booking Error]", err);
		return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
	}
}

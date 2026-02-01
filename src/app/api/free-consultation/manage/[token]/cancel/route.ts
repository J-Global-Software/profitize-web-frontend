import { NextRequest } from "next/server";
import { loadServerMessages } from "../../../../../../../messages/server";
import { query } from "@/src/utils/neon";
import { deleteCalendarEvent } from "@/src/utils/google-calendar";
import { deleteZoomMeeting } from "@/src/utils/zoom";
import { sendCancelUserEmail, sendCancelLecturerEmail } from "@/src/utils/email/service";

export async function POST(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	const locale = req.headers.get("x-locale") || "ja";
	const messages = await loadServerMessages(locale);

	try {
		const { token } = await context.params;

		// 1️⃣ Validate token format
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(token)) {
			return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
		}

		// 2️⃣ Fetch booking by token
		const result = await query(
			`
			SELECT
				id,
				first_name,
				last_name,
				email,
				event_date,
				status,
				google_calendar_event_id,
				zoom_meeting_id
			FROM profitize.bookings
			WHERE cancellation_token = $1
			`,
			[token],
		);

		if (!result.rows || result.rows.length === 0) {
			return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
		}

		let booking = result.rows[0];

		// 🔁 3️⃣ If booking was rescheduled, cancel the NEW confirmed booking instead
		const latestResult = await query(
			`
			SELECT *
			FROM profitize.bookings
			WHERE original_booking_id = $1
			  AND status = 'confirmed'
			ORDER BY created_at DESC
			LIMIT 1
			`,
			[booking.id],
		);

		if (latestResult.rows && latestResult.rows.length > 0) {
			booking = latestResult.rows[0];
		}

		// 4️⃣ Validate status
		if (booking.status !== "confirmed") {
			return new Response(JSON.stringify({ error: `Cannot cancel a booking with status: ${booking.status}` }), { status: 400 });
		}

		// 5️⃣ 24-hour + past check
		const eventDate = new Date(booking.event_date);
		const now = new Date();
		const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		if (eventDate < now) {
			return new Response(JSON.stringify({ error: "Cannot cancel a past event" }), { status: 400 });
		}

		if (hoursUntilEvent < 24) {
			return new Response(JSON.stringify({ error: "Cannot cancel within 24 hours of the event" }), { status: 400 });
		}

		// 6️⃣ Delete Google Calendar event (best effort)
		if (booking.google_calendar_event_id) {
			try {
				await deleteCalendarEvent(booking.google_calendar_event_id);
			} catch (error) {
				console.error("⚠️ Failed to delete calendar event:", error);
			}
		}

		// 7️⃣ Delete Zoom meeting (404-safe)
		if (booking.zoom_meeting_id) {
			try {
				await deleteZoomMeeting(booking.zoom_meeting_id);
			} catch (error) {
				console.error("⚠️ Failed to delete Zoom meeting:", error);
			}
		}

		// 8️⃣ Update booking status
		await query(
			`
			UPDATE profitize.bookings
			SET status = 'cancelled',
			    cancelled_at = $1
			WHERE id = $2
			`,
			[new Date().toISOString(), booking.id],
		);

		// 9️⃣ Send emails
		// Send user cancellation email
		await sendCancelUserEmail({
			locale,
			firstName: booking.first_name,
			lastName: booking.last_name,
			email: booking.email,
			eventDate: new Date(booking.event_date),
			messages,
			fromEmail: process.env.FROM_EMAIL || "",
			toEmail: booking.email,
		});

		// Send lecturer cancellation notification
		await sendCancelLecturerEmail(booking.first_name, booking.last_name, booking.email, new Date(booking.event_date), process.env.FROM_EMAIL || "", process.env.LECTURER_EMAIL || "");

		return new Response(JSON.stringify({ success: true, message: "Booking cancelled successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("[Cancel Booking Error]", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
	}
}

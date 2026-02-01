import { Resend } from "resend";
import { NextRequest } from "next/server";
import { loadServerMessages } from "../../../../../../../messages/server";
import { query } from "@/src/utils/neon";
import { deleteCalendarEvent } from "@/src/utils/google-calendar";
import { deleteZoomMeeting } from "@/src/utils/zoom";

// HTML escape utility
function escapeHtml(str: string) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Safe interpolate for templates
function interpolate(template: string, values: Record<string, string>) {
	return template.replace(/\{(\w+)\}/g, (_, key) => escapeHtml(values[key] ?? ""));
}

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
		const resend = new Resend(process.env.RESEND_API_KEY);

		// User email
		await resend.emails.send({
			from: process.env.FROM_EMAIL || "",
			to: booking.email,
			subject: messages.server.email.cancelledSubject,
			html: `
<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0; background-color:#f8fafc;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden;">
<tr><td style="padding:48px; text-align:center;">
<h1 style="margin:0; font-size:24px; font-weight:800; color:#0f172a;">${escapeHtml(messages.server.email.cancelledHeader)}</h1>
</td></tr>
<tr><td style="padding:0 48px 48px 48px; font-size:15px; line-height:1.6; color:#475569;">
<p>${interpolate(messages.server.email.hi, { name: locale === "ja" ? booking.last_name : booking.first_name })}</p>
<p>${escapeHtml(messages.server.email.cancelledIntro)}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; border-radius:12px; padding:24px; margin:20px 0; border:1px solid #f1f5f9;">
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-bottom:4px;">${escapeHtml(messages.server.email.serviceBooked)}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${escapeHtml(messages.server.email.serviceName)}</td>
</tr>
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${escapeHtml(messages.server.email.staff)}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${escapeHtml(messages.server.email.staffName)}</td>
</tr>
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${escapeHtml(messages.server.email.platform)}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${escapeHtml(messages.server.email.platformValue)}</td>
</tr>
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${escapeHtml(messages.server.email.dateTimeLabel)}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${new Date(booking.event_date).toLocaleString(locale === "ja" ? "ja-JP" : "en-US", { timeZone: "Asia/Tokyo", dateStyle: "long", timeStyle: "short" })} JST</td>
</tr>
</table>
<p>${escapeHtml(messages.server.email.cancelledAction)}</p>
<p style="margin-top:32px; font-size:13px; line-height:1.6; color:#64748b;">
<a href="mailto:${escapeHtml(messages.server.email.supportEmail)}" style="color:#1e40af; font-weight:600; text-decoration:none;">${escapeHtml(messages.server.email.supportEmail)}</a>
</p>
<p style="margin-top:32px;">— ${escapeHtml(messages.server.email.teamName)}</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
`,
		});

		// Lecturer email
		await resend.emails.send({
			from: process.env.FROM_EMAIL || "",
			to: process.env.LECTURER_EMAIL || "",
			subject: "(Profitize) Consultation Session Cancelled by User",
			html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body>
<p>Name: ${escapeHtml(booking.first_name)} ${escapeHtml(booking.last_name)}</p>
<p>Email: ${escapeHtml(booking.email)}</p>
<p>Date: ${new Date(booking.event_date).toLocaleString("en-US", { timeZone: "Asia/Tokyo", dateStyle: "long", timeStyle: "short" })} JST</p>
</body>
</html>
`,
		});

		return new Response(JSON.stringify({ success: true, message: "Booking cancelled successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("[Cancel Booking Error]", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
	}
}

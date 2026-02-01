import { Resend } from "resend";
import { NextRequest, after } from "next/server";
import { loadServerMessages } from "../../../../../../../messages/server";
import { query } from "@/src/utils/neon";
import { deleteCalendarEvent } from "@/src/utils/google-calendar";
import { deleteZoomMeeting } from "@/src/utils/zoom";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { sanitizeEmailMessage, sanitizeSimpleText } from "@/src/utils/sanitizeEmailMessage";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "30m"),
});

export async function POST(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	const locale = req.headers.get("x-locale") || "ja";

	function interpolate(template: string, values: Record<string, string>) {
		return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
	}

	try {
		// 1. Rate Limiting
		const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
		const { success } = await limiter.limit(ip);
		if (!success) {
			return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
		}

		const { token } = await context.params;

		// 2. Validate token format
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(token)) {
			return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
		}

		// Parallel: Load messages and Fetch booking
		const [messages, result] = await Promise.all([
			loadServerMessages(locale),
			query(
				`WITH target_booking AS (
					SELECT * FROM profitize.bookings WHERE cancellation_token = $1 LIMIT 1
				)
				SELECT * FROM profitize.bookings
				WHERE (id = (SELECT id FROM target_booking) OR original_booking_id = (SELECT id FROM target_booking))
				  AND status = 'confirmed'
				ORDER BY created_at DESC
				LIMIT 1`,
				[token],
			),
		]);

		if (!result.rows || result.rows.length === 0) {
			return new Response(JSON.stringify({ error: "Booking not found or already cancelled/rescheduled" }), { status: 404 });
		}

		const booking = result.rows[0];

		// 3. Time validation
		const eventDate = new Date(booking.event_date);
		const now = new Date();
		const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		if (eventDate < now) {
			return new Response(JSON.stringify({ error: "Cannot cancel a past event" }), { status: 400 });
		}

		if (hoursUntilEvent < 24) {
			return new Response(JSON.stringify({ error: "Cannot cancel within 24 hours of the event" }), { status: 400 });
		}

		// 4. Update booking status (Wait for this before responding)
		await query(
			`
			UPDATE profitize.bookings
			SET status = 'cancelled',
			    cancelled_at = $1
			WHERE id = $2
			`,
			[new Date().toISOString(), booking.id],
		);

		// 5. Background Tasks
		after(async () => {
			try {
				// Sanitize data for email
				const safeFirstName = sanitizeSimpleText(booking.first_name);
				const safeLastName = sanitizeSimpleText(booking.last_name);
				const safeEmail = sanitizeSimpleText(booking.email);
				const safeMessageHtml = booking.message ? sanitizeEmailMessage(booking.message).replace(/\n/g, "<br />") : "";

				// Delete External resources (Parallel)
				const deleteTasks = [];
				if (booking.google_calendar_event_id) {
					deleteTasks.push(deleteCalendarEvent(booking.google_calendar_event_id).catch((e) => console.error("Calendar delete fail:", e)));
				}
				if (booking.zoom_meeting_id) {
					deleteTasks.push(deleteZoomMeeting(booking.zoom_meeting_id).catch((e) => console.error("Zoom delete fail:", e)));
				}
				await Promise.all(deleteTasks);

				// Send emails
				const resend = new Resend(process.env.RESEND_API_KEY);

				// User email
				await resend.emails.send({
					from: process.env.FROM_EMAIL || "",
					to: safeEmail,
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
  <tr>
    <td align="center">
      <table width="540" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden;">
        <tr>
          <td style="padding:48px; text-align:center;">
            <h1 style="margin:0; font-size:24px; font-weight:800; color:#0f172a;">${messages.server.email.cancelledHeader}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:0 48px 48px 48px; font-size:15px; line-height:1.6; color:#475569;">
            <p>${interpolate(messages.server.email.hi, { name: locale === "ja" ? safeLastName : safeFirstName })}</p>
            <p>${messages.server.email.cancelledIntro}</p>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; border-radius:12px; padding:24px; margin:20px 0; border:1px solid #f1f5f9;">
              <tr>
                <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-bottom:4px;">${messages.server.email.serviceBooked}</td>
                <td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.serviceName}</td>
              </tr>
              <tr>
                <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.staff}</td>
                <td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.staffName}</td>
              </tr>
              <tr>
                <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.platform}</td>
                <td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.platformValue}</td>
              </tr>
              <tr>
                <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.dateTimeLabel}</td>
                <td style="font-size:15px; font-weight:600; color:#1e293b;">${new Date(booking.event_date).toLocaleString(locale === "ja" ? "ja-JP" : "en-US", { timeZone: "Asia/Tokyo", dateStyle: "long", timeStyle: "short" })} JST</td>
              </tr>
            </table>

            <p>${messages.server.email.cancelledAction}</p>

            <p style="margin-top:32px; font-size:13px; line-height:1.6; color:#64748b;">
              <a href="mailto:${messages.server.email.supportEmail}" style="color:#1e40af; font-weight:600; text-decoration:none;">${messages.server.email.supportEmail}</a>
            </p>

            <p style="margin-top:32px;">— ${messages.server.email.teamName}</p>
          </td>
        </tr>
      </table>

      <table width="540" cellpadding="0" cellspacing="0" border="0" style="margin:40px auto; text-align:center; font-family:Arial, sans-serif; font-size:12px; color:#94a3b8;">
        <tr>
          <td>
            <img src="https://profitize.jp/images/logo.png" alt="Profitize" style="max-width:120px; margin-bottom:24px; opacity:0.9; display:block; margin-left:auto; margin-right:auto;">
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:16px;">
            <a href="${locale === "ja" ? "https://profitize.jp/" : "https://profitize.jp/en/"}" style="color:#94a3b8; text-decoration:none; margin-right:15px;">${messages.server.email.footerWebsite}</a>
            <a href="${locale === "ja" ? "https://profitize.jp/privacy-policy/" : "https://profitize.jp/en/privacy-policy/"}" style="color:#94a3b8; text-decoration:none;">${messages.server.email.footerPrivacy}</a>
          </td>
        </tr>
        <tr>
          <td style="font-size:11px; color:#cbd5e1; line-height:1.6;">
            &copy; 2026 Profitize Inc.<br>
            ${messages.server.email.footerCopyright}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

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
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  .wrapper { width:100%; table-layout:fixed; padding:40px 0; background-color:#f8fafc; }
  .container { max-width:540px; margin:0 auto; background-color:#fff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden; }
  .header { padding:32px 32px 24px 32px; text-align:center; }
  h2 { margin:0; font-size:20px; font-weight:700; color:#0f172a; }
  .content { padding:0 32px 32px 32px; font-size:15px; color:#475569; line-height:1.6; }
  .detail-card { background-color:#f8fafc; border-radius:12px; padding:20px; border:1px solid #f1f5f9; margin-top:20px; }
  .row { margin-bottom:12px; }
  .label { font-weight:600; color:#94a3b8; margin-right:6px; text-transform:uppercase; font-size:12px; }
  .value { font-weight:500; color:#1e293b; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h2>Consultation Session Cancelled</h2>
      </div>

      <div class="content">
        <p>The following session has been cancelled:</p>

        <div class="detail-card">
          <div class="row"><span class="label">Name:</span><span class="value">${safeFirstName} ${safeLastName}</span></div>
          <div class="row"><span class="label">Email:</span><span class="value">${safeEmail}</span></div>
          ${safeMessageHtml ? `<div class="row"><span class="label">Message:</span><span class="value">${safeMessageHtml}</span></div>` : ""}
          <div class="row"><span class="label">Date:</span><span class="value">${new Date(booking.event_date).toLocaleString("en-US", {
						timeZone: "Asia/Tokyo",
						dateStyle: "long",
						timeStyle: "short",
					})} JST</span></div>
        </div>

        <p style="margin-top:24px;">— profitize.jp Team</p>
      </div>
    </div>
  </div>
</body>
</html>
`,
				});
			} catch (error) {
				console.error("Background cancellation tasks error:", error);
			}
		});

		return new Response(JSON.stringify({ success: true, message: "Booking cancelled successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("[Cancel Booking Error]", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
	}
}

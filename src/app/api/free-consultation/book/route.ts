import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Validators } from "@/src/utils/validation/validators";
import { sanitizeBookingInputs } from "@/src/utils/validation/sanitize";
import { getOrCreateSession } from "@/src/utils/db/getOrCreateSession";
import { query } from "@/src/utils/neon";
import { isValidationError } from "@/src/utils/validation/ErrorValidator";
import { loadServerMessages } from "@/messages/server";
import { createZoomMeeting } from "@/src/utils/zoom";
import { sendUserConfirmationEmail, sendLecturerNotificationEmail } from "@/src/utils/email/service";
import { generateICS } from "@/src/utils/email/templates";
import { getCalendarAuth } from "@/src/utils/google-calendar";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "30m"),
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for") || "unknown";

	const { success } = await limiter.limit(ip);
	if (!success) {
		return new Response(JSON.stringify({ error: "Too many requests. Try later." }), {
			status: 429,
		});
	}

	const locale = req.headers.get("x-locale") || "ja";
	const messages = await loadServerMessages(locale);

	try {
		const body = await req.json();
		// ✅ CHANGED: Now receiving timezone-aware data from client
		const { date, time, firstName, lastName, email, phone, message, timezone } = body;

		// ---------------------------------------------------------------
		// Validation (runs on raw input — same as before)
		// ---------------------------------------------------------------
		Validators.required(date, "Date");
		Validators.required(time, "Time");
		Validators.required(firstName, "First Name");
		Validators.string(firstName, "First Name");
		Validators.required(lastName, "Last Name");
		Validators.string(lastName, "Last Name");
		Validators.required(email, "Email");
		Validators.email(email);
		if (message) {
			Validators.string(message, "Message");
			Validators.minLength(message, 10, "Message");
			Validators.maxLength(message, 2000, "Message");
		}

		// ---------------------------------------------------------------
		// Sanitization — runs once, right after validation passes.
		//   plain.* → DB, Zoom topic, calendar description, plain-text email
		//   html.*  → HTML email templates
		// ---------------------------------------------------------------
		const { plain, html } = sanitizeBookingInputs({
			firstName,
			lastName,
			email,
			phone: phone || "",
			message: message || "",
			date,
			time,
		});

		// ---------------------------------------------------------------
		// Google Calendar Auth
		// ---------------------------------------------------------------
		const calendar = getCalendarAuth();

		// ---------------------------------------------------------------
		// Event timing
		// ✅ CHANGED: The date and time coming from client are already in JST
		// (the client sends selectedSlot.jstDate and selectedSlot.jstTime)
		// ---------------------------------------------------------------
		const start = new Date(`${plain.date}T${plain.time}:00+09:00`);
		const end = new Date(start.getTime() + 30 * 60 * 1000);

		// ---------------------------------------------------------------
		// Check conflicts
		// ---------------------------------------------------------------
		const existing = await calendar.events.list({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			timeMin: start.toISOString(),
			timeMax: end.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		const hasConflict = existing.data.items?.some((ev) => {
			if (!ev.start?.dateTime || !ev.end?.dateTime) return false;
			const evStart = new Date(ev.start.dateTime);
			const evEnd = new Date(ev.end.dateTime);
			return start < evEnd && end > evStart;
		});

		if (hasConflict) {
			return new Response(JSON.stringify({ error: "This time slot is already booked." }), { status: 409 });
		}

		// ---------------------------------------------------------------
		// Create Zoom meeting   ← plain.* (topic is plain text, not HTML)
		// ---------------------------------------------------------------
		const zoomTopic = `(Profitize) Free Consultation X ${plain.firstName} ${plain.lastName}`;
		const { meeting, registrantLinks } = await createZoomMeeting(zoomTopic, start, 30, [{ email: plain.email, firstName: plain.firstName, lastName: plain.lastName }]);

		const userZoomLink = registrantLinks[plain.email];

		// ---------------------------------------------------------------
		// Insert Google Calendar event   ← plain.* (description is plain text)
		// ---------------------------------------------------------------
		const event = {
			summary: zoomTopic,
			description: `Free consultation session with ${plain.firstName} ${plain.lastName}
Email: ${plain.email}
${plain.phone ? `Phone: ${plain.phone}\n` : ""}${plain.message ? `Message: ${plain.message}\n` : ""}
Zoom link: ${userZoomLink || ""}`,
			start: { dateTime: start.toISOString(), timeZone: "Asia/Tokyo" },
			end: { dateTime: end.toISOString(), timeZone: "Asia/Tokyo" },
			extendedProperties: {
				private: {
					firstName: plain.firstName,
					lastName: plain.lastName,
					email: plain.email,
					phone: plain.phone,
					message: plain.message,
					// ✅ ADDED: Store user's timezone for reference
					userTimezone: timezone || "Asia/Tokyo",
				},
			},
		};

		const responseEvent = await calendar.events.insert({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			requestBody: event,
		});

		const { sessionId } = await getOrCreateSession(req);

		// ---------------------------------------------------------------
		// Insert booking into DB   ← plain.* (parameterized queries are
		//   already SQL-safe, but plain-sanitized values are still cleaner)
		// ---------------------------------------------------------------
		const bookingResult = await query<{ id: string; cancellation_token: string }>(
			`INSERT INTO profitize.bookings
  (session_id, first_name, last_name, email, phone_number, message, event_date,
   google_calendar_event_id, zoom_meeting_id, zoom_join_url, status, created_at)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
  RETURNING id, cancellation_token`,
			[sessionId, plain.firstName, plain.lastName, plain.email, plain.phone, plain.message, start.toISOString(), responseEvent.data.id, String(meeting.id), userZoomLink, "confirmed", new Date().toISOString()],
		);

		const cancellationToken = bookingResult.rows[0].cancellation_token;

		// ---------------------------------------------------------------
		// Generate email assets
		// ✅ IMPROVED: ICS file now uses correct start/end times
		// ---------------------------------------------------------------
		const icsContent = generateICS({
			start,
			end,
			title: "Free Consultation Session",
			description: "Your free consultation session",
			location: "Online",
		});

		const managementUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://profitize.jp"}${locale === "ja" ? "" : `/${locale}`}/free-consultation/manage/${cancellationToken}`;
		// ---------------------------------------------------------------
		// Send user confirmation email
		// ---------------------------------------------------------------
		await sendUserConfirmationEmail({
			locale,
			userData: plain,
			userZoomLink,
			managementUrl,
			messages,
			icsContent,
			fromEmail: process.env.FROM_EMAIL || "",
			toEmail: plain.email,
		});

		// ---------------------------------------------------------------
		// Send lecturer notification email
		// ---------------------------------------------------------------
		await sendLecturerNotificationEmail({
			userData: html,
			messages,
			fromEmail: process.env.FROM_EMAIL || "",
			toEmail: process.env.LECTURER_EMAIL || "",
		});

		return new Response(JSON.stringify({ success: true, event: responseEvent, sessionId }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
			},
		});
	} catch (err) {
		if (isValidationError(err)) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: err.status,
			});
		}

		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
		});
	}
}

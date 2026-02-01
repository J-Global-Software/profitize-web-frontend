import { NextResponse, after } from "next/server";
import { Resend } from "resend";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Validators } from "@/src/utils/validation/validators";
import { ValidationError } from "@/src/utils/validation/ErrorValidator";
import { sanitizeEmailMessage, sanitizeSimpleText } from "@/src/utils/sanitizeEmailMessage";
import { getOrCreateSession } from "@/src/utils/db/getOrCreateSession";
import { query } from "@/src/utils/neon";

/* ----------------------------- Rate Limiting ----------------------------- */

const redis = Redis.fromEnv();

const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "15 m"),
});

/* ------------------------------ Types ----------------------------------- */

interface ContactBody {
	firstName: unknown;
	lastName: unknown;
	email: unknown;
	message: unknown;
	company?: unknown; // honeypot
}

function isContactBody(value: unknown): value is ContactBody {
	return typeof value === "object" && value !== null && "firstName" in value && "lastName" in value && "email" in value && "message" in value;
}

/* --------------------------- Bot Detection ------------------------------- */

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,50}$/;

function looksLikeBotMessage(text: string) {
	if (!text.includes(" ")) return true;
	if (/^[A-Za-z0-9]{15,}$/.test(text)) return true;
	if (/[A-Z]{6,}/.test(text)) return true;
	return false;
}

/* -------------------------------- Handler -------------------------------- */

export async function POST(req: Request) {
	try {
		/* ---------- Content-Type ---------- */
		const contentType = req.headers.get("content-type") ?? "";
		if (!contentType.includes("application/json")) {
			return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
		}

		/* ---------- Rate Limit (Early) ---------- */
		const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
		const { success: rateLimitSuccess } = await limiter.limit(ip);

		if (!rateLimitSuccess) {
			return NextResponse.json({ error: "Too many messages. Please wait and try again." }, { status: 429 });
		}

		/* ---------- Parse JSON ---------- */
		let body: unknown;
		try {
			body = await req.json();
		} catch {
			return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
		}

		/* ---------- Shape Guard ---------- */
		if (!isContactBody(body)) {
			return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
		}

		/* ---------- Honeypot (silent drop) ---------- */
		if ("company" in body && body.company) {
			return NextResponse.json({ success: true });
		}

		const { firstName, lastName, email, message } = body;

		/* ---------- Validation ---------- */
		Validators.required(firstName, "First name");
		Validators.string(firstName, "First name");

		Validators.required(lastName, "Last name");
		Validators.string(lastName, "Last name");

		Validators.required(email, "Email");
		Validators.email(email);

		Validators.required(message, "Message");
		Validators.minLength(message, 10, "Message");
		Validators.maxLength(message, 2000, "Message");

		if (!nameRegex.test(String(firstName))) {
			throw new ValidationError("Invalid first name");
		}

		if (!nameRegex.test(String(lastName))) {
			throw new ValidationError("Invalid last name");
		}

		if (looksLikeBotMessage(String(message))) {
			return NextResponse.json({ success: true });
		}

		/* ---------- Parallel: Session & Sanitization ---------- */
		const [sessionData] = await Promise.all([getOrCreateSession(req)]);
		const { sessionId, isNew } = sessionData;

		const safeFirstName = sanitizeSimpleText(String(firstName));
		const safeLastName = sanitizeSimpleText(String(lastName));
		const safeEmail = sanitizeSimpleText(String(email)).toLowerCase().trim();
		const safeMessageBody = sanitizeEmailMessage(String(message));

		/* ---------- Store ---------- */
		const result = await query(
			`INSERT INTO profitize.contact_messages
       (session_id, first_name, last_name, email, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
			[sessionId, safeFirstName, safeLastName, safeEmail, String(message)],
		);

		const messageId = result.rows[0].id;

		/* ---------- Background Email ---------- */
		after(async () => {
			try {
				const safeMessageHtml = safeMessageBody.replace(/\n/g, "<br />");
				const resend = new Resend(process.env.RESEND_API_KEY);

				await resend.emails.send({
					from: process.env.FROM_EMAIL!,
					to: [process.env.LECTURER_EMAIL!],
					replyTo: safeEmail,
					subject: `New Contact Message (ID: ${messageId})`,
					html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px;">
              <h2 style="color: #2563eb;">New Contact Message</h2>

              <p><strong>Message ID:</strong> ${messageId}</p>
              <p><strong>Session ID:</strong> ${sessionId}</p>
              <p><strong>First Name:</strong> ${safeFirstName}</p>
              <p><strong>Last Name:</strong> ${safeLastName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Message:</strong><br />${safeMessageHtml}</p>

              <hr style="margin: 20px 0;" />
              <p style="font-size: 0.9em; color: #666;">— Contact System</p>
            </div>
          `,
				});
			} catch (err) {
				console.error("BACKGROUND EMAIL ERROR:", err);
			}
		});

		/* ---------- Response ---------- */
		const res = NextResponse.json({ success: true });

		if (isNew) {
			res.headers.set("Set-Cookie", `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Secure`);
		}

		return res;
	} catch (error) {
		console.error("CONTACT API ERROR:", error);

		if (error instanceof ValidationError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}

		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

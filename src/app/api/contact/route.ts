import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Validators } from "@/src/utils/validation/validators";
import { getErrorStatus } from "@/src/utils/errors";
import { ContactService } from "@/src/services/contact.service";
import { SessionService } from "@/src/services/session.service";
import { setSessionCookie } from "@/src/utils/session-cookies.util";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "15m"),
});

export async function POST(req: NextRequest) {
	// 1. Guard: Payload Size (Prevent massive text attacks)
	const contentLength = parseInt(req.headers.get("content-length") || "0");
	if (contentLength > 15000) {
		return NextResponse.json({ error: "Payload too large" }, { status: 413 });
	}

	// 2. Rate Limiting: Check IP FIRST
	// This stops bots before they even trigger a Database call in SessionService
	const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { success, limit, reset, remaining } = await limiter.limit(`contact:${ip}`);

	if (!success) {
		return NextResponse.json(
			{ error: "Too many messages. Please try again in 15 minutes." },
			{
				status: 429,
				headers: {
					"X-RateLimit-Limit": limit.toString(),
					"X-RateLimit-Remaining": remaining.toString(),
					"X-RateLimit-Reset": reset.toString(),
				},
			},
		);
	}

	try {
		const body = await req.json();

		// 3. Security: Honeypot (bot trap)
		if (body.company && String(body.company).trim().length > 0) {
			// Silently succeed to trick the bot
			return NextResponse.json({ success: true });
		}

		// 4. Validation
		// Suggestion: use a specific validateContact method if available
		Validators.validateBooking({ ...body, date: "N/A", time: "N/A" });

		// 5. Session Management: Link the message to a persistent session
		const { sessionId } = await SessionService.getOrCreate(req);

		// 6. Service Delegation
		await ContactService.handleContactMessage({
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			message: body.message,
			sessionId,
		});

		// 7. Response with Cookie Persistence
		const res = NextResponse.json({ success: true });

		// Use a secure cookie so the next visit recognizes the user
		setSessionCookie(res, sessionId);

		return res;
	} catch (err) {
		// Type narrowing for the error object
		const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
		const status = getErrorStatus(errorMessage);

		console.error("Contact Form Error:", errorMessage);
		return NextResponse.json({ error: errorMessage }, { status });
	}
}

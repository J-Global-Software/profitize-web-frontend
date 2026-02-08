import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/src/services/booking.service";
import { Validators } from "@/src/utils/validation/validators";
import { getErrorStatus } from "@/src/utils/errors";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { SessionService } from "@/src/services/session.service";
import { setSessionCookie } from "@/src/utils/session-cookies.util";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(3, "10m"),
});

export async function POST(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	// 1. Rate Limiting: Prevent brute-forcing available slots
	const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { success } = await limiter.limit(`reschedule:${ip}`);

	if (!success) {
		return NextResponse.json({ error: "Too many reschedule attempts. Please try later." }, { status: 429 });
	}

	try {
		const { token } = await context.params;
		const body = await req.json();
		const { date, time } = body;
		const locale = req.headers.get("x-locale") || "ja";

		// 2. Validation
		Validators.required(date, "Date");
		Validators.required(time, "Time");

		// 3. Service Delegation
		// This handles: checking if token is valid, checking if new slot is free,
		// updating the DB, and sending the new confirmation email.
		const result = await BookingService.rescheduleBooking(token, date, time, locale);

		// 4. Ensure Session is valid/refreshed
		const { sessionId } = await SessionService.getOrCreate(req);

		const res = NextResponse.json(
			{
				success: true,
				newBooking: result,
			},
			{ status: 200 },
		);

		// Refresh cookie to keep the user recognized
		setSessionCookie(res, sessionId);

		return res;
	} catch (err: any) {
		console.error("Reschedule Route Error:", err.message);
		const status = getErrorStatus(err.message);
		return NextResponse.json({ error: err.message || "Internal Server Error" }, { status });
	}
}

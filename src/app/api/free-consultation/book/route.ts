import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Validators } from "@/src/utils/validation/validators";
import { sanitizeBookingInputs } from "@/src/utils/validation/sanitize";
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";
import { SessionService } from "@/src/services/session.service";
import { setSessionCookie } from "@/src/utils/session-cookies.util";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "30m"), // Stricter window for bookings
});

export async function POST(req: NextRequest) {
	// 1. Rate Limiting: Check IP FIRST
	const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { success } = await limiter.limit(`booking:${ip}`);

	if (!success) {
		return NextResponse.json({ error: "Too many requests. Please try again in 30 minutes." }, { status: 429 });
	}

	try {
		const body = await req.json(); // Simpler than req.text() + JSON.parse
		if (!body) return NextResponse.json({ error: "Empty body" }, { status: 400 });

		const locale = req.headers.get("x-locale") || "ja";

		// 2. Validate FIRST (Fail fast before hitting DB)
		Validators.validateBooking(body);

		// 3. Session & Sanitization
		const { sessionId } = await SessionService.getOrCreate(req);

		const { plain } = sanitizeBookingInputs({
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			phone: body.phone || "",
			message: body.message || "",
			date: body.date,
			time: body.time,
			timezone: body.timezone || "Asia/Tokyo",
		});

		// 4. Service Call
		const result = await BookingService.createBooking(plain, sessionId, locale);

		// 5. Success Response with Shared Cookie Helper
		const res = NextResponse.json({ success: true, ...result });
		setSessionCookie(res, sessionId);

		return res;
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : "Internal Server Error";

		console.error("[Booking Error]", err);
		const status = getErrorStatus(errorMessage);

		return Response.json({ error: errorMessage }, { status });
	}
}

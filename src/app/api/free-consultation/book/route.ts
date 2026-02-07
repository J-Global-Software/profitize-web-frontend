import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Validators } from "@/src/utils/validation/validators";
import { sanitizeBookingInputs } from "@/src/utils/validation/sanitize";
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";
import { SessionService } from "@/src/services/session.service";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "30m"),
});

export async function POST(req: NextRequest) {
	// 1. Rate Limiting
	const ip = req.headers.get("x-forwarded-for") || "unknown";
	const { success } = await limiter.limit(ip);
	if (!success) return Response.json({ error: "Too many requests" }, { status: 429 });

	try {
		const rawBody = await req.text();
		if (!rawBody) return Response.json({ error: "Empty body" }, { status: 400 });
		const body = JSON.parse(rawBody);

		const locale = req.headers.get("x-locale") || "ja";
		const { sessionId } = await SessionService.getOrCreate(req);
		// 2. Validate
		Validators.validateBooking(body);

		// 3. Sanitize
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

		return Response.json(
			{ success: true, ...result },
			{
				status: 200,
				headers: {
					"Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
				},
			},
		);
	} catch (err: any) {
		console.error("[Booking Error]", err);

		const status = getErrorStatus(err.message);
		return Response.json({ error: err.message || "Internal Server Error" }, { status });
	}
}

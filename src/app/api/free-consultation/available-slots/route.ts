import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(30, "1m"),
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for") || "unknown";

	// 1. Rate Limiting
	const { success } = await limiter.limit(ip);
	if (!success) {
		return Response.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		// 2. Request Validation
		const rawBody = await req.text();
		if (!rawBody) {
			return Response.json({ error: "Empty request body" }, { status: 400 });
		}

		const { date, timezone } = JSON.parse(rawBody);

		if (!date) {
			return Response.json({ error: "Date is required" }, { status: 400 });
		}

		// 3. Execution
		// Note: Providing the default here ensures the Service always has a string to work with
		const availableSlots = await BookingService.getAvailableSlots(date, timezone || "Asia/Tokyo");

		return Response.json(
			{
				date,
				availableSlots,
			},
			{ status: 200 },
		);
	} catch (err: any) {
		console.error("[Slots API Error]:", err.message);

		// Returns 400, 401, 404, etc. based on error message, or defaults to 500
		const status = getErrorStatus(err.message);

		return Response.json({ error: err.message || "Internal Server Error" }, { status });
	}
}

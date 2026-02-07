import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(20, "1m"), // Generous limit for calendar browsing
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for") || "unknown";
	const { success } = await limiter.limit(ip);
	if (!success) return Response.json({ error: "Too many requests" }, { status: 429 });

	try {
		const rawBody = await req.text();
		if (!rawBody) return Response.json({ error: "Empty body" }, { status: 400 });

		const { date, timezone } = JSON.parse(rawBody);

		if (!date) {
			return Response.json({ error: "Date is required" }, { status: 400 });
		}

		// Delegate heavy lifting to Service
		const availableSlots = await BookingService.getAvailableSlots(date, timezone || "Asia/Tokyo");

		return Response.json(
			{
				date,
				availableSlots,
			},
			{ status: 200 },
		);
	} catch (err: any) {
		console.error("[Slots API Error]", err.message);

		return Response.json({ error: err.message || "Internal Server Error" }, { status: getErrorStatus(err.message) });
	}
}

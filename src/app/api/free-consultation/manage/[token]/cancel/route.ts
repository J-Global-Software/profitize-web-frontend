import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(3, "10m"),
});

export async function GET(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { success } = await limiter.limit(`manage:${ip}`);

	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const { token } = await context.params;

		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!token || !uuidRegex.test(token)) {
			return NextResponse.json({ error: "Invalid or missing token" }, { status: 400 });
		}

		const data = await BookingService.getBookingManagementData(token);

		if (!data) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		// Create response
		const res = NextResponse.json(data, { status: 200 });

		// IMPORTANT: Prevent caching of sensitive management data
		res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
		res.headers.set("Pragma", "no-cache");

		return res;
	} catch (err: any) {
		console.error("[GET Booking Error]", err);
		const status = getErrorStatus(err.message);
		return NextResponse.json({ error: err.message || "Internal Server Error" }, { status });
	}
}

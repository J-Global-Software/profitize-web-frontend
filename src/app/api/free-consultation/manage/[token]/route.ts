import { NextRequest } from "next/server"; // Removed unused NextResponse
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Use a separate limiter for management lookups
const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, "1m"),
});

// Define the interface for the Route Params
interface RouteContext {
	params: Promise<{ token: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
	// 1. Rate Limiting: Protect against token scraping
	const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { success } = await limiter.limit(`manage:${ip}`);

	if (!success) {
		return Response.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		// 2. Unwrap the params
		const { token } = await context.params;

		// 3. Validation: UUID format check
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!token || !uuidRegex.test(token)) {
			return Response.json({ error: "Invalid or missing token" }, { status: 400 });
		}

		// 4. Service Delegation
		const data = await BookingService.getBookingManagementData(token);

		if (!data) {
			return Response.json({ error: "Booking not found" }, { status: 404 });
		}

		return Response.json(data, { status: 200 });
	} catch (err: unknown) {
		// Safe error handling
		const message = err instanceof Error ? err.message : "Internal Server Error";

		console.error("[GET Booking Error]", err);

		const status = getErrorStatus(message);

		return Response.json({ error: message }, { status });
	}
}

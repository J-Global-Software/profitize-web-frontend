import { query } from "@/src/utils/neon";
import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(20, "1m"),
});

export async function GET(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	try {
		// -----------------------------
		// 1. Rate Limiting
		// -----------------------------
		const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
		const { success } = await limiter.limit(ip);
		if (!success) {
			return Response.json({ error: "Too many requests" }, { status: 429 });
		}

		// Await the params Promise
		const params = await context.params;
		const token = params.token;

		// 2. Validate token format
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

		if (!uuidRegex.test(token)) {
			return Response.json({ error: "Invalid token format" }, { status: 400 });
		}

		// 3. Fetch booking (optimized: get latest version in one query)
		const baseResult = await query(
			`WITH initial_booking AS (
				SELECT * FROM profitize.bookings WHERE cancellation_token = $1 LIMIT 1
			)
			SELECT * FROM initial_booking
			UNION ALL
			SELECT * FROM profitize.bookings WHERE original_booking_id = (SELECT id FROM initial_booking)
			ORDER BY created_at DESC
			LIMIT 1`,
			[token],
		);

		if (baseResult.rowCount === 0) {
			return Response.json({ error: "Booking not found" }, { status: 404 });
		}

		const booking = baseResult.rows[0];

		// To correctly identify if we "redirected" to a later booking:
		const isRedirectedFromOldBooking = booking.cancellation_token !== token;

		// 4. Time logic
		const eventDate = new Date(booking.event_date);
		const now = new Date();

		const isPast = eventDate < now;
		const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		// 5. Reschedule / cancel rules
		const isRescheduledBooking = booking.original_booking_id !== null;

		const canReschedule = hoursUntilEvent > 6 && !isPast && booking.status === "confirmed" && !isRescheduledBooking;

		const canCancel = hoursUntilEvent > 24 && !isPast && booking.status === "confirmed";

		// 6. Response
		const responseData = {
			booking: {
				id: booking.id,
				firstName: booking.first_name,
				lastName: booking.last_name,
				email: booking.email,
				phoneNumber: booking.phone_number,
				message: booking.message,
				eventDate: booking.event_date,
				status: booking.status,
				zoomJoinUrl: booking.zoom_join_url,
				createdAt: booking.created_at,
				rescheduledAt: booking.rescheduled_at,
				cancelledAt: booking.cancelled_at,
				isRescheduledBooking,
			},
			canReschedule,
			canCancel,
			hoursUntilEvent: Math.round(hoursUntilEvent * 10) / 10,
			isRedirectedFromOldBooking,
		};

		return Response.json(responseData, { status: 200 });
	} catch (error) {
		console.error("[GET Booking Error]", error);
		return Response.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
	}
}

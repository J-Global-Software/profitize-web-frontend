import { NextRequest } from "next/server";
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";

export async function GET(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	try {
		// 1. Unwrap the params Promise
		const { token } = await context.params;

		// 2. Basic format check
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(token)) {
			return Response.json({ error: "Invalid token format" }, { status: 400 });
		}

		// 3. Delegate to Service (which handles Reschedule-trail and Policy logic)
		const data = await BookingService.getBookingManagementData(token);

		return Response.json(data, { status: 200 });
	} catch (err: any) {
		console.error("[GET Booking Error]", err);

		const status = getErrorStatus(err.message);

		return Response.json({ error: err.message || "Internal Server Error" }, { status });
	}
}

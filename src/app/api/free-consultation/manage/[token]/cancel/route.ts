import { NextRequest } from "next/server";
import { BookingService } from "@/src/services/booking.service";
import { getErrorStatus } from "@/src/utils/errors";

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
	const locale = req.headers.get("x-locale") || "ja";

	try {
		const { token } = await params;

		// Token format validation
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(token)) {
			return Response.json({ error: "Invalid token" }, { status: 400 });
		}

		// Service call
		await BookingService.cancelBooking(token, locale);

		return Response.json({ success: true, message: "Booking cancelled successfully" });
	} catch (err: any) {
		console.error("[Cancel Booking Error]", err);

		return Response.json({ error: err.message || "Internal server error" }, { status: getErrorStatus(err.message) });
	}
}

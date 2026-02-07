import { NextRequest } from "next/server";
import { BookingService } from "@/src/services/booking.service";
import { Validators } from "@/src/utils/validation/validators";
import { getErrorStatus } from "@/src/utils/errors";

export async function POST(req: NextRequest, context: { params: Promise<{ token: string }> }) {
	try {
		const { token } = await context.params;

		const rawBody = await req.text();
		if (!rawBody || rawBody.trim() === "") {
			return Response.json({ error: "Request body is empty" }, { status: 400 });
		}

		let body;
		try {
			body = JSON.parse(rawBody);
		} catch (e) {
			return Response.json({ error: "Invalid JSON format" }, { status: 400 });
		}

		const { date, time } = body;
		const locale = req.headers.get("x-locale") || "ja";

		Validators.required(date, "Date");
		Validators.required(time, "Time");

		const result = await BookingService.rescheduleBooking(token, date, time, locale);

		return Response.json({ success: true, newBooking: result }, { status: 200 });
	} catch (err: any) {
		console.error("Reschedule Route Error:", err.message);

		const status = getErrorStatus(err.message);

		return Response.json({ error: err.message || "Internal Server Error" }, { status });
	}
}

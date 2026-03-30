import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { sanitizeBookingInputs } from "@/src/utils/validation/sanitize";
import { WorkshopService } from "@/src/services/workshop.service";
import { getErrorStatus } from "@/src/utils/errors";
import { SessionService } from "@/src/services/session.service";
import { setSessionCookie } from "@/src/utils/session-cookies.util";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(30, "30m"), // Stricter window for workshop registrations
});

export async function POST(req: NextRequest) {
	// 1. Rate Limiting: Check IP FIRST
	const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { success } = await limiter.limit(`workshop_reg:${ip}`);

	if (!success) {
		return NextResponse.json({ error: "Too many requests. Please try again in 30 minutes." }, { status: 429 });
	}

	try {
		const body = await req.json();
		if (!body) return NextResponse.json({ error: "Empty body" }, { status: 400 });

		const locale = req.headers.get("x-locale") || "ja";

		// 2. Validate FIRST (Fail fast before hitting DB)
		// If you add a validator specifically for workshops to your Validators class, call it here:
		// Validators.validateWorkshopRegistration(body);

		// 3. Session & Sanitization
		const { sessionId } = await SessionService.getOrCreate(req);

		// We use your existing sanitizer.
		// Note: You might need to adjust the sanitizer slightly if it requires 'date' and 'time' fields,
		// or just pass dummy values since the workshop ID handles the date/time.
		const { plain } = sanitizeBookingInputs({
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			phone: body.phone || "",
			message: "",
			date: "2099-01-01", // Dummy data if your sanitizer strictly requires it
			time: "12:00", // Dummy data if your sanitizer strictly requires it
			timezone: "Asia/Tokyo",
		});

		// Ensure workshopId is present
		const workshopId = typeof body.workshopId === "string" ? body.workshopId.trim() : "";
		if (!workshopId) {
			return NextResponse.json({ error: "Workshop ID is required" }, { status: 400 });
		}

		// Construct the final payload for the service
		const payload = {
			firstName: plain.firstName,
			lastName: plain.lastName,
			email: plain.email,
			phone: plain.phone,
			workshopId: workshopId,
		};

		// 4. Service Call
		const result = await WorkshopService.register(payload, sessionId, locale);

		// 5. Success Response with Shared Cookie Helper
		const res = NextResponse.json({ ...result, success: true });
		setSessionCookie(res, sessionId);

		return res;
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
		console.error("[Workshop Registration Error]", err);

		// 6. Handle the specific "Already Registered" constraint violation gracefully
		if (errorMessage === "ALREADY_REGISTERED") {
			return NextResponse.json(
				{ error: "You are already registered for this specific workshop." },
				{ status: 409 }, // 409 Conflict is the correct HTTP status for duplicate state
			);
		}

		const status = getErrorStatus(errorMessage);
		return NextResponse.json({ error: errorMessage }, { status });
	}
}

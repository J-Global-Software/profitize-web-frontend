import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Validators } from "@/src/utils/validation/validators";
import { getErrorStatus } from "@/src/utils/errors";
import { ContactService } from "@/src/services/contact.service";
import { SessionService } from "@/src/services/session.service";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "15 m"), // Note: "15 m" works, but "15m" is standard for Upstash
});

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,50}$/;

export async function POST(req: NextRequest) {
	console.log("--- API Route Timer Start ---");
	console.time("⏱️ FULL_ROUTE_EXECUTION");

	try {
		console.time("⏱️ BODY_PARSE");
		const rawBody = await req.text();
		if (!rawBody) return Response.json({ error: "Empty body" }, { status: 400 });
		const body = JSON.parse(rawBody);
		console.timeEnd("⏱️ BODY_PARSE");

		// Honeypot
		if (body.company) return Response.json({ success: true });

		const { firstName, lastName, email, message } = body;

		// 1. Validation
		Validators.required(firstName, "First name");
		Validators.required(lastName, "Last name");
		Validators.required(email, "Email");
		Validators.email(email);
		Validators.required(message, "Message");

		if (!nameRegex.test(String(firstName)) || !nameRegex.test(String(lastName))) {
			return Response.json({ error: "Invalid name format" }, { status: 400 });
		}

		// 2. Session Initialization
		console.time("⏱️ SESSION_INIT");
		// Calling the static method from your SessionService class
		const { sessionId } = await SessionService.getOrCreate(req);
		console.timeEnd("⏱️ SESSION_INIT");

		// 3. Rate Limit Check
		console.time("⏱️ RATE_LIMIT_CHECK");
		const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
		const { success } = await limiter.limit(`${sessionId}:${ip}`);
		console.timeEnd("⏱️ RATE_LIMIT_CHECK");

		if (!success) {
			return Response.json({ error: "Too many messages. Please try later." }, { status: 429 });
		}

		// 4. Service Delegation
		await ContactService.handleContactMessage({
			firstName: String(firstName),
			lastName: String(lastName),
			email: String(email),
			message: String(message),
			sessionId,
		});

		// 5. Response & Cookie Management
		// We set the cookie every time to refresh the expiration and repair missing cookies
		const res = NextResponse.json({ success: true });
		res.headers.set("Set-Cookie", `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=2592000`);

		console.timeEnd("⏱️ FULL_ROUTE_EXECUTION");
		console.log("--- API Route Timer End ---");

		return res;
	} catch (err: any) {
		console.error("CONTACT API ERROR:", err.message);
		// Ensure the timer stops even on failure
		try {
			console.timeEnd("⏱️ FULL_ROUTE_EXECUTION");
		} catch (e) {}

		return Response.json({ error: err.message || "Internal Server Error" }, { status: getErrorStatus(err.message) });
	}
}

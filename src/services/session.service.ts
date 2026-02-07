// src/services/session.service.ts
import { SessionRepository } from "@/src/repositories/session.repository";
import { getCookie } from "../utils/cookies.utils";

export class SessionService {
	/**
	 * The logic you wrote: checks for a cookie session,
	 * falls back to database upsert via fingerprint.
	 */
	static async getOrCreate(req: Request) {
		// 1. Check Cookie first
		const cookieSessionId = getCookie(req, "sessionId");

		if (cookieSessionId) {
			const existing = await SessionRepository.findById(cookieSessionId);
			if (existing) return { sessionId: cookieSessionId, isNew: false };
		}

		// 2. Fallback to IP/UA Upsert
		const forwardedFor = req.headers.get("x-forwarded-for");
		const ip = forwardedFor?.split(",")[0].trim() || "unknown";
		const ua = req.headers.get("user-agent") ?? "";

		const result = await SessionRepository.upsertSession({
			ip,
			ua,
			fingerprint: `${ip}:${ua}`,
		});

		return {
			sessionId: result.id,
			isNew: result.is_new,
		};
	}
}

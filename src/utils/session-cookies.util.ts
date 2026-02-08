// src/utils/session-cookies.utils.ts
import { NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "sessionId";

export function setSessionCookie(res: NextResponse, sessionId: string) {
	res.cookies.set(SESSION_COOKIE_NAME, sessionId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
}

export function getSessionCookie(req: NextRequest | Request): string | undefined {
	// If it's a NextRequest, use the built-in .cookies helper
	if ("cookies" in req) {
		return req.cookies.get(SESSION_COOKIE_NAME)?.value;
	}

	// Fallback for standard Request objects (like in some middleware or edge cases)
	const cookieHeader = req.headers.get("cookie") ?? "";
	const match = cookieHeader.match(new RegExp(`(^| )${SESSION_COOKIE_NAME}=([^;]+)`));
	return match ? decodeURIComponent(match[2]) : undefined;
}

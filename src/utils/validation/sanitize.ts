// src/utils/validation/sanitize.ts

/**
 * Strips control characters (newlines, tabs, nulls, etc.) from a string.
 * Safe for plain-text contexts: DB, calendar descriptions, Zoom topics.
 */
export function sanitizePlainText(input: unknown): string {
	// If it's not a string, return an empty string instead of crashing
	if (typeof input !== "string") return "";

	return input
		.replace(/\\x[0-9A-Fa-f]{2}/g, "")
		.replace(/[\x00-\x1F\x7F]/g, "")
		.trim();
}

/**
 * Escapes HTML special characters.
 * Safe for interpolation into HTML email templates.
 */
export function sanitizeHtml(input: string): string {
	return sanitizePlainText(input).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/**
 * Sanitizes all booking fields at once.
 * Returns both plain-text and HTML-safe versions so each context
 * picks the right one without the caller having to think about it.
 */

interface SanitizeParams {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
	date: string;
	time: string;
	timezone?: string;
}
export function sanitizeBookingInputs(raw: SanitizeParams) {
	return {
		plain: {
			firstName: sanitizePlainText(raw.firstName),
			lastName: sanitizePlainText(raw.lastName),
			date: sanitizePlainText(raw.date),
			time: sanitizePlainText(raw.time),
			email: sanitizePlainText(raw.email),
			phone: sanitizePlainText(raw.phone),
			message: sanitizePlainText(raw.message),
		},
		html: {
			firstName: sanitizeHtml(raw.firstName),
			lastName: sanitizeHtml(raw.lastName),
			date: sanitizeHtml(raw.date),
			time: sanitizeHtml(raw.time),
			email: sanitizeHtml(raw.email),
			phone: sanitizeHtml(raw.phone),
			message: sanitizeHtml(raw.message),
		},
	};
}

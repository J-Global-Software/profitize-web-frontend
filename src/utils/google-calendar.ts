import { google, calendar_v3 } from "googleapis";

/**
 * Get authenticated Google Calendar client
 * Reuses the JWT instance to avoid re-auth on every call in the same execution context
 */
let calendarClient: calendar_v3.Calendar | null = null;

export function getCalendarAuth() {
	if (calendarClient) return calendarClient;

	const auth = new google.auth.JWT({
		email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
		key: process.env.GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
		scopes: ["https://www.googleapis.com/auth/calendar"],
	});

	calendarClient = google.calendar({ version: "v3", auth });
	return calendarClient;
}

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

/**
 * Check for availability/conflicts in a time range
 */
export async function checkCalendarConflict(start: Date, end: Date): Promise<boolean> {
	const calendar = getCalendarAuth();
	const response = await calendar.events.list({
		calendarId: CALENDAR_ID,
		timeMin: start.toISOString(),
		timeMax: end.toISOString(),
		singleEvents: true,
		orderBy: "startTime",
	});

	return (response.data.items?.length ?? 0) > 0;
}

/**
 * Insert a new event
 */
export async function createCalendarEvent(eventBody: calendar_v3.Schema$Event) {
	const calendar = getCalendarAuth();
	try {
		const response = await calendar.events.insert({
			calendarId: CALENDAR_ID,
			requestBody: eventBody,
		});
		return response.data;
	} catch (error) {
		console.error("❌ Google Calendar Insert Error:", error);
		throw error;
	}
}

/**
 * Delete a Google Calendar event
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
	const calendar = getCalendarAuth();
	try {
		await calendar.events.delete({
			calendarId: CALENDAR_ID,
			eventId: eventId,
		});
		return true;
	} catch (error: any) {
		// If it's already deleted (404/410), don't treat it as a hard crash
		if (error.code === 404 || error.code === 410) {
			console.warn(`⚠️ Event ${eventId} already deleted or not found.`);
			return true;
		}
		console.error(`❌ Failed to delete calendar event ${eventId}:`, error);
		return false;
	}
}

/**
 * Get a Google Calendar event by ID
 */
export async function getCalendarEvent(eventId: string) {
	const calendar = getCalendarAuth();
	try {
		const response = await calendar.events.get({
			calendarId: CALENDAR_ID,
			eventId: eventId,
		});
		return response.data;
	} catch (error) {
		console.error(`❌ Failed to get calendar event ${eventId}:`, error);
		return null;
	}
}

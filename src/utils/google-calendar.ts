import { google, calendar_v3 } from "googleapis";

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
	});
	return (response.data.items?.length ?? 0) > 0;
}

/**
 * High-level wrapper to create a booking event
 */
export async function createBookingEvent(data: { summary: string; description: string; start: Date; end: Date }) {
	const calendar = getCalendarAuth();
	const response = await calendar.events.insert({
		calendarId: CALENDAR_ID,
		requestBody: {
			summary: data.summary,
			description: data.description,
			start: { dateTime: data.start.toISOString(), timeZone: "Asia/Tokyo" },
			end: { dateTime: data.end.toISOString(), timeZone: "Asia/Tokyo" },
		},
	});
	return response.data;
}

export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
	const calendar = getCalendarAuth();
	try {
		await calendar.events.delete({ calendarId: CALENDAR_ID, eventId });
		return true;
	} catch (error: any) {
		if (error.code === 404 || error.code === 410) return true;
		return false;
	}
}

import { google, calendar_v3 } from "googleapis";

// Define an interface for the creation data to avoid 'any'
export interface CreateCalendarEventDTO {
	summary: string;
	description: string;
	start: Date;
	end: Date;
}

let calendarClient: calendar_v3.Calendar | null = null;

/**
 * Initializes and returns the Google Calendar Client (Singleton)
 */
export function getCalendarAuth(): calendar_v3.Calendar {
	if (calendarClient) return calendarClient;

	const clientEmail = process.env.GOOGLE_SERVICE_CLIENT_EMAIL;
	const privateKey = process.env.GOOGLE_SERVICE_PRIVATE_KEY;

	if (!clientEmail || !privateKey) {
		throw new Error("Missing Google Service Account credentials in environment variables.");
	}

	const auth = new google.auth.JWT({
		email: clientEmail,
		key: privateKey.replace(/\\n/g, "\n"),
		scopes: ["https://www.googleapis.com/auth/calendar"],
	});

	calendarClient = google.calendar({ version: "v3", auth });
	return calendarClient;
}

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

/**
 * Check for availability/conflicts in a time range.
 * Returns true if the slot is occupied.
 */
export async function checkCalendarConflict(start: Date, end: Date): Promise<boolean> {
	const calendar = getCalendarAuth();

	const response = await calendar.events.list({
		calendarId: CALENDAR_ID,
		timeMin: start.toISOString(),
		timeMax: end.toISOString(),
		singleEvents: true,
		// Optional: ensure we don't count "transparent" (free) events as conflicts
		timeZone: "Asia/Tokyo",
	});

	// Filter out cancelled events just in case
	const activeEvents = response.data.items?.filter((event) => event.status !== "cancelled") ?? [];
	return activeEvents.length > 0;
}

/**
 * Creates a booking event and returns the typed event data.
 */
export async function createBookingEvent(data: CreateCalendarEventDTO): Promise<calendar_v3.Schema$Event> {
	const calendar = getCalendarAuth();

	const response = await calendar.events.insert({
		calendarId: CALENDAR_ID,
		requestBody: {
			summary: data.summary,
			description: data.description,
			start: {
				dateTime: data.start.toISOString(),
				timeZone: "Asia/Tokyo",
			},
			end: {
				dateTime: data.end.toISOString(),
				timeZone: "Asia/Tokyo",
			},
			// Makes the event show as 'Busy' to prevent double-booking
			transparency: "opaque",
		},
	});

	return response.data;
}

/**
 * Deletes an event. Returns true if successful or if the event already didn't exist.
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
	const calendar = getCalendarAuth();
	try {
		await calendar.events.delete({
			calendarId: CALENDAR_ID,
			eventId,
		});
		return true;
	} catch (error: unknown) {
		// Handle specific Google API error codes
		if (typeof error === "object" && error !== null && "code" in error) {
			const code = (error as { code: number }).code;
			if (code === 404 || code === 410) {
				console.warn(`Attempted to delete non-existent event: ${eventId}`);
				return true;
			}
		}
		console.error("Google Calendar Deletion Error:", error);
		return false;
	}
}

/**
 * Free Coaching - Available Slots API Route (Debug Version)
 */

import { weeklySlots, convertJSTToUserTimezone } from "@/src/utils/slots";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { google, calendar_v3 } from "googleapis";
import type { NextRequest } from "next/server";

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(20, "1m"),
});

type CalendarEvent = calendar_v3.Schema$Event;

const parseTimeJST = (dateStr: string, timeStr: string): Date => {
	const [hourStr, minStr] = timeStr.split(":");
	return new Date(`${dateStr}T${hourStr.padStart(2, "0")}:${minStr.padStart(2, "0")}:00+09:00`);
};

const isSlotAvailable = (slotStart: Date, slotEnd: Date, events: CalendarEvent[], jstTime: string): boolean => {
	const conflict = events.find((ev) => {
		if (!ev.start?.dateTime || !ev.end?.dateTime) return false;
		const evStart = new Date(ev.start.dateTime);
		const evEnd = new Date(ev.end.dateTime);
		return slotStart < evEnd && slotEnd > evStart;
	});

	if (conflict) {
		return false;
	}
	return true;
};

export async function POST(req: NextRequest): Promise<Response> {
	try {
		const body: any = await req.json();
		const { date: userDateStr, timezone: userTimezone } = body;
		const timezone = userTimezone || "Asia/Tokyo";

		const parts = userDateStr.split("-").map(Number);
		const baseDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
		const jstDatesToCheck = [new Date(baseDate.getTime() - 86400000).toISOString().split("T")[0], userDateStr, new Date(baseDate.getTime() + 86400000).toISOString().split("T")[0]];

		const { GOOGLE_SERVICE_CLIENT_EMAIL, GOOGLE_SERVICE_PRIVATE_KEY, GOOGLE_CALENDAR_ID } = process.env;
		const auth = new google.auth.JWT({
			email: GOOGLE_SERVICE_CLIENT_EMAIL,
			key: GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
		});

		const calendar = google.calendar({ version: "v3", auth });
		const now = new Date();
		const FOUR_HOURS = 4 * 60 * 60 * 1000;
		const allSlots: any[] = [];

		for (const jstDateStr of jstDatesToCheck) {
			const startOfDay = new Date(`${jstDateStr}T00:00:00+09:00`);
			const endOfDay = new Date(`${jstDateStr}T23:59:59+09:00`);

			const eventsRes = await calendar.events.list({
				calendarId: GOOGLE_CALENDAR_ID,
				timeMin: startOfDay.toISOString(),
				timeMax: endOfDay.toISOString(),
				singleEvents: true,
			});

			const events = eventsRes.data.items ?? [];
			const [y, m, d] = jstDateStr.split("-").map(Number);
			const jstDayOfWeek = new Date(y, m - 1, d).getDay();
			const jstSlots = weeklySlots[jstDayOfWeek] ?? [];

			for (const jstTime of jstSlots) {
				const slotStart = parseTimeJST(jstDateStr, jstTime);
				const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

				// Check 4-hour rule
				if (slotStart.getTime() - now.getTime() < FOUR_HOURS) {
					continue;
				}

				// Check Calendar Availability
				if (!isSlotAvailable(slotStart, slotEnd, events, jstTime)) {
					continue;
				}

				const { displayTime, displayDate } = convertJSTToUserTimezone(jstDateStr, jstTime, timezone);

				if (displayDate === userDateStr) {
					allSlots.push({ displayTime, displayDate, jstTime, jstDate: jstDateStr });
				}
			}
		}

		allSlots.sort((a, b) => a.displayTime.localeCompare(b.displayTime));

		return new Response(JSON.stringify({ date: userDateStr, availableSlots: allSlots }), { status: 200 });
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
}

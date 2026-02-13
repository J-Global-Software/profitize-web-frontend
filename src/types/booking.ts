export const BOOKING_STATUS = {
	CONFIRMED: "confirmed",
	CANCELLED: "cancelled",
	RESCHEDULED: "rescheduled",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export interface Booking {
	id: string;
	session_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	message?: string;
	event_date: string;
	google_calendar_event_id?: string;
	zoom_meeting_id?: string;
	zoom_join_url?: string;
	status: BookingStatus;
	cancellation_token: string;
	original_booking_id?: string;
	created_at: string;
	cancelled_at?: string;
	rescheduled_at?: string;
}

export interface CreateBookingDTO {
	sessionId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
	eventDate: string;
	calendarId?: string;
	zoomId?: string;
	zoomUrl?: string;
}

export interface BookingPayload {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;

	// Frontend specific fields (e.g., from <input type="date" />)
	date: string; // Format: "YYYY-MM-DD"
	time: string; // Format: "HH:mm"

	// Optional integration IDs if passed from client (usually generated on server though)
	calendarId?: string;
	zoomId?: string;
	zoomUrl?: string;
}

/**
 * Useful if you want a version where all fields are optional
 * for the Validator logic.
 */
export type PartialBookingPayload = Partial<BookingPayload>;

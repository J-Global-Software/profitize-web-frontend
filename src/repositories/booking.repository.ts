import { query } from "@/src/utils/neon";
import { Booking, CreateBookingDTO, BookingStatus, BOOKING_STATUS } from "@/src/types/booking";

// Mapping statuses to their specific DB timestamp columns
const STATUS_TIMESTAMP_COLS: Partial<Record<BookingStatus, string>> = {
	[BOOKING_STATUS.CANCELLED]: "cancelled_at",
	[BOOKING_STATUS.RESCHEDULED]: "rescheduled_at",
};

export const BookingRepository = {
	/**
	 * Creates the initial booking record.
	 */
	async createInitial(data: CreateBookingDTO): Promise<Pick<Booking, "id" | "cancellation_token">> {
		const sql = `
            INSERT INTO profitize.bookings 
            (session_id, first_name, last_name, email, phone_number, message, event_date, 
             google_calendar_event_id, zoom_meeting_id, zoom_join_url, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, cancellation_token
        `;

		const values = [data.sessionId, data.firstName, data.lastName, data.email, data.phone, data.message, data.eventDate, data.calendarId, data.zoomId, data.zoomUrl, BOOKING_STATUS.CONFIRMED, new Date().toISOString()];

		const res = await query<Pick<Booking, "id" | "cancellation_token">>(sql, values);
		return res.rows[0];
	},

	/**
	 * Generic status updater that automatically handles timestamp columns.
	 */
	async updateStatus(id: string, status: BookingStatus) {
		const timestampCol = STATUS_TIMESTAMP_COLS[status];
		const now = new Date().toISOString();

		if (timestampCol) {
			// Dynamically inject column name only if it exists in our map
			return await query(`UPDATE profitize.bookings SET status = $1, ${timestampCol} = $2 WHERE id = $3`, [status, now, id]);
		}

		return await query(`UPDATE profitize.bookings SET status = $1 WHERE id = $2`, [status, id]);
	},

	async findByToken(token: string): Promise<Booking | null> {
		const res = await query<Booking>(`SELECT * FROM profitize.bookings WHERE cancellation_token = $1`, [token]);
		return res.rows[0] || null;
	},

	async findLatestChild(originalId: string): Promise<Booking | null> {
		const res = await query<Booking>(
			`SELECT * FROM profitize.bookings 
             WHERE original_booking_id = $1 
             AND status = $2 
             ORDER BY created_at DESC LIMIT 1`,
			[originalId, BOOKING_STATUS.CONFIRMED],
		);
		return res.rows[0] || null;
	},

	async createRescheduled(oldBooking: Booking, newBookingData: Partial<CreateBookingDTO>): Promise<Pick<Booking, "id" | "cancellation_token">> {
		const sql = `
            INSERT INTO profitize.bookings
            (first_name, last_name, email, phone_number, message, event_date,
             google_calendar_event_id, zoom_meeting_id, zoom_join_url, 
             status, original_booking_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, cancellation_token
        `;

		const values = [oldBooking.first_name, oldBooking.last_name, oldBooking.email, oldBooking.phone_number, oldBooking.message, newBookingData.eventDate, newBookingData.calendarId, newBookingData.zoomId, newBookingData.zoomUrl, BOOKING_STATUS.CONFIRMED, oldBooking.id, new Date().toISOString()];

		const res = await query<Pick<Booking, "id" | "cancellation_token">>(sql, values);
		return res.rows[0];
	},
};

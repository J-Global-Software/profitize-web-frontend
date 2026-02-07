import { query } from "@/src/utils/neon";

export const BookingRepository = {
	async createInitial(data: any) {
		const res = await query(
			`INSERT INTO profitize.bookings 
            (session_id, first_name, last_name, email, phone_number, message, event_date, 
             google_calendar_event_id, zoom_meeting_id, zoom_join_url, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, cancellation_token`,
			[data.sessionId, data.firstName, data.lastName, data.email, data.phone, data.message, data.eventDate, data.calendarId, data.zoomId, data.zoomUrl, "confirmed", new Date().toISOString()],
		);
		return res.rows[0];
	},
	async findByToken(token: string) {
		const res = await query(`SELECT * FROM profitize.bookings WHERE cancellation_token = $1`, [token]);
		return res.rows[0] || null;
	},

	async findLatestChild(originalId: string) {
		const res = await query(
			`SELECT * FROM profitize.bookings 
             WHERE original_booking_id = $1 
             AND status = 'confirmed' 
             ORDER BY created_at DESC LIMIT 1`,
			[originalId],
		);
		return res.rows[0] || null;
	},
	async updateStatus(id: string, status: "cancelled" | "rescheduled") {
		return await query(`UPDATE profitize.bookings SET status = $1, ${status}_at = $2 WHERE id = $3`, [status, new Date().toISOString(), id]);
	},
	async createRescheduled(oldBooking: any, newBookingData: any) {
		// We do this in a single method to keep the service clean
		const res = await query<{ id: string; cancellation_token: string }>(
			`INSERT INTO profitize.bookings
            (first_name, last_name, email, phone_number, message, event_date,
             google_calendar_event_id, zoom_meeting_id, zoom_join_url, 
             status, original_booking_id, created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING id, cancellation_token`,
			[oldBooking.first_name, oldBooking.last_name, oldBooking.email, oldBooking.phone_number, oldBooking.message, newBookingData.eventDate, newBookingData.calendarId, newBookingData.zoomId, newBookingData.zoomUrl, "confirmed", oldBooking.id, new Date().toISOString()],
		);
		return res.rows[0];
	},
};

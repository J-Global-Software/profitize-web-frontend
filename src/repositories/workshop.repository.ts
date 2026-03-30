import { query } from "@/src/utils/neon";
import { Workshop, RegisterWorkshopDTO } from "@/src/types/workshop";

export const WorkshopRepository = {
	/**
	 * Fetches all upcoming workshops that haven't happened yet.
	 */
	async getUpcoming(): Promise<Workshop[]> {
		const sql = `
            SELECT 
                id, 
                title, 
				title_jp,
                event_date AS "eventDate", 
                zoom_join_url AS "zoomJoinUrl", 
                language 
            FROM profitize.workshops 
            WHERE event_date > NOW() 
            ORDER BY event_date ASC
        `;

		const res = await query<Workshop>(sql);
		return res.rows;
	},

	/**
	 * Fetches a specific workshop by ID.
	 */
	async findById(id: string): Promise<Workshop | null> {
		const sql = `
            SELECT 
                id, title, event_date AS "eventDate", zoom_join_url AS "zoomJoinUrl", language 
            FROM profitize.workshops 
            WHERE id = $1
        `;

		const res = await query<Workshop>(sql, [id]);
		return res.rows[0] || null;
	},

	/**
	 * Upserts the client and links them to the workshop in a single transaction.
	 * Prevents duplicate registrations using the database constraint.
	 */
	async registerUser(data: RegisterWorkshopDTO, sessionId: string): Promise<{ registrationId: string }> {
		const sql = `
            WITH client_upsert AS (
                INSERT INTO profitize.clients (first_name, last_name, email, phone_number)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) 
                DO UPDATE SET 
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    phone_number = COALESCE(EXCLUDED.phone_number, profitize.clients.phone_number)
                RETURNING id
            )
            INSERT INTO profitize.workshop_registrations (client_id, workshop_id, session_id)
            SELECT id, $5, $6 FROM client_upsert
            RETURNING id;
        `;

		const values = [data.firstName, data.lastName, data.email, data.phone || null, data.workshopId, sessionId];

		try {
			const res = await query<{ id: string }>(sql, values);
			return { registrationId: res.rows[0].id };
		} catch (error: any) {
			// Catch the specific PostgreSQL constraint to prevent double-booking
			if (error.constraint === "unique_client_workshop_registration") {
				throw new Error("ALREADY_REGISTERED");
			}
			throw error;
		}
	},
};

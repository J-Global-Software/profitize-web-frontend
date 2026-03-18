import { query } from "@/src/utils/neon";
import { RegisterWorkshopDTO } from "@/src/types/workshop";

export const WorkshopRegistrationRepository = {
	/**
	 * Finds or creates a client, then registers them for the workshop.
	 * Uses a single PostgreSQL CTE for maximum efficiency.
	 */
	async registerUser(data: RegisterWorkshopDTO): Promise<{ registration_id: string }> {
		const sql = `
            WITH client_upsert AS (
                -- Step 1: Insert or update the client based on their email
                INSERT INTO profitize.clients (first_name, last_name, email, phone_number)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) 
                DO UPDATE SET 
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    -- Only update phone if a new one is provided
                    phone_number = COALESCE(EXCLUDED.phone_number, profitize.clients.phone_number)
                RETURNING id
            )
            -- Step 2: Take the returned client ID and insert the registration
            INSERT INTO profitize.workshop_registrations (client_id, workshop_id, session_id)
            SELECT id, $5, $6 FROM client_upsert
            RETURNING id AS registration_id
        `;

		const values = [data.firstName, data.lastName, data.email, data.phone || null, data.workshopId, data.sessionId || null];

		try {
			const res = await query<{ registration_id: string }>(sql, values);
			return res.rows[0];
		} catch (error: any) {
			// Check for our custom unique constraint (user already registered)
			if (error.constraint === "unique_client_workshop_registration") {
				throw new Error("You are already registered for this workshop.");
			}
			throw error;
		}
	},
};

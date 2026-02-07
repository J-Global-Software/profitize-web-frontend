// src/repositories/session.repository.ts
import { query } from "../utils/neon"; // Assuming your neon utility is here

export interface SessionRecord {
	id: string;
	is_new: boolean;
}

export const SessionRepository = {
	/**
	 * Validates if a session ID exists in the database
	 */
	async findById(id: string): Promise<{ id: string } | null> {
		const result = await query(
			`
            SELECT id 
            FROM profitize.client_sessions 
            WHERE id = $1
        `,
			[id],
		);

		return result.rows[0] || null;
	},

	/**
	 * Creates a new session or updates an existing one based on the device fingerprint.
	 * Uses PostgreSQL xmax trick to determine if the row was newly inserted or updated.
	 */
	async upsert(data: { ip: string; ua: string; fingerprint: string }): Promise<SessionRecord> {
		const result = await query<SessionRecord>(
			`INSERT INTO profitize.client_sessions (ip_address, user_agent, fingerprint)
             VALUES ($1, $2, $3)
             ON CONFLICT (fingerprint)
             DO UPDATE SET 
                ip_address = EXCLUDED.ip_address, 
                last_seen_at = NOW()
             RETURNING id, (xmax = 0) AS is_new`,
			[data.ip, data.ua, data.fingerprint],
		);

		if (!result.rows[0]) {
			throw new Error("Failed to upsert session: No rows returned.");
		}

		return result.rows[0];
	},
	async upsertSession(data: { ip: string; ua: string; fingerprint: string }) {
		const result = await query<{ id: string; is_new: boolean }>(
			`INSERT INTO profitize.client_sessions (ip_address, user_agent, fingerprint)
             VALUES ($1, $2, $3)
             ON CONFLICT (fingerprint)
             DO UPDATE SET 
                ip_address = EXCLUDED.ip_address, 
                last_seen_at = NOW()
             RETURNING id, (xmax = 0) AS is_new`,
			[data.ip, data.ua, data.fingerprint],
		);

		return result.rows[0];
	},
};

import { query } from "@/src/utils/neon";

export const ContactRepository = {
	async create(data: any): Promise<number> {
		const result = await query(
			`INSERT INTO profitize.contact_messages
             (session_id, first_name, last_name, email, message)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
			[data.sessionId, data.firstName, data.lastName, data.email.toLowerCase().trim(), data.message],
		);
		return result.rows[0].id;
	},
};

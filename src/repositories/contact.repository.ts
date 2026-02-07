import { query } from "@/src/utils/neon";

export interface CreateContactDTO {
	sessionId: string;
	firstName: string;
	lastName: string;
	email: string;
	message: string;
}

export const ContactRepository = {
	/**
	 * Persists a new contact message to the Neon database
	 */
	async create(data: CreateContactDTO): Promise<number> {
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

export interface ContactMessage {
	id: number;
	session_id: string;
	first_name: string;
	last_name: string;
	email: string;
	message: string;
	created_at: string;
}

export interface CreateContactDTO {
	sessionId: string;
	firstName: string;
	lastName: string;
	email: string;
	message: string;
}

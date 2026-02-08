import { ContactRepository } from "@/src/repositories/contact.repository";
import { sanitizeEmailMessage } from "@/src/utils/sanitizeEmailMessage";
import { EmailService } from "./email.service";

export const ContactService = {
	/**
	 * Orchestrates the contact message flow with diagnostic timing
	 */
	async handleContactMessage(data: { firstName: string; lastName: string; email: string; message: string; sessionId: string }) {
		// 1. Persist Raw (Parameterized query handles SQL safety)
		const messageId = await ContactRepository.create(data);

		// 2. Sanitize specifically for HTML Emails
		// This strips scripts/styles but keeps line breaks
		const safeMessage = sanitizeEmailMessage(data.message).replace(/\n/g, "<br />");

		// 3. Notify Lecturer
		await EmailService.sendContactNotification({
			messageId: String(messageId),
			sessionId: data.sessionId,
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			safeMessage,
			fromEmail: process.env.FROM_EMAIL!,
			toEmail: process.env.LECTURER_EMAIL!,
		});

		return { messageId };
	},
};

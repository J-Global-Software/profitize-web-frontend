import { ContactRepository } from "@/src/repositories/contact.repository";
import { sanitizeEmailMessage } from "@/src/utils/sanitizeEmailMessage";
import { EmailService } from "./email.service";

export const ContactService = {
	/**
	 * Orchestrates the contact message flow with diagnostic timing
	 */
	async handleContactMessage(data: { firstName: string; lastName: string; email: string; message: string; sessionId: string }) {
		console.log("--- Contact Submission Debug Start ---");

		// 1. Database Storage Timer
		console.time("⏱️ DB_SAVE");
		const messageId = await ContactRepository.create(data);
		console.timeEnd("⏱️ DB_SAVE");

		// 2. Formatting
		const safeMessage = sanitizeEmailMessage(data.message).replace(/\n/g, "<br />");

		// 3. Email Delivery Timer
		console.time("⏱️ EMAIL_SEND");
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
		console.timeEnd("⏱️ EMAIL_SEND");

		console.log("--- Contact Submission Debug End ---");

		return { messageId };
	},
};

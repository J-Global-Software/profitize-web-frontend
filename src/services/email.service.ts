import { Resend } from "resend";
import { loadServerMessages } from "@/messages/server";
import { generateCancelHTMLEmail, generateContactNotificationHTML, generateHTMLEmail, generateLecturerCancelNotificationHTML, generateLecturerNotificationHTML, generateLecturerRescheduleNotificationHTML, generatePlainTextEmail, generateRescheduleHTMLEmail } from "./generateEmail";
import { BookingPayload } from "@/src/types/booking";

// Capture the type from the loader
type ServerMessages = Awaited<ReturnType<typeof loadServerMessages>>;

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Interfaces for grouped parameters
 */
interface BaseEmailParams {
	fromEmail: string;
	toEmail: string;
	locale: string;
	messages: ServerMessages;
}

interface RescheduleUserParams {
	locale: string;
	firstName: string;
	lastName: string;
	email: string; // <--- Add this back
	oldEventDate: Date;
	newStart: Date;
	newEnd: Date;
	userZoomLink: string;
	managementUrl: string;
	messages: ServerMessages;
	fromEmail: string;
	toEmail: string;
}

interface CancelUserParams {
	locale: string;
	firstName: string;
	lastName: string;
	email: string; // Added to match your call
	eventDate: Date;
	messages: ServerMessages;
	fromEmail: string;
	toEmail: string;
}

interface UserConfirmationParams extends BaseEmailParams {
	userData: BookingPayload;
	userZoomLink: string;
	managementUrl: string;
	icsContent: string;
}

interface RescheduleUserParams extends BaseEmailParams {
	firstName: string;
	lastName: string;
	oldEventDate: Date;
	newStart: Date;
	newEnd: Date;
	userZoomLink: string;
	managementUrl: string;
}

export const EmailService = {
	/**
	 * Sends confirmation and ICS file to the User
	 */
	async sendUserConfirmation({ locale, userData, userZoomLink, managementUrl, messages, icsContent, fromEmail, toEmail }: UserConfirmationParams) {
		const greetingName = locale === "ja" ? userData.lastName : userData.firstName;
		const plainText = generatePlainTextEmail(locale, greetingName, userData, userZoomLink, managementUrl, messages);
		const htmlContent = generateHTMLEmail(locale, greetingName, userData, userZoomLink, managementUrl, messages);

		return resend.emails.send({
			from: fromEmail,
			to: toEmail,
			subject: messages.server.email.subject,
			text: plainText,
			html: htmlContent,
			attachments: [
				{
					filename: "consultation-session.ics",
					content: icsContent,
					contentType: "text/calendar; charset=utf-8",
				},
			],
		});
	},

	/**
	 * Notifies Lecturer of a new booking
	 */
	async sendLecturerNotification({ userData, messages, fromEmail, toEmail }: { userData: BookingPayload; messages: ServerMessages; fromEmail: string; toEmail: string }) {
		const htmlContent = generateLecturerNotificationHTML(userData, messages);
		return resend.emails.send({
			from: fromEmail,
			to: toEmail,
			subject: "(Profitize) Free Consultation Booking Received",
			html: htmlContent,
		});
	},

	/**
	 * Sends Reschedule confirmation to the User
	 */
	async sendRescheduleUser({ locale, firstName, lastName, oldEventDate, newStart, newEnd, userZoomLink, managementUrl, messages, fromEmail, toEmail }: RescheduleUserParams) {
		const htmlContent = generateRescheduleHTMLEmail(locale, firstName, lastName, oldEventDate, newStart, newEnd, userZoomLink, managementUrl, messages);
		return resend.emails.send({
			from: fromEmail,
			to: toEmail,
			subject: messages.server.email.rescheduledSubject,
			html: htmlContent,
		});
	},

	/**
	 * Notifies Lecturer of a reschedule
	 */
	async sendRescheduleLecturer(firstName: string, lastName: string, oldEventDate: Date, newEventDate: Date, fromEmail: string, toEmail: string) {
		const htmlContent = generateLecturerRescheduleNotificationHTML(firstName, lastName, oldEventDate, newEventDate);
		return resend.emails.send({
			from: fromEmail,
			to: toEmail,
			subject: "(Profitize) Consultation Session Rescheduled",
			html: htmlContent,
		});
	},

	/**
	 * Sends Cancellation notice to the User
	 */
	async sendCancelUser({ locale, firstName, lastName, eventDate, messages, fromEmail, toEmail }: CancelUserParams) {
		const htmlContent = generateCancelHTMLEmail(locale, firstName, lastName, eventDate, messages);
		return resend.emails.send({
			from: fromEmail,
			to: toEmail,
			subject: messages.server.email.cancelledSubject,
			html: htmlContent,
		});
	},

	/**
	 * Notifies Lecturer of a cancellation
	 */
	async sendCancelLecturer(firstName: string, lastName: string, email: string, eventDate: Date, fromEmail: string, toEmail: string) {
		const htmlContent = generateLecturerCancelNotificationHTML(firstName, lastName, email, eventDate);
		return resend.emails.send({
			from: fromEmail,
			to: toEmail,
			subject: "(Profitize) Consultation Session Cancelled by User",
			html: htmlContent,
		});
	},

	/**
	 * Sends the contact form message to the Lecturer
	 */
	async sendContactNotification(params: { messageId: string; sessionId: string; firstName: string; lastName: string; email: string; safeMessage: string; fromEmail: string; toEmail: string }): Promise<void> {
		const htmlContent = generateContactNotificationHTML(params);

		await resend.emails.send({
			from: params.fromEmail,
			to: params.toEmail,
			replyTo: params.email.toLowerCase().trim(),
			subject: `New Contact Message (ID: ${params.messageId})`,
			html: htmlContent,
		});
	},
};

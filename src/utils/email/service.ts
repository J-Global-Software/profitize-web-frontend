import { Resend } from "resend";
import { loadServerMessages } from "@/messages/server";
import { generatePlainTextEmail, generateHTMLEmail, generateLecturerNotificationHTML, generateICS, generateRescheduleHTMLEmail, generateCancelHTMLEmail, generateLecturerRescheduleNotificationHTML, generateLecturerCancelNotificationHTML, type EmailData } from "./templates";

type ServerMessages = Awaited<ReturnType<typeof loadServerMessages>>;

export interface UserConfirmationEmailParams {
	locale: string;
	userData: EmailData;
	userZoomLink: string;
	managementUrl: string;
	messages: ServerMessages;
	icsContent: string;
	fromEmail: string;
	toEmail: string;
}

export interface LecturerNotificationEmailParams {
	userData: EmailData;
	messages: ServerMessages;
	fromEmail: string;
	toEmail: string;
}

export interface RescheduleEmailParams {
	locale: string;
	firstName: string;
	lastName: string;
	email: string;
	oldEventDate: Date;
	newStart: Date;
	newEnd: Date;
	userZoomLink: string;
	managementUrl: string;
	messages: ServerMessages;
	fromEmail: string;
	toEmail: string;
}

export interface CancelEmailParams {
	locale: string;
	firstName: string;
	lastName: string;
	email: string;
	eventDate: Date;
	messages: ServerMessages;
	fromEmail: string;
	toEmail: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendUserConfirmationEmail({ locale, userData, userZoomLink, managementUrl, messages, icsContent, fromEmail, toEmail }: UserConfirmationEmailParams): Promise<void> {
	const greetingName = locale === "ja" ? userData.lastName : userData.firstName;
	const htmlGreetingName = locale === "ja" ? userData.lastName : userData.firstName;

	const plainText = generatePlainTextEmail(locale, greetingName, userData, userZoomLink, managementUrl, messages);

	const htmlContent = generateHTMLEmail(locale, htmlGreetingName, userData, userZoomLink, managementUrl, messages);

	await resend.emails.send({
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
}

export async function sendLecturerNotificationEmail({ userData, messages, fromEmail, toEmail }: LecturerNotificationEmailParams): Promise<void> {
	const htmlContent = generateLecturerNotificationHTML(userData, messages);

	await resend.emails.send({
		from: fromEmail,
		to: toEmail,
		subject: "(Profitize) Free Consultation Booking Received",
		html: htmlContent,
	});
}

export async function sendRescheduleUserEmail({ locale, firstName, lastName, email, oldEventDate, newStart, newEnd, userZoomLink, managementUrl, messages, fromEmail, toEmail }: RescheduleEmailParams): Promise<void> {
	const htmlContent = generateRescheduleHTMLEmail(locale, firstName, lastName, oldEventDate, newStart, newEnd, userZoomLink, managementUrl, messages);

	await resend.emails.send({
		from: fromEmail,
		to: toEmail,
		subject: messages.server.email.rescheduledSubject,
		html: htmlContent,
	});
}

export async function sendRescheduleLecturerEmail(firstName: string, lastName: string, oldEventDate: Date, newEventDate: Date, fromEmail: string, toEmail: string): Promise<void> {
	const htmlContent = generateLecturerRescheduleNotificationHTML(firstName, lastName, oldEventDate, newEventDate);

	await resend.emails.send({
		from: fromEmail,
		to: toEmail,
		subject: "(Profitize) Consultation Session Rescheduled",
		html: htmlContent,
	});
}

export async function sendCancelUserEmail({ locale, firstName, lastName, email, eventDate, messages, fromEmail, toEmail }: CancelEmailParams): Promise<void> {
	const htmlContent = generateCancelHTMLEmail(locale, firstName, lastName, eventDate, messages);

	await resend.emails.send({
		from: fromEmail,
		to: toEmail,
		subject: messages.server.email.cancelledSubject,
		html: htmlContent,
	});
}

export async function sendCancelLecturerEmail(firstName: string, lastName: string, email: string, eventDate: Date, fromEmail: string, toEmail: string): Promise<void> {
	const htmlContent = generateLecturerCancelNotificationHTML(firstName, lastName, email, eventDate);

	await resend.emails.send({
		from: fromEmail,
		to: toEmail,
		subject: "(Profitize) Consultation Session Cancelled by User",
		html: htmlContent,
	});
}

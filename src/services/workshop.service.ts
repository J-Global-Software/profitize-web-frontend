import { loadServerMessages } from "@/messages/server";
import { WorkshopRepository } from "../repositories/workshop.repository";
import { EmailService } from "./email.service";
import { RegisterWorkshopDTO } from "@/src/types/workshop";

export const WorkshopService = {
	async register(payload: RegisterWorkshopDTO, sessionId: string, locale: string = "ja") {
		try {
			// 1. Verify the workshop exists
			const workshop = await WorkshopRepository.findById(payload.workshopId);
			if (!workshop) throw new Error("WORKSHOP_NOT_FOUND");

			// 2. Register the user in the database
			const { registrationId } = await WorkshopRepository.registerUser(payload, sessionId);

			const messages = await loadServerMessages(locale);

			try {
				const traceId = Math.random().toString(36).substring(7);
				console.log(workshop.zoomJoinUrl);
				console.log(`[TRACE ${traceId}] 1. Right before function:`, workshop.zoomJoinUrl);
				await EmailService.sendWorkshopConfirmation({
					toEmail: payload.email,
					firstName: payload.firstName,
					lastName: payload.lastName,
					workshopDate: new Date(workshop.eventDate),
					zoomLink: workshop.zoomJoinUrl,
					language: workshop.language,
					fromEmail: process.env.FROM_EMAIL || "",
					locale: locale,
					messages,
				});
			} catch (emailError) {
				console.error("Failed to send email, but user is registered:", emailError);
				// Decide if you want to throw here or just log it. Usually, we just log it
				// so the user still sees a success screen.
			}

			return { registrationId, success: true };
		} catch (error) {
			throw error; // Let the API route catch and format the error
		}
	},
};

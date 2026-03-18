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

			return { registrationId, success: true };
		} catch (error) {
			throw error; // Let the API route catch and format the error
		}
	},
};

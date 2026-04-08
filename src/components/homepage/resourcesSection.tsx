// Import the repository we created instead of @vercel/postgres

import { WorkshopRepository } from "@/src/repositories/workshop.repository";
import ProfitizeWorkshop from "./workshopSection";

// This makes Next.js re-fetch the data when the page loads, ensuring it's never stale.
export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
	// 1. Fetch data directly from your Neon DB using your clean Repository
	const workshops = await WorkshopRepository.getUpcoming();

	// 2. Format the raw database rows into the clean strings the UI wants
	const formattedSlots = workshops.map((workshop) => {
		// 1. Create the Date object from your database timestamp
		const eventDate = new Date(workshop.eventDate);

		// 2. Add 1.5 hours (90 minutes) to calculate the end time
		const endDate = new Date(eventDate.getTime() + 90 * 60 * 1000);

		// 3. Determine Language Codes
		let langCode = "EN";
		let fullLang = "English";

		if (workshop.language === "jp") {
			langCode = "JP";
			fullLang = "Japanese (日本語)";
		} else if (workshop.language === "bilingual") {
			langCode = "(EN/JP)";
			fullLang = "Bilingual (EN/JP)";
		}

		// 4. Return the exact structure our new UI component expects
		return {
			id: workshop.id,
			lang: langCode,
			full: fullLang,
			title: workshop.title,
			title_jp: workshop.title_jp,
			// .toISOString() passes standard UTC strings to the frontend
			// e.g., "2024-06-30T11:00:00.000Z"
			startTime: eventDate.toISOString(),
			endTime: endDate.toISOString(),
		};
	});

	// 3. Pass the formatted data directly into the Client Component
	return (
		<main>
			<ProfitizeWorkshop workshopSlots={formattedSlots} />
		</main>
	);
}

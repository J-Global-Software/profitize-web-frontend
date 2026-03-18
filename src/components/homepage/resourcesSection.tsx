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
		// Notice we use workshop.eventDate here because we aliased it in the SQL query!
		const eventDate = new Date(workshop.eventDate);

		// We use Intl.DateTimeFormat to ensure the server formats it correctly
		const dateStr = new Intl.DateTimeFormat("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			timeZone: "Asia/Tokyo", // Adjust timezone if needed!
		}).format(eventDate);

		const timeStr =
			new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit",
				timeZone: "Asia/Tokyo",
			}).format(eventDate) + " – 9:30 PM";

		let langCode = "EN";
		let fullLang = "English / Bilingual";

		if (workshop.language === "jp") {
			langCode = "JP";
			fullLang = "Japanese (日本語)";
		} else if (workshop.language === "bilingual") {
			langCode = "BI";
			fullLang = "Bilingual (EN/JP)";
		}

		return {
			id: workshop.id,
			date: dateStr,
			time: timeStr,
			lang: langCode,
			full: fullLang,
		};
	});

	// 3. Pass the formatted data directly into the Client Component
	return (
		<main>
			<ProfitizeWorkshop workshopSlots={formattedSlots} />
		</main>
	);
}

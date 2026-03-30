export interface Workshop {
	id: string;
	title: string;
	title_jp?: string;
	eventDate: string; // or Date
	zoomJoinUrl: string;
	language: "en" | "jp" | "bilingual";
}

export interface RegisterWorkshopDTO {
	workshopId: string;
	sessionId?: string; // Optional if they block cookies
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
}

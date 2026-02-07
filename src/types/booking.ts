export interface TimeSlot {
	displayTime: string;
	displayDate: string;
	jstTime: string;
	jstDate: string;
}

export interface Booking {
	firstName: string;
	lastName: string;
	eventDate: string;
	zoomJoinUrl?: string | null;
	status: string;
	email?: string;
	message?: string;
}

export interface ManageBookingResponse {
	booking: Booking;
	canReschedule: boolean;
	canCancel: boolean;
}

export type BookingStep = 1 | 2;

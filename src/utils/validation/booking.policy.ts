export const BookingPolicy = {
	CANCELLATION_WINDOW_HOURS: 4,

	/**
	 * Centralized check to see if an action is allowed based on time.
	 */
	canModify(eventDate: Date | string): { allowed: boolean; hoursUntil: number; isPast: boolean } {
		const date = typeof eventDate === "string" ? new Date(eventDate) : eventDate;
		const now = new Date();
		const hoursUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
		const isPast = date < now;

		return {
			allowed: !isPast && hoursUntil >= this.CANCELLATION_WINDOW_HOURS,
			hoursUntil,
			isPast,
		};
	},
};

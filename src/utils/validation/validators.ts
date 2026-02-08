import { ValidationError } from "./ErrorValidator";

export const Validators = {
	// --- Existing atomic methods ---
	required(value: unknown, field: string): void {
		if (value === undefined || value === null || value === "") {
			throw new ValidationError(`${field} is required`);
		}
	},
	string(value: unknown, field: string): void {
		if (typeof value !== "string") {
			throw new ValidationError(`${field} must be a string`);
		}
	},
	email(value: unknown, field = "Email"): void {
		if (typeof value !== "string") throw new ValidationError(`${field} must be a string`);
		const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim());
		if (!isValid) throw new ValidationError(`Invalid ${field.toLowerCase()}`);
	},
	minLength(value: unknown, min: number, field: string): void {
		if (typeof value !== "string" || value.length < min) throw new ValidationError(`${field} must be at least ${min} characters`);
	},
	maxLength(value: unknown, max: number, field: string): void {
		if (typeof value !== "string" || value.length > max) throw new ValidationError(`${field} must be at most ${max} characters`);
	},

	// --- NEW: Grouped Schema Validation ---
	validateBooking(data: any): void {
		this.required(data.date, "Date");
		this.required(data.time, "Time");
		this.required(data.firstName, "First Name");
		this.string(data.firstName, "First Name");
		this.required(data.lastName, "Last Name");
		this.string(data.lastName, "Last Name");
		this.required(data.email, "Email");
		this.email(data.email);

		if (data.message) {
			this.string(data.message, "Message");
			this.minLength(data.message, 10, "Message");
			this.maxLength(data.message, 2000, "Message");
		}
	},
	validateContact(data: any): void {
		this.required(data.firstName, "First Name");
		this.maxLength(data.firstName, 50, "First Name");

		this.required(data.lastName, "Last Name");
		this.maxLength(data.lastName, 50, "Last Name");

		this.required(data.email, "Email");
		this.email(data.email);

		this.required(data.message, "Message");
		this.minLength(data.message, 10, "Message");
		this.maxLength(data.message, 5000, "Message");
	},
};

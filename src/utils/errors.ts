/**
 * Maps internal Service Error messages to HTTP Status Codes
 */
const ERROR_CODE_MAP: Record<string, number> = {
	// Common Errors
	BOOKING_NOT_FOUND: 404,
	INVALID_STATUS: 400,

	// Policy Errors
	POLICY_VIOLATION: 400,
	PAST_EVENT: 400,
	TOO_LATE_TO_CANCEL: 400,
	TOO_LATE_TO_RESCHEDULE: 400,
	NEW_TIME_TOO_SOON: 400,

	// Conflict Errors
	TIME_SLOT_OCCUPIED: 409,

	// Auth/Session Errors
	UNAUTHORIZED: 401,
	SESSION_EXPIRED: 401,

	VALIDATION_ERROR: 400,
	MESSAGE_TOO_LONG: 413,
	PAYLOAD_TOO_LARGE: 413,
};

export function getErrorStatus(message: string): number {
	return ERROR_CODE_MAP[message] || 500;
}

// utils/sanitizeEmailHtml.ts
import sanitizeHtml from "sanitize-html";

export function sanitizeEmailMessage(message: string) {
	return sanitizeHtml(message, {
		allowedTags: ["br"],
		allowedAttributes: {},
		disallowedTagsMode: "discard",
	});
}

export function sanitizeSimpleText(text: string) {
	return sanitizeHtml(text, {
		allowedTags: [],
		allowedAttributes: {},
		disallowedTagsMode: "discard",
	});
}

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["ja", "en"],
	localeDetection: false,
	// Used when no locale matches
	defaultLocale: "ja",
	localePrefix: "as-needed",
});

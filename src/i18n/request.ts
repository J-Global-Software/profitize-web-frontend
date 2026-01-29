import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	// Typically corresponds to the `[locale]` segment
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

	// Load all categories needed for the project
	const homepage = (await import(`../../messages/${locale}/homepage.json`)).default;

	// Merge into one messages object
	const messages = { homepage };

	return { locale, messages };
});

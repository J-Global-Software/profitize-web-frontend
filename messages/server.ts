import { routing } from "@/src/i18n/routing";

export async function loadServerMessages(locale: string) {
	const fallback = routing.defaultLocale;

	function isValidLocale(l: string): l is (typeof routing.locales)[number] {
		return (routing.locales as readonly string[]).includes(l);
	}

	const lang = isValidLocale(locale) ? locale : fallback;

	const modules = {
		server: (await import(`./${lang}/server.json`)).default,
	};

	return modules;
}

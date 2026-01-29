// i18n/config.ts
import { routing } from "./routing";

export const I18N = {
	locales: routing.locales,
	defaultLocale: routing.defaultLocale,
	localePrefix: routing.localePrefix,
} as const;

export type AppLocale = (typeof I18N.locales)[number];

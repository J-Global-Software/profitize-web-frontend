// lib/metadata.ts
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppLocale } from "../i18n/config";
import { routing } from "../i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface MetadataConfig {
	namespace: string;
	pathname: string;
	image?: string;
}

/**
 * Normalizes URLs to prevent double slashes like //en/
 */
function getLocalizedUrl(locale: string, pathname: string) {
	const isDefault = locale === routing.defaultLocale;
	const localePrefix = isDefault ? "" : `/${locale}`;

	// URL constructor handles the slashes between SITE_URL and the path
	const url = new URL(SITE_URL);
	// We clean the pathname to ensure it's not double-slashed with the prefix
	const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

	url.pathname = `${localePrefix}${cleanPath}`.replace(/\/+/g, "/");
	return url.toString();
}

export async function constructMetadata(locale: AppLocale, config: MetadataConfig): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: config.namespace });

	const canonical = getLocalizedUrl(locale, config.pathname);

	// Generate Alternates
	const languages = Object.fromEntries(routing.locales.map((loc) => [loc, getLocalizedUrl(loc, config.pathname)]));

	// Image Logic
	const ogImage = config.image || "/og-main.png";
	const absoluteImageUrl = new URL(ogImage, SITE_URL).toString();

	const title = t("seo.title");
	const description = t("seo.description");

	return {
		title,
		description,
		alternates: {
			canonical,
			languages: {
				...languages,
				"x-default": getLocalizedUrl(routing.defaultLocale, config.pathname),
			},
		},
		openGraph: {
			title,
			description,
			url: canonical,
			images: [{ url: absoluteImageUrl, width: 1200, height: 630 }],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [absoluteImageUrl],
		},
	};
}

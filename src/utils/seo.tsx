// lib/metadata.ts
import { getTranslations } from "next-intl/server";
import type { Metadata, ResolvingMetadata } from "next";
import { AppLocale, I18N } from "../i18n/config";

type PageProps = {
	params: Promise<{ locale: AppLocale }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL!;

function getLocalePrefix(locale: AppLocale) {
	return locale === I18N.defaultLocale ? "" : `/${locale}`;
}

export async function generatePageMetadata(props: PageProps, parent: ResolvingMetadata, namespace: string, pathname = ""): Promise<Metadata> {
	const { locale } = await props.params;

	const t = await getTranslations({ locale, namespace });

	// ✅ THIS is where your snippet is used
	const languages = Object.fromEntries(
		I18N.locales.map((loc) => [
			loc, // ja / en
			`${SITE_URL}${getLocalePrefix(loc)}${pathname}`,
		]),
	);

	const canonical = `${SITE_URL}${getLocalePrefix(locale)}${pathname}`;

	return {
		alternates: {
			canonical,
			languages: {
				...languages,
				"x-default": `${SITE_URL}${pathname}`,
			},
		},
		title: t("seo.title"),
		description: t("seo.description"),

		// Open Graph metadata
		openGraph: {
			title: t("seo.title") || t("seo.title"),
			description: t("seo.description") || t("seo.description"),
			type: "website",
			url: t("seo.title"), // optional, can fallback to current page URL
			images: t("seo.image") ? [{ url: t("seo.image") }] : undefined,
			siteName: "Profitize.jp",
		},

		// Twitter card metadata
		twitter: {
			card: "summary_large_image",
			title: t("seo.title") || t("seo.title"),
			description: t("seo.description") || t("seo.description"),
			images: t("seo.image") ? [t("seo.image")] : undefined,
		},

		icons: {
			icon: "/favicon/favicon.ico",
			shortcut: "/favicon/favicon.ico",
			apple: "/favicon/apple-touch-icon.png",
		},
		manifest: "/favicon/site.webmanifest",
		appleWebApp: {
			title: "Profitize.jp",
		},
	};
}

import { MetadataRoute } from "next";

// Locales supported
const locales = ["en", ""];

export default function robots(): MetadataRoute.Robots {
	const disallowManage = locales.flatMap((locale) => [
		`/${locale}/free-consultation/manage/`,
		`/${locale}/free-consultation/manage/*`, // optional, for tokens
	]);

	return {
		rules: [
			{
				userAgent: "*",
				allow: locales.map((locale) => `/${locale}/free-consultation/`), // allow booking page
				disallow: ["/api/", ...disallowManage], // block management & API
			},
		],
		sitemap: "https://www.profitize.jp/sitemap.xml",
	};
}

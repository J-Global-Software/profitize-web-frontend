import { MetadataRoute } from "next";

const BASE_URL = "https://www.profitize.jp";

const staticPages = ["", "free-consultation"];

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const urls: MetadataRoute.Sitemap = [];

	const allPages = [...staticPages];

	// 🇯🇵 Japanese (default)
	for (const page of allPages) {
		const path = page ? `/${page}/` : "/";
		urls.push({
			url: `${BASE_URL}${path}`,
			lastModified: now,
			changeFrequency: page === "" ? "weekly" : "monthly",
			priority: page === "" ? 1 : page.startsWith("programs") ? 0.6 : 0.3,
		});
	}

	// 🇺🇸 English
	for (const page of allPages) {
		const path = page ? `/en/${page}/` : "/en/";
		urls.push({
			url: `${BASE_URL}${path}`,
			lastModified: now,
			changeFrequency: page === "" ? "weekly" : "monthly",
			priority: page === "" ? 0.8 : page.startsWith("programs") ? 0.6 : 0.3,
		});
	}

	return urls;
}

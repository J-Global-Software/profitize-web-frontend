import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import "../globals.css";
import { Roboto, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { Metadata } from "next";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-roboto",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});
//

export const metadata: Metadata = {
	title: {
		template: "%s | Profitize.jp", // %s will be replaced by the page's specific title
		default: "Profitize.jp - Your Business Growth Partner",
	},
	description: "Profitize helps leaders, teams, and global companies align strategy and execution to cut costs, reduce risk, and achieve sustainable growth through bilingual consulting, workshops, and execution support.",
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://profitize.jp"),
	openGraph: { type: "website", siteName: "Profitize.jp" },
	twitter: { card: "summary_large_image" },
	icons: {
		icon: "/favicon/favicon.ico",
		apple: "/favicon/apple-touch-icon.png",
	},
	manifest: "/favicon/site.webmanifest",
	appleWebApp: { title: "Profitize.jp" },
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body className={`${roboto.variable} ${playfair.variable} bg-background-light `}>
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
				<Toaster richColors closeButton />
			</body>
		</html>
	);
}

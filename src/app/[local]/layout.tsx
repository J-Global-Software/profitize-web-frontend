import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Roboto, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-roboto",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
			</head>
			<body className={`${roboto.variable} ${playfair.variable} bg-background-light dark:bg-background-dark`}>
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
				<Toaster richColors closeButton />
			</body>
		</html>
	);
}

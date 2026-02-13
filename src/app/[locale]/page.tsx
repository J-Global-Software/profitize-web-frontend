import Header from "../../components/homepage/headerSection";
import Hero from "../../components/homepage/heroSection";
import WhoWeHelp from "../../components/homepage/whoWeHelpSection";
import Industries from "../../components/homepage/IndustriesSection";
import Methodology from "../../components/homepage/methodologySection";
import Footer from "../../components/homepage/footerSection";
import Resources from "../../components/homepage/resourcesSection";
import ClientLogos from "../../components/homepage/clientLogosSection";
import { AppLocale } from "@/src/i18n/config";
import { constructMetadata } from "@/src/utils/metadata";

type Props = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	return constructMetadata(locale, {
		namespace: "homepage",
		pathname: "/",
	});
}

export default function GlobalConsulting() {
	return (
		<div className="bg-[#f7f7ff] text-[#111318] min-h-screen">
			{/* Header */}
			<Header />

			<main>
				{/* Hero Section */}
				<Hero />
				{/* Who We Help */}
				<WhoWeHelp />
				{/* Methodology */}
				<Methodology />
				{/* Industries */}
				<Industries />
				{/* approach
				<ProfitizeApproachSection /> */}
				{/* Client Logos */}
				<ClientLogos />
				{/* Resources */}
				<Resources />
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}

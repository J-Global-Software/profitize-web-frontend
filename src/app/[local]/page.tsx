import Header from "../../components/homepage/headerSection";
import Hero from "../../components/homepage/heroSection";
import WhoWeHelp from "../../components/homepage/whoWeHelpSection";
import Industries from "../../components/homepage/IndustriesSection";
import Methodology from "../../components/homepage/methodologySection";
import Services from "../../components/homepage/servicesComponent";
import Footer from "../../components/homepage/footerSection";
import Resources from "../../components/homepage/resourcesSection";
import ClientLogos from "../../components/homepage/clientLogosSection";
import { AppLocale } from "@/src/i18n/config";
import { generatePageMetadata } from "@/src/utils/seo";
import type { ResolvingMetadata } from "next";

// app/[locale]/page.tsx
/*
export async function generateMetadata(props: { params: Promise<{ locale: AppLocale }> }, parent: ResolvingMetadata) {
	return generatePageMetadata(props, parent, "seo");
}
*/
export default function GlobalConsulting() {
	return (
		<div className="bg-[#f6f6f8] text-[#111318] min-h-screen">
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

				{/* Services */}
				<Services />
				{/* Pricing 
				<section className="max-w-[1200px] mx-auto px-6 py-24" id="pricing">
					<div className="text-center mb-16">
						<h2 className=" text-4xl md:text-5xl font-black mb-4">Investment Tiers</h2>
						<div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-6 py-2 rounded-full text-sm font-bold">
							<span className="material-symbols-outlined scale-75">verified_user</span> 30% Promo Applied to All Plans
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
						<div className="bg-white p-10 rounded-2xl border border-gray-100 flex flex-col gap-8 shadow-sm">
							<div>
								<h3 className="text-lg font-bold text-gray-400">Essential</h3>
								<div className="flex items-baseline gap-1 mt-4">
									<span className="text-4xl font-black">$2,790</span>
									<span className="text-sm text-gray-400">/mo</span>
								</div>
								<p className="text-xs font-bold text-[#1754cf] mt-2">WAS $3,990</p>
							</div>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Bi-weekly advisory
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Market entry analysis
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Email support
								</li>
							</ul>
							<button className="w-full py-4 rounded-lg font-bold border-2 border-[#1754cf] text-[#1754cf] hover:bg-[#1754cf] hover:text-white transition-all">Select Plan</button>
						</div>
						<div className="bg-gray-900 text-white p-12 rounded-[2rem] flex flex-col gap-8 shadow-2xl relative scale-110 z-10">
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1754cf] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full">RECOMMENDED</div>
							<div>
								<h3 className="text-lg font-bold opacity-60">Premium</h3>
								<div className="flex items-baseline gap-1 mt-4">
									<span className="text-5xl font-black">$5,590</span>
									<span className="text-sm opacity-50">/mo</span>
								</div>
								<p className="text-xs font-bold text-[#1754cf] mt-2">WAS $7,990</p>
							</div>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> Weekly Executive Calls
								</li>
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> 2 Global Hub Audits
								</li>
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> Priority Technical Support
								</li>
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> Dedicated Growth Partner
								</li>
							</ul>
							<button className="w-full py-4 rounded-lg font-bold bg-[#1754cf] hover:bg-blue-600 transition-all">Start Accelerating</button>
						</div>
						<div className="bg-white p-10 rounded-2xl border border-gray-100 flex flex-col gap-8 shadow-sm">
							<div>
								<h3 className="text-lg font-bold text-gray-400">Enterprise</h3>
								<div className="flex items-baseline gap-1 mt-4">
									<span className="text-4xl font-black">Custom</span>
								</div>
								<p className="text-xs font-bold text-[#1754cf] mt-2">30% DISCOUNT AVAILABLE</p>
							</div>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Unlimited Global Support
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> On-site Consultation
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Full M&A Advisory
								</li>
							</ul>
							<button className="w-full py-4 rounded-lg font-bold border-2 border-[#1754cf] text-[#1754cf] hover:bg-[#1754cf] hover:text-white transition-all">Talk to Partners</button>
						</div>
					</div>
				</section>

				*/}

				{/* Client Logos
				<ClientLogos />

				 */}
				{/* Resources */}
				<Resources />
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}

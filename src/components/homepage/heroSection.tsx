"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
	const t = useTranslations("homepage");

	return (
		<section className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
				{/* Text content */}
				<div className="flex flex-col gap-8 order-2 md:order-1">
					<h1 className="text-4xl md:text-6xl font-black text-[#111318]">
						{t("hero.title.line1")} <br />
						{t("hero.title.line2")}
						<br />
						<span className="text-[#1754cf]">{t("hero.title.highlight")}</span>
					</h1>

					<p className="text-md md:text-lg text-gray-600 max-w-[500px] leading-relaxed">{t("hero.description")}</p>

					<div className="flex flex-col sm:flex-row gap-4">
						<Link href="#book-consultation" className="bg-[#1754cf] text-white text-base font-bold px-10 py-3 rounded-xl shadow-xl shadow-[#1754cf]/20 hover:scale-[1.02] transition-transform text-center">
							{t("hero.cta.bookConsultation")}
						</Link>

						<Link href="#offer" className="bg-white border-2 border-[#1754cf]/10 text-[#1754cf] text-base font-bold px-10 py-3 rounded-xl hover:bg-[#f0f4ff] transition-colors text-center">
							{t("hero.cta.viewOffer")}
						</Link>
					</div>
				</div>

				{/* Image */}
				<div className="relative order-1 md:order-2">
					<div
						className="w-full aspect-[3/2] bg-center bg-cover rounded-[2rem] shadow-2xl overflow-hidden"
						style={{
							backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop")',
						}}
					>
						<div className="absolute inset-0 bg-[#1754cf]/10 mix-blend-multiply" />
					</div>
				</div>
			</div>
		</section>
	);
}

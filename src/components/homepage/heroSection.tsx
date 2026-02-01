"use client";

import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Hero() {
	const t = useTranslations("homepage");

	return (
		<motion.section className="max-w-[1200px] mx-auto px-6 py-16 md:py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
				{/* Text content */}
				<motion.div className="flex flex-col gap-6 md:gap-8 order-2 md:order-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}>
					<motion.h1 className="text-4xl md:text-6xl font-black text-[#111318]" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.14, ease: "easeOut" }}>
						{t("hero.title.line1")} <br />
						{t("hero.title.line2")}
						<br />
						<span className="text-[#1754cf]">{t("hero.title.highlight")}</span>
					</motion.h1>

					<motion.p className="text-md md:text-lg text-gray-600 max-w-[500px] leading-relaxed" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}>
						{t("hero.description")}
					</motion.p>

					<motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.26, ease: "easeOut" }}>
						<Link href="/free-consultation" className="bg-[#1754cf] text-white text-base font-bold px-10 py-3 rounded-xl shadow-xl shadow-[#1754cf]/20 hover:scale-[1.02] transition-transform text-center">
							{t("hero.cta.bookConsultation")}
						</Link>

						<Link href="#who-we-help" className="bg-white border-2 border-[#1754cf]/10 text-[#1754cf] text-base font-bold px-10 py-3 rounded-xl hover:bg-[#f0f4ff] transition-colors text-center">
							{t("hero.cta.viewOffer")}
						</Link>
					</motion.div>
				</motion.div>

				{/* Image */}
				<motion.div className="relative order-1 md:order-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0, ease: "easeOut" }}>
					<div
						className="w-full aspect-[3/2] bg-center bg-cover rounded-[2rem] shadow-2xl overflow-hidden"
						style={{
							backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop")',
						}}
					>
						<div className="absolute inset-0 bg-[#1754cf]/10 mix-blend-multiply" />
					</div>
				</motion.div>
			</div>
		</motion.section>
	);
}

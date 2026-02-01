"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ClientLogos() {
	const logos = [
		{ name: "Hilton", src: "/images/logos/hiltonLogo.jpg" },
		{ name: "Disney Resort", src: "/images/logos/Disneyresortlogo.jpg" },
		{ name: "Fujitsu", src: "/images/logos/Fujitsulogo.jpg" },
		{ name: "Hitachi", src: "/images/logos/hitachilogo.jpg" },
		{ name: "IDP", src: "/images/logos/idplogo.jpg" },
		{ name: "JR East Ads", src: "/images/logos/JReastAdslogo.jpg" },
		{ name: "Kyowa Kirin", src: "/images/logos/kkclogo.jpg" },
		{ name: "Kuroneko Yamato", src: "/images/logos/kuronekologo.jpg" },
		{ name: "Lexus", src: "/images/logos/lexuslogo.jpg" },
		{ name: "MyNavi", src: "/images/logos/mynavilogo.jpg" },
		{ name: "Nissan", src: "/images/logos/nissanlogo.jpg" },
		{ name: "Saatchi & Saatchi", src: "/images/logos/saatchilogo.jpg" },
		{ name: "Shane English School", src: "/images/logos/shanelogo.jpg" },
	];

	const t = useTranslations("homepage");

	const loopLogos = [...logos, ...logos];

	return (
		<section className="py-20 border-t bg-white border-gray-100 overflow-hidden">
			<motion.div
				className="max-w-[1200px] mx-auto px-6 text-center"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={{
					hidden: {},
					visible: { transition: { staggerChildren: 0.14 } },
				}}
			>
				<motion.p
					className="font-bold text-xl md:text-3xl text-gray-400 uppercase tracking-widest mb-12"
					variants={{
						hidden: { opacity: 0, y: 16 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
					}}
				>
					{t("clientLogos.title")}
				</motion.p>

				<motion.p
					className="text-lg text-gray-600 max-w-3xl mx-auto mb-16"
					variants={{
						hidden: { opacity: 0, y: 12 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
					}}
				>
					{t("clientLogos.description")}
				</motion.p>
			</motion.div>

			{/* Marquee — kept as CSS, fades in after header settles */}
			<motion.div className="relative w-full overflow-hidden" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}>
				<div className="flex w-max animate-logo-marquee hover:[animation-play-state:paused]">
					{loopLogos.map((logo, index) => (
						<div key={`${logo.name}-${index}`} className="mx-6 md:mx-12 flex items-center justify-center transition">
							<div className="relative w-16 h-10 md:w-32 md:h-20">
								<Image src={logo.src} alt={`${logo.name} logo`} fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</section>
	);
}

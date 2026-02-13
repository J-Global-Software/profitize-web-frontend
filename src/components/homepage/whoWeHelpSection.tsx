"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineUsers, HiOutlineGlobeAlt } from "react-icons/hi2";

export default function WhoWeHelp() {
	const t = useTranslations("homepage");

	const cards = [
		{ Icon: HiOutlineUser, title: t("whoWeHelp.card1Title"), text: t("whoWeHelp.card1Text") },
		{ Icon: HiOutlineUsers, title: t("whoWeHelp.card2Title"), text: t("whoWeHelp.card2Text") },
		{ Icon: HiOutlineGlobeAlt, title: t("whoWeHelp.card3Title"), text: t("whoWeHelp.card3Text") },
	];

	return (
		<section className="bg-white py-24" id="who-we-help">
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
					{/* Image / Visual */}
					<motion.div className="relative group" initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}>
						<div className="absolute -inset-4 bg-[#1754cf]/5 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform" />
						<div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
							<Image src="/images/who-we-help.jpg" alt={`${t("whoWeHelp.imageOverlayTitleLine1")} ${t("whoWeHelp.imageOverlayTitleLine2")}`} fill className="object-cover" priority />
							<div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

							<motion.div className="absolute bottom-10 left-10 text-white" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}>
								<span className="text-xs font-bold uppercase tracking-[0.3em]">{t("whoWeHelp.imageOverlaySmall")}</span>
								<h3 className="text-3xl font-black mt-2 leading-tight">
									{t("whoWeHelp.imageOverlayTitleLine1")}
									<br />
									{t("whoWeHelp.imageOverlayTitleLine2")}
								</h3>
							</motion.div>
						</div>
					</motion.div>

					{/* Content */}
					<motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}>
						<motion.h2 className="text-4xl md:text-5xl font-black mb-8" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
							{t("whoWeHelp.header")}
						</motion.h2>

						<motion.p className="text-lg text-gray-500 mb-8 leading-relaxed" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
							{t("whoWeHelp.description1.before")}&nbsp;
							<span className="text-[#1754cf] font-bold">{t("whoWeHelp.description1.highlight")}</span>
							{t("whoWeHelp.description1.after")}&nbsp;
							<span className="text-[#1754cf] font-bold">{t("whoWeHelp.description1.highlight2")}</span>
							{t("whoWeHelp.description1.after2")}
						</motion.p>

						<motion.p className="text-gray-500 mb-12 leading-relaxed" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}>
							{t("whoWeHelp.description2.before")}&nbsp;
							<span className="font-bold text-gray-800">{t("whoWeHelp.description2.highlight")}</span>
							{t("whoWeHelp.description2.after")}
						</motion.p>

						<motion.div
							className="grid grid-cols-1 sm:grid-cols-3 gap-6"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							variants={{
								hidden: {},
								visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
							}}
						>
							{cards.map((card, idx) => (
								<motion.div
									key={idx}
									className="flex items-start gap-3"
									variants={{
										hidden: { opacity: 0, y: 12 },
										visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
									}}
								>
									{/* Icon Component rendering */}
									<card.Icon className="text-[#1754cf] w-6 h-6 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-medium text-sm">{card.title}</p>
										<p className="text-xs text-gray-500 leading-snug">{card.text}</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

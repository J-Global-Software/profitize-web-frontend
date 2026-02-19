"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineUsers, HiOutlineGlobeAlt } from "react-icons/hi2";
import { IconType } from "react-icons";

interface HelpCard {
	Icon: IconType;
	title: string;
	text: string;
}

export default function WhoWeHelp() {
	const t = useTranslations("homepage");

	const cards: HelpCard[] = [
		{ Icon: HiOutlineUser, title: t("whoWeHelp.card1Title"), text: t("whoWeHelp.card1Text") },
		{ Icon: HiOutlineUsers, title: t("whoWeHelp.card2Title"), text: t("whoWeHelp.card2Text") },
		{ Icon: HiOutlineGlobeAlt, title: t("whoWeHelp.card3Title"), text: t("whoWeHelp.card3Text") },
	];

	return (
		<section className="relative overflow-hidden bg-[#fafbff] py-24 md:py-32" id="who-we-help">
			{/* Soft background glow */}
			<div className="absolute top-1/4 right-0 w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[120px] -z-10" />

			<div className="max-w-[1200px] mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
					{/* Image / Visual with Glass Frame */}
					<motion.div className="relative group" initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}>
						{/* The "Glass Frame" background */}
						<div className="absolute -inset-6 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white shadow-xl -z-10 group-hover:scale-[1.02] transition-transform duration-500" />

						<div className="relative h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
							<Image src="/images/who-we-help.jpg" alt={`${t("whoWeHelp.imageOverlayTitleLine1")} ${t("whoWeHelp.imageOverlayTitleLine2")}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
							<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

							<motion.div className="absolute bottom-12 left-12 text-white" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}>
								<span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-300">{t("whoWeHelp.imageOverlaySmall")}</span>
								<h3 className="text-4xl font-black mt-3 leading-tight tracking-tight">
									{t("whoWeHelp.imageOverlayTitleLine1")}
									<br />
									{t("whoWeHelp.imageOverlayTitleLine2")}
								</h3>
							</motion.div>
						</div>
					</motion.div>

					{/* Content Section */}
					<motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}>
						<motion.h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 tracking-tight leading-[1.1]" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
							{t("whoWeHelp.header")}
						</motion.h2>

						<motion.p className="text-lg text-slate-500 mb-6 leading-relaxed font-medium" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
							{t("whoWeHelp.description1.before")}&nbsp;
							<span className="text-[#1754cf] font-bold">{t("whoWeHelp.description1.highlight")}</span>
							{t("whoWeHelp.description1.after")}&nbsp;
							<span className="text-[#1754cf] font-bold">{t("whoWeHelp.description1.highlight2")}</span>
							{t("whoWeHelp.description1.after2")}
						</motion.p>

						<motion.p className="text-slate-500 mb-12 leading-relaxed" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}>
							{t("whoWeHelp.description2.before")}&nbsp;
							<span className="font-bold text-slate-900">{t("whoWeHelp.description2.highlight")}</span>
							{t("whoWeHelp.description2.after")}
						</motion.p>

						{/* Glassmorphic Icon Cards */}
						<motion.div
							className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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
									className="flex flex-col gap-3 p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-sm hover:shadow-md hover:bg-white transition-all group"
									variants={{
										hidden: { opacity: 0, y: 12 },
										visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
									}}
								>
									<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
										<card.Icon size={20} strokeWidth={2.5} />
									</div>
									<div>
										<p className="font-bold text-slate-900 text-[13px] tracking-tight">{card.title}</p>
										<p className="text-[11px] text-slate-500 leading-snug mt-1">{card.text}</p>
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

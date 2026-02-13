"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { HiOutlineSpeakerphone, HiOutlineAcademicCap, HiOutlineCurrencyDollar, HiOutlineTerminal, HiOutlineBeaker } from "react-icons/hi";
import { MdOutlineDirectionsCar, MdOutlineMovie, MdOutlineHotel, MdOutlinePrecisionManufacturing } from "react-icons/md";

const INDUSTRIES = [
	{ key: "advertising", Icon: HiOutlineSpeakerphone },
	{ key: "automobile", Icon: MdOutlineDirectionsCar },
	{ key: "education", Icon: HiOutlineAcademicCap },
	{ key: "entertainment", Icon: MdOutlineMovie },
	{ key: "finance", Icon: HiOutlineCurrencyDollar },
	{ key: "hospitality", Icon: MdOutlineHotel },
	{ key: "itTechnology", Icon: HiOutlineTerminal },
	{ key: "lifeScience", Icon: HiOutlineBeaker },
	{ key: "manufacturing", Icon: MdOutlinePrecisionManufacturing },
];

export default function Industries() {
	const t = useTranslations("homepage");

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 640);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: isMobile ? 0 : 0.07,
				delayChildren: isMobile ? 0 : 0.15,
			},
		},
	};

	return (
		<section id="industries" className="bg-[#f7f7ff] py-8 sm:py-12">
			<div className="max-w-[1120px] mx-auto px-4 sm:px-6">
				<motion.div className="flex flex-col items-center text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }}>
					<h2 className="text-3xl sm:text-[42px] font-black leading-tight tracking-[-0.03em] mb-4 sm:mb-6 text-[#0e121b]">{t("industries.header.title")}</h2>

					<p className="text-[#5b6871] text-base sm:text-lg leading-relaxed max-w-[800px]">{t("industries.header.description")}</p>
				</motion.div>

				<motion.div className="flex flex-wrap justify-center gap-3 sm:gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={containerVariants}>
					{INDUSTRIES.map(({ key, Icon }) => (
						<motion.div key={key} layout className="group flex items-center gap-2 sm:gap-3 px-5 py-3 sm:px-8 sm:py-5 rounded-full bg-white border border-[#e7ebf3] cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#f0f4ff] hover:border-[#1754cf] hover:shadow-[0_4px_12px_rgba(23,84,207,0.08)]">
							{/* Icon Component replacing the span */}
							<Icon className="text-[#1754cf] text-[20px] sm:text-[24px] transition-transform group-hover:scale-110" />

							<span className="text-sm sm:text-md font-semibold tracking-tight text-[#0e121b] whitespace-nowrap">{t(`industries.list.${key}`)}</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

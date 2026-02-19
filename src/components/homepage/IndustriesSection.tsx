"use client";

import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
// Consolidated imports to Hi2 for visual consistency with your other sections
import { HiOutlineMegaphone, HiOutlineAcademicCap, HiOutlineCurrencyDollar, HiOutlineCommandLine, HiOutlineBeaker, HiOutlineTruck, HiOutlineFilm, HiOutlineBuildingOffice2, HiOutlineCpuChip } from "react-icons/hi2";

interface IndustryItem {
	key: string;
	Icon: IconType;
}

const INDUSTRIES: IndustryItem[] = [
	{ key: "advertising", Icon: HiOutlineMegaphone },
	{ key: "automobile", Icon: HiOutlineTruck },
	{ key: "education", Icon: HiOutlineAcademicCap },
	{ key: "entertainment", Icon: HiOutlineFilm },
	{ key: "finance", Icon: HiOutlineCurrencyDollar },
	{ key: "hospitality", Icon: HiOutlineBuildingOffice2 },
	{ key: "itTechnology", Icon: HiOutlineCommandLine },
	{ key: "lifeScience", Icon: HiOutlineBeaker },
	{ key: "manufacturing", Icon: HiOutlineCpuChip },
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

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: isMobile ? 0.03 : 0.08,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, scale: 0.9, y: 10 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: "spring", stiffness: 260, damping: 20 },
		},
	};

	return (
		<section id="industries" className="relative bg-[#fafbff] py-16  overflow-hidden">
			{/* Subtle glass background glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-50/50 blur-[120px] -z-10" />

			<div className="max-w-[1120px] mx-auto px-6">
				<motion.div className="flex flex-col items-center text-center mb-10 sm:mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
					<h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">{t("industries.header.title")}</h2>
					<p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-[650px]">{t("industries.header.description")}</p>
				</motion.div>

				<motion.div className="flex flex-wrap justify-center gap-2.5 sm:gap-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
					{INDUSTRIES.map(({ key, Icon }) => (
						<motion.div key={key} variants={itemVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="group flex items-center gap-3 px-5 py-3 sm:px-7 sm:py-4 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm hover:shadow-md hover:bg-white hover:border-blue-100 transition-all cursor-default">
							<div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
								<Icon className="text-lg sm:text-xl" />
							</div>
							<span className="text-sm sm:text-base font-bold tracking-tight text-slate-800 whitespace-nowrap">{t(`industries.list.${key}`)}</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

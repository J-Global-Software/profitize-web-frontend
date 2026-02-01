"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const INDUSTRIES = [
	{ key: "advertising", icon: "campaign" },
	{ key: "automobile", icon: "directions_car" },
	{ key: "education", icon: "school" },
	{ key: "entertainment", icon: "movie" },
	{ key: "finance", icon: "payments" },
	{ key: "hospitality", icon: "hotel" },
	{ key: "itTechnology", icon: "terminal" },
	{ key: "lifeScience", icon: "biotech" },
	{ key: "manufacturing", icon: "precision_manufacturing" },
];

export default function Industries() {
	const t = useTranslations("homepage");

	return (
		<section id="industries" className="bg-[#f7f7ff] py-8 sm:py-12">
			<div className="max-w-[1120px] mx-auto px-4 sm:px-6">
				{/* ================= Header ================= */}
				<motion.div className="flex flex-col items-center text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }}>
					<h2
						className="
						text-3xl sm:text-[42px]
						font-black
						leading-tight
						tracking-[-0.03em]
						mb-4 sm:mb-6
						text-[#0e121b]
					"
					>
						{t("industries.header.title")}
					</h2>

					<p
						className="
						text-[#5b6871]
						text-base sm:text-lg
						leading-relaxed
						max-w-[800px]
					"
					>
						{t("industries.header.description")}
					</p>
				</motion.div>

				{/* ================= Pills Grid ================= */}
				<motion.div
					className="flex flex-wrap justify-center gap-3 sm:gap-4"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.25 }}
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
					}}
				>
					{INDUSTRIES.map(({ key, icon }) => (
						<motion.div
							key={key}
							variants={{
								hidden: { opacity: 0, y: 16, scale: 0.92 },
								visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
							}}
							className="
								group
								flex items-center gap-2 sm:gap-3
								px-5 py-3 sm:px-8 sm:py-5
								rounded-full
								bg-white
								border border-[#e7ebf3]
								cursor-pointer
								transition-all duration-300
								hover:-translate-y-[2px]
								hover:bg-[#f0f4ff]
								hover:border-primary
								hover:shadow-[0_4px_12px_rgba(23,84,207,0.08)]
							"
						>
							<span
								className="
								material-symbols-outlined
								text-primary
								text-[20px] sm:text-[24px]
								transition-transform
								group-hover:scale-110
							"
							>
								{icon}
							</span>

							<span
								className="
								text-sm sm:text-md
								font-semibold
								tracking-tight
								text-[#0e121b]
								whitespace-nowrap
							"
							>
								{t(`industries.list.${key}`)}
							</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

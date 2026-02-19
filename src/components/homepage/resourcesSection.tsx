"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { WorkshopBlock } from "./workshopCard";

export default function Resources() {
	const t = useTranslations("homepage");

	const workshops = [{ key: "w1" }, { key: "w2" }, { key: "w3" }, { key: "w4" }];

	return (
		<section className="relative overflow-hidden bg-[#fbfcfe] py-24 md:py-32" id="resources">
			{/* 1. THE CANVAS: Patterns and Ambient Colors */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				{/* Subtle Modern Grid */}
				<div
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `linear-gradient(#1754cf 1.5px, transparent 1.5px), linear-gradient(90deg, #1754cf 1.5px, transparent 1.5px)`,
						backgroundSize: "60px 60px",
					}}
				/>

				{/* Large Soft Glows to give the 'Glass' something to blur */}
				<div className="absolute top-[10%] left-[-10%] w-[50%] h-[60%] bg-blue-100/40 blur-[120px] rounded-full" />
				<div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[50%] bg-indigo-50 blur-[100px] rounded-full" />
			</div>

			<div className="relative z-10 max-w-[1200px] mx-auto px-6">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
					<motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-2xl">
						<h2 className="text-4xl md:text-5xl font-black leading-[1.1] text-slate-900">{t("resources.header")}</h2>
					</motion.div>
				</div>

				{/* Grid of Workshop Cards */}
				<motion.div
					className="grid grid-cols-1 lg:grid-cols-2 gap-6"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.1 } },
					}}
				>
					{workshops.map((workshop) => (
						<motion.div
							key={workshop.key}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
							}}
						>
							<WorkshopBlock t={t} workshop={workshop} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

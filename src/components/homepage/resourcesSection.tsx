"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { WorkshopBlock } from "./workshopCard";

export default function Resources() {
	const t = useTranslations("homepage");

	const workshops = [{ key: "w1" }, { key: "w2" }, { key: "w3" }, { key: "w4" }];

	return (
		<section className="bg-blue-50 py-20" id="resources">
			<div className="max-w-[1200px] mx-auto px-6">
				{/* Header */}
				<motion.h2 className="mt-4 text-4xl md:text-5xl font-black leading-tight text-gray-900 mb-15" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: "easeOut" }}>
					{t("resources.header")}
				</motion.h2>

				{/* Board */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 gap-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.25 }}
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
					}}
				>
					{workshops.map((workshop) => (
						<motion.div
							key={workshop.key}
							variants={{
								hidden: { opacity: 0, y: 18 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
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

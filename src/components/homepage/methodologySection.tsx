"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

// Import React Icons
import { HiOutlineMagnifyingGlass, HiOutlineLightBulb, HiOutlineRocketLaunch, HiOutlineSparkles, HiOutlineChartBar, HiOutlineUsers, HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";

const ICONS = [HiOutlineMagnifyingGlass, HiOutlineLightBulb, HiOutlineRocketLaunch, HiOutlineSparkles, HiOutlineChartBar, HiOutlineUsers, HiOutlineDocumentMagnifyingGlass];

export default function MethodologySection() {
	const t = useTranslations("homepage");
	const [step, setStep] = useState(0);

	const steps = [
		{ title: t("methodology.steps.step01_title"), text: t("methodology.steps.step01_text") },
		{ title: t("methodology.steps.step02_title"), text: t("methodology.steps.step02_text") },
		{ title: t("methodology.steps.step03_title"), text: t("methodology.steps.step03_text") },
		{ title: t("methodology.steps.step04_title"), text: t("methodology.steps.step04_text") },
		{ title: t("methodology.steps.step05_title"), text: t("methodology.steps.step05_text") },
		{ title: t("methodology.steps.step06_title"), text: t("methodology.steps.step06_text") },
		{ title: t("methodology.steps.step07_title"), text: t("methodology.steps.step07_text") },
	];

	const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
	const prevStep = () => setStep((s) => Math.max(s - 1, 0));

	const imageSrc = `/images/${String(step + 1).padStart(2, "0")}.jpg`;

	return (
		<section id="methodology" className="pt-24 pb-10 bg-[#f7f7ff]">
			{/* Header */}
			<motion.div className="max-w-[1100px] mx-auto px-6 text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }}>
				<h2 className="text-4xl md:text-5xl font-black text-[#0e121b]">{t("methodology.header.title")}</h2>
				<p className="mt-3 text-lg max-w-3xl mx-auto text-[#4e6797]">{t("methodology.header.description")}</p>
			</motion.div>

			{/* Card */}
			<motion.div className="max-w-[1200px] mx-auto px-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}>
				<div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
					{/* Sidebar */}
					<aside className="hidden lg:block w-[300px] pt-5 border-r border-[#e5e7eb] bg-[rgba(249,250,251,0.6)]">
						<nav className="p-2 flex flex-col gap-2">
							{steps.map((stepItem, i) => {
								const active = i === step;
								const Icon = ICONS[i];

								return (
									<motion.button
										key={i}
										onClick={() => setStep(i)}
										initial={{ opacity: 0, x: -12 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true, amount: 0.3 }}
										transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
										animate={active ? { backgroundColor: "#1754cf", color: "#ffffff" } : { backgroundColor: "transparent", color: "#6b7280" }}
										className={`
                                            group flex items-center gap-3 px-4 py-2 rounded-xl text-md
                                            transition-transform duration-300
                                            ${active ? "font-bold shadow-lg shadow-[#1754cf]/25" : "hover:bg-white hover:translate-x-1 hover:shadow-sm"}
                                        `}
									>
										<Icon className="text-lg flex-shrink-0" />
										<span className="text-left">
											{String(i + 1).padStart(2, "0")}. {stepItem.title}
										</span>
									</motion.button>
								);
							})}
						</nav>
					</aside>

					{/* Content */}
					<div className="flex-1 relative bg-white p-8 overflow-hidden">
						{/* Mobile carousel controls */}
						<div className="flex lg:hidden items-center justify-between mb-6">
							<button onClick={prevStep} disabled={step === 0} className="px-4 py-2 rounded-full text-sm font-bold bg-[#f1f5f9] text-[#0e121b] disabled:opacity-40">
								← Back
							</button>
							<span className="text-xs font-bold text-[#6b7280]">
								Step {step + 1} / {steps.length}
							</span>
							<button onClick={nextStep} disabled={step === steps.length - 1} className="px-4 py-2 rounded-full text-sm font-bold bg-[#1754cf] text-white disabled:opacity-40">
								Next →
							</button>
						</div>

						<AnimatePresence mode="wait">
							<motion.div key={step} className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: "easeOut" }}>
								<div className="max-w-xl">
									<div className="inline-flex items-center gap-2 bg-[#1754cf]/10 text-[#1754cf] px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-4">
										{t("methodology.steps.labels.step")} {step + 1}
									</div>
									<h3 className="text-4xl font-bold text-[#0e121b] mb-4">{steps[step].title}</h3>
									<p className="text-lg font-medium text-[#4e6797]">{steps[step].text}</p>
								</div>

								<div className="relative w-full h-[130px] lg:h-[200px] overflow-hidden">
									<Image src={imageSrc} alt={steps[step].title} fill sizes="(max-width: 1024px) 100vw, 50vw" priority className="object-contain" />
								</div>
							</motion.div>
						</AnimatePresence>

						{/* Footer Indicators */}
						<div className="mt-10 pt-6 border-t border-[#e5e7eb] flex items-center justify-between relative z-10">
							<div className="flex gap-1">
								{steps.map((_, i) => (
									<motion.div
										key={i}
										className="h-1 rounded-full bg-[#e5e7eb]"
										animate={{
											backgroundColor: i === step ? "#1754cf" : "#e5e7eb",
											width: i === step ? "1.25rem" : "1rem",
										}}
										transition={{ duration: 0.3, ease: "easeOut" }}
									/>
								))}
							</div>
							<span className="text-[10px] font-bold text-[#9ca3af]">
								{step + 1} / {steps.length}
							</span>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}

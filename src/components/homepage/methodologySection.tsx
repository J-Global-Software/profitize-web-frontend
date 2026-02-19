"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { IconType } from "react-icons";

// Import React Icons
import { HiOutlineMagnifyingGlass, HiOutlineLightBulb, HiOutlineRocketLaunch, HiOutlineSparkles, HiOutlineChartBar, HiOutlineUsers, HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";

const ICONS: IconType[] = [HiOutlineMagnifyingGlass, HiOutlineLightBulb, HiOutlineRocketLaunch, HiOutlineSparkles, HiOutlineChartBar, HiOutlineUsers, HiOutlineDocumentMagnifyingGlass];

interface Step {
	title: string;
	text: string;
}

export default function MethodologySection() {
	const t = useTranslations("homepage");
	const [step, setStep] = useState(0);

	const steps: Step[] = [
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
		<section id="methodology" className="relative py-10 bg-[#fafbff] overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 blur-[120px] -z-10" />
			<div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50/50 blur-[100px] -z-10" />

			{/* Header - Reduced mb-16 to mb-8 */}
			<motion.div className="max-w-[1100px] mx-auto px-6 text-center mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }}>
				<h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{t("methodology.header.title")}</h2>
				<p className="mt-2 text-lg max-w-2xl mx-auto text-slate-500 font-medium">{t("methodology.header.description")}</p>
			</motion.div>

			{/* Main Interactive Stage - Reduced min-h-[550px] to min-h-[450px] */}
			<motion.div className="max-w-[1240px] mx-auto px-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}>
				<div className="relative bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[450px]">
					{/* Sidebar: Glass Acrylic */}
					<aside className="hidden lg:block w-[300px] pt-6 border-r border-white/60 bg-white/20">
						<div className="px-6 mb-4">
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow Index</p>
						</div>
						<nav className="px-3 flex flex-col gap-1">
							{steps.map((stepItem, i) => {
								const active = i === step;
								const Icon = ICONS[i];

								return (
									<button
										key={i}
										onClick={() => setStep(i)}
										className={`
                                            group flex items-center gap-4 px-5 py-2.5 rounded-2xl text-sm transition-all duration-300
                                            ${active ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-2" : "text-slate-500 hover:bg-white/60 hover:text-slate-900"}
                                        `}
									>
										<Icon className={`text-lg transition-transform ${active ? "scale-110" : "group-hover:rotate-12"}`} />
										<span className="text-left font-bold tracking-tight">
											{i + 1}.{" " + stepItem.title}
										</span>
									</button>
								);
							})}
						</nav>
					</aside>

					{/* Content Area - Reduced p-16 to p-12 */}
					<div className="flex-1 relative p-8 lg:p-12 flex flex-col justify-between">
						{/* Mobile controls */}
						<div className="flex lg:hidden items-center justify-between mb-6">
							<button onClick={prevStep} disabled={step === 0} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 disabled:opacity-30">
								←
							</button>
							<div className="text-center">
								<p className="text-[10px] font-black text-slate-400 uppercase">Step</p>
								<p className="text-sm font-bold text-slate-900">
									{step + 1} / {steps.length}
								</p>
							</div>
							<button onClick={nextStep} disabled={step === steps.length - 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white disabled:opacity-30">
								→
							</button>
						</div>

						<AnimatePresence mode="wait">
							<motion.div key={step} className="flex-grow flex flex-col lg:flex-row gap-8 items-center lg:items-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
								<div className="flex-1 text-center lg:text-left">
									<h3 className="text-2xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight">{steps[step].title}</h3>
									<p className="text-base lg:text-lg text-slate-500 leading-relaxed font-medium max-w-xl">{steps[step].text}</p>
								</div>

								<div className="relative w-1/2 lg:w-1/4 aspect-square rounded-3xl overflow-hidden shadow-inner">
									<Image src={imageSrc} alt={steps[step].title} fill className="object-cover" priority />
								</div>
							</motion.div>
						</AnimatePresence>

						{/* Footer Navigation - Reduced mt-12 pt-8 to mt-6 pt-4 */}
						<div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
							<div className="flex gap-1.5">
								{steps.map((_, i) => (
									<div key={i} onClick={() => setStep(i)} className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${i === step ? "w-8 bg-slate-900" : "w-3 bg-slate-200 hover:bg-slate-300"}`} />
								))}
							</div>
							<div className="flex gap-3">
								<button onClick={prevStep} disabled={step === 0} className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors">
									Previous
								</button>
								<button onClick={nextStep} disabled={step === steps.length - 1} className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 disabled:opacity-20 transition-colors">
									Next Step →
								</button>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}

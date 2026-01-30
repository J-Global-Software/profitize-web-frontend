"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ICONS = ["search_check", "insights", "rocket_launch", "auto_fix_high", "trending_up", "diversity_3", "assessment"];

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

	const imageSrc = `/images/${String(step + 1).padStart(2, "0")}.jpg`;

	return (
		<section id="methodology" className="pt-24 pb-10 bg-[#f6f6f8]">
			{/* Header */}
			<div className="max-w-[1100px] mx-auto px-6 text-center mb-12">
				<h2 className="text-4xl md:text-5xl font-black text-[#0e121b]">{t("methodology.header.title")}</h2>

				<p className="mt-3 text-lg max-w-3xl mx-auto text-[#4e6797]">{t("methodology.header.description")}</p>
			</div>

			{/* Card */}
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
					{/* Sidebar */}
					<aside className="w-full lg:w-[300px] lg:pt-5 border-b lg:border-b-0 lg:border-r border-[#e5e7eb] bg-[rgba(249,250,251,0.6)]">
						<nav className="p-2 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
							{steps.map((stepItem, i) => {
								const active = i === step;

								return (
									<button
										key={i}
										onClick={() => setStep(i)}
										className={`
            group
            flex items-center gap-3
            px-4 py-2
            rounded-xl
            text-sm lg:text-md
            whitespace-nowrap
            min-w-max
            transition-all duration-300
            ${active ? "bg-[#1754cf] text-white font-bold shadow-lg shadow-[#1754cf]/25" : "text-[#6b7280] hover:bg-white lg:hover:translate-x-1 hover:shadow-sm"}
          `}
									>
										<span className="material-symbols-outlined text-lg shrink-0">{ICONS[i]}</span>

										<span className="leading-tight">
											{String(i + 1).padStart(2, "0")}. {stepItem.title}
										</span>
									</button>
								);
							})}
						</nav>
					</aside>

					{/* Content */}
					<div className="flex-1 relative bg-white p-8 overflow-hidden">
						{/* Big number */}

						{/* Animated content */}
						<div key={step} className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-[fadeSlide_0.4s_ease-out]">
							{/* Text */}
							<div className="max-w-xl">
								<div className="inline-flex items-center gap-2 bg-[#1754cf]/10 text-[#1754cf] px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-4">
									{t("methodology.steps.labels.step")} {step + 1}
								</div>

								<h3 className="text-4xl xl:text-4xl font-bold text-[#0e121b] mb-4">{steps[step].title}</h3>

								<p className="text-lg font-medium text-[#4e6797]">{steps[step].text}</p>
							</div>

							{/* Image */}
							<div className="relative group w-full h-[130px] lg:h-[200px] overflow-hidden">
								<Image
									key={imageSrc}
									src={imageSrc}
									alt={steps[step].title}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									priority
									className="
										object-contain
										transition-all duration-700 ease-out
										scale-[1.02]
										
									"
								/>
							</div>
						</div>

						{/* Footer */}
						<div className="mt-10 pt-6 border-t border-[#e5e7eb] flex items-center justify-between relative z-10">
							<div className="flex gap-1">
								{steps.map((_, i) => (
									<div key={i} className={`w-4 h-1 rounded-full transition-all ${i === step ? "bg-[#1754cf] scale-x-110" : "bg-[#e5e7eb]"}`} />
								))}
							</div>

							<span className="text-[10px] font-bold text-[#9ca3af]">
								{step + 1} / {steps.length}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Animation */}
			<style jsx>{`
				@keyframes fadeSlide {
					from {
						opacity: 0;
						transform: translateY(8px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</section>
	);
}

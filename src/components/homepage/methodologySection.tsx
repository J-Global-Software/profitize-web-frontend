"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MethodologySection() {
	const t = useTranslations("homepage");
	const [step, setStep] = useState(1);

	const steps = [
		{ title: t("methodology.steps.step01_title"), text: t("methodology.steps.step01_text") },
		{ title: t("methodology.steps.step02_title"), text: t("methodology.steps.step02_text") },
		{ title: t("methodology.steps.step03_title"), text: t("methodology.steps.step03_text") },
		{ title: t("methodology.steps.step04_title"), text: t("methodology.steps.step04_text") },
		{ title: t("methodology.steps.step05_title"), text: t("methodology.steps.step05_text") },
		{ title: t("methodology.steps.step06_title"), text: t("methodology.steps.step06_text") },
		{ title: t("methodology.steps.step07_title"), text: t("methodology.steps.step07_text") },
	];

	const current = steps[step - 1];
	const imageSrc = `/images/${String(step).padStart(2, "0")}.jpg`;

	return (
		<section id="methodology" className="bg-white py-16 md:py-24">
			<div className="max-w-[1000px] mx-auto px-6 text-center">
				<h2 className="serif-header text-4xl md:text-5xl font-black text-prestige-navy leading-tight">{t("methodology.header.title")}</h2>
				<div className="h-1 w-20 bg-primary mt-2 mb-4 mx-auto" />
				<p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("methodology.header.description")}</p>
			</div>

			{/* Navigation */}
			<div className="max-w-3xl mx-auto mt-12">
				<div className="grid grid-cols-7 border-b border-gray-100 mb-8 relative">
					<div className="absolute bottom-0 h-1 bg-primary transition-all duration-500 ease-out" style={{ width: `${100 / steps.length}%`, left: `${((step - 1) * 100) / steps.length}%` }} />
					{steps.map((s, i) => {
						const index = i + 1;
						const active = step === index;
						const completed = step > index;

						return (
							<button
								key={i}
								onClick={() => setStep(index)}
								className={`
		group relative flex flex-col items-center
		py-4 px-2
		rounded-lg
		border transition-all duration-300 ease-out

		${active ? "border-primary bg-primary/5 scale-[1.03]" : "border-transparent opacity-50 hover:opacity-80 hover:border-gray-200"}
	`}
							>
								<span
									className={`text-xs font-bold mb-1 tracking-wide transition-colors
		${active ? "text-primary" : "text-gray-500"}`}
								>
									{t("methodology.steps.labels.step")}
								</span>

								<span
									className={`serif-header text-xl md:text-2xl font-black transition-colors
		${active ? "text-primary" : completed ? "text-prestige-navy" : "text-gray-400"}`}
								>
									{String(index).padStart(2, "0")}
								</span>

								<span
									className={`mt-2 text-[11px] md:text-xs text-center leading-tight max-w-[90px] transition-colors
		${active ? "text-primary font-semibold" : "text-gray-500"}`}
								>
									{s.title}
								</span>
							</button>
						);
					})}
				</div>

				{/* Step Content */}
				<Step title={current.title} text={current.text} image={imageSrc} />

				{/* Arrows */}
				<div className="flex justify-between items-center mt-8">
					<button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${step === 1 ? "opacity-0 pointer-events-none" : "bg-gray-100 hover:bg-gray-200 text-prestige-navy"}`}>
						{t("methodology.steps.labels.previous")}
					</button>
					<div className="text-sm text-gray-500">{t("methodology.steps.labels.progress", { current: step, total: steps.length })}</div>
					<button onClick={() => setStep(Math.min(steps.length, step + 1))} disabled={step === steps.length} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${step === steps.length ? "opacity-0 pointer-events-none" : "bg-primary hover:bg-primary/90 text-white"}`}>
						{t("methodology.steps.labels.next")}
					</button>
				</div>
			</div>
		</section>
	);
}

function Step({ title, text, image }: { title: string; text: string; image: string }) {
	return (
		<div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm min-h-[320px] animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex-1">
				<h3 className="serif-header text-3xl font-bold text-prestige-navy mb-4">{title}</h3>
				<p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{text}</p>
			</div>
			<div className="hidden md:block w-40 h-40 bg-gray-50 rounded-xl overflow-hidden opacity-80 flex-shrink-0 transition-transform duration-300 hover:scale-105">
				<Image src={image} alt={title} width={160} height={160} className="w-full h-full object-cover mix-blend-multiply" />
			</div>
		</div>
	);
}

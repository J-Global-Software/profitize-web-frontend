"use client";

import { useState } from "react";
import Image from "next/image";

/* ---------------------------------- */
/* Data */
/* ---------------------------------- */

const STEPS = [{ title: "Strategic Goals" }, { title: "Stakeholder Input" }, { title: "Strategy Integration" }, { title: "Individual Goals" }, { title: "Planning & Tracking" }, { title: "Coordination" }, { title: "Evaluation" }];

const STEP_CONTENT = [
	{
		title: "Strategic Goal Setting",
		text: "We define clear, high-level objectives that align with long-term profitability and global market positioning. This phase establishes the North Star for the entire transformation project.",
	},
	{
		title: "Stakeholder Input",
		text: "Capturing critical feedback from all organizational layers. We conduct high-prestige workshops and deep-dive interviews to ensure cross-functional buy-in and organizational alignment.",
	},
	{
		title: "Bottom-Up Strategy Integration",
		text: "Empowering operational teams to identify efficiencies and innovative cost-cutting opportunities. This step bridges the gap between executive vision and ground-floor reality.",
	},
	{
		title: "Individual Goal Development",
		text: "Translating macro strategies into measurable, personalized KPIs. We ensure every team member understands their unique contribution to the larger mission.",
	},
	{
		title: "Project Planning & Tracking",
		text: "Rigorous roadmap execution with real-time data visualization. Our proprietary tracking systems provide absolute transparency on progress and risk mitigation.",
	},
	{
		title: "Cross-Functional Coordination",
		text: "Breaking down silos through centralized communication frameworks. We synchronize efforts across departments to eliminate redundant processes and waste.",
	},
	{
		title: "Performance Evaluation",
		text: "Comprehensive review cycles to refine strategies and optimize future performance. We quantify the final ROI and establish sustainable governance models for the future.",
	},
];

/* ---------------------------------- */
/* Main Component */
/* ---------------------------------- */

export default function MethodologySection() {
	const [step, setStep] = useState(1);

	const imageSrc = `/images/${String(step).padStart(2, "0")}.jpg`;
	const content = STEP_CONTENT[step - 1];

	return (
		<section id="methodology" className="bg-white py-16 md:py-24">
			<div className="max-w-[1000px] mx-auto px-6">
				{/* Header */}
				<div className="text-center">
					<h2 className="serif-header text-4xl md:text-5xl font-black text-prestige-navy leading-tight">Seven-Step Methodology</h2>
					<div className="h-1 w-20 bg-primary mt-2 mb-2 mx-auto" />
				</div>

				<div className="max-w-3xl mb-12 mx-auto text-center text-lg text-gray-600 leading-relaxed">
					<p>Success happens when leadership vision and day-to-day execution move in lockstep. Our collaborative, seven-step process blends stakeholder insight with bottom-up strategy—aligning teams, clarifying accountability, and focusing your entire organization on measurable, positive outcomes.</p>
				</div>

				{/* Step Navigation */}
				<div className="relative overflow-hidden">
					<div className="grid grid-cols-7 border-b border-gray-100 mb-8 relative">
						{/* Active indicator */}
						<div
							className="absolute bottom-0 h-1 bg-primary transition-all duration-500 ease-out"
							style={{
								width: `${100 / STEPS.length}%`,
								left: `${((step - 1) * 100) / STEPS.length}%`,
							}}
						/>

						{STEPS.map((item, i) => {
							const index = i + 1;
							const active = step === index;
							const completed = step > index;

							return (
								<button
									key={index}
									onClick={() => setStep(index)}
									className={`group flex flex-col items-center py-4 px-1 transition-all duration-300
										${active ? "opacity-100 scale-105" : "opacity-40 hover:opacity-70"}
									`}
								>
									<span
										className={`text-xs font-bold mb-1 tracking-wide
											${active ? "text-primary" : "text-gray-500"}
										`}
									>
										STEP
									</span>

									<span
										className={`serif-header text-xl md:text-2xl font-black
											${active ? "text-primary" : completed ? "text-prestige-navy" : "text-gray-400"}
										`}
									>
										{String(index).padStart(2, "0")}
									</span>

									<span
										className={`mt-2 text-[11px] md:text-xs text-center leading-tight max-w-[90px]
											${active ? "text-primary font-semibold" : "text-gray-500"}
										`}
									>
										{item.title}
									</span>
								</button>
							);
						})}
					</div>

					{/* Content */}
					<div className="content-container">
						<Step title={content.title} text={content.text} image={imageSrc} />
					</div>

					{/* Navigation Arrows */}
					<div className="flex justify-between items-center mt-8">
						<button
							onClick={() => setStep(Math.max(1, step - 1))}
							disabled={step === 1}
							className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300
								${step === 1 ? "opacity-0 pointer-events-none" : "bg-gray-100 hover:bg-gray-200 text-prestige-navy"}
							`}
						>
							← Previous
						</button>

						<div className="text-sm text-gray-500">
							Step {step} of {STEPS.length}
						</div>

						<button
							onClick={() => setStep(Math.min(STEPS.length, step + 1))}
							disabled={step === STEPS.length}
							className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300
								${step === STEPS.length ? "opacity-0 pointer-events-none" : "bg-primary hover:bg-primary/90 text-white"}
							`}
						>
							Next →
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

/* ---------------------------------- */
/* Step Component */
/* ---------------------------------- */

function Step({ title, text, image }: { title: string; text: string; image: string }) {
	return (
		<div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm min-h-[320px] animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex-1">
				<h3 className="serif-header text-3xl font-bold text-prestige-navy mb-4">{title}</h3>
				<p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{text}</p>
			</div>

			<div className="hidden md:block w-40 h-40 bg-gray-100 rounded-xl overflow-hidden opacity-80 flex-shrink-0 transition-transform duration-300 hover:scale-105">
				<Image src={image} alt={title} width={160} height={160} className="w-full h-full object-cover mix-blend-multiply" />
			</div>
		</div>
	);
}

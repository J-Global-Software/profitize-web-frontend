import React from "react";
import { HiOutlineSparkles, HiOutlineGlobeAlt } from "react-icons/hi2";

/**
 * FeatureCard Sub-component
 * Uses a component type for the Icon prop for type safety and performance.
 */
interface FeatureCardProps {
	Icon: React.ElementType;
	title: string;
	description: string;
}

function FeatureCard({ Icon, title, description }: FeatureCardProps) {
	return (
		<div className="group">
			<div className="flex items-center gap-4 mb-3">
				<div className="w-10 h-10 rounded-xl bg-[#1754cf]/5 flex items-center justify-center">
					<Icon className="text-[#1754cf] text-2xl transition-transform group-hover:scale-110" />
				</div>
				<h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-[0.2em]">{title}</h3>
			</div>
			<p className="text-gray-500 dark:text-gray-400 text-sm leading-snug max-w-sm">{description}</p>
		</div>
	);
}

export default function ProfitizeCompanySection() {
	return (
		<div className="min-h-screen bg-[#fcfcfd] text-[#111318]">
			<main>
				<section className="py-10 lg:py-16">
					<div className="max-w-[1000px] mx-auto px-6">
						<div className="white-paper-border bg-white p-8 md:p-12 lg:p-16 rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
							{/* Background Grid Lines */}
							<div className="absolute inset-0 pointer-events-none opacity-[0.03]">
								<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
									<line stroke="currentColor" strokeWidth="0.1" x1="0" x2="100" y1="50" y2="50" />
									<line stroke="currentColor" strokeWidth="0.1" x1="50" x2="50" y1="0" y2="100" />
								</svg>
							</div>

							{/* Header */}
							<div className="relative z-10 mb-8 text-center">
								<span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#1754cf] mb-3 block">Strategic Roadmap</span>
								<h1 className="serif-header text-3xl md:text-5xl lg:text-6xl font-black text-[#111318] leading-tight mb-4">Profitize your organization</h1>
								<div className="w-16 h-1 bg-[#1754cf]/20 mx-auto rounded-full" />
							</div>

							{/* Feature cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 text-left mb-10 relative z-10">
								<FeatureCard Icon={HiOutlineSparkles} title="Free Coaching" description="High-level assessments to unlock hidden capital efficiency in your current operational structures." />
								<FeatureCard Icon={HiOutlineGlobeAlt} title="Bilingual Workshops" description="Global strategy deployment seminars delivered in English and Japanese for international teams." />
							</div>

							{/* Buttons */}
							<div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
								<button className="w-full sm:w-auto bg-[#1754cf] text-white text-[10px] font-bold px-10 py-4 rounded-full hover:bg-blue-700 transition-all uppercase tracking-widest shadow-md">Book Coaching</button>
								<button className="w-full sm:w-auto bg-transparent border-2 border-gray-100 text-[#111318] text-[10px] font-bold px-10 py-4 rounded-full hover:bg-gray-50 transition-all uppercase tracking-widest">Join Workshop</button>
							</div>

							{/* Footnote */}
							<div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-30">
								<span className="text-[9px] font-bold tracking-widest uppercase">Since 2013</span>
								<span className="text-[9px] font-bold tracking-widest uppercase">Global Presence</span>
								<span className="text-[9px] font-bold tracking-widest uppercase">ISO 9001 Certified</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

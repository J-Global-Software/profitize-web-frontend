"use client";

import { motion } from "framer-motion";

type Workshop = {
	key: string;
};

type TranslationFn = (key: string) => string;

interface WorkshopBlockProps {
	t: TranslationFn;
	workshop: Workshop;
}

export function WorkshopBlock({ t, workshop }: WorkshopBlockProps) {
	const base = `resources.workshops.${workshop.key}`;

	return (
		<motion.a
			href={t(`${base}.link`)}
			target="_blank"
			rel="noopener noreferrer"
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ y: -4 }}
			className="group relative flex items-center gap-6 p-5 rounded-2xl 
                bg-white border border-slate-200
                hover:border-indigo-500 hover:shadow-[0_20px_40px_rgba(79,70,229,0.08)]
                transition-all duration-300 mb-4 overflow-hidden"
		>
			{/* 1. STRUCTURAL ACCENT (Replaces vague mesh) */}
			<div className="absolute top-0 left-0 bottom-0 w-1 bg-slate-100 group-hover:bg-indigo-600 transition-colors duration-300" />

			{/* 2. DATE CARD (High Contrast) */}
			<div
				className="relative flex flex-col items-center justify-center w-16 h-16 shrink-0 rounded-xl
                bg-slate-50 border border-slate-200 
                group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300"
			>
				<span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 group-hover:text-indigo-600 leading-none">{t(`${base}.month`)}</span>
				<span className="text-2xl font-black text-slate-900 leading-none mt-1">{t(`${base}.date`)}</span>
			</div>

			{/* 3. CONTENT (Increased readability) */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1.5">
					<h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors duration-300">{t(`${base}.title`)}</h3>
				</div>

				<div className="flex items-center gap-2">
					<p className="text-xs font-bold uppercase tracking-widest text-slate-400 py-1 px-2 bg-slate-100 rounded group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{t(`${base}.detail`)}</p>
				</div>
			</div>

			{/* 4. CTA (Sharp & Intentional) */}
			<div className="shrink-0">
				<div
					className="flex items-center justify-center w-11 h-11 rounded-full
                    bg-slate-50 border border-slate-200 text-slate-400
                    group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 
                    transition-all duration-300 shadow-sm"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
						<path d="M5 12h14m-7-7 7 7-7 7" />
					</svg>
				</div>
			</div>
		</motion.a>
	);
}

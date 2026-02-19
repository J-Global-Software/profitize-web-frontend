"use client";

import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Hero() {
	const t = useTranslations("homepage");

	return (
		<section className="relative overflow-hidden bg-[#f8faff]">
			{/* Background Pattern & Gradients */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				{/* 1. Subtle Geometric Grid */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `linear-gradient(#1754cf 1px, transparent 1px), linear-gradient(90deg, #1754cf 1px, transparent 1px)`,
						backgroundSize: "40px 40px",
					}}
				/>

				{/* 2. Ambient Color Blobs */}
				<div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#1754cf]/10 blur-[120px] rounded-full" />
				<div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-blue-400/10 blur-[100px] rounded-full" />

				{/* 3. Smooth Fade Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f8faff]" />
			</div>

			<motion.section className="relative z-10 max-w-[1200px] mx-auto px-6 py-16 md:py-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
					{/* Text content */}
					<motion.div className="flex flex-col gap-6 md:gap-8 order-2 md:order-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
						<motion.h1 className="text-4xl md:text-6xl font-black text-[#111318] tracking-tight leading-[1.1]">
							{t("hero.title.line1")} <br />
							{t("hero.title.line2")}
							<br />
							<span className="text-[#1754cf] relative inline-block">
								{t("hero.title.highlight")}
								{/* Subtlest underline for the highlight */}
							</span>
						</motion.h1>

						<motion.p className="text-md md:text-lg text-slate-600 max-w-[500px] leading-relaxed">{t("hero.description")}</motion.p>

						<motion.div className="flex flex-col sm:flex-row gap-4">
							<Link href="/free-consultation" className="bg-[#1754cf] text-white text-base font-bold px-10 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all text-center">
								{t("hero.cta.bookConsultation")}
							</Link>

							<Link href="#who-we-help" className="bg-white/60 backdrop-blur-md border border-slate-200 text-slate-700 text-base font-bold px-10 py-3.5 rounded-xl hover:bg-white transition-all text-center">
								{t("hero.cta.viewOffer")}
							</Link>
						</motion.div>
					</motion.div>

					{/* Image with enhanced styling */}
					<motion.div className="relative order-1 md:order-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
						{/* Soft glow behind the image */}
						<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

						<div
							className="relative w-full aspect-[4/3] bg-center bg-cover rounded-[2rem] shadow-2xl overflow-hidden border border-white/50"
							style={{
								backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop")',
							}}
						>
							{/* Blue overlay tint */}
							<div className="absolute inset-0 bg-[#1754cf]/5 mix-blend-multiply" />
						</div>
					</motion.div>
				</div>
			</motion.section>
		</section>
	);
}

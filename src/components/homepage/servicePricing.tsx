"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { HiOutlineUserGroup, HiOutlineDocumentMagnifyingGlass, HiOutlineChartBar, HiOutlineLightBulb, HiOutlineCalendar, HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

// Define interfaces for type safety
interface ServiceItem {
	title: string;
	price: string;
	text: string;
	Icon: IconType;
}

interface PremiumServiceItem extends ServiceItem {
	highlight: string;
}

export default function PricingSection() {
	const t = useTranslations("homepage.pricing");

	// Retrieve raw arrays from JSON and cast them to the correct structure
	const standardData = t.raw("standardServices") as Omit<ServiceItem, "Icon">[];
	const premiumData = t.raw("premiumServices") as Omit<PremiumServiceItem, "Icon">[];

	// Map Icons to the translated data
	const standardIcons = [HiOutlineUserGroup, HiOutlineDocumentMagnifyingGlass, HiOutlineChartBar, HiOutlineLightBulb];

	const premiumIcons = [HiOutlineCalendar, HiOutlineClipboardDocumentCheck];

	const standardServices: ServiceItem[] = standardData.map((item, idx) => ({
		...item,
		Icon: standardIcons[idx],
	}));

	const premiumServices: PremiumServiceItem[] = premiumData.map((item, idx) => ({
		...item,
		Icon: premiumIcons[idx],
	}));

	return (
		<section id="pricing" className="relative overflow-hidden bg-[#fafbff] py-24 md:py-32">
			<div className="absolute top-1/4 left-0 w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[120px] -z-10" />

			<div className="max-w-[1200px] mx-auto px-6">
				<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
					<div className="max-w-3xl mx-auto mb-16 text-center">
						<h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
							{t("title")}&nbsp;
							<span className="text-blue-600">{t("titleAccent")}</span>
						</h2>
						<p className="text-lg text-slate-500 mt-4 font-medium">{t("subtitle")}</p>
					</div>
				</motion.div>

				{/* Standard Services Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					{standardServices.map((service, idx) => (
						<motion.div key={idx} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col gap-4 p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-sm hover:shadow-md hover:bg-white transition-all group">
							<div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1754cf] group-hover:scale-110 transition-transform">
								<service.Icon size={24} />
							</div>
							<div>
								<h3 className="font-bold text-slate-900 text-[15px] tracking-tight">{service.title}</h3>
								<p className="text-[#1754cf] font-bold text-sm mt-1">{service.price}</p>
								<p className="text-[12px] text-slate-500 leading-relaxed mt-3">{service.text}</p>
							</div>
						</motion.div>
					))}
				</div>

				{/* Premium Solutions Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
					{premiumServices.map((service, idx) => (
						<motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1 }} className="group relative">
							<div className="absolute -inset-px bg-gradient-to-r from-[#1754cf]/20 to-indigo-100 rounded-[1.5rem] blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />

							<a href="#contact" className="relative h-full bg-white/80 backdrop-blur-xl border border-white rounded-[1.5rem] p-7 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col justify-between">
								<div>
									<div className="flex justify-between items-start mb-5">
										<div className="w-12 h-12 rounded-xl bg-[#1754cf] text-white flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-500">
											<service.Icon size={24} />
										</div>
										<span className="px-3 py-1 rounded-full bg-blue-50 text-[#1754cf] text-[9px] font-black uppercase tracking-widest border border-blue-100">{service.highlight}</span>
									</div>

									<h3 className="text-xl font-black text-slate-900 tracking-tight">{service.title}</h3>

									<div className="mt-2 flex items-baseline gap-1.5">
										<span className="text-2xl font-black text-slate-900 tracking-tighter">{service.price}</span>
										<span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">JPY</span>
									</div>

									<p className="mt-4 text-slate-500 text-sm leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-300">{service.text}</p>
								</div>

								<div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
									<span className="text-slate-900 font-bold text-xs uppercase tracking-tight">{t("cta")}</span>
									<div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all duration-300">
										<svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
										</svg>
									</div>
								</div>
							</a>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

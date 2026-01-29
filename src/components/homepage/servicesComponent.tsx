"use client";

import { useTranslations } from "next-intl";

type Service = {
	icon: string;
	title: string;
	description: string;
	label: string;
};

export default function Services() {
	const t = useTranslations("homepage");

	// Array of services using translation keys
	const services: Service[] = [
		{
			icon: "payments",
			title: t("services.cards.salesGrowth.title"),
			description: t("services.cards.salesGrowth.description"),
			label: t("services.cards.salesGrowth.label"),
		},
		{
			icon: "engineering",
			title: t("services.cards.engineering.title"),
			description: t("services.cards.engineering.description"),
			label: t("services.cards.engineering.label"),
		},
		{
			icon: "biotech",
			title: t("services.cards.rdAdvisory.title"),
			description: t("services.cards.rdAdvisory.description"),
			label: t("services.cards.rdAdvisory.label"),
		},
	];

	return (
		<section className="py-24" id="services">
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
					<div>
						<h2 className="text-4xl md:text-5xl font-black mb-4">{t("services.header.title")}</h2>
						<p className="text-gray-500 max-w-[600px]">{t("services.header.description")}</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{services.map((service, i) => (
						<div key={i} className="group p-10 bg-white rounded-3xl border-b-4 border-transparent hover:border-[#1754cf] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-[#1754cf]/5 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />

							<div className="relative">
								<div className="w-16 h-16 bg-[#f0f4ff] text-[#1754cf] rounded-2xl flex items-center justify-center mb-8">
									<span className="material-symbols-outlined text-3xl">{service.icon}</span>
								</div>

								<h3 className="text-2xl font-black mb-4">{service.title}</h3>

								<p className="text-sm text-gray-500 leading-relaxed mb-6">{service.description}</p>

								<a href="#" className="text-[#1754cf] font-bold text-sm inline-flex items-center gap-2 group/link">
									{t("services.cta.learnMore")}
									<span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
								</a>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

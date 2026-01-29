"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Resources() {
	const t = useTranslations("homepage");

	return (
		<section className="bg-[#f0f4ff]/30 py-24" id="resources">
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					<div className="lg:col-span-2">
						<h4 className="text-3xl font-black mb-8">{t("resources.header")}</h4>

						<div className="space-y-4">
							{/* Workshop 1 */}
							<div className="bg-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-lg transition-all border border-transparent hover:border-[#1754cf]/20">
								<div className="flex items-center gap-6 text-center md:text-left">
									<div className="bg-[#f0f4ff] text-[#1754cf] px-4 py-2 rounded-lg text-center">
										<span className="block text-xl font-black leading-none">{t("resources.workshops.w1.date")}</span>
										<span className="text-[10px] uppercase font-bold">{t("resources.workshops.w1.month")}</span>
									</div>

									<div>
										<h5 className="font-black text-lg">{t("resources.workshops.w1.title")}</h5>
										<p className="text-xs text-gray-400">{t("resources.workshops.w1.detail")}</p>
									</div>
								</div>

								<a target="_blank" rel="noopener noreferrer" href={t("resources.workshops.w1.link")} className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-bold group-hover:bg-[#1754cf] transition-colors">
									{t("resources.workshops.w1.cta")}
								</a>
							</div>

							{/* Workshop 2 */}
							<div className="bg-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-lg transition-all border border-transparent hover:border-[#1754cf]/20">
								<div className="flex items-center gap-6 text-center md:text-left">
									<div className="bg-[#f0f4ff] text-[#1754cf] px-4 py-2 rounded-lg text-center">
										<span className="block text-xl font-black leading-none">{t("resources.workshops.w2.date")}</span>
										<span className="text-[10px] uppercase font-bold">{t("resources.workshops.w2.month")}</span>
									</div>

									<div>
										<h5 className="font-black text-lg">{t("resources.workshops.w2.title")}</h5>
										<p className="text-xs text-gray-400">{t("resources.workshops.w2.detail")}</p>
									</div>
								</div>

								<a target="_blank" rel="noopener noreferrer" href={t("resources.workshops.w2.link")} className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-bold group-hover:bg-[#1754cf] transition-colors">
									{t("resources.workshops.w2.cta")}
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

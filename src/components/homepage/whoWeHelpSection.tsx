"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function WhoWeHelp() {
	const t = useTranslations("homepage");

	return (
		<section className="bg-white py-24" id="who-we-help">
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
					{/* Image / Visual */}
					<div className="relative group">
						<div className="absolute -inset-4 bg-[#1754cf]/5 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform" />
						<div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
							<Image src="/images/who-we-help.jpg" alt={`${t("whoWeHelp.imageOverlayTitleLine1")} ${t("whoWeHelp.imageOverlayTitleLine2")}`} fill className="object-cover" priority />
							<div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
							<div className="absolute bottom-10 left-10 text-white">
								<span className="text-xs font-bold uppercase tracking-[0.3em]">{t("whoWeHelp.imageOverlaySmall")}</span>
								<h3 className="text-3xl font-black mt-2 leading-tight">
									{t("whoWeHelp.imageOverlayTitleLine1")}
									<br />
									{t("whoWeHelp.imageOverlayTitleLine2")}
								</h3>
							</div>
						</div>
					</div>

					{/* Content */}
					<div>
						<h2 className="text-4xl md:text-5xl font-black mb-8">{t("whoWeHelp.header")}</h2>

						<p className="text-lg text-gray-500 mb-8 leading-relaxed">
							{t("whoWeHelp.description1.before")}&nbsp;
							<span className="text-[#1754cf] font-bold">{t("whoWeHelp.description1.highlight")}</span>
							{t("whoWeHelp.description1.after")}&nbsp;
							<span className="text-[#1754cf] font-bold">{t("whoWeHelp.description1.highlight2")}</span>
							{t("whoWeHelp.description1.after2")}
						</p>

						<p className="text-gray-500 mb-12 leading-relaxed">
							{t("whoWeHelp.description2.before")}&nbsp;
							<span className="font-bold text-gray-800">{t("whoWeHelp.description2.highlight")}</span>
							{t("whoWeHelp.description2.after")}
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
							{/* Card 1 */}
							<div className="flex items-start gap-3">
								<span className="material-symbols-outlined text-[#1754cf] mt-0.5">person</span>
								<div>
									<p className="font-medium text-sm">{t("whoWeHelp.card1Title")}</p>
									<p className="text-xs text-gray-500 leading-snug">{t("whoWeHelp.card1Text")}</p>
								</div>
							</div>

							{/* Card 2 */}
							<div className="flex items-start gap-3">
								<span className="material-symbols-outlined text-[#1754cf] mt-0.5">groups</span>
								<div>
									<p className="font-medium text-sm">{t("whoWeHelp.card2Title")}</p>
									<p className="text-xs text-gray-500 leading-snug">{t("whoWeHelp.card2Text")}</p>
								</div>
							</div>

							{/* Card 3 */}
							<div className="flex items-start gap-3">
								<span className="material-symbols-outlined text-[#1754cf] mt-0.5">public</span>
								<div>
									<p className="font-medium text-sm">{t("whoWeHelp.card3Title")}</p>
									<p className="text-xs text-gray-500 leading-snug">{t("whoWeHelp.card3Text")}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

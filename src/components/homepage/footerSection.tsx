"use client";

import { useTranslations } from "next-intl";
import { ContactForm } from "./contacts-section/contactForm";

export default function Footer() {
	const t = useTranslations("homepage");

	return (
		<footer className="bg-white border-t border-gray-100 pt-24 pb-12">
			<div className="max-w-[1200px] mx-auto px-6">
				{/* ================= TOP ================= */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
					{/* Left */}
					{/* Left */}
					<div className="max-w-xl">
						<h2 className="text-4xl font-black mb-6">{t("footer.heading")}</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex flex-col gap-4 mt-10">
								{/* Email */}
								<a href={`mailto:jon.lynch@profitize.jp`} className="group flex items-center gap-4">
									<div
										className="size-12 bg-gray-100 rounded-full flex items-center justify-center
				group-hover:bg-[#1754cf] group-hover:text-white transition-colors"
									>
										<span className="material-symbols-outlined text-[22px]">mail</span>
									</div>

									<div>
										<p className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t("footer.email")}</p>
										<p className="font-semibold text-gray-900 group-hover:text-[#1754cf] transition-colors">jon.lynch@profitize.jp</p>
									</div>
								</a>

								{/* Phone */}
								<a href={`tel:03-3281-4303`} className="group flex items-center gap-4">
									<div
										className="size-12 bg-gray-100 rounded-full flex items-center justify-center
				group-hover:bg-[#1754cf] group-hover:text-white transition-colors"
									>
										<span className="material-symbols-outlined text-[22px]">call</span>
									</div>

									<div>
										<p className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t("footer.phoneNumber")}</p>
										<p className="font-semibold text-gray-900 group-hover:text-[#1754cf] transition-colors">03-3281-4303</p>
									</div>
								</a>
							</div>
						</div>
					</div>

					{/* Right – Form */}

					<ContactForm />
				</div>

				{/* ================= BOTTOM ================= */}
				<div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
					<div className="flex items-center gap-2">
						<p className="text-xs font-medium text-gray-400">{t("footer.bottomText")}</p>
					</div>

					<div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
						<a href="#" className="hover:text-[#1754cf] transition-colors">
							{t("footer.privacy")}
						</a>
						<a href="#" className="hover:text-[#1754cf] transition-colors">
							{t("footer.terms")}
						</a>
						<a href="#" className="hover:text-[#1754cf] transition-colors">
							{t("footer.ethics")}
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

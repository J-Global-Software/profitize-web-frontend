"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
	const t = useTranslations("homepage");

	return (
		<footer className="bg-white border-t border-gray-100 pt-24 pb-12">
			<div className="max-w-[1200px] mx-auto px-6">
				{/* ================= TOP ================= */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
					{/* Left */}
					<div>
						<h2 className="text-4xl font-black mb-8">{t("footer.heading")}</h2>

						<div className="mt-5">
							{t("footer.contactPrefix")}: <span className="text-blue-600 bold">{t("footer.email")}</span>
						</div>
					</div>

					{/* Right – Form (commented out, static version if needed) */}
					{/*
          <div className="bg-gray-50 p-10 rounded-3xl">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">{t("footer.form.fullName")}</label>
                <input type="text" placeholder={t("footer.form.fullNamePlaceholder")} className="bg-white border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1754cf]" />
              </div>
              ...
            </form>
          </div>
          */}
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

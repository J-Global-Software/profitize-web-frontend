"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { submitContactMessage } from "./submitContactMessage";
// Importing react-icons for a consistent look
import { HiArrowRight } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function ContactForm() {
	const t = useTranslations("homepage.contact");
	const locale = useLocale();
	const [mountTime] = useState(Date.now()); // Bot detection
	const [loading, setLoading] = useState(false);

	// Form State
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		message: "",
		company: "", // Honeypot field
	});

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		// Anti-bot: Humans usually take > 3 seconds to fill a form
		if ((Date.now() - mountTime) / 1000 < 3) {
			toast.success(t("toast.success")); // Silent fail for bots
			return;
		}

		try {
			setLoading(true);
			await submitContactMessage(form);
			toast.success(t("toast.success"));
			setForm({ firstName: "", lastName: "", email: "", message: "", company: "" });
		} catch (err: any) {
			toast.error(err.message || t("toast.error"));
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10 bg-[#f7f7ff] rounded-3xl shadow-sm">
			{/* Honeypot - Hidden from users, bots will fill it */}
			<input type="text" name="company_name_hp" className="hidden" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />

			{/* Name Fields: Order changes based on Locale */}
			<div className="flex flex-col md:flex-row gap-6 md:col-span-2">
				{(locale === "ja" ? ["lastName", "firstName"] : ["firstName", "lastName"]).map((key) => (
					<div key={key} className="flex-1 flex flex-col gap-2">
						<label className="text-xs font-bold opacity-60 uppercase tracking-wider">{t(key)}</label>
						<input required type="text" placeholder={t(`placeholder.${key}`)} className="bg-white border border-transparent rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1754cf] transition-all" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
					</div>
				))}
			</div>

			{/* Email Field */}
			<div className="md:col-span-2 flex flex-col gap-2">
				<label className="text-xs font-bold opacity-60 uppercase tracking-wider flex items-center gap-2">{t("email")}</label>
				<input required type="email" placeholder={t("placeholder.email")} className="bg-white border border-transparent rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1754cf] transition-all" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
			</div>

			{/* Message Field */}
			<div className="md:col-span-2 flex flex-col gap-2">
				<label className="text-xs font-bold opacity-60 uppercase tracking-wider flex items-center gap-2">{t("message")}</label>
				<textarea required rows={4} placeholder={t("placeholder.message")} className="bg-white border border-transparent rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1754cf] transition-all resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
			</div>

			{/* Submit Button */}
			<button disabled={loading} className="md:col-span-2 bg-[#1754cf] hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200">
				{loading ? (
					<AiOutlineLoading3Quarters className="animate-spin" size={20} />
				) : (
					<>
						{t("submit")}
						<HiArrowRight size={18} />
					</>
				)}
			</button>
		</form>
	);
}

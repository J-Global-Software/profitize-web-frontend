"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { submitContactMessage } from "./submitContactMessage";
import { HiArrowRight } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Define the shape of your form state
interface ContactFormState {
	firstName: string;
	lastName: string;
	email: string;
	message: string;
	company: string;
}

export function ContactForm() {
	const t = useTranslations("homepage.contact");
	const locale = useLocale();
	const [mountTime] = useState(Date.now());
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState<ContactFormState>({
		firstName: "",
		lastName: "",
		email: "",
		message: "",
		company: "",
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if ((Date.now() - mountTime) / 1000 < 3) {
			toast.success(t("toast.success"));
			return;
		}

		try {
			setLoading(true);
			await submitContactMessage(form);
			toast.success(t("toast.success"));
			setForm({ firstName: "", lastName: "", email: "", message: "", company: "" });
		} catch (err) {
			// In TS, caught errors are 'unknown'. We check if it's an instance of Error.
			const errorMessage = err instanceof Error ? err.message : t("toast.error");
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	}

	// Helper for typed iteration
	const nameFields = (locale === "ja" ? ["lastName", "firstName"] : ["firstName", "lastName"]) as Array<keyof ContactFormState>;

	return (
		<form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10 bg-[#f7f7ff] rounded-3xl shadow-sm">
			{/* Honeypot */}
			<input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" value={form.company} onChange={handleChange} />

			{/* Name Fields */}
			<div className="flex flex-col md:flex-row gap-6 md:col-span-2">
				{nameFields.map((key) => (
					<div key={key} className="flex-1 flex flex-col gap-2">
						<label className="text-xs font-bold opacity-60 uppercase tracking-wider">{t(key)}</label>
						<input
							required
							type="text"
							name={key} // Added name attribute for the handler
							placeholder={t(`placeholder.${key}`)}
							className="bg-white border border-transparent rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1754cf] transition-all"
							value={form[key]}
							onChange={handleChange}
						/>
					</div>
				))}
			</div>

			{/* Email Field */}
			<div className="md:col-span-2 flex flex-col gap-2">
				<label className="text-xs font-bold opacity-60 uppercase tracking-wider flex items-center gap-2">{t("email")}</label>
				<input required type="email" name="email" placeholder={t("placeholder.email")} className="bg-white border border-transparent rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1754cf] transition-all" value={form.email} onChange={handleChange} />
			</div>

			{/* Message Field */}
			<div className="md:col-span-2 flex flex-col gap-2">
				<label className="text-xs font-bold opacity-60 uppercase tracking-wider flex items-center gap-2">{t("message")}</label>
				<textarea required name="message" rows={4} placeholder={t("placeholder.message")} className="bg-white border border-transparent rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1754cf] transition-all resize-none" value={form.message} onChange={handleChange} />
			</div>

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

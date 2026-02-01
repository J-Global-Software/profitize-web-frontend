"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { submitContactMessage } from "./submitContactMessage";

type ApiError = {
	message?: string;
	error?: string;
	details?: string;
};

export function ContactForm() {
	const t = useTranslations("homepage.contact");
	const locale = useLocale();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			setLoading(true);

			await submitContactMessage({
				firstName,
				lastName,
				email,
				message,
				company: "", // honeypot
			});

			toast.success(t("toast.success"));

			setFirstName("");
			setLastName("");
			setEmail("");
			setMessage("");
		} catch (err: unknown) {
			let errorMessage = t("toast.error");

			if (typeof err === "object" && err !== null) {
				const apiError = err as ApiError;
				errorMessage = apiError.error ?? apiError.message ?? errorMessage;

				if (apiError.details) {
					errorMessage += ` ${apiError.details}`;
				}
			}

			toast.error("Error: " + errorMessage);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="bg-gray-50 p-5 md:p-10 rounded-3xl">
			<form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="flex flex-col md:flex-row gap-4">
					{[
						...(locale === "ja"
							? [
									{ label: t("lastName"), value: lastName, setValue: setLastName, placeholder: t("placeholder.lastName") },
									{ label: t("firstName"), value: firstName, setValue: setFirstName, placeholder: t("placeholder.firstName") },
								]
							: [
									{ label: t("firstName"), value: firstName, setValue: setFirstName, placeholder: t("placeholder.firstName") },
									{ label: t("lastName"), value: lastName, setValue: setLastName, placeholder: t("placeholder.lastName") },
								]),
					].map((field) => (
						<div key={field.label} className="flex-1 flex flex-col gap-2">
							<label className="text-xs font-bold uppercase tracking-widest opacity-60">{field.label}</label>
							<input type="text" placeholder={field.placeholder} value={field.value} onChange={(e) => field.setValue(e.target.value)} required className="bg-white border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1754cf]" />
						</div>
					))}
				</div>

				<div className="flex flex-col gap-2 md:col-span-2">
					<label className="text-xs font-bold uppercase tracking-widest opacity-60">{t("email")}</label>
					<input type="email" placeholder={t("placeholder.email")} value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1754cf]" />
				</div>

				<div className="flex flex-col gap-2 md:col-span-2">
					<label className="text-xs font-bold uppercase tracking-widest opacity-60">{t("message")}</label>
					<textarea placeholder={t("placeholder.message")} value={message} onChange={(e) => setMessage(e.target.value)} required minLength={10} className="bg-white border-none rounded-xl py-3 px-4 h-32 focus:ring-2 focus:ring-[#1754cf]" />
				</div>

				<button type="submit" disabled={loading} className="md:col-span-2 bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1754cf]/20 hover:bg-blue-600 transition-all disabled:opacity-60">
					{loading ? t("submitting") : t("submit")}
				</button>
			</form>
		</div>
	);
}

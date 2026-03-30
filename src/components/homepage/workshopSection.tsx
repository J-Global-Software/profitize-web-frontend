"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations, useFormatter } from "next-intl";
import { FiX, FiCheckCircle, FiArrowRight, FiTarget, FiMap, FiTrendingUp, FiUsers, FiDollarSign, FiClock, FiCalendar } from "react-icons/fi";

export interface WorkshopSlot {
	id: string;
	lang: string; // e.g., "EN" or "JP"
	full: string;
	title: string;
	title_jp?: string;
	// Pass standard ISO 8601 strings from your database
	startTime: string; // e.g., "2024-06-30T20:00:00Z"
	endTime: string; // e.g., "2024-06-30T21:30:00Z"
}

const featureItems = [
	{ id: "goalClarity", icon: <FiTarget size={16} /> },
	{ id: "processMapping", icon: <FiMap size={16} /> },
	{ id: "growthTracking", icon: <FiTrendingUp size={16} /> },
	{ id: "teamBuyIn", icon: <FiUsers size={16} /> },
	{ id: "cashflowMastery", icon: <FiDollarSign size={16} /> },
];

export default function ProfitizeWorkshop({ workshopSlots }: { workshopSlots: WorkshopSlot[] }) {
	const t = useTranslations("homepage.Workshop");
	const locale = useLocale();
	const format = useFormatter();

	// Modal & UI State
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSlotId, setSelectedSlotId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});

	const openModal = (id: string) => {
		setSelectedSlotId(id);
		setIsModalOpen(true);
		setIsSuccess(false);
		setErrorMessage("");
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrorMessage("");

		try {
			const response = await fetch("/api/workshops/register", {
				method: "POST",
				headers: { "Content-Type": "application/json", "x-locale": locale },
				body: JSON.stringify({ workshopId: selectedSlotId, ...formData }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || t("errors.default"));

			setIsSuccess(true);
			setFormData({ firstName: "", lastName: "", email: "" });
			setSelectedSlotId("");

			setTimeout(() => {
				setIsModalOpen(false);
				setTimeout(() => setIsSuccess(false), 300);
			}, 2500);
		} catch (error: any) {
			setErrorMessage(error.message || t("errors.default"));
		} finally {
			setIsSubmitting(false);
		}
	};

	// Helper functions to format dates dynamically via next-intl
	const formatLocalizedDate = (dateString: string) => {
		return format.dateTime(new Date(dateString), {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const formatLocalizedTimeRange = (startStr: string, endStr: string) => {
		const start = format.dateTime(new Date(startStr), { hour: "numeric", minute: "2-digit" });
		const end = format.dateTime(new Date(endStr), { hour: "numeric", minute: "2-digit" });
		return `${start} – ${end}`;
	};

	return (
		<>
			<section className="bg-slate-50 py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden" id="workshop">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

				<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-6xl mx-auto rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row relative z-10 bg-white">
					{/* LEFT PANE */}
					<div className="lg:w-[45%] bg-slate-900 p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col justify-center">
						<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

						<div className="relative z-10">
							<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
								<span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
								{t("badge")}
							</div>

							<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.15] tracking-tight">{t("title")}</h2>

							<p className="text-slate-300 text-base leading-relaxed mb-10 max-w-md">{t("description")}</p>

							<div className="flex flex-wrap gap-3">
								{featureItems.map((f, i) => (
									<motion.div key={f.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.05 }} className="flex items-center gap-2.5 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2.5 hover:bg-slate-700/60 transition-colors">
										<div className="text-blue-400">{f.icon}</div>
										<span className="text-sm font-medium text-slate-200">{t(`features.${f.id}.title`)}</span>
									</motion.div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT PANE */}
					<div className="lg:w-[55%] p-8 md:p-12 lg:p-16 bg-white flex flex-col">
						<div className="flex items-center justify-between mb-8">
							<h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
								<FiCalendar className="text-blue-600" />
								{t("bookingTitle")}
							</h3>
							<span className="text-sm font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{workshopSlots.length} Available</span>
						</div>

						<div className="flex flex-col gap-4 flex-grow">
							{workshopSlots.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
									<FiClock size={32} className="mb-3 opacity-50" />
									<span className="text-sm font-medium">{t("noSlots")}</span>
								</div>
							) : (
								workshopSlots.map((slot, i) => (
									<motion.div key={slot.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }} className="group relative p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
										<div className="flex flex-col gap-1.5">
											<div className="flex items-center gap-2">
												<span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${slot.lang === "JP" ? "bg-slate-200 text-slate-700" : "bg-blue-100 text-blue-700"}`}>{slot.lang}</span>
												<span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
													{formatLocalizedDate(slot.startTime)} · {formatLocalizedTimeRange(slot.startTime, slot.endTime)}
												</span>
											</div>
											<h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{locale === "en" ? slot.title : slot.title_jp}</h4>
										</div>

										<button onClick={() => openModal(slot.id)} className="w-full sm:w-auto shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white h-10 px-5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md">
											{t("bookButton")}
											<FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
										</button>
									</motion.div>
								))
							)}
						</div>
					</div>
				</motion.div>
			</section>

			{/* Modal */}
			<AnimatePresence>
				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSubmitting && !isSuccess && setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

						<motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-white/20">
							{isSuccess ? (
								<div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
									<motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}>
										<div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
											<FiCheckCircle className="w-10 h-10 text-green-500" />
										</div>
									</motion.div>
									<h3 className="text-2xl font-black text-slate-900 mb-2">{t("modalSuccessTitle")}</h3>
									<p className="text-slate-500 text-base">{t("modalSuccessBody")}</p>
								</div>
							) : (
								<div className="p-8 sm:p-10">
									<button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all duration-200 disabled:opacity-50">
										<FiX className="w-5 h-5" />
									</button>

									<div className="mb-8">
										<h3 className="text-2xl font-black text-slate-900 mb-2">{t("modalFormTitle")}</h3>
										<p className="text-slate-500 text-sm">{t("modalFormBody")}</p>
									</div>

									{errorMessage && (
										<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
											{errorMessage}
										</motion.div>
									)}

									<form onSubmit={handleSubmit} className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-1.5">
												<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("form.firstName")}</label>
												<input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-medium" />
											</div>
											<div className="space-y-1.5">
												<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("form.lastName")}</label>
												<input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-medium" />
											</div>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("form.email")}</label>
											<input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-medium" />
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("form.select")}</label>
											<select required value={selectedSlotId} onChange={(e) => setSelectedSlotId(e.target.value)} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-medium appearance-none cursor-pointer">
												<option value="" disabled>
													{t("form.select")}
												</option>
												{workshopSlots.map((s) => (
													<option key={s.id} value={s.id}>
														{formatLocalizedDate(s.startTime)} · {formatLocalizedTimeRange(s.startTime, s.endTime)} ({s.full})
													</option>
												))}
											</select>
										</div>

										<button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] transition-all duration-300 mt-4 text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-slate-900 disabled:hover:shadow-none">
											{isSubmitting ? t("form.submitting") : t("form.submit")}
											{!isSubmitting && <FiArrowRight size={16} />}
										</button>
									</form>
								</div>
							)}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}

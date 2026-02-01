"use client";

import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { format, type Locale } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";

type Step = 1 | 2;

export default function FreeConsultationClient() {
	const locale = useLocale();
	const t = useTranslations("consultation");
	const dateFnsLocale: Locale = locale === "ja" ? ja : enUS;

	const [step, setStep] = useState<Step>(1);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [showAllSlots, setShowAllSlots] = useState(false);
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [loadingBooking, setLoadingBooking] = useState(false);

	// Controlled form values
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	// Safer "Today" check - sets to midnight local time
	const today = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

	const daysInMonth = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();
		return { firstDay, totalDays };
	}, [currentMonth]);

	function getMonthLabel(currentMonth: Date) {
		if (locale === "ja") {
			// Year first, numeric month
			return format(currentMonth, "yyyy年 MM月", { locale: dateFnsLocale });
			// or with Japanese characters:
			// return format(currentMonth, "yyyy年 MM月", { locale: locales[locale] });
		} else {
			// English: full month name + year
			return format(currentMonth, "MMMM yyyy", { locale: dateFnsLocale });
		}
	}
	const isCurrentMonth = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

	/* ---------------- Available slots logic ---------------- */
	useEffect(() => {
		if (!selectedDate) return;

		const fetchSlots = async () => {
			setLoadingSlots(true);
			setAvailableSlots([]);
			setSelectedTime(null);

			try {
				const res = await fetch("/api/free-consultation/available-slots/", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					// SAFE: format uses the date as shown on the calendar
					body: JSON.stringify({ date: format(selectedDate, "yyyy-MM-dd") }),
				});
				const data = await res.json();
				setAvailableSlots(data.availableSlots || []);
			} catch (err) {
				console.error("Failed to fetch slots", err);
				setAvailableSlots([]);
			} finally {
				setLoadingSlots(false);
			}
		};

		fetchSlots();
	}, [selectedDate]);

	/* ---------------- Slot preview logic ---------------- */
	const previewCount = 6;
	const previewSlots = selectedTime ? [...availableSlots.slice(0, previewCount).filter((slot) => slot !== selectedTime), selectedTime] : availableSlots.slice(0, previewCount);
	const extraSlots = availableSlots.filter((slot) => !previewSlots.includes(slot));

	/* ---------------- Booking logic ---------------- */
	const handleConfirmBooking = async () => {
		if (!selectedDate || !selectedTime) {
			toast.error(t("booking.errorDateTime"));
			return;
		}

		if (!firstName || !lastName || !email) {
			toast.error(t("booking.errorFields"));
			return;
		}

		setLoadingBooking(true);

		try {
			const res = await fetch("/api/free-consultation/book", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-locale": locale,
				},
				body: JSON.stringify({
					// FIXED: Using format instead of toISOString() to avoid UTC shifts
					date: format(selectedDate, "yyyy-MM-dd"),
					time: selectedTime,
					firstName,
					lastName,
					email,
					message,
				}),
			});

			const data = await res.json();

			if (!res.ok || data.error) {
				throw new Error(data.error || "Booking failed");
			}

			toast.success(t("booking.success"));

			// Reset form
			setStep(1);
			setSelectedDate(null);
			setSelectedTime(null);
			setFirstName("");
			setLastName("");
			setEmail("");
			setMessage("");
		} catch (err: unknown) {
			if (err instanceof Error) toast.error(err.message);
			else toast.error(t("errors.requestFailed"));
		} finally {
			setLoadingBooking(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center px-6 py-12">
			<div className="max-w-[1100px] w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
				{/* Header */}
				<div className="px-5 md:px-10 py-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
					<h1 className="text-2xl md:text-3xl font-black">{t("booking.title")}</h1>
					<div className="flex gap-6">
						<StepIndicator count={1} active={step === 1} label={t("booking.step1")} onClick={() => setStep(1)} />
						<StepIndicator
							count={2}
							active={step === 2}
							label={t("booking.step2")}
							onClick={() => {
								if (selectedTime) setStep(2);
							}}
						/>
					</div>
				</div>

				{/* STEP 1: Calendar & Time Selection */}
				{step === 1 && (
					<div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
						<div className="md:col-span-6 p-5 md:p-10 border-r border-gray-100">
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-2xl font-bold capitalize">{getMonthLabel(currentMonth)}</h2>
								<div className="flex gap-2">
									<button disabled={isCurrentMonth} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className={`p-2 rounded-lg transition ${isCurrentMonth ? "opacity-20 cursor-not-allowed" : "hover:bg-gray-100"}`}>
										←
									</button>
									<button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-lg hover:bg-gray-100">
										→
									</button>
								</div>
							</div>

							<div className="grid grid-cols-7 gap-y-4 text-center">
								{[t("calendar.sun"), t("calendar.mon"), t("calendar.tue"), t("calendar.wed"), t("calendar.thu"), t("calendar.fri"), t("calendar.sat")].map((d) => (
									<div key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
										{d}
									</div>
								))}

								{Array.from({ length: daysInMonth.firstDay }).map((_, i) => (
									<div key={`empty-${i}`} />
								))}

								{Array.from({ length: daysInMonth.totalDays }).map((_, i) => {
									const day = i + 1;
									const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
									const isPast = date < today;
									const isSelected = selectedDate?.toDateString() === date.toDateString();

									return (
										<button
											key={day}
											disabled={isPast}
											onClick={() => setSelectedDate(date)}
											className={`py-3 text-sm font-medium rounded-xl transition
                                                ${isSelected ? "bg-[#1754cf] text-white shadow-lg shadow-[#1754cf]/20" : isPast ? "text-gray-300 bg-transparent cursor-not-allowed" : "hover:bg-[#f0f4ff]"}`}
										>
											{day}
										</button>
									);
								})}
							</div>
						</div>

						<div className="md:col-span-6 bg-[#f8f9fa] flex flex-col">
							<div className="p-5 md:p-10 pb-4">
								<p className="text-[10px] font-black uppercase tracking-widest text-[#1754cf]">{selectedDate ? format(selectedDate, "PPPP", { locale: dateFnsLocale }) : t("manage.selectDateShort")}</p>
								<h3 className="text-xl font-bold">{t("manage.availableSlots")}</h3>
							</div>

							<div className="px-5 md:px-10 grid grid-cols-2 gap-3 min-h-[200px]">
								{loadingSlots ? (
									<div className="col-span-2 flex justify-center items-center">
										<div className="w-8 h-8 border-4 border-[#1754cf]/30 border-t-[#1754cf] rounded-full animate-spin" />
									</div>
								) : previewSlots.length === 0 ? (
									<div className="col-span-2 text-gray-400 font-bold text-center">{t("booking.noSlots")}</div>
								) : (
									<>
										{previewSlots.map((time) => (
											<button
												key={time}
												onClick={() => setSelectedTime(time)}
												className={`px-4 py-3 rounded-xl text-left transition border
                                                    ${selectedTime === time ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf] font-bold" : "bg-white border-transparent hover:border-[#1754cf]/30"}`}
											>
												{time}
											</button>
										))}
										{extraSlots.length > 0 && !showAllSlots && (
											<button onClick={() => setShowAllSlots(true)} className="px-4 py-3 rounded-xl text-left font-bold border border-gray-300 hover:bg-gray-100 col-span-2">
												+{extraSlots.length} {t("common.more")}
											</button>
										)}
									</>
								)}
							</div>

							{/* Modal for all slots */}
							{showAllSlots && (
								<div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50" onClick={() => setShowAllSlots(false)}>
									<div className="bg-white rounded-2xl p-6 max-w-[700px] w-full max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-xl font-bold">{t("manage.allSlots")}</h3>
											<button onClick={() => setShowAllSlots(false)} className="text-gray-500 hover:text-gray-900 text-2xl font-bold">
												×
											</button>
										</div>
										<div className="grid grid-cols-3 gap-3">
											{availableSlots.map((time) => (
												<button
													key={time}
													onClick={() => {
														setSelectedTime(time);
														setShowAllSlots(false);
													}}
													className={`px-4 py-3 rounded-xl text-center transition border ${selectedTime === time ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf] font-bold" : "bg-white border-transparent hover:border-[#1754cf]/30"}`}
												>
													{time}
												</button>
											))}
										</div>
									</div>
								</div>
							)}

							<div className="mt-auto p-5 md:p-10 pt-6 border-t border-gray-100 bg-white/60">
								<button disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)} className="w-full bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-30">
									{t("booking.continue")}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* STEP 2: Summary & User Details */}
				{step === 2 && (
					<div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
						<div className="md:col-span-4 bg-[#f8f9fa] p-5 md:p-10 flex flex-col gap-6">
							<h2 className="text-2xl font-bold">{t("booking.summary")}</h2>
							<div className="flex flex-col gap-4 mt-4">
								<div className="flex justify-between text-sm font-bold">
									<span className="text-gray-400">{t("booking.date")}:</span>
									{/* Added locale here for consistent date formatting */}
									<span>{selectedDate ? format(selectedDate, "PP", { locale: dateFnsLocale }) : "-"}</span>
								</div>
								<div className="flex justify-between text-sm font-bold">
									<span className="text-gray-400">{t("booking.time")}:</span>
									<span>{selectedTime || "-"}</span>
								</div>
								<div className="flex justify-between text-sm font-bold">
									<span className="text-gray-400">{t("booking.location")}:</span>
									<span>Zoom</span>
								</div>
							</div>
						</div>

						<div className="md:col-span-8 bg-white p-5 md:p-10 flex flex-col justify-between">
							<div>
								<h2 className="text-2xl font-black mb-6">{t("booking.details")}</h2>
								<form className="grid gap-6" onSubmit={(e) => e.preventDefault()}>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{(locale === "ja"
											? [
													{ label: t("booking.lastName"), value: lastName, onChange: setLastName },
													{ label: t("booking.firstName"), value: firstName, onChange: setFirstName },
												]
											: [
													{ label: t("booking.firstName"), value: firstName, onChange: setFirstName },
													{ label: t("booking.lastName"), value: lastName, onChange: setLastName },
												]
										).map((field) => (
											<Input key={field.label} label={field.label} value={field.value} onChange={field.onChange} required />
										))}
									</div>

									<Input label={t("booking.email")} type="email" value={email} onChange={setEmail} required />
									<textarea rows={4} placeholder={t("booking.messagePlaceholder")} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1754cf]/30" />
								</form>
							</div>

							<div className="mt-6 flex gap-4">
								<button type="button" onClick={() => setStep(1)} className="flex-1 text-sm font-bold text-gray-400 hover:text-[#1754cf] py-3 rounded-xl border border-gray-200">
									← {t("common.back")}
								</button>
								<button onClick={handleConfirmBooking} disabled={loadingBooking} className="flex-[2] bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50">
									{loadingBooking ? t("booking.bookingStatus") : t("booking.confirm")}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/* ---------------- Sub-components ---------------- */
function StepIndicator({ count, active, label, onClick }: { count: number; active: boolean; label: string; onClick?: () => void }) {
	return (
		<div className={`flex flex-col items-center ${!active && "opacity-40"} cursor-pointer transition-opacity`} onClick={onClick}>
			<span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${active ? "bg-[#1754cf] text-white" : "border border-gray-300"}`}>{count}</span>
			<span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
		</div>
	);
}

function Input({ label, type = "text", value, onChange, required = false }: { label: string; type?: string; value: string; onChange: (val: string) => void; required?: boolean }) {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
			<input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1754cf]/30" />
		</div>
	);
}

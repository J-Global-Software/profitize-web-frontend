"use client";

import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { format, type Locale } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";

type Step = 1 | 2;

interface TimeSlot {
	displayTime: string;
	displayDate: string;
	jstTime: string;
	jstDate: string;
}

export default function FreeConsultationClient() {
	const locale = useLocale();
	const t = useTranslations("consultation");
	const dateFnsLocale: Locale = locale === "ja" ? ja : enUS;

	const [step, setStep] = useState<Step>(1);
	const [currentMonth, setCurrentMonth] = useState(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
	const [showAllSlots, setShowAllSlots] = useState(false);
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [loadingBooking, setLoadingBooking] = useState(false);
	const [userTimezone, setUserTimezone] = useState<string>("");

	// Controlled form values
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const [isClient, setIsClient] = useState(false);

	// Detect user's timezone
	useEffect(() => {
		setIsClient(true); // Mark that we're on client now
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setUserTimezone(tz);
	}, []);

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
			return format(currentMonth, "yyyy年 MM月", { locale: dateFnsLocale });
		} else {
			return format(currentMonth, "MMMM yyyy", { locale: dateFnsLocale });
		}
	}

	const isCurrentMonth = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

	/* ---------------- Available slots logic ---------------- */
	useEffect(() => {
		if (!selectedDate || !userTimezone) return;

		const fetchSlots = async () => {
			setLoadingSlots(true);
			setAvailableSlots([]);
			setSelectedSlot(null);

			try {
				const res = await fetch("/api/free-consultation/available-slots/", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						date: format(selectedDate, "yyyy-MM-dd"),
						timezone: userTimezone,
					}),
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
	}, [selectedDate, userTimezone]);

	/* ---------------- Slot preview logic ---------------- */
	const previewCount = 6;
	const previewSlots = useMemo(() => {
		if (!selectedSlot) return availableSlots.slice(0, previewCount);

		const firstSlots = availableSlots.slice(0, previewCount);
		// If selected slot is in first 6, just return them
		if (firstSlots.some((slot) => slot.displayTime === selectedSlot.displayTime)) {
			return firstSlots;
		}
		// Otherwise, replace the last slot with the selected one
		return [...firstSlots.slice(0, previewCount - 1), selectedSlot];
	}, [availableSlots, selectedSlot]);
	const extraSlots = availableSlots.filter((slot) => !previewSlots.includes(slot));

	/* ---------------- Booking logic ---------------- */
	const handleConfirmBooking = async () => {
		if (!selectedDate || !selectedSlot) {
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
					// Send JST date/time to backend
					date: selectedSlot.jstDate,
					time: selectedSlot.jstTime,
					timezone: userTimezone,
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
			setSelectedSlot(null);
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
								if (selectedSlot) setStep(2);
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
									// japan is ahead of UTC and the date changes depending on timezone
									let isPast = false;
									if (isClient) {
										const localToday = new Date();
										localToday.setHours(0, 0, 0, 0);
										const localDate = new Date(date);
										localDate.setHours(0, 0, 0, 0);
										isPast = localDate.getTime() < localToday.getTime();
									}
									const isSelected = selectedDate?.toDateString() === date.toDateString();

									return (
										<button
											key={day + i}
											disabled={isPast}
											onClick={() => setSelectedDate(date)}
											className={`py-3 text-sm font-medium rounded-xl transition
    ${isSelected ? "bg-[#1754cf] text-white shadow-lg shadow-[#1754cf]/20" : isPast ? "text-gray-300 bg-transparent cursor-not-allowed" : "hover:bg-[#f0f4ff]"}
  `}
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
								{userTimezone && userTimezone !== "Asia/Tokyo" && <p className="text-xs text-gray-500 mt-1">{t("booking.timezone_notice", { timezone: userTimezone })}</p>}{" "}
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
										{previewSlots.map((slot) => (
											<button
												key={slot.displayTime}
												onClick={() => setSelectedSlot(slot)}
												className={`px-4 py-3 rounded-xl text-left transition border
            ${selectedSlot?.displayTime === slot.displayTime ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf] font-bold" : "bg-white border-transparent hover:border-[#1754cf]/30"}`}
											>
												<div className="text-sm">{slot.displayTime}</div>
												{/* Add JST Time display here */}
												{userTimezone && userTimezone !== "Asia/Tokyo" && <div className="text-[10px] text-gray-400 font-medium mt-1">JST: {slot.jstTime}</div>}
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
								<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setShowAllSlots(false)}>
									{/* Animated Overlay */}
									<div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

									<div className="bg-white rounded-[2rem] w-full max-w-[640px] max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
										{/* Modal Header */}
										<div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
											<div>
												<h3 className="text-xl font-black text-gray-900">{t("manage.allSlots")}</h3>
												<p className="text-xs text-gray-400 font-medium mt-1">{selectedDate ? format(selectedDate, "PPPP", { locale: dateFnsLocale }) : ""}</p>
											</div>
											<button onClick={() => setShowAllSlots(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
												<span className="material-symbols-outlined">close</span>
											</button>
										</div>

										{/* Scrollable Content */}
										<div className="p-8 overflow-y-auto custom-scrollbar">
											<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
												{availableSlots.map((slot) => {
													const isSelected = selectedSlot?.displayTime === slot.displayTime;
													return (
														<button
															key={slot.displayTime}
															onClick={() => {
																setSelectedSlot(slot);
																setShowAllSlots(false);
															}}
															className={`group flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all duration-200 border-2 ${isSelected ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf]" : "border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white text-gray-600"}`}
														>
															<span className="text-sm font-bold tracking-tight">{slot.displayTime}</span>

															{userTimezone && userTimezone !== "Asia/Tokyo" && <span className={`text-[10px] mt-1 font-medium px-2 py-0.5 rounded-full transition-colors ${isSelected ? "bg-[#1754cf]/10 text-[#1754cf]" : "text-gray-400 bg-gray-200/50"}`}>JST {slot.jstTime}</span>}
														</button>
													);
												})}
											</div>
										</div>

										{/* Modal Footer (Optional visual anchor) */}
										<div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 text-center">
											<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{userTimezone ? `Timezone: ${userTimezone.replace("_", " ")}` : ""}</p>
										</div>
									</div>
								</div>
							)}

							<div className="mt-auto p-5 md:p-10 pt-6 border-t border-gray-100 bg-white/60">
								<button disabled={!selectedDate || !selectedSlot} onClick={() => setStep(2)} className="w-full bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-30">
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
									<span>{selectedSlot?.displayDate || (selectedDate ? format(selectedDate, "PP", { locale: dateFnsLocale }) : "-")}</span>
								</div>
								<div className="flex justify-between text-sm font-bold">
									<span className="text-gray-400">{t("booking.time")}:</span>
									<div className="text-right">
										<div>{selectedSlot?.displayTime || "-"}</div>
										{userTimezone && userTimezone !== "Asia/Tokyo" && selectedSlot && <div className="text-xs text-gray-400 font-normal mt-1">JST: {selectedSlot.jstTime}</div>}
									</div>
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

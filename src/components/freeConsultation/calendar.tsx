"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { format, startOfDay } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { TimeSlot } from "@/src/types/booking";

interface BookingCalendarProps {
	selectedDate: Date | null;
	onDateSelect: (date: Date) => void;
	selectedSlot: TimeSlot | null;
	onSlotSelect: (slot: TimeSlot | null) => void;
	onContinue?: () => void;
	showContinueButton?: boolean;
	continueButtonText?: string;
	userTimezone: string;
	apiEndpoint?: string;
	maxMonthsAhead?: number;
	disabled?: boolean;
}

export default function BookingCalendar({ selectedDate, onDateSelect, selectedSlot, onSlotSelect, onContinue, showContinueButton = false, continueButtonText, userTimezone, apiEndpoint = "/api/free-consultation/available-slots/", maxMonthsAhead = 6, disabled = false }: BookingCalendarProps) {
	const locale = useLocale();
	const t = useTranslations("consultation");
	const dateFnsLocale = locale === "ja" ? ja : enUS;

	const [currentMonth, setCurrentMonth] = useState(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});

	const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [slotsError, setSlotsError] = useState<string | null>(null);
	const [showAllSlots, setShowAllSlots] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const today = useMemo(() => startOfDay(new Date()), []);
	const maxDate = useMemo(() => {
		const d = new Date();
		d.setMonth(d.getMonth() + maxMonthsAhead);
		return startOfDay(d);
	}, [maxMonthsAhead]);

	const daysInMonth = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();
		return { firstDay, totalDays };
	}, [currentMonth]);

	const isCurrentMonth = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();
	const isMaxMonth = currentMonth.getFullYear() === maxDate.getFullYear() && currentMonth.getMonth() === maxDate.getMonth();

	/* ---------------- Optimization: Prefetch ---------------- */
	const prefetchSlots = useCallback(
		(date: Date) => {
			if (disabled) return;
			fetch(apiEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ date: format(date, "yyyy-MM-dd"), timezone: userTimezone }),
			}).catch(() => {});
		},
		[apiEndpoint, userTimezone, disabled],
	);

	/* ---------------- Fetch Slots ---------------- */
	useEffect(() => {
		if (!selectedDate || !userTimezone) return;
		const abortController = new AbortController();

		const fetchSlots = async () => {
			setLoadingSlots(true);
			setSlotsError(null);
			try {
				const res = await fetch(apiEndpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						date: format(selectedDate, "yyyy-MM-dd"),
						timezone: userTimezone,
					}),
					signal: abortController.signal,
				});

				if (!res.ok) throw new Error(`Status: ${res.status}`);
				const data = await res.json();
				if (!abortController.signal.aborted) {
					setAvailableSlots(data.availableSlots || []);
				}
			} catch (err: any) {
				if (err.name !== "AbortError") {
					setSlotsError(t("errors.fetchSlotsFailed") || "Failed to load time slots");
				}
			} finally {
				if (!abortController.signal.aborted) setLoadingSlots(false);
			}
		};

		fetchSlots();
		return () => abortController.abort();
	}, [selectedDate, userTimezone, apiEndpoint, t]);

	const previewCount = 6;
	const previewSlots = useMemo(() => {
		const base = availableSlots.slice(0, previewCount);
		if (selectedSlot && !base.find((s) => s.displayTime === selectedSlot.displayTime)) {
			return [...base.slice(0, 5), selectedSlot];
		}
		return base;
	}, [availableSlots, selectedSlot]);

	const extraSlots = useMemo(() => availableSlots.filter((slot) => !previewSlots.includes(slot)), [availableSlots, previewSlots]);

	const handlePreviousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
	const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

	return (
		<div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
			{/* Calendar Section */}
			<div className="md:col-span-6 p-5 md:p-10 border-r border-gray-100">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl font-bold capitalize">{format(currentMonth, locale === "ja" ? "yyyy年 MM月" : "MMMM yyyy", { locale: dateFnsLocale })}</h2>
					<div className="flex gap-2">
						<button disabled={isCurrentMonth || disabled} onClick={handlePreviousMonth} className={`p-2 rounded-lg transition ${isCurrentMonth || disabled ? "opacity-20 cursor-not-allowed" : "hover:bg-gray-100"}`}>
							←
						</button>
						<button disabled={isMaxMonth || disabled} onClick={handleNextMonth} className={`p-2 rounded-lg transition ${isMaxMonth || disabled ? "opacity-20 cursor-not-allowed" : "hover:bg-gray-100"}`}>
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
						const isPast = isClient && startOfDay(date) < today;
						const isTooFar = isClient && startOfDay(date) > maxDate;
						const isSelected = selectedDate?.toDateString() === date.toDateString();
						const isDisabled = isPast || isTooFar || disabled;

						return (
							<button
								key={day}
								disabled={isDisabled}
								onMouseEnter={() => !isDisabled && prefetchSlots(date)}
								onClick={() => onDateSelect(date)}
								className={`py-3 text-sm font-medium rounded-xl transition
                                    ${isSelected ? "bg-[#1754cf] text-white shadow-lg shadow-[#1754cf]/20" : isDisabled ? "text-gray-300 bg-transparent cursor-not-allowed" : "hover:bg-[#f0f4ff]"}
                                `}
							>
								{day}
							</button>
						);
					})}
				</div>
			</div>

			{/* Time Slots Section */}
			<div className="md:col-span-6 bg-[#f8f9fa] flex flex-col">
				<div className="p-5 md:p-10 pb-4">
					<p className="text-[10px] font-black uppercase tracking-widest text-[#1754cf]">{selectedDate ? format(selectedDate, "PPPP", { locale: dateFnsLocale }) : t("manage.selectDateShort")}</p>
					<h3 className="text-xl font-bold">{t("manage.availableSlots")}</h3>
					{userTimezone && userTimezone !== "Asia/Tokyo" && <p className="text-xs text-gray-500 mt-1">{t("booking.timezone_notice", { timezone: userTimezone })}</p>}
				</div>

				<div className="px-5 md:px-10 grid grid-cols-2 gap-3 min-h-[200px] content-start">
					{loadingSlots ? (
						Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[62px] w-full bg-gray-200 animate-pulse rounded-xl" />)
					) : slotsError ? (
						<div className="col-span-2 flex flex-col items-center justify-center gap-3 py-10">
							<p className="text-red-500 text-sm text-center">{slotsError}</p>
							<button onClick={() => selectedDate && onDateSelect(selectedDate)} className="text-xs text-[#1754cf] hover:underline">
								{t("common.retry")}
							</button>
						</div>
					) : previewSlots.length === 0 ? (
						<div className="col-span-2 text-gray-400 font-bold text-center py-10">{t("booking.noSlots")}</div>
					) : (
						<>
							{previewSlots.map((slot) => (
								<button
									key={slot.displayTime}
									onClick={() => onSlotSelect(slot)}
									disabled={disabled}
									className={`px-4 py-3 rounded-xl text-left transition border
                                        ${selectedSlot?.displayTime === slot.displayTime ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf] font-bold" : disabled ? "opacity-50 cursor-not-allowed" : "bg-white border-transparent hover:border-[#1754cf]/30"}`}
								>
									<div className="text-sm">{slot.displayTime}</div>
									{userTimezone && userTimezone !== "Asia/Tokyo" && <div className="text-[10px] text-gray-400 font-medium mt-1">JST: {slot.jstTime}</div>}
								</button>
							))}
							{extraSlots.length > 0 && !showAllSlots && (
								<button onClick={() => setShowAllSlots(true)} disabled={disabled} className="px-4 py-3 rounded-xl text-left font-bold border border-gray-300 hover:bg-gray-100 col-span-2 disabled:opacity-50 disabled:cursor-not-allowed">
									+{extraSlots.length} {t("common.more")}
								</button>
							)}
						</>
					)}
				</div>

				{showContinueButton && (
					<div className="mt-auto p-5 md:p-10 pt-6 border-t border-gray-100 bg-white/60">
						<button disabled={!selectedDate || !selectedSlot || disabled} onClick={onContinue} className="w-full bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-blue-600 active:scale-[0.98]">
							{continueButtonText || t("booking.continue")}
						</button>
					</div>
				)}
			</div>

			{/* Modal - Kept exactly as your original */}
			{showAllSlots && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setShowAllSlots(false)}>
					<div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
					<div className="bg-white rounded-[2rem] w-full max-w-[640px] max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
						<div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
							<div>
								<h3 className="text-xl font-black text-gray-900">{t("manage.allSlots")}</h3>
								<p className="text-xs text-gray-400 font-medium mt-1">{selectedDate ? format(selectedDate, "PPPP", { locale: dateFnsLocale }) : ""}</p>
							</div>
							<button onClick={() => setShowAllSlots(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
								✕
							</button>
						</div>
						<div className="p-8 overflow-y-auto">
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
								{availableSlots.map((slot) => (
									<button
										key={slot.displayTime}
										onClick={() => {
											onSlotSelect(slot);
											setShowAllSlots(false);
										}}
										className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all border-2 ${selectedSlot?.displayTime === slot.displayTime ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf]" : "border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white"}`}
									>
										<span className="text-sm font-bold">{slot.displayTime}</span>
										{userTimezone && userTimezone !== "Asia/Tokyo" && <span className="text-[10px] mt-1 font-medium">JST {slot.jstTime}</span>}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

"use client";

import { useEffect, useState, useMemo, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { format, type Locale } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { Link } from "@/src/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

import Header from "@/src/components/homepage/headerSection";

/* ───────────── Types ───────────── */

interface TimeSlot {
	displayTime: string;
	displayDate: string;
	jstTime: string;
	jstDate: string;
}

interface Booking {
	firstName: string;
	lastName: string;
	eventDate: string;
	zoomJoinUrl?: string | null;
	status: string;
}

interface ManageBookingResponse {
	booking: Booking;
	canReschedule: boolean;
	canCancel: boolean;
}

interface AvailableSlotsResponse {
	availableSlots: TimeSlot[];
	timezone: string;
}

export default function ManageBookingPage() {
	const t = useTranslations("consultation");
	const locale = useLocale();

	const params = useParams<{ token: string }>();
	const token = params.token;
	const dateFnsLocale: Locale = locale === "ja" ? ja : enUS;

	/* ───────────── States ───────────── */
	const [loading, setLoading] = useState(true);
	const [booking, setBooking] = useState<Booking | null>(null);
	const [canReschedule, setCanReschedule] = useState(false);
	const [canCancel, setCanCancel] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [showReschedule, setShowReschedule] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [success, setSuccess] = useState<"reschedule" | "cancel" | null>(null);
	const [showAllSlots, setShowAllSlots] = useState(false);
	const [userTimezone, setUserTimezone] = useState<string>("");

	const [isClient, setIsClient] = useState(false);

	/* ───────────── Calendar State ───────────── */
	const [currentMonth, setCurrentMonth] = useState(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});

	const today = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

	function getMonthLabel(currentMonth: Date) {
		if (locale === "ja") {
			return format(currentMonth, "yyyy年 MM月", { locale: dateFnsLocale });
		} else {
			return format(currentMonth, "MMMM yyyy", { locale: dateFnsLocale });
		}
	}

	const daysInMonth = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();
		return { firstDay, totalDays };
	}, [currentMonth]);

	const isCurrentMonth = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

	/* ───────────── Effects ───────────── */

	// Detect user's timezone
	useEffect(() => {
		setIsClient(true);
		try {
			const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			setUserTimezone(tz);
		} catch (error) {
			console.error("Failed to detect timezone:", error);
			setUserTimezone("Asia/Tokyo");
		}
	}, []);

	useEffect(() => {
		const fetchBooking = async () => {
			try {
				const res = await fetch(`/api/free-consultation/manage/${token}`);
				const data: ManageBookingResponse = await res.json();

				if (!res.ok) throw new Error(t("errors.fetchBookingFailed"));

				setBooking(data.booking);
				setCanReschedule(data.canReschedule);
				setCanCancel(data.canCancel);
			} catch (err: unknown) {
				setError(err instanceof Error ? err.message : t("errors.fetchBookingFailed"));
			} finally {
				setLoading(false);
			}
		};
		fetchBooking();
	}, [token, t]);

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
				const data: AvailableSlotsResponse = await res.json();
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

	/* ───────────── Slot preview logic ───────────── */
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

	const handleAction = async (type: "reschedule" | "cancel") => {
		setSubmitting(true);
		try {
			const res = await fetch(`/api/free-consultation/manage/${token}/${type}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-locale": locale,
				},
				body:
					type === "reschedule" && selectedSlot
						? JSON.stringify({
								date: selectedSlot.jstDate,
								time: selectedSlot.jstTime,
								timezone: userTimezone,
							})
						: null,
			});

			if (!res.ok) throw new Error();
			setSuccess(type);
		} catch {
			toast.error(t("errors.requestFailed"));
		} finally {
			setSubmitting(false);
		}
	};

	/* ───────────── Render Helpers ───────────── */
	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
				<FaSpinner className="animate-spin text-[#1754cf] w-8 h-8" />
			</div>
		);

	if (error)
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfb] px-4 text-center">
				<h1 className="text-3xl font-black text-gray-900 mb-4">{t("errors.oops")}</h1>
				<p className="text-gray-500 mb-6">{error}</p>
				<Link href="/" className="px-8 py-3 bg-[#1754cf] text-white rounded-xl font-semibold hover:bg-blue-600 transition-all">
					{t("common.returnHome")}
				</Link>
			</div>
		);

	if (!booking) return null;

	// Convert booking event date to user's timezone for display
	const bookingDate = new Date(booking.eventDate);
	const displayDateTime = userTimezone
		? bookingDate.toLocaleString(locale === "ja" ? "ja-JP" : "en-US", {
				timeZone: userTimezone,
				dateStyle: "full",
				timeStyle: "short",
			})
		: format(bookingDate, "PPPP p", { locale: dateFnsLocale });

	if (success) {
		const isReschedule = success === "reschedule";
		return (
			<div>
				<Header />
				<main className="min-h-[70vh] flex items-center justify-center px-6 bg-[#fbfbfb]">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
						<div className={`mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full ${isReschedule ? "bg-blue-50 text-[#1754cf]" : "bg-red-50 text-red-600"}`}>
							<span className="material-symbols-outlined text-3xl">{isReschedule ? "event_available" : "event_busy"}</span>
						</div>
						<h1 className="text-3xl font-black text-gray-900 mb-3">{isReschedule ? t("manage.bookingRescheduled") : t("manage.bookingCancelled")}</h1>
						<p className="text-gray-500 text-sm mb-8 leading-relaxed">{isReschedule ? t("manage.rescheduleSuccess") : t("manage.cancelSuccess")}</p>
						{isReschedule && selectedSlot && (
							<div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left">
								<p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t("manage.newDateTime")}</p>
								<p className="font-bold text-gray-900">{selectedSlot.displayDate}</p>
								<p className="text-gray-500">{selectedSlot.displayTime}</p>
								{userTimezone !== "Asia/Tokyo" && <p className="text-xs text-gray-400 mt-2">JST: {selectedSlot.jstTime}</p>}
							</div>
						)}
						<div className="flex flex-col gap-3">
							<Link href="/" className="w-full px-6 py-4 bg-[#1754cf] text-white rounded-2xl font-bold hover:bg-blue-600 transition">
								{t("common.returnHome")}
							</Link>
							<button onClick={() => window.close()} className="w-full px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition">
								{t("common.close")}
							</button>
						</div>
					</motion.div>
				</main>
			</div>
		);
	}

	return (
		<div>
			<Header />
			<main className="flex-grow flex flex-col items-center py-16 px-6 bg-[#fbfbfb] text-[#111318]">
				{!showReschedule && (
					<>
						<div className="max-w-[800px] w-full mb-12 text-center">
							<h1 className="serif-header text-4xl md:text-5xl font-black text-gray-900 mb-4">{t("manage.title")}</h1>
							<p className="text-gray-500 text-sm max-w-md mx-auto">{t("manage.subtitle")}</p>
						</div>
						<div className="max-w-[800px] w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
							<div className="p-10">
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
									<div className="space-y-6">
										<InfoRow label={t("manage.clientName")} value={`${booking.firstName} ${booking.lastName}`} icon="person" />
										<InfoRow
											label={t("manage.consultationDate")}
											value={
												<div className="flex flex-col">
													<div className="flex items-center gap-2">
														<span className="material-symbols-outlined text-[#1754cf] text-xl">calendar_today</span>
														<span className="text-lg font-semibold text-gray-700">{displayDateTime}</span>
													</div>
													{userTimezone && userTimezone !== "Asia/Tokyo" && <p className="text-xs text-gray-500 mt-1">{t("booking.timezone_notice", { timezone: userTimezone })}</p>}
												</div>
											}
										/>
										<InfoRow
											label={t("manage.meetingLink")}
											value={
												booking.zoomJoinUrl ? (
													<a className="flex items-center gap-2 text-[#1754cf] font-bold hover:underline" href={booking.zoomJoinUrl} target="_blank">
														<span className="material-symbols-outlined text-xl">video_camera_front</span> {t("manage.launchZoom")}
													</a>
												) : (
													t("manage.notAvailable")
												)
											}
										/>
									</div>
									<div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">{booking.status}</div>
								</div>
							</div>
						</div>
						<div className="max-w-[800px] w-full flex flex-col md:flex-row gap-4 mb-12">
							{canReschedule && (
								<button onClick={() => setShowReschedule(true)} className="flex-1 bg-[#1754cf] text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
									<span className="material-symbols-outlined">event_repeat</span> {t("manage.reschedule")}
								</button>
							)}
							{canCancel && (
								<button onClick={() => setShowCancelConfirm(true)} className="flex-1 bg-white text-gray-600 border-2 border-gray-200 font-bold py-5 rounded-2xl hover:border-red-200 hover:text-red-500 transition-all flex items-center justify-center gap-3">
									<span className="material-symbols-outlined">event_busy</span> {t("manage.cancel")}
								</button>
							)}
						</div>
					</>
				)}

				{showReschedule && (
					<div className="relative w-full max-w-[1100px]">
						<button onClick={() => setShowReschedule(false)} className="absolute -top-10 left-0 flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
							<span className="material-symbols-outlined text-base">arrow_back</span> {t("common.back")}
						</button>
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
							<div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
								<div className="md:col-span-6 border-r border-gray-100 p-5 md:p-10">
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
										{userTimezone && userTimezone !== "Asia/Tokyo" && <p className="text-xs text-gray-500 mt-1">{t("booking.timezone_notice", { timezone: userTimezone })}</p>}
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
									<div className="mt-auto p-5 md:p-10 pt-6 border-t border-gray-100 bg-white/60">
										<button disabled={!selectedDate || !selectedSlot || submitting} onClick={() => handleAction("reschedule")} className="w-full bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-30">
											{submitting ? t("common.updating") : t("manage.confirmReschedule")}
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				)}

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
									<span className="material-symbols-outlined">close</span>
								</button>
							</div>

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

							<div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 text-center">
								<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{userTimezone ? `Timezone: ${userTimezone.replace("_", " ")}` : ""}</p>
							</div>
						</div>
					</div>
				)}

				{showCancelConfirm && (
					<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
						<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
							<h3 className="text-xl font-bold text-gray-900 mb-2">{t("manage.cancelTitle")}</h3>
							<p className="text-gray-500 mb-8 text-sm leading-relaxed">{t("manage.cancelWarning")}</p>
							<div className="grid grid-cols-2 gap-3">
								<button onClick={() => setShowCancelConfirm(false)} disabled={submitting} className="py-3 text-sm font-bold text-gray-400 hover:text-gray-600">
									{t("manage.keepBooking")}
								</button>
								<button onClick={() => handleAction("cancel")} disabled={submitting} className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex justify-center items-center">
									{submitting ? <FaSpinner className="animate-spin w-5 h-5" /> : t("manage.yesCancel")}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</main>
		</div>
	);
}

function InfoRow({ label, value, icon }: { label: string; value: ReactNode; icon?: string | ReactNode }) {
	return (
		<div className="flex items-start gap-4">
			{icon && typeof icon === "string" ? <span className="material-symbols-outlined text-[#1754cf] text-xl mt-1">{icon}</span> : icon}
			<div>
				<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
				<div className="text-lg font-semibold text-gray-900">{value}</div>
			</div>
		</div>
	);
}

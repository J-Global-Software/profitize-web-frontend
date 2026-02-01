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
	availableSlots: string[];
}

export default function ManageBookingPage() {
	const t = useTranslations("consultation"); // Single translation hook
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
	const [selectedDate, setSelectedDate] = useState<Date>();
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [availableTimes, setAvailableTimes] = useState<string[]>([]);
	const [loadingTimes, setLoadingTimes] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [success, setSuccess] = useState<"reschedule" | "cancel" | null>(null);
	const [showAllSlots, setShowAllSlots] = useState(false);

	/* ───────────── Calendar State ───────────── */
	const [currentMonth, setCurrentMonth] = useState(new Date());
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

	/* ───────────── Effects ───────────── */
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
		if (!selectedDate) return;
		setSelectedTime(null);
		setAvailableTimes([]);
		setLoadingTimes(true);

		fetch("/api/free-consultation/available-slots/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ date: format(selectedDate, "yyyy-MM-dd") }),
		})
			.then((res) => res.json())
			.then((data: AvailableSlotsResponse) => setAvailableTimes(data.availableSlots ?? []))
			.finally(() => setLoadingTimes(false));
	}, [selectedDate]);

	const previewCount = 6;
	const previewSlots = useMemo(() => {
		if (!availableTimes.length) return [];
		if (selectedTime) {
			return [...availableTimes.slice(0, previewCount).filter((slot) => slot !== selectedTime), selectedTime];
		}
		return availableTimes.slice(0, previewCount);
	}, [availableTimes, selectedTime]);

	const extraSlots = useMemo(() => {
		return availableTimes.filter((slot) => !previewSlots.includes(slot));
	}, [availableTimes, previewSlots]);

	const handleAction = async (type: "reschedule" | "cancel") => {
		setSubmitting(true);
		try {
			const res = await fetch(`/api/free-consultation/manage/${token}/${type}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: type === "reschedule" ? JSON.stringify({ date: format(selectedDate as Date, "yyyy-MM-dd"), time: selectedTime }) : null,
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
						{isReschedule && selectedDate && selectedTime && (
							<div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left">
								<p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t("manage.newDateTime")}</p>
								<p className="font-bold text-gray-900">{format(new Date(booking.eventDate), "PPPP", { locale: dateFnsLocale })}</p>
								<p className="text-gray-500">{selectedTime}</p>
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
														<span className="text-lg font-semibold text-gray-700">{format(new Date(booking.eventDate), "PPPP", { locale: dateFnsLocale })}</span>
													</div>
													<p className="text-sm text-gray-500 ml-7 mt-1">{format(new Date(booking.eventDate), "p")}</p>
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
								<div className="md:col-span-6 border-r border-gray-100 p-10">
									<div className="flex items-center justify-between mb-8">
										<h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
										<div className="flex gap-2">
											<button disabled={currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth()} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-20">
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
											return (
												<button key={day} disabled={isPast} onClick={() => setSelectedDate(date)} className={`py-3 text-sm font-medium rounded-xl transition ${selectedDate?.toDateString() === date.toDateString() ? "bg-[#1754cf] text-white" : isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-[#f0f4ff]"}`}>
													{day}
												</button>
											);
										})}
									</div>
								</div>

								<div className="md:col-span-6 bg-[#f8f9fa] flex flex-col">
									<div className="p-6 pb-4">
										<p className="text-[10px] font-black uppercase tracking-widest text-[#1754cf]">{selectedDate ? format(selectedDate, "PP") : t("manage.selectDateShort")}</p>
										<h3 className="text-xl font-bold">{t("manage.availableSlots")}</h3>
									</div>
									<div className="px-6 grid grid-cols-2 gap-3 min-h-[200px]">
										{loadingTimes ? (
											<div className="col-span-2 flex justify-center items-center">
												<div className="w-8 h-8 border-4 border-[#1754cf]/30 border-t-[#1754cf] rounded-full animate-spin" />
											</div>
										) : availableTimes.length === 0 ? (
											<div className="col-span-2 text-gray-400 font-bold text-center">{t("manage.selectDate")}</div>
										) : (
											<>
												{previewSlots.map((time) => (
													<button key={time} onClick={() => setSelectedTime(time)} className={`px-4 py-3 rounded-xl text-left border ${selectedTime === time ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf] font-bold" : "bg-white border-transparent"}`}>
														{time}
													</button>
												))}
												{extraSlots.length > 0 && !showAllSlots && (
													<button onClick={() => setShowAllSlots(true)} className="px-4 py-3 rounded-xl text-left font-bold border border-gray-300 hover:bg-gray-100 col-span-2">
														+{extraSlots.length} more
													</button>
												)}
											</>
										)}
									</div>
									<div className="mt-auto p-6 pt-4 border-t border-gray-100 bg-white/60 flex justify-end">
										<button disabled={!selectedTime || submitting} onClick={() => handleAction("reschedule")} className="w-full sm:w-auto px-12 py-4 bg-[#1754cf] disabled:bg-gray-200 text-white rounded-2xl font-bold transition-all">
											{submitting ? t("common.updating") : t("manage.confirmReschedule")}
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				)}

				{showAllSlots && (
					<div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50" onClick={() => setShowAllSlots(false)}>
						<div className="bg-white rounded-2xl p-6 max-w-[700px] w-full max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold">{t("manage.allSlots")}</h3>
								<button onClick={() => setShowAllSlots(false)} className="text-gray-500 text-2xl font-bold">
									×
								</button>
							</div>
							<div className="grid grid-cols-3 gap-3">
								{availableTimes.map((time) => (
									<button
										key={time}
										onClick={() => {
											setSelectedTime(time);
											setShowAllSlots(false);
										}}
										className={`px-4 py-3 rounded-xl border ${selectedTime === time ? "border-[#1754cf] bg-[#f0f4ff] text-[#1754cf] font-bold" : "bg-white border-transparent"}`}
									>
										{time}
									</button>
								))}
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

"use client";

import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { HiOutlineUser, HiOutlineCalendarDays, HiOutlineVideoCamera, HiOutlineArrowLeft, HiOutlineXMark, HiOutlineArrowPath } from "react-icons/hi2";
import Header from "@/src/components/homepage/headerSection";
import BookingCalendar from "@/src/components/freeConsultation/calendar";
import { TimeSlot } from "@/src/types/bookingFrontend";
import { useManageBooking } from "@/src/hooks/useManageBooking";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";
import { SuccessView } from "@/src/components/freeConsultation/ui/successView";
import { ErrorState } from "@/src/components/freeConsultation/ui/errorState";

/**
 * Interface for InfoRow to ensure strict typing
 */
interface InfoRowProps {
	label: string;
	value: ReactNode;
	Icon: React.ElementType;
}

/**
 * Sub-component for displaying booking details with an icon
 */
function InfoRow({ label, value, Icon }: InfoRowProps) {
	return (
		<div className="flex items-start gap-4">
			<div className="text-[#1754cf] mt-1">
				<Icon size={20} />
			</div>
			<div>
				<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
				<div className="text-lg font-semibold text-gray-900">{value}</div>
			</div>
		</div>
	);
}

export default function ManageBookingPage() {
	const t = useTranslations("consultation");
	const locale = useLocale();
	const dateFnsLocale = locale === "ja" ? ja : enUS;

	// 1. Logic Hook - Ensure useManageBooking returns strict types
	const { loading, booking, canReschedule, canCancel, error, submitting, success, handleAction, userTimezone } = useManageBooking();

	// 2. Local UI State
	const [showReschedule, setShowReschedule] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

	// 3. Conditional Rendering for Loading/Error/Success
	if (loading) return <LoadingSpinner />;
	if (error) return <ErrorState message={error} />;

	if (success) {
		return <SuccessView type={success} slot={selectedSlot} userTimezone={userTimezone} />;
	}

	if (!booking) return null;

	// 4. Formatting logic
	const bookingDate = new Date(booking.eventDate);
	const displayDateTime = userTimezone
		? bookingDate.toLocaleString(locale === "ja" ? "ja-JP" : "en-US", {
				timeZone: userTimezone,
				dateStyle: "full",
				timeStyle: "short",
			})
		: format(bookingDate, "PPPP p", { locale: dateFnsLocale });

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-grow flex flex-col items-center py-16 px-6 bg-[#fbfbfb] text-[#111318]">
				{!showReschedule ? (
					<>
						{/* Summary Header */}
						<div className="max-w-[800px] w-full mb-12 text-center">
							<h1 className="serif-header text-4xl md:text-5xl font-black text-gray-900 mb-4">{t("manage.title")}</h1>
							<p className="text-gray-500 text-sm max-w-md mx-auto">{t("manage.subtitle")}</p>
						</div>

						{/* Booking Details Card */}
						<div className="max-w-[800px] w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
							<div className="p-10">
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
									<div className="space-y-6">
										<InfoRow label={t("manage.clientName")} value={`${booking.firstName} ${booking.lastName}`} Icon={HiOutlineUser} />
										<InfoRow
											label={t("manage.consultationDate")}
											Icon={HiOutlineCalendarDays}
											value={
												<div className="flex flex-col">
													<div className="text-lg font-semibold text-gray-700">{displayDateTime}</div>
													{userTimezone && userTimezone !== "Asia/Tokyo" && <p className="text-xs text-gray-500 mt-1">{t("booking.timezone_notice", { timezone: userTimezone })}</p>}
												</div>
											}
										/>
										<InfoRow
											label={t("manage.meetingLink")}
											Icon={HiOutlineVideoCamera}
											value={
												booking.zoomJoinUrl ? (
													<a className="text-[#1754cf] font-bold hover:underline" href={booking.zoomJoinUrl} target="_blank" rel="noreferrer">
														{t("manage.launchZoom")}
													</a>
												) : (
													t("manage.notAvailable")
												)
											}
										/>
									</div>
									<div className="bg-blue-50 text-[#1754cf] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">{booking.status}</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="max-w-[800px] w-full flex flex-col md:flex-row gap-4 mb-12">
							{canReschedule && (
								<button onClick={() => setShowReschedule(true)} className="flex-1 bg-[#1754cf] text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
									<HiOutlineArrowPath className="text-xl" /> {t("manage.reschedule")}
								</button>
							)}
							{canCancel && (
								<button onClick={() => setShowCancelConfirm(true)} className="flex-1 bg-white text-gray-600 border-2 border-gray-200 font-bold py-5 rounded-2xl hover:border-red-200 hover:text-red-500 transition-all flex items-center justify-center gap-3">
									<HiOutlineXMark className="text-xl" /> {t("manage.cancel")}
								</button>
							)}
						</div>
					</>
				) : (
					/* Reschedule View */
					<div className="relative w-full max-w-[1100px]">
						<button onClick={() => setShowReschedule(false)} className="absolute -top-10 left-0 flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
							<HiOutlineArrowLeft className="text-sm" /> {t("common.back")}
						</button>
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
							<BookingCalendar
								selectedDate={selectedDate}
								onDateSelect={setSelectedDate}
								selectedSlot={selectedSlot}
								onSlotSelect={setSelectedSlot}
								userTimezone={userTimezone}
								showContinueButton={true}
								continueButtonText={submitting ? t("common.updating") : t("manage.confirmReschedule")}
								onContinue={() => {
									if (selectedSlot && !submitting) {
										handleAction("reschedule", {
											date: selectedSlot.jstDate,
											time: selectedSlot.jstTime,
										});
									}
								}}
							/>
						</motion.div>
					</div>
				)}

				{/* Cancellation Modal */}
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

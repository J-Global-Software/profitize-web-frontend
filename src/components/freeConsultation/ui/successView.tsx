"use client";

import { motion } from "framer-motion";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import Header from "@/src/components/homepage/headerSection";
import { TimeSlot } from "@/src/types/booking";

interface SuccessViewProps {
	// Add "book" to the type union
	type: "reschedule" | "cancel" | "book";
	slot: TimeSlot | null;
	userTimezone: string;
}

export function SuccessView({ type, slot, userTimezone }: SuccessViewProps) {
	const t = useTranslations("consultation");

	// Logic to differentiate UI states
	const isCancel = type === "cancel";
	const isInitialBooking = type === "book";
	const isReschedule = type === "reschedule";

	return (
		<div className="w-full">
			{/* If used inside FreeConsultationClient, you might want to hide 
                the header if the parent already has one, or keep it for the standalone feel */}
			<Header />
			<main className="min-h-[70vh] flex items-center justify-center px-6 bg-[#fbfbfb]">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
					{/* Icon Logic */}
					<div
						className={`mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full 
                        ${isCancel ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#1754cf]"}`}
					>
						<span className="material-symbols-outlined text-3xl">{isCancel ? "event_busy" : "event_available"}</span>
					</div>

					{/* Title Logic */}
					<h1 className="text-3xl font-black text-gray-900 mb-3">
						{isInitialBooking && t("booking.successTitle")}
						{isReschedule && t("manage.bookingRescheduled")}
						{isCancel && t("manage.bookingCancelled")}
					</h1>

					{/* Subtitle Logic */}
					<p className="text-gray-500 text-sm mb-8 leading-relaxed">
						{isInitialBooking && t("booking.successSubtitle")}
						{isReschedule && t("manage.rescheduleSuccess")}
						{isCancel && t("manage.cancelSuccess")}
					</p>

					{/* Show slot info for both Reschedule and Initial Booking */}
					{(isReschedule || isInitialBooking) && slot && (
						<div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left">
							<p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{isInitialBooking ? t("booking.confirmedTime") : t("manage.newDateTime")}</p>
							<p className="font-bold text-gray-900">{slot.displayDate}</p>
							<p className="text-gray-500">{slot.displayTime}</p>
							{userTimezone !== "Asia/Tokyo" && <p className="text-xs text-gray-400 mt-2">JST: {slot.jstTime}</p>}
						</div>
					)}

					<div className="flex flex-col gap-3">
						<Link href="/" className="w-full px-6 py-4 bg-[#1754cf] text-white rounded-2xl font-bold hover:bg-blue-600 transition">
							{t("common.returnHome")}
						</Link>
					</div>
				</motion.div>
			</main>
		</div>
	);
}

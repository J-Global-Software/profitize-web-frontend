"use client";

import { format } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";
import BookingCalendar from "./calendar";
import { useBooking } from "@/src/hooks/useBooking";
import { SuccessView } from "@/src/components/freeConsultation/ui/successView";

export default function FreeConsultationClient() {
	const locale = useLocale();
	const t = useTranslations("consultation");
	const dateFnsLocale = locale === "ja" ? ja : enUS;

	const { step, setStep, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, formData, updateField, loading, handleConfirm, userTimezone, success } = useBooking();

	// SUCCESS STATE UI
	if (success) {
		return (
			<div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center px-6 py-12">
				<SuccessView type="book" slot={selectedSlot} userTimezone={userTimezone} />
			</div>
		);
	}

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
				{step === 1 && <BookingCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} selectedSlot={selectedSlot} onSlotSelect={setSelectedSlot} userTimezone={userTimezone} showContinueButton={true} continueButtonText={t("booking.continue")} onContinue={() => setStep(2)} />}

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
													{ label: t("booking.lastName"), value: formData.lastName, field: "lastName" },
													{ label: t("booking.firstName"), value: formData.firstName, field: "firstName" },
												]
											: [
													{ label: t("booking.firstName"), value: formData.firstName, field: "firstName" },
													{ label: t("booking.lastName"), value: formData.lastName, field: "lastName" },
												]
										).map((item) => (
											<Input key={item.field} label={item.label} value={item.value} onChange={(val) => updateField(item.field as any, val)} required />
										))}
									</div>

									<Input label={t("booking.email")} type="email" value={formData.email} onChange={(val) => updateField("email", val)} required />

									<textarea rows={4} placeholder={t("booking.messagePlaceholder")} value={formData.message} onChange={(e) => updateField("message", e.target.value)} className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1754cf]/30" />
								</form>
							</div>

							<div className="mt-6 flex gap-4">
								<button type="button" onClick={() => setStep(1)} className="flex-1 text-sm font-bold text-gray-400 hover:text-[#1754cf] py-3 rounded-xl border border-gray-200">
									← {t("common.back")}
								</button>
								<button onClick={handleConfirm} disabled={loading} className="flex-[2] bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50">
									{loading ? t("booking.bookingStatus") : t("booking.confirm")}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/* ---------------- Sub-components (Kept the same) ---------------- */
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

import { useState } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { BookingStep, TimeSlot } from "@/src/types/booking";
import { useTimezone } from "./useTimezone";

export function useBooking() {
	const locale = useLocale();
	const t = useTranslations("consultation");
	const userTimezone = useTimezone();

	const [step, setStep] = useState<BookingStep>(1);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [loading, setLoading] = useState(false);
	// Add success state
	const [success, setSuccess] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		message: "",
	});

	const updateField = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleConfirm = async () => {
		if (!selectedDate || !selectedSlot) return toast.error(t("booking.errorDateTime"));
		if (!formData.firstName || !formData.lastName || !formData.email) return toast.error(t("booking.errorFields"));

		setLoading(true);
		try {
			const res = await fetch("/api/free-consultation/book", {
				method: "POST",
				headers: { "Content-Type": "application/json", "x-locale": locale },
				body: JSON.stringify({
					...formData,
					date: selectedSlot.jstDate,
					time: selectedSlot.jstTime,
					timezone: userTimezone,
				}),
			});

			if (!res.ok) throw new Error("Booking failed");

			// Instead of resetting step, set success state
			setSuccess("book");
			toast.success(t("booking.success"));
		} catch (err) {
			toast.error(t("errors.requestFailed"));
		} finally {
			setLoading(false);
		}
	};

	return {
		step,
		setStep,
		selectedDate,
		setSelectedDate,
		selectedSlot,
		setSelectedSlot,
		formData,
		updateField,
		loading,
		success, // Export success
		handleConfirm,
		userTimezone,
	};
}

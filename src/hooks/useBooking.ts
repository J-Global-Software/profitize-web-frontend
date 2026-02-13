import { useState } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { BookingStep, TimeSlot } from "@/src/types/bookingFrontend";
import { useTimezone } from "./useTimezone";

// Define the shape of your form for better type inference
export interface BookingFormData {
	firstName: string;
	lastName: string;
	email: string;
	message: string;
}

export function useBooking() {
	const locale = useLocale();
	const t = useTranslations("consultation");
	const userTimezone = useTimezone();

	const [step, setStep] = useState<BookingStep>(1);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);

	const [formData, setFormData] = useState<BookingFormData>({
		firstName: "",
		lastName: "",
		email: "",
		message: "",
	});

	// Using keyof BookingFormData ensures 'field' is never 'any'
	const updateField = (field: keyof BookingFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleConfirm = async () => {
		// Validation logic
		if (!selectedDate || !selectedSlot) {
			return toast.error(t("booking.errorDateTime"));
		}
		if (!formData.firstName || !formData.lastName || !formData.email) {
			return toast.error(t("booking.errorFields"));
		}

		setLoading(true);
		try {
			const res = await fetch("/api/free-consultation/book", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-locale": locale,
				},
				body: JSON.stringify({
					...formData,
					// Use optional chaining or defaults if these might be null
					date: selectedSlot.jstDate,
					time: selectedSlot.jstTime,
					timezone: userTimezone,
				}),
			});

			if (!res.ok) throw new Error("Booking failed");

			setSuccess("book");
			toast.success(t("booking.success"));
		} catch {
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
		success,
		handleConfirm,
		userTimezone,
	};
}

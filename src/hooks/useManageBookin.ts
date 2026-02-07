import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Booking, TimeSlot, ManageBookingResponse } from "@/src/types/booking";
import { useTimezone } from "./useTimezone";

export function useManageBooking() {
	const t = useTranslations("consultation");
	const locale = useLocale();
	const { token } = useParams<{ token: string }>();
	const userTimezone = useTimezone();

	const [loading, setLoading] = useState(true);
	const [booking, setBooking] = useState<Booking | null>(null);
	const [canReschedule, setCanReschedule] = useState(false);
	const [canCancel, setCanCancel] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<"reschedule" | "cancel" | null>(null);

	useEffect(() => {
		const fetchBooking = async () => {
			try {
				const res = await fetch(`/api/free-consultation/manage/${token}`);
				if (!res.ok) throw new Error(t("errors.fetchBookingFailed"));
				const data: ManageBookingResponse = await res.json();
				setBooking(data.booking);
				setCanReschedule(data.canReschedule);
				setCanCancel(data.canCancel);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		if (token) fetchBooking();
	}, [token, t]);

	// Update the signature to accept 'data' instead of 'selectedSlot'
	const handleAction = async (
		type: "reschedule" | "cancel",
		data?: { date: string; time: string }, // Changed from TimeSlot to simple object
	) => {
		setSubmitting(true);
		try {
			const res = await fetch(`/api/free-consultation/manage/${token}/${type}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-locale": locale,
				},
				// Logic change: Use the 'data' passed from the page
				body:
					type === "reschedule" && data
						? JSON.stringify({
								date: data.date,
								time: data.time,
								timezone: userTimezone,
							})
						: null,
			});

			if (!res.ok) {
				const errorRes = await res.json();
				throw new Error(errorRes.error || "Request failed");
			}

			setSuccess(type);
		} catch (err: any) {
			toast.error(err.message || t("errors.requestFailed"));
		} finally {
			setSubmitting(false);
		}
	};

	return {
		loading,
		booking,
		canReschedule,
		canCancel,
		error,
		submitting,
		success,
		handleAction,
		userTimezone,
	};
}

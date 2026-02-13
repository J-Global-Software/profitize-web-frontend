import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Booking, ManageBookingResponse } from "@/src/types/bookingFrontend";
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
			} catch (err) {
				// Type narrowing for unknown error
				const errorMessage = err instanceof Error ? err.message : t("errors.fetchBookingFailed");
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};
		if (token) fetchBooking();
	}, [token, t]);

	const handleAction = async (type: "reschedule" | "cancel", data?: { date: string; time: string }) => {
		setSubmitting(true);
		try {
			const res = await fetch(`/api/free-consultation/manage/${token}/${type}`, {
				method: type === "reschedule" ? "POST" : "GET",
				headers: {
					"Content-Type": "application/json",
					"x-locale": locale,
				},
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
				// Explicitly typing the error response
				const errorRes: { error?: string } = await res.json();
				throw new Error(errorRes.error || "Request failed");
			}

			setSuccess(type);
		} catch (err) {
			// Type narrowing for toast notification
			const errorMessage = err instanceof Error ? err.message : t("errors.requestFailed");
			toast.error(errorMessage);
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

import { useState, useEffect } from "react";

export function useTimezone() {
	const [timezone, setTimezone] = useState<string>("Asia/Tokyo");

	useEffect(() => {
		try {
			const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			setTimezone(tz || "Asia/Tokyo");
		} catch (e) {
			console.error("Timezone detection failed", e);
		}
	}, []);

	return timezone;
}

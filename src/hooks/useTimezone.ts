import { useState } from "react";

export function useTimezone() {
	// We use a "lazy initializer" function inside useState
	const [timezone] = useState<string>(() => {
		try {
			return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tokyo";
		} catch (e) {
			console.error("Timezone detection failed", e);
			return "Asia/Tokyo";
		}
	});

	return timezone;
}

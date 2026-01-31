export interface ContactPayload {
	firstName: string;
	lastName: string;
	email: string;
	message: string;
	company?: string; // honeypot
}

export async function submitContactMessage(payload: ContactPayload) {
	const res = await fetch("/api/contact", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data?.error ?? "Something went wrong");
	}

	return data as { success: true };
}

export function getCookie(req: Request, name: string): string | undefined {
	const cookieHeader = req.headers.get("cookie") ?? "";
	const match = cookieHeader.match(new RegExp(`(^| )${name}=([^;]+)`));
	return match ? decodeURIComponent(match[2]) : undefined;
}

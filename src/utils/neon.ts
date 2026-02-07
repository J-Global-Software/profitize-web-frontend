import { neon } from "@neondatabase/serverless";

// Create the connection pooler instance
const sql = neon(process.env.DATABASE_URL!);

export async function query<T extends Record<string, any> = any>(text: string, params?: any[]) {
	// ✅ Use .query() for manual text + array parameters
	// This avoids the 'Object literal' / 'timezone' error
	const rows = await sql.query(text, params || []);

	// Return in the format your app expects
	return { rows: rows as T[] };
}

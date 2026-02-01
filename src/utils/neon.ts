import { neon, QueryResult, QueryResultRow } from "@neondatabase/serverless";

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
	const sql = neon(process.env.DATABASE_URL!, { fullResults: true });
	// @ts-expect-error - params type mismatch between neon and pg
	const result = await sql(text, params);
	return result as unknown as QueryResult<T>;
}

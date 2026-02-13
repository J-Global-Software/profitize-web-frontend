import { Pool, QueryResultRow } from "@neondatabase/serverless";

// 1. Initialize the Pool (Singleton)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Executes a SQL query with full type safety.
 * @template T - The expected shape of the database row, extending QueryResultRow.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<{ rows: T[]; rowCount: number | null }> {
	// 2. Execute the query using the Pool's native text/params support
	const result = await pool.query<T>(text, params);

	// 3. Return the typed rows and the count of affected rows
	return {
		rows: result.rows,
		rowCount: result.rowCount,
	};
}

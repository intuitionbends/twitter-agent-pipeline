import { pool } from "./pool.js";

/**
 * Execute a SQL query and return all rows.
 * Uses parameterized queries to prevent SQL injection.
 *
 * @example
 * const users = await query<User>('SELECT * FROM users WHERE active = $1', [true]);
 */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

/**
 * Execute a SQL query and return the first row or null.
 *
 * @example
 * const user = await queryOne<User>('SELECT * FROM users WHERE id = $1', [id]);
 */
export async function queryOne<T>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/**
 * Execute a SQL query that doesn't return rows (INSERT, UPDATE, DELETE).
 * Returns the number of affected rows.
 *
 * @example
 * const count = await execute('DELETE FROM users WHERE active = $1', [false]);
 */
export async function execute(text: string, params?: unknown[]): Promise<number> {
  const result = await pool.query(text, params);
  return result.rowCount ?? 0;
}

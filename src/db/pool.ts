import { Pool } from "pg";
import "dotenv/config";

/**
 * PostgreSQL connection pool with singleton pattern.
 * Cached on globalThis to survive hot-reload (dev) and share across
 * Vercel serverless invocations within the same process (prod).
 */

const globalForPg = globalThis as unknown as {
  pool: Pool | undefined;
};

const isServerless = !!process.env.VERCEL;

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
    max: isServerless ? 3 : 10,
    idleTimeoutMillis: isServerless ? 10000 : 30000,
    connectionTimeoutMillis: 10000,
  });

// Handle pool errors to prevent silent failures
pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

// Always cache — survives hot-reload in dev and re-use in serverless
globalForPg.pool = pool;

/**
 * Check if database is configured.
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

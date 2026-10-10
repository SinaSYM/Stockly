import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const globalDb = globalThis as typeof globalThis & { stocklyDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (globalDb.stocklyDb) return globalDb.stocklyDb;
  const directory = process.env.STOCKLY_DATA_DIR || join(process.cwd(), ".data");
  mkdirSync(directory, { recursive: true });
  const db = new DatabaseSync(join(directory, "stockly.sqlite"), { timeout: 5000 });
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL, price INTEGER NOT NULL CHECK(price >= 0),
      stock INTEGER NOT NULL CHECK(stock >= 0), threshold INTEGER NOT NULL CHECK(threshold >= 0),
      color TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS products_user_idx ON products(user_id);
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL,
      items_json TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders(user_id, created_at DESC);
  `);
  globalDb.stocklyDb = db;
  return db;
}

export function transaction<T>(work: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try { const result = work(db); db.exec("COMMIT"); return result; }
  catch (error) { db.exec("ROLLBACK"); throw error; }
}

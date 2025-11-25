import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export function createDatabase(dbPath?: string): Database.Database {
  const resolvedPath =
    dbPath ?? path.join(process.cwd(), "data", "oripheon.db");
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  const db = new Database(resolvedPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS avatars (
      id TEXT PRIMARY KEY,
      seed INTEGER NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  return db;
}

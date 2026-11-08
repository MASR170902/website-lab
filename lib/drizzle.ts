import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import * as schema from './schema';

const dbPath = path.join(process.cwd(), 'data', 'school.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

export const sqlite = globalForDb.sqlite ?? new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

try {
  sqlite.exec('ALTER TABLE organization_members ADD COLUMN role TEXT');
} catch {}
try {
  sqlite.exec('ALTER TABLE organization_members ADD COLUMN group_title TEXT');
} catch {}

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });

import Database from "better-sqlite3";
import path from "path";

/**
 * Koneksi database SQLite untuk development.
 * Untuk production, ganti layer ini ke PostgreSQL (mis. pakai `pg` atau Prisma
 * dengan provider postgresql) — struktur query di repository layer (src/lib/*Repository.ts)
 * dibuat sesederhana mungkin supaya gampang di-porting.
 */
const DB_PATH = process.env.DATABASE_PATH ?? path.join(__dirname, "../../dev.db");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

/**
 * Jalankan sekali saat startup: bikin tabel kalau belum ada.
 * Tahap 1: hanya tabel `users`.
 * Tahap berikutnya (katalog, watch party) akan menambah migrasi baru di sini.
 */
export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Tahap 2: katalog Cinema (movie/series) & Music (track/album)
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('movie', 'series', 'track', 'album')),
      title TEXT NOT NULL,
      subtitle TEXT,
      poster_url TEXT NOT NULL,
      duration_seconds INTEGER,
      stream_url TEXT,
      genre TEXT, -- JSON array string, mis. '["Drama","Misteri"]'
      release_year INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Tahap 4: Watch Party rooms. Status "live" & jumlah member dihitung real-time
    -- dari koneksi WebSocket aktif (lihat watchPartyRegistry.ts), bukan dari tabel ini.
    CREATE TABLE IF NOT EXISTS watch_party_rooms (
      id TEXT PRIMARY KEY,
      host_id TEXT NOT NULL,
      host_name TEXT NOT NULL,
      media_id TEXT NOT NULL,
      media_title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (media_id) REFERENCES media(id)
    );
  `);
}

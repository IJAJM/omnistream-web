import { Pool } from "pg";

/**
 * Koneksi PostgreSQL (Supabase). Semua query di seluruh backend jalan lewat
 * pool ini. SSL diaktifkan karena Supabase mewajibkan koneksi terenkripsi.
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Jalankan sekali saat startup: bikin tabel kalau belum ada.
 * Aman dijalankan berkali-kali (pakai IF NOT EXISTS).
 */
export async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Jaga-jaga kalau tabel users sudah ada dari sebelum kolom ini ditambahkan
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

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
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Tahap 4: Watch Party rooms. Status "live" & jumlah member dihitung real-time
    -- dari koneksi WebSocket aktif (lihat watchPartyRegistry.ts), bukan dari tabel ini.
    CREATE TABLE IF NOT EXISTS watch_party_rooms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      host_id UUID NOT NULL,
      host_name TEXT NOT NULL,
      media_id TEXT NOT NULL,
      media_title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY (media_id) REFERENCES media(id)
    );
  `);
}

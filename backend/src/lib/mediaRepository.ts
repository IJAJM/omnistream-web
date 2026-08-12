import { db } from "./db";

export type MediaType = "movie" | "series" | "track" | "album";

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  subtitle: string | null;
  poster_url: string;
  duration_seconds: number | null;
  stream_url: string | null;
  genre: string | null; // disimpan sebagai JSON string array di DB
  release_year: number | null;
}

// Bentuk yang dikirim ke frontend (camelCase, genre sudah jadi array).
export interface MediaItemResponse {
  id: string;
  type: MediaType;
  title: string;
  subtitle?: string;
  posterUrl: string;
  durationSeconds?: number;
  streamUrl?: string;
  genre?: string[];
  releaseYear?: number;
}

function toResponse(row: MediaItem): MediaItemResponse {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    posterUrl: row.poster_url,
    durationSeconds: row.duration_seconds ?? undefined,
    streamUrl: row.stream_url ?? undefined,
    genre: row.genre ? JSON.parse(row.genre) : undefined,
    releaseYear: row.release_year ?? undefined,
  };
}

export const mediaRepository = {
  findByTypes(types: MediaType[]): MediaItemResponse[] {
    const placeholders = types.map(() => "?").join(",");
    const rows = db
      .prepare(`SELECT * FROM media WHERE type IN (${placeholders}) ORDER BY created_at DESC`)
      .all(...types) as MediaItem[];
    return rows.map(toResponse);
  },

  findById(id: string): MediaItemResponse | undefined {
    const row = db.prepare("SELECT * FROM media WHERE id = ?").get(id) as MediaItem | undefined;
    return row ? toResponse(row) : undefined;
  },

  // Ambil beberapa item teratas per tipe, dipakai buat feed home (trending).
  findTrending(types: MediaType[], limit: number): MediaItemResponse[] {
    const placeholders = types.map(() => "?").join(",");
    const rows = db
      .prepare(`SELECT * FROM media WHERE type IN (${placeholders}) ORDER BY created_at DESC LIMIT ?`)
      .all(...types, limit) as MediaItem[];
    return rows.map(toResponse);
  },

  /** Dipanggil setelah file berhasil di-upload ke storage. Simpan nama file relatifnya. */
  setStreamFile(id: string, relativeFilename: string, durationSeconds?: number) {
    db.prepare(`UPDATE media SET stream_url = ?, duration_seconds = COALESCE(?, duration_seconds) WHERE id = ?`)
      .run(relativeFilename, durationSeconds ?? null, id);
  },

  /** Ambil raw row (butuh stream_url asli, bukan yang sudah diformat) buat keperluan streaming. */
  findRawById(id: string): MediaItem | undefined {
    return db.prepare("SELECT * FROM media WHERE id = ?").get(id) as MediaItem | undefined;
  },
};

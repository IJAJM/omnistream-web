import { pool } from "./db";

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
  async findByTypes(types: MediaType[]): Promise<MediaItemResponse[]> {
    const { rows } = await pool.query<MediaItem>(
      `SELECT * FROM media WHERE type = ANY($1) ORDER BY created_at DESC`,
      [types]
    );
    return rows.map(toResponse);
  },

  async findById(id: string): Promise<MediaItemResponse | undefined> {
    const { rows } = await pool.query<MediaItem>("SELECT * FROM media WHERE id = $1", [id]);
    return rows[0] ? toResponse(rows[0]) : undefined;
  },

  async findTrending(types: MediaType[], limit: number): Promise<MediaItemResponse[]> {
    const { rows } = await pool.query<MediaItem>(
      `SELECT * FROM media WHERE type = ANY($1) ORDER BY created_at DESC LIMIT $2`,
      [types, limit]
    );
    return rows.map(toResponse);
  },

  /** Dipanggil setelah file berhasil di-upload ke storage. Simpan nama file relatifnya. */
  async setStreamFile(id: string, relativeFilename: string, durationSeconds?: number): Promise<void> {
    await pool.query(
      `UPDATE media SET stream_url = $1, duration_seconds = COALESCE($2, duration_seconds) WHERE id = $3`,
      [relativeFilename, durationSeconds ?? null, id]
    );
  },

  /** Ambil raw row (butuh stream_url asli, bukan yang sudah diformat) buat keperluan streaming. */
  async findRawById(id: string): Promise<MediaItem | undefined> {
    const { rows } = await pool.query<MediaItem>("SELECT * FROM media WHERE id = $1", [id]);
    return rows[0];
  },

  async create(input: {
    id: string;
    type: MediaType;
    title: string;
    subtitle?: string;
    posterUrl: string;
    genre?: string[];
    releaseYear?: number;
  }): Promise<MediaItemResponse> {
    const { rows } = await pool.query<MediaItem>(
      `INSERT INTO media (id, type, title, subtitle, poster_url, genre, release_year)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        input.id,
        input.type,
        input.title,
        input.subtitle ?? null,
        input.posterUrl,
        JSON.stringify(input.genre ?? []),
        input.releaseYear ?? null,
      ]
    );
    return toResponse(rows[0]);
  },

  async update(
    id: string,
    input: Partial<{ title: string; subtitle: string; posterUrl: string; genre: string[]; releaseYear: number }>
  ): Promise<MediaItemResponse | undefined> {
    const existing = await pool.query<MediaItem>("SELECT * FROM media WHERE id = $1", [id]);
    if (!existing.rows[0]) return undefined;

    const current = existing.rows[0];
    const { rows } = await pool.query<MediaItem>(
      `UPDATE media SET title = $1, subtitle = $2, poster_url = $3, genre = $4, release_year = $5 WHERE id = $6 RETURNING *`,
      [
        input.title ?? current.title,
        input.subtitle ?? current.subtitle,
        input.posterUrl ?? current.poster_url,
        input.genre ? JSON.stringify(input.genre) : current.genre,
        input.releaseYear ?? current.release_year,
        id,
      ]
    );
    return toResponse(rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM media WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },
};

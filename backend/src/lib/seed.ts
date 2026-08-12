import "dotenv/config";
import { db, runMigrations } from "./db";

runMigrations();

const cinemaItems = [
  { id: "c1", type: "series", title: "Senja di Kota Tua", subtitle: "Series • 2025", posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400", releaseYear: 2025, genre: ["Drama", "Misteri"] },
  { id: "c2", type: "movie", title: "Ombak Terakhir", subtitle: "Film • 2024", posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400", releaseYear: 2024, genre: ["Drama"] },
  { id: "c3", type: "series", title: "Rahasia Gunung Es", subtitle: "Series • 2025", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400", releaseYear: 2025, genre: ["Thriller", "Misteri"] },
  { id: "c4", type: "movie", title: "Jalan Pulang", subtitle: "Film • 2023", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400", releaseYear: 2023, genre: ["Drama", "Keluarga"] },
  { id: "c5", type: "series", title: "Lorong Waktu", subtitle: "Series • 2024", posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400", releaseYear: 2024, genre: ["Sci-Fi"] },
] as const;

const musicItems = [
  { id: "m1", type: "track", title: "Cahaya Kota", subtitle: "Rentang Senja", posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", genre: ["Pop", "Indie"] },
  { id: "m2", type: "track", title: "Malam Ini", subtitle: "Studio Kelana", posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400", genre: ["Electronic"] },
  { id: "m3", type: "album", title: "Ruang Tunggu", subtitle: "Aksara Biru", posterUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400", genre: ["Folk"] },
  { id: "m4", type: "track", title: "Pulang", subtitle: "Nada Lembayung", posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", genre: ["Pop"] },
  { id: "m5", type: "album", title: "Serupa Ombak", subtitle: "Kolase Senja", posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400", genre: ["Indie"] },
] as const;

const insert = db.prepare(`
  INSERT OR REPLACE INTO media (id, type, title, subtitle, poster_url, duration_seconds, stream_url, genre, release_year)
  VALUES (@id, @type, @title, @subtitle, @posterUrl, @durationSeconds, @streamUrl, @genre, @releaseYear)
`);

const seedAll = db.transaction(() => {
  for (const item of [...cinemaItems, ...musicItems]) {
    insert.run({
      id: item.id,
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      posterUrl: item.posterUrl,
      durationSeconds: "durationSeconds" in item ? (item as { durationSeconds?: number }).durationSeconds ?? null : null,
      streamUrl: null, // diisi di Tahap 3 pas sistem streaming sudah ada
      genre: JSON.stringify(item.genre ?? []),
      releaseYear: "releaseYear" in item ? (item as { releaseYear?: number }).releaseYear ?? null : null,
    });
  }
});

seedAll();
console.log(`Seed selesai: ${cinemaItems.length} item cinema, ${musicItems.length} item music.`);

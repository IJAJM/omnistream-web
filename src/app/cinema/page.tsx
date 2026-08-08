import { Card } from "@/components/ui/Card";

// Ganti dengan `await api.getCinemaCatalog()` (server component, sudah async-ready).
const catalog = [
  { id: "c1", title: "Senja di Kota Tua", subtitle: "Series • 2025", posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
  { id: "c2", title: "Ombak Terakhir", subtitle: "Film • 2024", posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400" },
  { id: "c3", title: "Rahasia Gunung Es", subtitle: "Series • 2025", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: "c4", title: "Jalan Pulang", subtitle: "Film • 2023", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: "c5", title: "Lorong Waktu", subtitle: "Series • 2024", posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
];

export default function CinemaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 font-display text-3xl">Cinema</h1>
      <p className="mb-6 text-muted">Katalog film & series — pilih judul buat mulai nonton.</p>
      <div className="divider-strip divider-strip--marquee mb-8 w-32" />

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {catalog.map((item) => (
          <Card key={item.id} href={`/cinema/${item.id}`} accent="marquee" {...item} />
        ))}
      </div>
    </div>
  );
}

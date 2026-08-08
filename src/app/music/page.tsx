import { Card } from "@/components/ui/Card";

// Ganti dengan `await api.getMusicCatalog()`.
const catalog = [
  { id: "m1", title: "Cahaya Kota", subtitle: "Rentang Senja", posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" },
  { id: "m2", title: "Malam Ini", subtitle: "Studio Kelana", posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400" },
  { id: "m3", title: "Ruang Tunggu", subtitle: "Aksara Biru", posterUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400" },
  { id: "m4", title: "Pulang", subtitle: "Nada Lembayung", posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" },
  { id: "m5", title: "Serupa Ombak", subtitle: "Kolase Senja", posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400" },
];

export default function MusicPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 font-display text-3xl">Music</h1>
      <p className="mb-6 text-muted">Album & lagu — putar dan lanjut ke halaman manapun tanpa berhenti.</p>
      <div className="divider-strip divider-strip--frequency mb-8 w-32" />

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {catalog.map((item) => (
          <Card key={item.id} href={`/music/${item.id}`} accent="frequency" {...item} />
        ))}
      </div>
    </div>
  );
}

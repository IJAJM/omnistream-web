import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Data contoh — ganti dengan `api.getHomeFeed()` waktu backend udah siap.
const trendingCinema = [
  { id: "c1", title: "Senja di Kota Tua", subtitle: "Series • 2025", posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
  { id: "c2", title: "Ombak Terakhir", subtitle: "Film • 2024", posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400" },
  { id: "c3", title: "Rahasia Gunung Es", subtitle: "Series • 2025", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
];

const trendingMusic = [
  { id: "m1", title: "Cahaya Kota", subtitle: "Rentang Senja", posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" },
  { id: "m2", title: "Malam Ini", subtitle: "Studio Kelana", posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400" },
  { id: "m3", title: "Ruang Tunggu", subtitle: "Aksara Biru", posterUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="flex flex-col items-start gap-6 py-20">
        <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
          Nonton. Dengerin. <span className="text-marquee">Bareng</span>{" "}
          <span className="text-frequency">real-time.</span>
        </h1>
        <p className="max-w-lg text-muted">
          OmniStream nyatuin katalog film, series, dan musik dalam satu ruang — plus watch party
          buat nonton dan dengerin bareng temen kapan aja.
        </p>
        <div className="flex gap-3">
          <Link href="/cinema"><Button variant="marquee">Jelajahi Cinema</Button></Link>
          <Link href="/music"><Button variant="frequency">Jelajahi Music</Button></Link>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trending di Cinema</h2>
          <Link href="/cinema" className="text-sm text-marquee hover:underline">Lihat semua</Link>
        </div>
        <div className="divider-strip divider-strip--marquee mb-6 w-24" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {trendingCinema.map((item) => (
            <Card key={item.id} href={`/cinema/${item.id}`} accent="marquee" {...item} />
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trending di Music</h2>
          <Link href="/music" className="text-sm text-frequency hover:underline">Lihat semua</Link>
        </div>
        <div className="divider-strip divider-strip--frequency mb-6 w-24" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {trendingMusic.map((item) => (
            <Card key={item.id} href={`/music/${item.id}`} accent="frequency" {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}

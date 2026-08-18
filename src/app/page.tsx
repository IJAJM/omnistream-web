import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export const revalidate = 30; // re-fetch katalog dari backend tiap 30 detik

export default async function HomePage() {
  let trendingCinema: Awaited<ReturnType<typeof api.getHomeFeed>>["cinema"] = [];
  let trendingMusic: Awaited<ReturnType<typeof api.getHomeFeed>>["music"] = [];
  let fetchError = false;

  try {
    const feed = await api.getHomeFeed();
    trendingCinema = feed.cinema;
    trendingMusic = feed.music;
  } catch {
    fetchError = true;
  }

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

      {fetchError && (
        <p className="mb-6 rounded-md border border-white/10 bg-ink-soft px-4 py-3 text-sm text-muted">
          Nggak bisa ambil data katalog dari server sekarang. Coba refresh beberapa saat lagi.
        </p>
      )}

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

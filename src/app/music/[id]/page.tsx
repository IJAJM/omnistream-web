"use client";

import Image from "next/image";
import { Play, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAudio } from "@/hooks/useAudio";
import type { MediaItem } from "@/lib/api";

// Ganti dengan `api.getMusicDetail(params.id)` lewat server component + props drilling,
// atau fetch client-side kalau butuh interaktivitas penuh seperti di sini.
function getDetail(id: string): MediaItem {
  return {
    id,
    type: "album",
    title: "Cahaya Kota",
    subtitle: "Rentang Senja",
    posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    streamUrl: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", // contoh audio publik
    genre: ["Indie", "Folk"],
    releaseYear: 2025,
  };
}

export default function MusicDetailPage({ params }: { params: { id: string } }) {
  const media = getDetail(params.id);
  const { play, currentTrack, isPlaying } = useAudio();
  const isCurrent = currentTrack?.id === media.id && isPlaying;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-2xl">
          <Image src={media.posterUrl} alt={media.title} fill className="object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Album</p>
          <h1 className="font-display text-4xl">{media.title}</h1>
          <p className="mt-1 text-muted">{media.subtitle} • {media.releaseYear}</p>
          <div className="mt-4 flex gap-3">
            <Button variant="frequency" onClick={() => play(media)}>
              <Play size={16} /> {isCurrent ? "Sedang diputar" : "Putar"}
            </Button>
            <Link href={`/watchparty?media=${media.id}`}>
              <Button variant="outline">
                <Users size={16} /> Dengerin Bareng
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="divider-strip divider-strip--frequency my-8 w-32" />
      <p className="max-w-2xl text-paper/90">
        Album ini mengangkat suasana kota di jam-jam senja — instrumen akustik berlapis synth
        lembut, cocok didengarkan sambil nemenin obrolan santai.
      </p>
    </div>
  );
}

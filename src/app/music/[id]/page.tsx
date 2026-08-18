"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Play, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAudio } from "@/hooks/useAudio";
import { api, type MediaItem } from "@/lib/api";

export default function MusicDetailPage({ params }: { params: { id: string } }) {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [error, setError] = useState(false);
  const { play, currentTrack, isPlaying } = useAudio();

  useEffect(() => {
    api
      .getMusicDetail(params.id)
      .then(setMedia)
      .catch(() => setError(true));
  }, [params.id]);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 text-muted">
        Lagu/album nggak ditemukan.
      </div>
    );
  }

  if (!media) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 text-muted">
        Memuat…
      </div>
    );
  }

  const isCurrent = currentTrack?.id === media.id && isPlaying;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-2xl">
          <Image src={media.posterUrl} alt={media.title} fill className="object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {media.type === "album" ? "Album" : "Lagu"}
          </p>
          <h1 className="font-display text-4xl">{media.title}</h1>
          <p className="mt-1 text-muted">{media.subtitle} • {media.releaseYear}</p>
          <div className="mt-4 flex gap-3">
            <Button variant="frequency" onClick={() => play(media)} disabled={!media.streamUrl}>
              <Play size={16} /> {isCurrent ? "Sedang diputar" : media.streamUrl ? "Putar" : "Belum ada audio"}
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
      {media.genre && media.genre.length > 0 && (
        <p className="text-sm text-muted">Genre: {media.genre.join(", ")}</p>
      )}
    </div>
  );
}

import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";

export default async function CinemaDetailPage({ params }: { params: { id: string } }) {
  let media;
  try {
    media = await api.getCinemaDetail(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {media.streamUrl ? (
        <VideoPlayer src={media.streamUrl} poster={media.posterUrl} title={media.title} />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-ink-soft text-muted">
          Video belum tersedia untuk judul ini.
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl">{media.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {media.releaseYear} • {(media.genre ?? []).join(", ")}
          </p>
          {media.subtitle && <p className="mt-4 max-w-2xl text-paper/90">{media.subtitle}</p>}
        </div>
        <Link href={`/watchparty?media=${media.id}`}>
          <Button variant="outline">
            <Users size={16} /> Mulai Watch Party
          </Button>
        </Link>
      </div>
    </div>
  );
}

import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { Users } from "lucide-react";
import Link from "next/link";

// Ganti dengan `await api.getCinemaDetail(params.id)`.
async function getDetail(id: string) {
  return {
    id,
    title: "Senja di Kota Tua",
    description:
      "Seorang arsitek muda kembali ke kota kelahirannya buat merestorasi gedung tua peninggalan keluarganya, sambil membongkar rahasia yang terkubur selama tiga dekade.",
    genre: ["Drama", "Misteri"],
    releaseYear: 2025,
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // contoh stream HLS publik
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200",
  };
}

export default async function CinemaDetailPage({ params }: { params: { id: string } }) {
  const media = await getDetail(params.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <VideoPlayer src={media.streamUrl} poster={media.posterUrl} title={media.title} />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl">{media.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {media.releaseYear} • {media.genre.join(", ")}
          </p>
          <p className="mt-4 max-w-2xl text-paper/90">{media.description}</p>
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

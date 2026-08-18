import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";

export const revalidate = 30;

export default async function MusicPage() {
  let catalog: Awaited<ReturnType<typeof api.getMusicCatalog>> = [];
  let fetchError = false;

  try {
    catalog = await api.getMusicCatalog();
  } catch {
    fetchError = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 font-display text-3xl">Music</h1>
      <p className="mb-6 text-muted">Album & lagu — putar dan lanjut ke halaman manapun tanpa berhenti.</p>
      <div className="divider-strip divider-strip--frequency mb-8 w-32" />

      {fetchError && (
        <p className="mb-6 rounded-md border border-white/10 bg-ink-soft px-4 py-3 text-sm text-muted">
          Nggak bisa ambil katalog dari server sekarang. Coba refresh beberapa saat lagi.
        </p>
      )}
      {!fetchError && catalog.length === 0 && (
        <p className="mb-6 text-sm text-muted">Belum ada lagu/album di katalog.</p>
      )}

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {catalog.map((item) => (
          <Card key={item.id} href={`/music/${item.id}`} accent="frequency" {...item} />
        ))}
      </div>
    </div>
  );
}

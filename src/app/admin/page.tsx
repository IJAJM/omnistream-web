"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api, getToken, type MediaItem, type MediaType, type CurrentUser } from "@/lib/api";

const emptyForm = {
  type: "movie" as MediaType,
  title: "",
  subtitle: "",
  posterUrl: "",
  genre: "",
  releaseYear: "",
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api
      .getMe()
      .then((me) => {
        if (!me.isAdmin) {
          router.replace("/");
          return;
        }
        setUser(me);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false));
  }, [router]);

  async function loadItems() {
    setLoadingItems(true);
    try {
      const [cinema, music] = await Promise.all([api.getCinemaCatalog(), api.getMusicCatalog()]);
      setItems([...cinema, ...music]);
    } catch {
      setError("Gagal memuat daftar konten.");
    } finally {
      setLoadingItems(false);
    }
  }

  useEffect(() => {
    if (user) loadItems();
  }, [user]);

  function startEdit(item: MediaItem) {
    setEditingId(item.id);
    setForm({
      type: item.type,
      title: item.title,
      subtitle: item.subtitle ?? "",
      posterUrl: item.posterUrl,
      genre: (item.genre ?? []).join(", "),
      releaseYear: item.releaseYear ? String(item.releaseYear) : "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      type: form.type,
      title: form.title,
      subtitle: form.subtitle || undefined,
      posterUrl: form.posterUrl,
      genre: form.genre ? form.genre.split(",").map((g) => g.trim()).filter(Boolean) : undefined,
      releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
    };

    try {
      if (editingId) {
        await api.updateMedia(editingId, payload);
      } else {
        await api.createMedia(payload);
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Gagal menyimpan. Cek lagi form-nya.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin mau hapus konten ini?")) return;
    try {
      await api.deleteMedia(id);
      await loadItems();
    } catch {
      setError("Gagal menghapus.");
    }
  }

  if (checking) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-muted sm:px-6">Memeriksa akses…</div>;
  }
  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl">Admin — Kelola Konten</h1>
      <p className="mt-1 text-muted">Tambah, edit, atau hapus film, series, lagu, dan album.</p>
      <div className="divider-strip divider-strip--frequency my-6 w-32" />

      <form onSubmit={handleSubmit} className="mb-10 space-y-4 rounded-lg border border-white/10 bg-ink-soft p-5">
        <h2 className="font-medium">{editingId ? "Edit Konten" : "Tambah Konten Baru"}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted">Tipe</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as MediaType })}
              disabled={!!editingId}
              className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-paper outline-none focus:border-frequency disabled:opacity-50"
            >
              <option value="movie">Film</option>
              <option value="series">Series</option>
              <option value="track">Lagu</option>
              <option value="album">Album</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Tahun Rilis</label>
            <input
              type="number"
              value={form.releaseYear}
              onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-paper outline-none focus:border-frequency"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Judul</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-paper outline-none focus:border-frequency"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Subjudul / Artis</label>
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-paper outline-none focus:border-frequency"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-muted">URL Poster</label>
            <input
              required
              type="url"
              value={form.posterUrl}
              onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-paper outline-none focus:border-frequency"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-muted">Genre (pisah pakai koma)</label>
            <input
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              placeholder="Drama, Misteri"
              className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-paper outline-none focus:border-frequency"
            />
          </div>
        </div>

        {error && <p className="text-sm text-marquee">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="frequency" disabled={saving}>
            {saving ? "Menyimpan…" : editingId ? "Simpan Perubahan" : (
              <>
                <Plus size={16} /> Tambah Konten
              </>
            )}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Batal
            </Button>
          )}
        </div>
      </form>

      <h2 className="mb-4 font-medium">Semua Konten ({items.length})</h2>
      {loadingItems ? (
        <p className="text-muted">Memuat…</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-ink-soft px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted">
                  {item.type} • {item.subtitle} {item.releaseYear ? `• ${item.releaseYear}` : ""}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => startEdit(item)}
                  aria-label="Edit"
                  className="rounded-md p-2 text-muted hover:bg-white/5 hover:text-paper"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label="Hapus"
                  className="rounded-md p-2 text-muted hover:bg-white/5 hover:text-marquee"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

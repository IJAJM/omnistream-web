"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.register(name, email, password);
      window.location.href = "/";
    } catch {
      setError("Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-display text-3xl">Buat Akun Baru</h1>
      <p className="mt-1 text-muted">Satu akun buat cinema, music, dan watch party.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm text-muted">Nama</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-ink-soft px-3 py-2 text-paper outline-none focus:border-frequency"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-muted">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-ink-soft px-3 py-2 text-paper outline-none focus:border-frequency"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-muted">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-ink-soft px-3 py-2 text-paper outline-none focus:border-frequency"
          />
        </div>

        {error && <p className="text-sm text-marquee">{error}</p>}

        <Button type="submit" variant="frequency" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Daftar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-marquee hover:underline">Masuk</Link>
      </p>
    </div>
  );
}

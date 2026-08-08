import { clsx, type ClassValue } from "clsx";

/** Gabungin class names dengan aman, skip falsy values. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format detik jadi "mm:ss" atau "hh:mm:ss" buat player. */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Truncate teks panjang buat card/caption. */
export function truncate(text: string, max = 90): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

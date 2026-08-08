/**
 * Konfigurasi koneksi API OmniStream.
 * Ganti NEXT_PUBLIC_API_BASE_URL di .env.local sesuai backend lo.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export type MediaType = "movie" | "series" | "track" | "album";

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  subtitle?: string;
  posterUrl: string;
  durationSeconds?: number;
  streamUrl?: string; // .m3u8 buat video, .mp3/.aac buat audio
  genre?: string[];
  releaseYear?: number;
}

export interface WatchPartyRoom {
  id: string;
  hostName: string;
  mediaId: string;
  memberCount: number;
  isLive: boolean;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    throw new ApiError(`Request gagal: ${res.status} ${res.statusText}`, res.status);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getHomeFeed: () => request<{ cinema: MediaItem[]; music: MediaItem[] }>("/home"),
  getCinemaCatalog: () => request<MediaItem[]>("/cinema"),
  getCinemaDetail: (id: string) => request<MediaItem>(`/cinema/${id}`),
  getMusicCatalog: () => request<MediaItem[]>("/music"),
  getMusicDetail: (id: string) => request<MediaItem>(`/music/${id}`),
  getWatchPartyRooms: () => request<WatchPartyRoom[]>("/watchparty"),
  login: (email: string, password: string) =>
    request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
};

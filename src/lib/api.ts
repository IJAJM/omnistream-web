/**
 * Konfigurasi koneksi API OmniStream.
 * Ganti NEXT_PUBLIC_API_BASE_URL di .env.local sesuai backend lo.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://incredible-renewal-production-01b1.up.railway.app/api";

const TOKEN_KEY = "omnistream_token";

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
  mediaTitle: string;
  memberCount: number;
  isLive: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// ===== Token management (browser only — dipakai di client component) =====
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) {
    let message = `Request gagal: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response bukan JSON, pakai pesan default di atas
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // ===== Katalog (publik) =====
  getHomeFeed: () => request<{ cinema: MediaItem[]; music: MediaItem[] }>("/home"),
  getCinemaCatalog: () => request<MediaItem[]>("/cinema"),
  getCinemaDetail: (id: string) => request<MediaItem>(`/cinema/${id}`),
  getMusicCatalog: () => request<MediaItem[]>("/music"),
  getMusicDetail: (id: string) => request<MediaItem>(`/music/${id}`),

  // ===== Watch Party =====
  getWatchPartyRooms: () => request<WatchPartyRoom[]>("/watchparty/rooms"),
  createWatchPartyRoom: (mediaId: string) =>
    request<WatchPartyRoom>("/watchparty/rooms", {
      method: "POST",
      body: JSON.stringify({ mediaId }),
    }),

  // ===== Auth =====
  login: async (email: string, password: string) => {
    const result = await request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(result.token);
    return result;
  },
  register: async (name: string, email: string, password: string) => {
    const result = await request<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setToken(result.token);
    return result;
  },
  logout: () => clearToken(),
  getMe: () => request<CurrentUser>("/auth/me"),

  // ===== Admin (butuh login sebagai admin) =====
  createMedia: (input: {
    type: MediaType;
    title: string;
    subtitle?: string;
    posterUrl: string;
    genre?: string[];
    releaseYear?: number;
  }) => request<MediaItem>("/admin/media", { method: "POST", body: JSON.stringify(input) }),

  updateMedia: (
    id: string,
    input: Partial<{ title: string; subtitle: string; posterUrl: string; genre: string[]; releaseYear: number }>
  ) => request<MediaItem>(`/admin/media/${id}`, { method: "PUT", body: JSON.stringify(input) }),

  deleteMedia: (id: string) => request<{ message: string }>(`/admin/media/${id}`, { method: "DELETE" }),
};

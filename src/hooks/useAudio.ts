import { create } from "zustand";
import type { MediaItem } from "@/lib/api";

interface AudioState {
  currentTrack: MediaItem | null;
  isPlaying: boolean;
  queue: MediaItem[];
  play: (track: MediaItem, queue?: MediaItem[]) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
}

/**
 * Store global buat sticky AudioPlayer di layout.tsx.
 * Panggil dari halaman music manapun: `const { play } = useAudio()`.
 */
export const useAudio = create<AudioState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],

  play: (track, queue = []) =>
    set({ currentTrack: track, isPlaying: true, queue: queue.length ? queue : get().queue }),

  pause: () => set({ isPlaying: false }),

  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

  next: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = queue[(idx + 1) % queue.length];
    if (nextTrack) set({ currentTrack: nextTrack, isPlaying: true });
  },

  prev: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = queue[(idx - 1 + queue.length) % queue.length];
    if (prevTrack) set({ currentTrack: prevTrack, isPlaying: true });
  },
}));

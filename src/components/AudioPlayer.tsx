"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { formatDuration } from "@/lib/utils";

/**
 * Player musik sticky di bagian bawah layar, dipasang sekali di layout.tsx.
 * Statenya global (useAudio) supaya lagu tetap jalan walau pindah halaman.
 */
export function AudioPlayer() {
  const { currentTrack, isPlaying, toggle, next, prev } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.streamUrl) return;
    if (audio.src !== currentTrack.streamUrl) {
      audio.src = currentTrack.streamUrl;
    }
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => next();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [next]);

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setProgress(time);
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Number(e.target.value);
  }

  if (!currentTrack) return null; // sembunyi kalau belum ada lagu diputar

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/5 bg-ink/95 backdrop-blur-md">
      <div className="divider-strip divider-strip--frequency" />
      <audio ref={audioRef} />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-ink-soft">
            <Image src={currentTrack.posterUrl} alt={currentTrack.title} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">{currentTrack.title}</p>
            <p className="truncate text-xs text-muted">{currentTrack.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button onClick={prev} aria-label="Sebelumnya" className="text-muted hover:text-paper">
              <SkipBack size={18} />
            </button>
            <button
              onClick={toggle}
              aria-label={isPlaying ? "Jeda" : "Putar"}
              className="rounded-full bg-frequency p-2 text-ink hover:bg-frequency-dim"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={next} aria-label="Selanjutnya" className="text-muted hover:text-paper">
              <SkipForward size={18} />
            </button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <span className="font-mono text-[10px] text-muted">{formatDuration(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="h-1 w-full cursor-pointer accent-frequency"
              aria-label="Progress lagu"
            />
            <span className="font-mono text-[10px] text-muted">{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Volume2 size={16} className="text-muted" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            onChange={handleVolume}
            className="h-1 w-20 cursor-pointer accent-frequency"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

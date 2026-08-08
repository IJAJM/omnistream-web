"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { formatDuration, cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string; // URL .m3u8 (HLS) atau video progresif (.mp4)
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
}

/**
 * Video player kustom dengan dukungan HLS via hls.js.
 * Fallback ke native <video> di Safari yang sudah support HLS bawaan.
 */
export function VideoPlayer({ src, poster, title, autoPlay = false, className, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: import("hls.js").default | null = null;

    async function setupSource() {
      const isHls = src.endsWith(".m3u8");
      const nativeHlsSupport = video!.canPlayType("application/vnd.apple.mpegurl");

      if (isHls && !nativeHlsSupport) {
        const HlsModule = (await import("hls.js")).default;
        if (HlsModule.isSupported()) {
          hls = new HlsModule();
          hls.loadSource(src);
          hls.attachMedia(video!);
        }
      } else {
        video!.src = src;
      }
    }

    setupSource();
    return () => hls?.destroy();
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [onTimeUpdate]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setProgress(time);
  }

  function toggleFullscreen() {
    videoRef.current?.requestFullscreen?.();
  }

  return (
    <div className={cn("group relative w-full overflow-hidden rounded-lg bg-black", className)}>
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        className="aspect-video w-full"
        onClick={togglePlay}
      />

      {title && (
        <div className="pointer-events-none absolute left-0 top-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="font-display text-lg text-paper">{title}</p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full space-y-2 bg-gradient-to-t from-black/85 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="h-1 w-full cursor-pointer accent-marquee"
          aria-label="Progress video"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} aria-label={isPlaying ? "Jeda" : "Putar"} className="text-paper hover:text-marquee">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={toggleMute} aria-label={isMuted ? "Bunyikan" : "Bisukan"} className="text-paper hover:text-marquee">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <span className="font-mono text-xs text-muted">
              {formatDuration(progress)} / {formatDuration(duration)}
            </span>
          </div>
          <button onClick={toggleFullscreen} aria-label="Layar penuh" className="text-paper hover:text-marquee">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

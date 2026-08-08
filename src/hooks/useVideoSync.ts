import { RefObject, useEffect, useRef } from "react";

interface SyncPayload {
  currentTime: number;
  isPlaying: boolean;
  updatedBy: string;
}

interface UseVideoSyncOptions {
  roomId: string;
  clientId: string;
  socketUrl?: string;
  /** Toleransi drift (detik) sebelum kita paksa re-seek video lokal. */
  driftTolerance?: number;
}

/**
 * Sinkronin elemen <video>/<audio> lokal dengan state watch party dari server realtime.
 * Ganti implementasi socket sesuai backend (WebSocket / Socket.IO / Ably / dll).
 */
export function useVideoSync(
  mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>,
  { roomId, clientId, socketUrl, driftTolerance = 1.5 }: UseVideoSyncOptions
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketUrl) return;
    const ws = new WebSocket(`${socketUrl}?room=${roomId}&client=${clientId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const payload: SyncPayload = JSON.parse(event.data);
      if (payload.updatedBy === clientId) return;

      const media = mediaRef.current;
      if (!media) return;

      const drift = Math.abs(media.currentTime - payload.currentTime);
      if (drift > driftTolerance) {
        media.currentTime = payload.currentTime;
      }
      if (payload.isPlaying && media.paused) media.play().catch(() => {});
      if (!payload.isPlaying && !media.paused) media.pause();
    };

    return () => ws.close();
  }, [roomId, clientId, socketUrl, driftTolerance, mediaRef]);

  /** Broadcast state lokal ke room (dipanggil dari onPlay/onPause/onSeeked). */
  function broadcast(currentTime: number, isPlaying: boolean) {
    const payload: SyncPayload = { currentTime, isPlaying, updatedBy: clientId };
    socketRef.current?.send(JSON.stringify(payload));
  }

  return { broadcast };
}

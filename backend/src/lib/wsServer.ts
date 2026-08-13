import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { URL } from "url";
import { watchPartyRegistry, PlaybackState } from "./watchPartyRegistry";

/**
 * Pasang WebSocket server ke HTTP server yang sama dengan Express.
 * Path: /ws/watchparty?room=<roomId>&client=<clientId>
 * — persis sesuai yang dipanggil frontend di src/hooks/useVideoSync.ts
 */
export function attachWatchPartyWebSocket(httpServer: HttpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/watchparty" });

  wss.on("connection", (socket: WebSocket, req) => {
    const url = new URL(req.url ?? "", "http://localhost");
    const roomId = url.searchParams.get("room");
    const clientId = url.searchParams.get("client");

    if (!roomId || !clientId) {
      socket.close(1008, "room dan client wajib diisi di query param");
      return;
    }

    watchPartyRegistry.join(roomId, clientId, socket);

    // Client yang baru join langsung dikasih tau state terakhir (kalau ada),
    // biar dia sinkron duluan sebelum ada event play/pause/seek baru.
    const lastState = watchPartyRegistry.getLastState(roomId);
    if (lastState) {
      socket.send(JSON.stringify(lastState));
    }

    socket.on("message", (raw) => {
      let payload: PlaybackState;
      try {
        payload = JSON.parse(raw.toString());
      } catch {
        return; // abaikan pesan yang bukan JSON valid
      }
      if (
        typeof payload.currentTime !== "number" ||
        typeof payload.isPlaying !== "boolean" ||
        typeof payload.updatedBy !== "string"
      ) {
        return; // abaikan payload yang nggak sesuai kontrak
      }
      watchPartyRegistry.broadcast(roomId, payload);
    });

    socket.on("close", () => {
      watchPartyRegistry.leave(roomId, clientId);
    });
  });

  return wss;
}

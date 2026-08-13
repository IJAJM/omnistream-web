import { WebSocket } from "ws";

/**
 * Registry in-memory buat koneksi WebSocket yang lagi aktif per room.
 * Ini yang menentukan "isLive" dan "memberCount" secara real-time —
 * bukan disimpan di database, karena statusnya berubah tiap detik.
 *
 * Catatan skalabilitas: kalau nanti backend di-scale ke lebih dari 1 instance/server,
 * state ini perlu dipindah ke Redis (pub/sub) supaya semua instance lihat room yang sama.
 * Untuk sekarang (1 instance), in-memory Map ini cukup.
 */

export interface PlaybackState {
  currentTime: number;
  isPlaying: boolean;
  updatedBy: string;
}

interface RoomState {
  clients: Map<string, WebSocket>; // clientId -> socket
  lastState: PlaybackState | null; // state terakhir, dikirim ke client yang baru join
}

const rooms = new Map<string, RoomState>();

export const watchPartyRegistry = {
  join(roomId: string, clientId: string, socket: WebSocket) {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { clients: new Map(), lastState: null });
    }
    rooms.get(roomId)!.clients.set(clientId, socket);
  },

  leave(roomId: string, clientId: string) {
    const room = rooms.get(roomId);
    if (!room) return;
    room.clients.delete(clientId);
    // Room kosong tetap disimpan sebentar (lastState) biar gampang dilihat histori terakhir,
    // tapi kalau mau hemat memori bisa langsung rooms.delete(roomId) di sini.
  },

  broadcast(roomId: string, state: PlaybackState) {
    const room = rooms.get(roomId);
    if (!room) return;
    room.lastState = state;

    const payload = JSON.stringify(state);
    for (const [clientId, socket] of room.clients) {
      if (clientId === state.updatedBy) continue; // nggak perlu kirim balik ke pengirim
      if (socket.readyState === socket.OPEN) {
        socket.send(payload);
      }
    }
  },

  getLastState(roomId: string): PlaybackState | null {
    return rooms.get(roomId)?.lastState ?? null;
  },

  getMemberCount(roomId: string): number {
    return rooms.get(roomId)?.clients.size ?? 0;
  },

  isLive(roomId: string): boolean {
    return this.getMemberCount(roomId) > 0;
  },
};

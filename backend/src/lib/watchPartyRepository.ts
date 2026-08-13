import { randomUUID } from "crypto";
import { db } from "./db";

export interface WatchPartyRoomRow {
  id: string;
  host_id: string;
  host_name: string;
  media_id: string;
  media_title: string;
  created_at: string;
}

export const watchPartyRepository = {
  create(input: { hostId: string; hostName: string; mediaId: string; mediaTitle: string }): WatchPartyRoomRow {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO watch_party_rooms (id, host_id, host_name, media_id, media_title) VALUES (?, ?, ?, ?, ?)`
    ).run(id, input.hostId, input.hostName, input.mediaId, input.mediaTitle);
    return this.findById(id)!;
  },

  findById(id: string): WatchPartyRoomRow | undefined {
    return db.prepare("SELECT * FROM watch_party_rooms WHERE id = ?").get(id) as WatchPartyRoomRow | undefined;
  },

  findAll(): WatchPartyRoomRow[] {
    return db.prepare("SELECT * FROM watch_party_rooms ORDER BY created_at DESC").all() as WatchPartyRoomRow[];
  },
};

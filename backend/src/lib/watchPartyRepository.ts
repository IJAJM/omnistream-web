import { pool } from "./db";

export interface WatchPartyRoomRow {
  id: string;
  host_id: string;
  host_name: string;
  media_id: string;
  media_title: string;
  created_at: string;
}

export const watchPartyRepository = {
  async create(input: {
    hostId: string;
    hostName: string;
    mediaId: string;
    mediaTitle: string;
  }): Promise<WatchPartyRoomRow> {
    const { rows } = await pool.query<WatchPartyRoomRow>(
      `INSERT INTO watch_party_rooms (host_id, host_name, media_id, media_title)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [input.hostId, input.hostName, input.mediaId, input.mediaTitle]
    );
    return rows[0];
  },

  async findById(id: string): Promise<WatchPartyRoomRow | undefined> {
    const { rows } = await pool.query<WatchPartyRoomRow>(
      "SELECT * FROM watch_party_rooms WHERE id = $1",
      [id]
    );
    return rows[0];
  },

  async findAll(): Promise<WatchPartyRoomRow[]> {
    const { rows } = await pool.query<WatchPartyRoomRow>(
      "SELECT * FROM watch_party_rooms ORDER BY created_at DESC"
    );
    return rows;
  },
};

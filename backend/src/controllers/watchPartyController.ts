import { Request, Response } from "express";
import { z } from "zod";
import { watchPartyRepository } from "../lib/watchPartyRepository";
import { watchPartyRegistry } from "../lib/watchPartyRegistry";
import { mediaRepository } from "../lib/mediaRepository";
import { userRepository } from "../lib/userRepository";

const createRoomSchema = z.object({
  mediaId: z.string().min(1, "mediaId wajib diisi"),
});

export async function createRoom(req: Request, res: Response) {
  const parsed = createRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const userId = (req as Request & { userId?: string }).userId!;
  const user = await userRepository.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }

  const media = await mediaRepository.findById(parsed.data.mediaId);
  if (!media) {
    return res.status(404).json({ error: "Media tidak ditemukan" });
  }

  const room = await watchPartyRepository.create({
    hostId: user.id,
    hostName: user.name,
    mediaId: media.id,
    mediaTitle: media.title,
  });

  return res.status(201).json({
    id: room.id,
    hostName: room.host_name,
    mediaTitle: room.media_title,
    mediaId: room.media_id,
    memberCount: 0,
    isLive: false,
  });
}

export async function listRooms(_req: Request, res: Response) {
  const rooms = await watchPartyRepository.findAll();
  const result = rooms.map((room) => ({
    id: room.id,
    hostName: room.host_name,
    mediaTitle: room.media_title,
    mediaId: room.media_id,
    memberCount: watchPartyRegistry.getMemberCount(room.id),
    isLive: watchPartyRegistry.isLive(room.id),
  }));
  return res.status(200).json(result);
}

export async function getRoom(req: Request, res: Response) {
  const room = await watchPartyRepository.findById(String(req.params.id));
  if (!room) {
    return res.status(404).json({ error: "Room tidak ditemukan" });
  }
  return res.status(200).json({
    id: room.id,
    hostName: room.host_name,
    mediaTitle: room.media_title,
    mediaId: room.media_id,
    memberCount: watchPartyRegistry.getMemberCount(room.id),
    isLive: watchPartyRegistry.isLive(room.id),
  });
}

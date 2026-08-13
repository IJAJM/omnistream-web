import { Request, Response } from "express";
import { mediaRepository } from "../lib/mediaRepository";

const TRENDING_LIMIT = 5;

export async function getHomeFeed(_req: Request, res: Response) {
  const cinema = await mediaRepository.findTrending(["movie", "series"], TRENDING_LIMIT);
  const music = await mediaRepository.findTrending(["track", "album"], TRENDING_LIMIT);
  return res.status(200).json({ cinema, music });
}

export async function getCinemaCatalog(_req: Request, res: Response) {
  const items = await mediaRepository.findByTypes(["movie", "series"]);
  return res.status(200).json(items);
}

export async function getCinemaDetail(req: Request, res: Response) {
  const item = await mediaRepository.findById(String(req.params.id));
  if (!item || (item.type !== "movie" && item.type !== "series")) {
    return res.status(404).json({ error: "Judul tidak ditemukan" });
  }
  return res.status(200).json(item);
}

export async function getMusicCatalog(_req: Request, res: Response) {
  const items = await mediaRepository.findByTypes(["track", "album"]);
  return res.status(200).json(items);
}

export async function getMusicDetail(req: Request, res: Response) {
  const item = await mediaRepository.findById(String(req.params.id));
  if (!item || (item.type !== "track" && item.type !== "album")) {
    return res.status(404).json({ error: "Lagu/album tidak ditemukan" });
  }
  return res.status(200).json(item);
}

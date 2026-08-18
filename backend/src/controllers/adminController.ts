import { Request, Response } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";
import { mediaRepository } from "../lib/mediaRepository";

const createMediaSchema = z.object({
  type: z.enum(["movie", "series", "track", "album"]),
  title: z.string().min(1, "Judul wajib diisi"),
  subtitle: z.string().optional(),
  posterUrl: z.string().url("posterUrl harus URL valid"),
  genre: z.array(z.string()).optional(),
  releaseYear: z.number().int().optional(),
});

const updateMediaSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  posterUrl: z.string().url().optional(),
  genre: z.array(z.string()).optional(),
  releaseYear: z.number().int().optional(),
});

export async function createMedia(req: Request, res: Response) {
  const parsed = createMediaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const id = randomUUID();
  const item = await mediaRepository.create({ id, ...parsed.data });
  return res.status(201).json(item);
}

export async function updateMedia(req: Request, res: Response) {
  const parsed = updateMediaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const item = await mediaRepository.update(String(req.params.id), parsed.data);
  if (!item) {
    return res.status(404).json({ error: "Media tidak ditemukan" });
  }
  return res.status(200).json(item);
}

export async function deleteMedia(req: Request, res: Response) {
  const deleted = await mediaRepository.delete(String(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: "Media tidak ditemukan" });
  }
  return res.status(200).json({ message: "Media dihapus" });
}

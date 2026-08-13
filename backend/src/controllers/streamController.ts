import { Request, Response } from "express";
import { mediaRepository } from "../lib/mediaRepository";
import { storage } from "../lib/storage";
import { generateStreamToken, verifyStreamToken } from "../lib/streamToken";

export async function uploadMedia(req: Request, res: Response) {
  const media = await mediaRepository.findRawById(String(req.params.id));
  if (!media) {
    return res.status(404).json({ error: "Media tidak ditemukan" });
  }

  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    return res.status(400).json({ error: "File tidak ditemukan di request" });
  }

  await mediaRepository.setStreamFile(media.id, file.filename);
  return res.status(200).json({ message: "Upload berhasil", filename: file.filename });
}

export async function getStreamUrl(req: Request, res: Response) {
  const media = await mediaRepository.findRawById(String(req.params.id));
  if (!media || !media.stream_url) {
    return res.status(404).json({ error: "File streaming belum tersedia untuk media ini" });
  }

  const { token, expiresAt } = generateStreamToken(media.id);
  return res.status(200).json({
    url: `/api/stream/${media.id}?token=${token}`,
    expiresAt,
  });
}

export async function streamMedia(req: Request, res: Response) {
  const media = await mediaRepository.findRawById(String(req.params.id));
  if (!media || !media.stream_url) {
    return res.status(404).json({ error: "File streaming tidak ditemukan" });
  }

  const token = req.query.token as string | undefined;
  if (!token || !verifyStreamToken(media.id, token)) {
    return res.status(403).json({ error: "Token streaming tidak valid atau sudah kedaluwarsa" });
  }

  const filename = media.stream_url;
  if (!storage.exists(filename)) {
    return res.status(404).json({ error: "File fisik tidak ditemukan di storage" });
  }

  const fileSize = storage.getFileSize(filename);
  const range = req.headers.range;
  const contentType = filename.endsWith(".mp4") ? "video/mp4" : "audio/mpeg";

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
    });
    storage.createReadStream(filename).pipe(res);
    return;
  }

  const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": contentType,
  });
  storage.createReadStream(filename, { start, end }).pipe(res);
}

import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import { uploadMedia, getStreamUrl, streamMedia } from "../controllers/streamController";
import { requireAuth } from "../middleware/requireAuth";
import { storage } from "../lib/storage";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, storage.root),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB batas per file
});

const router = Router();

// Upload butuh login (nanti diperketat jadi admin-only saat role sistem sudah ada)
router.post("/media/:id/upload", requireAuth, upload.single("file"), uploadMedia);

// Minta signed URL sebelum streaming — juga butuh login
router.get("/media/:id/stream-url", requireAuth, getStreamUrl);

// Endpoint streaming aktualnya publik (diproteksi lewat token di query, bukan header auth,
// karena elemen <video>/<audio> di browser nggak bisa kirim custom header)
router.get("/stream/:id", streamMedia);

export default router;

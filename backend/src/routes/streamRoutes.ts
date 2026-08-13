import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import { uploadMedia, getStreamUrl, streamMedia } from "../controllers/streamController";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../middleware/asyncHandler";
import { storage } from "../lib/storage";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, storage.root),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 },
});

const router = Router();

router.post("/media/:id/upload", requireAuth, upload.single("file"), asyncHandler(uploadMedia));
router.get("/media/:id/stream-url", requireAuth, asyncHandler(getStreamUrl));
router.get("/stream/:id", asyncHandler(streamMedia));

export default router;

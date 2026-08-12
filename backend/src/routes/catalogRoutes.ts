import { Router } from "express";
import {
  getHomeFeed,
  getCinemaCatalog,
  getCinemaDetail,
  getMusicCatalog,
  getMusicDetail,
} from "../controllers/catalogController";

const router = Router();

// Sesuai kontrak di frontend: src/lib/api.ts
router.get("/home", getHomeFeed);
router.get("/cinema", getCinemaCatalog);
router.get("/cinema/:id", getCinemaDetail);
router.get("/music", getMusicCatalog);
router.get("/music/:id", getMusicDetail);

export default router;

import { Router } from "express";
import {
  getHomeFeed,
  getCinemaCatalog,
  getCinemaDetail,
  getMusicCatalog,
  getMusicDetail,
} from "../controllers/catalogController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/home", asyncHandler(getHomeFeed));
router.get("/cinema", asyncHandler(getCinemaCatalog));
router.get("/cinema/:id", asyncHandler(getCinemaDetail));
router.get("/music", asyncHandler(getMusicCatalog));
router.get("/music/:id", asyncHandler(getMusicDetail));

export default router;

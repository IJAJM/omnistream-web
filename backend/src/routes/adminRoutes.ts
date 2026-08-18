import { Router } from "express";
import { createMedia, updateMedia, deleteMedia } from "../controllers/adminController";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/admin/media", requireAuth, asyncHandler(requireAdmin), asyncHandler(createMedia));
router.put("/admin/media/:id", requireAuth, asyncHandler(requireAdmin), asyncHandler(updateMedia));
router.delete("/admin/media/:id", requireAuth, asyncHandler(requireAdmin), asyncHandler(deleteMedia));

export default router;

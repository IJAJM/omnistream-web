import { Router } from "express";
import { register, login, me, bootstrapAdmin } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/auth/register", asyncHandler(register));
router.post("/auth/login", asyncHandler(login));
router.get("/auth/me", requireAuth, asyncHandler(me));
router.post("/auth/bootstrap-admin", asyncHandler(bootstrapAdmin));

export default router;

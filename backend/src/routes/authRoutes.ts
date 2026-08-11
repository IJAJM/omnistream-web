import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Sesuai kontrak di frontend: src/lib/api.ts -> api.login() & api.register()
router.post("/auth/register", register);
router.post("/auth/login", login);

// Endpoint tambahan buat cek user yang sedang login (dipakai frontend nanti)
router.get("/auth/me", requireAuth, me);

export default router;

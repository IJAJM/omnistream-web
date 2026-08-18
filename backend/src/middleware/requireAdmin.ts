import { Response, NextFunction } from "express";
import { AuthedRequest } from "./requireAuth";
import { userRepository } from "../lib/userRepository";

/**
 * Dipasang SETELAH requireAuth. Cek apakah user yang login itu admin.
 * requireAuth mengisi req.userId, middleware ini yang verifikasi role-nya.
 */
export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const user = await userRepository.findById(req.userId!);
  if (!user || !user.is_admin) {
    return res.status(403).json({ error: "Butuh akses admin buat aksi ini" });
  }
  next();
}

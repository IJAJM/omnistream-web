import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userRepository } from "../lib/userRepository";
import { signToken } from "../lib/jwt";
import { registerSchema, loginSchema } from "../types/authSchemas";

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { name, email, password } = parsed.data;

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Email sudah terdaftar" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepository.create({ name, email, passwordHash });

  const token = signToken({ userId: user.id, email: user.email });
  return res.status(201).json({ token });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Email atau password salah" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Email atau password salah" });
  }

  const token = signToken({ userId: user.id, email: user.email });
  return res.status(200).json({ token });
}

export async function me(req: Request, res: Response) {
  const userId = (req as Request & { userId?: string }).userId;
  const user = await userRepository.findById(userId!);
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }
  return res.status(200).json({ id: user.id, name: user.name, email: user.email, isAdmin: user.is_admin });
}

/**
 * Endpoint sekali-pakai buat jadiin sebuah akun sebagai admin pertama.
 * Dilindungi oleh ADMIN_BOOTSTRAP_SECRET (bukan token login), karena dipakai
 * SEBELUM ada admin sama sekali. Setelah punya admin, buat admin baru lewat
 * halaman admin (pakai akun admin yang sudah ada), bukan endpoint ini lagi.
 */
export async function bootstrapAdmin(req: Request, res: Response) {
  const { email, secret } = req.body ?? {};

  const expectedSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!expectedSecret) {
    return res.status(503).json({ error: "ADMIN_BOOTSTRAP_SECRET belum di-set di server" });
  }
  if (!secret || secret !== expectedSecret) {
    return res.status(403).json({ error: "Secret salah" });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "email wajib diisi" });
  }

  const user = await userRepository.promoteToAdmin(email);
  if (!user) {
    return res.status(404).json({ error: "User dengan email itu belum terdaftar. Daftar dulu lewat /auth/register." });
  }

  return res.status(200).json({ message: `${user.email} sekarang jadi admin.`, isAdmin: user.is_admin });
}

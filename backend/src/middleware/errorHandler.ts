import { Request, Response, NextFunction } from "express";

/** Dipasang paling akhir, buat route yang nggak match sama sekali. */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.path} tidak ditemukan` });
}

/**
 * Error handler terpusat. Semua error yang di-throw atau dipanggil lewat next(err)
 * di controller manapun bakal ditangkap di sini, biar:
 * 1. Client selalu dapat response JSON yang rapi, bukan stack trace mentah
 * 2. Detail error internal (yang bisa jadi sensitif) nggak bocor ke luar
 * 3. Tetap ke-log di server buat keperluan debug
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  if (res.headersSent) return;

  res.status(500).json({ error: "Terjadi kesalahan di server. Coba lagi nanti." });
}

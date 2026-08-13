import rateLimit from "express-rate-limit";

/**
 * Rate limit ketat buat endpoint auth (login/register) — mencegah brute-force
 * tebak password atau spam pendaftaran akun.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20, // maksimal 20 percobaan per IP per 15 menit
  message: { error: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limit umum buat semua endpoint /api lainnya — cukup longgar,
 * cuma buat cegah abuse/scraping kasar, bukan buat batasi pemakaian normal.
 */
export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 120, // 120 request per menit per IP
  message: { error: "Terlalu banyak request. Coba lagi sebentar lagi." },
  standardHeaders: true,
  legacyHeaders: false,
});

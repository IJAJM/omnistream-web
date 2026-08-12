import crypto from "crypto";

/**
 * Signed streaming token: token sementara (HMAC) yang cuma valid untuk satu
 * media tertentu dan kedaluwarsa setelah beberapa menit. Ini yang bikin URL
 * streaming ("/api/stream/:mediaId?token=...") nggak bisa dibagikan bebas
 * atau di-hotlink dari luar aplikasi.
 */

const STREAM_SECRET = process.env.STREAM_SECRET ?? "dev-stream-secret-jangan-dipakai-di-production";
const DEFAULT_TTL_SECONDS = 60 * 10; // 10 menit, cukup buat load & mulai streaming

function sign(mediaId: string, expiresAt: number): string {
  return crypto
    .createHmac("sha256", STREAM_SECRET)
    .update(`${mediaId}:${expiresAt}`)
    .digest("hex");
}

export function generateStreamToken(mediaId: string, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const signature = sign(mediaId, expiresAt);
  return {
    token: `${expiresAt}.${signature}`,
    expiresAt,
  };
}

export function verifyStreamToken(mediaId: string, token: string): boolean {
  const [expiresAtStr, signature] = token.split(".");
  const expiresAt = Number(expiresAtStr);
  if (!expiresAt || !signature) return false;
  if (Date.now() > expiresAt) return false; // token sudah kedaluwarsa

  const expectedSignature = sign(mediaId, expiresAt);
  // timingSafeEqual biar nggak bisa ditebak lewat timing attack
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

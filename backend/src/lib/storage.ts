import fs from "fs";
import path from "path";

/**
 * Storage abstraction. Implementasi sekarang: local disk (buat development/testing).
 *
 * Untuk production, ganti isi fungsi-fungsi ini ke S3/Cloudflare R2 SDK
 * (upload ke bucket, generate signed URL dari provider-nya langsung).
 * Kontrak/interface di bawah ini didesain supaya pemanggilnya (controller)
 * tidak perlu berubah sama sekali saat storage-nya diganti.
 */

const STORAGE_ROOT = process.env.STORAGE_ROOT ?? path.join(__dirname, "../../uploads");

if (!fs.existsSync(STORAGE_ROOT)) {
  fs.mkdirSync(STORAGE_ROOT, { recursive: true });
}

export const storage = {
  root: STORAGE_ROOT,

  /** Path fisik file di disk, dari nama file relatif yang disimpan di DB. */
  resolvePath(relativeFilename: string): string {
    return path.join(STORAGE_ROOT, relativeFilename);
  },

  exists(relativeFilename: string): boolean {
    return fs.existsSync(this.resolvePath(relativeFilename));
  },

  getFileSize(relativeFilename: string): number {
    return fs.statSync(this.resolvePath(relativeFilename)).size;
  },

  /** Stream file dengan dukungan HTTP Range (byte 0-1000 dst), penting buat seek/scrub audio & video. */
  createReadStream(relativeFilename: string, options?: { start: number; end: number }) {
    return fs.createReadStream(this.resolvePath(relativeFilename), options);
  },
};

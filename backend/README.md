# OmniStream Backend

Backend API untuk OmniStream. Dibangun bertahap — status progress ada di bagian **Roadmap** di bawah.

## Tech Stack
- Node.js + Express + TypeScript
- SQLite via `better-sqlite3` (development) — gampang di-swap ke PostgreSQL untuk production
- JWT (`jsonwebtoken`) untuk autentikasi
- `bcryptjs` untuk hash password
- `zod` untuk validasi input

> Catatan: awalnya dicoba pakai Prisma, tapi di-skip untuk sekarang karena proses `prisma generate` butuh download binary dari server Prisma yang kadang diblokir jaringan tertentu. `better-sqlite3` dipilih karena lebih ringan dan tidak butuh binary eksternal — cocok untuk tahap awal ini. Bisa dievaluasi lagi nanti kalau proyek makin besar.

## Menjalankan Secara Lokal

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server jalan di `http://localhost:8000`. Test cepat:

```bash
curl http://localhost:8000/health
```

## Endpoint yang Sudah Jalan

### Tahap 1 — Auth

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/api/auth/register` | Daftar user baru. Body: `{ name, email, password }`. Return: `{ token }` |
| POST | `/api/auth/login` | Login. Body: `{ email, password }`. Return: `{ token }` |
| GET | `/api/auth/me` | Ambil data user yang sedang login. Butuh header `Authorization: Bearer <token>` |
| GET | `/health` | Health check server |

### Validasi Auth
- `name`: minimal 2 karakter
- `email`: harus format email valid
- `password`: minimal 8 karakter
- Email yang sudah terdaftar akan ditolak dengan status `409`
- Login salah (email/password tidak cocok) akan ditolak dengan status `401`

### Tahap 2 — Katalog Cinema & Music

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/api/home` | Feed gabungan trending. Return: `{ cinema: MediaItem[], music: MediaItem[] }` |
| GET | `/api/cinema` | Daftar semua film & series |
| GET | `/api/cinema/:id` | Detail 1 film/series. `404` kalau id tidak ada atau bukan tipe cinema |
| GET | `/api/music` | Daftar semua lagu & album |
| GET | `/api/music/:id` | Detail 1 lagu/album. `404` kalau id tidak ada atau bukan tipe music |

Data katalog masih data contoh (seed) — sama persis dengan yang tadinya hardcoded di frontend (`src/app/cinema/page.tsx`, `src/app/music/page.tsx`), supaya begitu frontend disambungkan ke API ini, tampilannya nggak berubah.

Semua endpoint di atas sudah cocok dengan kontrak yang dipakai frontend di `src/lib/api.ts`.

#### Tahap 3 — Video & Audio Streaming

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/api/media/:id/upload` | Upload file video/audio untuk item media tertentu. Butuh login. Body: `multipart/form-data` dengan field `file` |
| GET | `/api/media/:id/stream-url` | Minta signed URL sementara (berlaku 10 menit) untuk streaming. Butuh login |
| GET | `/api/stream/:id?token=...` | Endpoint streaming aktual, publik tapi diproteksi lewat token dari `stream-url`. Mendukung HTTP Range untuk seek/scrub |

**Cara kerja alurnya:**
1. Frontend minta `GET /api/media/:id/stream-url` (dengan token login user)
2. Backend balikin URL sementara berisi token khusus streaming, valid 10 menit
3. Player (`<video>`/`<audio>`) langsung diarahkan ke URL itu — browser otomatis kirim header `Range` saat user nge-seek, dan server balikin `206 Partial Content` per potongan file

File fisik disimpan di folder `uploads/` (local disk, di-gitignore). Layer storage-nya (`src/lib/storage.ts`) didesain sebagai abstraksi — pemanggilnya nggak perlu berubah kalau nanti diganti ke S3/Cloudflare R2 untuk production.

**Belum termasuk di tahap ini** (masuk pekerjaan lanjutan/production-hardening): transcoding otomatis ke HLS (`.m3u8`), multi-bitrate/adaptive streaming, dan CDN. Untuk skala kecil-menengah, serving langsung dengan Range support seperti sekarang ini sudah cukup.

### Tahap 4 — Watch Party Real-time

| Method/Protokol | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/api/watchparty/rooms` | Bikin room baru. Butuh login. Body: `{ mediaId }` |
| GET | `/api/watchparty/rooms` | Daftar semua room, termasuk `isLive` & `memberCount` real-time |
| GET | `/api/watchparty/rooms/:id` | Detail 1 room |
| WebSocket | `ws://.../ws/watchparty?room=<roomId>&client=<clientId>` | Koneksi real-time buat sinkronisasi play/pause/seek |

**Cara kerja WebSocket-nya**, persis mengikuti kontrak yang sudah ada di frontend (`src/hooks/useVideoSync.ts`) — jadi frontend nggak perlu diubah sama sekali:
- Client konek dengan query param `room` (id room) dan `client` (id unik per user/tab)
- Client kirim pesan `{ currentTime, isPlaying, updatedBy }` tiap kali user play/pause/seek video lokal
- Server broadcast pesan itu ke semua client LAIN di room yang sama (bukan ke pengirimnya sendiri)
- Client yang baru join langsung dikirimin state terakhir room itu, biar dia auto-sinkron

**`isLive` dan `memberCount`** dihitung real-time dari jumlah koneksi WebSocket yang aktif di tiap room (in-memory), bukan dari database — begitu semua orang keluar dari room, room otomatis "mati" (`isLive: false`) tanpa perlu proses tambahan.

> Catatan skalabilitas: state koneksi ini disimpan in-memory per-instance server. Kalau nanti backend di-scale ke lebih dari 1 instance, ini perlu dipindah ke Redis pub/sub supaya semua instance server "lihat" room yang sama. Untuk sekarang (1 instance, buat testing) ini sudah cukup dan sudah ditest jalan dengan 2 client simulasi di `scripts/test-watchparty.js`.

## Isi Ulang Data Contoh
```bash
npm run seed
```
Ini akan insert/replace 5 item cinema + 5 item music ke database. Aman dijalankan berkali-kali (pakai `INSERT OR REPLACE`).

## Struktur Folder

```
backend/
├── src/
│   ├── index.ts              # Entry point, setup Express app
│   ├── routes/                # Definisi route per fitur
│   ├── controllers/           # Logic handling request/response
│   ├── middleware/             # Middleware (mis. requireAuth)
│   ├── lib/                    # Koneksi DB, JWT helper, repository layer
│   └── types/                  # Skema validasi (Zod)
├── .env.example
└── dev.db                     # Database SQLite (otomatis dibuat, di-gitignore)
```

Catatan: `src/lib/seed.ts` berisi data contoh katalog — jalankan `npm run seed` setelah `npm install` biar `/api/home`, `/api/cinema`, `/api/music` ada isinya.

## Roadmap

- [x] **Tahap 1 — Fondasi & Auth**: struktur project, koneksi database, register/login/me dengan JWT ✅ *(selesai)*
- [x] **Tahap 2 — Katalog Cinema & Music**: endpoint `/home`, `/cinema`, `/cinema/:id`, `/music`, `/music/:id` + data seed ✅ *(selesai)*
- [x] **Tahap 3 — Video & Audio Streaming**: upload, signed URL, streaming dengan HTTP Range ✅ *(selesai — transcoding HLS & CDN masuk tahap production-hardening nanti)*
- [x] **Tahap 4 — Watch Party Real-time**: WebSocket server, room management, sinkronisasi play/pause/seek ✅ *(selesai, ditest dengan 2 client simulasi)*
- [ ] **Tahap 5 — Hardening**: rate limiting, logging, deployment, migrasi ke PostgreSQL
- [ ] **Tahap 4 — Watch Party Real-time**: WebSocket server, room management, sinkronisasi play/pause/seek
- [ ] **Tahap 5 — Hardening**: rate limiting, logging, deployment, migrasi ke PostgreSQL

## Untuk Production
Sebelum deploy ke production:
1. Ganti `JWT_SECRET` di `.env` dengan string random yang kuat (jangan pakai default)
2. Pertimbangkan migrasi dari SQLite ke PostgreSQL untuk concurrent write yang lebih baik
3. Set `CORS_ORIGIN` ke domain frontend production, bukan `localhost`

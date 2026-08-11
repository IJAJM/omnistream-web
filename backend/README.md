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

## Endpoint yang Sudah Jalan (Tahap 1: Auth)

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/api/auth/register` | Daftar user baru. Body: `{ name, email, password }`. Return: `{ token }` |
| POST | `/api/auth/login` | Login. Body: `{ email, password }`. Return: `{ token }` |
| GET | `/api/auth/me` | Ambil data user yang sedang login. Butuh header `Authorization: Bearer <token>` |
| GET | `/health` | Health check server |

Semua endpoint ini sudah cocok dengan kontrak yang dipakai frontend di `src/lib/api.ts` (`api.login()` dan `api.register()`).

### Validasi
- `name`: minimal 2 karakter
- `email`: harus format email valid
- `password`: minimal 8 karakter
- Email yang sudah terdaftar akan ditolak dengan status `409`
- Login salah (email/password tidak cocok) akan ditolak dengan status `401`

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

## Roadmap

- [x] **Tahap 1 — Fondasi & Auth**: struktur project, koneksi database, register/login/me dengan JWT ✅ *(selesai)*
- [ ] **Tahap 2 — Katalog Cinema & Music**: endpoint `/home`, `/cinema`, `/cinema/:id`, `/music`, `/music/:id` + data seed
- [ ] **Tahap 3 — Video & Audio Streaming**: setup storage, transcoding HLS, signed URL
- [ ] **Tahap 4 — Watch Party Real-time**: WebSocket server, room management, sinkronisasi play/pause/seek
- [ ] **Tahap 5 — Hardening**: rate limiting, logging, deployment, migrasi ke PostgreSQL

## Untuk Production
Sebelum deploy ke production:
1. Ganti `JWT_SECRET` di `.env` dengan string random yang kuat (jangan pakai default)
2. Pertimbangkan migrasi dari SQLite ke PostgreSQL untuk concurrent write yang lebih baik
3. Set `CORS_ORIGIN` ke domain frontend production, bukan `localhost`

import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { runMigrations } from "./lib/db";
import authRoutes from "./routes/authRoutes";
import catalogRoutes from "./routes/catalogRoutes";
import streamRoutes from "./routes/streamRoutes";
import watchPartyRoutes from "./routes/watchPartyRoutes";
import { attachWatchPartyWebSocket } from "./lib/wsServer";

const app = express();
const PORT = process.env.PORT ?? 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

runMigrations();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Semua route API OmniStream ada di bawah prefix /api,
// sesuai NEXT_PUBLIC_API_BASE_URL default di frontend (src/lib/api.ts)
app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", streamRoutes);
app.use("/api", watchPartyRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// HTTP server dibuat eksplisit (bukan app.listen langsung) supaya WebSocket
// server (Tahap 4: Watch Party) bisa nebeng di port yang sama.
const httpServer = http.createServer(app);
attachWatchPartyWebSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`OmniStream backend jalan di http://localhost:${PORT}`);
  console.log(`WebSocket watch party siap di ws://localhost:${PORT}/ws/watchparty`);
});

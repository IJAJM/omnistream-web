import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { runMigrations } from "./lib/db";
import authRoutes from "./routes/authRoutes";
import catalogRoutes from "./routes/catalogRoutes";
import streamRoutes from "./routes/streamRoutes";
import watchPartyRoutes from "./routes/watchPartyRoutes";
import { attachWatchPartyWebSocket } from "./lib/wsServer";
import { authRateLimit, generalRateLimit } from "./middleware/rateLimit";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT ?? 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV ?? "development";

if (NODE_ENV === "production") {
  const usingDefaultJwt = !process.env.JWT_SECRET || process.env.JWT_SECRET.includes("dev-secret");
  const usingDefaultStream = !process.env.STREAM_SECRET || process.env.STREAM_SECRET.includes("dev-stream-secret");
  if (usingDefaultJwt || usingDefaultStream) {
    console.warn(
      "\n⚠️  PERINGATAN: JWT_SECRET dan/atau STREAM_SECRET masih pakai nilai default/dev.\n" +
        "   Ganti ke string random yang kuat sebelum benar-benar dipakai production!\n"
    );
  }
}

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", generalRateLimit);
app.use("/api/auth", authRateLimit);
app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", streamRoutes);
app.use("/api", watchPartyRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = http.createServer(app);
attachWatchPartyWebSocket(httpServer);

async function start() {
  await runMigrations();
  httpServer.listen(PORT, () => {
    console.log(`OmniStream backend jalan di http://localhost:${PORT} (${NODE_ENV})`);
    console.log(`WebSocket watch party siap di ws://localhost:${PORT}/ws/watchparty`);
  });
}

start().catch((err) => {
  console.error("Gagal start server:", err);
  process.exit(1);
});

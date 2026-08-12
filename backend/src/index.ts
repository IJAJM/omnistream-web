import "dotenv/config";
import express from "express";
import cors from "cors";
import { runMigrations } from "./lib/db";
import authRoutes from "./routes/authRoutes";
import catalogRoutes from "./routes/catalogRoutes";
import streamRoutes from "./routes/streamRoutes";

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`OmniStream backend jalan di http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth";
import studentRoutes from "./routes/students";
import staffRoutes from "./routes/staff";
import feeRoutes from "./routes/fees";
import attendanceRoutes from "./routes/attendance";
import paymentRoutes from "./routes/payments";
import reportsRoutes from "./routes/reports";
import aiRoutes from "./routes/ai";
import gamificationRoutes from "./routes/gamification";
import notificationRoutes from "./routes/notifications";
import contentRoutes from "./routes/content";
import competitionRoutes from "./routes/competitions";
import pastPapersRoutes from "./routes/pastpapers";
import shopRoutes from "./routes/shop";
import safetyRoutes from "./routes/safety";
import filesRoutes from "./routes/files";
import vendorRoutes from "./routes/vendor";

const app = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Global rate limiter: 500 req per 15 min
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — slow down" },
});
app.use(globalLimiter);

// Serve uploaded files
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "./uploads");
app.use("/uploads", express.static(uploadDir));

// ── Health check ──────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "acadebit-api",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/pastpapers", pastPapersRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/safety", safetyRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/vendor", vendorRoutes);

// ── Error handlers ────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  if (err.message?.includes("CORS")) {
    res.status(403).json({ error: "CORS error" });
    return;
  }
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Acadebit API v2 running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

export default app;

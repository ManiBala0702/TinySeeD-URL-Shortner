require("dotenv").config();
const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const analyticsRoutes = require("./routes/analyticsRoutes");
const qrRoutes = require("./routes/qrRoutes");
const trendRoutes = require("./routes/trendRoutes");
/**
 * PURPOSE:
 *   The application entry point. Boots the Express server in this order:
 *     1. Load environment variables (.env)
 *     2. Connect to MongoDB Atlas
 *     3. Configure Express middleware stack (security → logging → parsing → routes)
 *     4. Mount route modules
 *     5. Attach global error handler
 *     6. Start listening
 *
 * REQUEST FLOW (every request):
 *   Request → CORS check → Helmet headers → Rate limiter
 *   → Body parsing → Morgan log → Route handler → Error handler → Response
 *
 * SECURITY CONSIDERATIONS:
 *   - helmet() sets 14 security-related HTTP headers (XSS, clickjacking, etc.)
 *   - cors() restricts origins to CLIENT_URL only — blocks other origins.
 *   - Rate limiter on /api/auth prevents brute-force attacks on login/register.
 *   - Body size capped at 10kb — prevents large payload attacks.
 *   - process.env validation at startup — fail fast if config is missing.
 */

// ── Validate required env vars ───────────────────────────────
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// ── Connect to Database ──────────────────────────────────────
connectDB();

const app = express();

// ── Security Middleware ──────────────────────────────────────

// Sets secure HTTP headers: X-XSS-Protection, X-Frame-Options, etc.
app.use(helmet());

// CORS — only allow requests from our frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate limiter specifically for auth endpoints
// 20 requests per 15 minutes per IP — prevents brute force on login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── General Middleware ───────────────────────────────────────

// Parse JSON bodies — cap at 10kb to prevent large payload attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// HTTP request logger (dev: colorful, production: combined Apache format)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ── Routes ───────────────────────────────────────────────────

// Health check — useful for deployment platforms (Railway, Render, etc.)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Auth routes with rate limiting applied
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/urls", urlRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/analytics", trendRoutes);
app.get("/:code", redirectUrl);
// 404 handler — catches any route not matched above
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ─────────────────────────────────────
// Must be last — Express identifies error handlers by their 4 parameters
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  console.log(`📡 API base: http://localhost:${PORT}/api`);
});


// Handle unhandled promise rejections (e.g. DB query errors not caught)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  // In production, you'd want to log this and gracefully shut down
});

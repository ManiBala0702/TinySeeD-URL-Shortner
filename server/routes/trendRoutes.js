// routes/trendRoutes.js
// Mount this in server.js: app.use("/api/analytics", trendRoutes);

const express = require("express");
const router = express.Router();
const { getTrend } = require("../controllers/trendController");
const {protect} = require("../middleware/authMiddleware"); // adjust path if needed

// GET /api/analytics/:urlId/trend
router.get("/:urlId/trend", protect, getTrend);

module.exports = router;

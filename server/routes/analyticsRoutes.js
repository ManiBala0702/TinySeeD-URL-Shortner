const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getUrlAnalytics,
  getDashboardAnalytics,
} = require("../controllers/analyticsController");

router.use(protect);

// GET /api/analytics
router.get("/", getDashboardAnalytics);

// GET /api/analytics/:urlId
router.get("/:urlId", getUrlAnalytics);

module.exports = router;
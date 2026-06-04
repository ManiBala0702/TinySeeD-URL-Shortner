const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // your existing JWT middleware
const {
  createUrl,
  getUserUrls,
  deleteUrl,
  getUrlById
} = require("../controllers/urlController");

// All routes below require a valid JWT
router.use(protect);

router.post("/", createUrl);
router.get("/", getUserUrls);
router.get("/:id", getUrlById);
router.delete("/:id", deleteUrl);

module.exports = router;

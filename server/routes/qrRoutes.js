const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const { generateQR } = require("../controllers/qrController");

console.log("protect =", protect);
console.log("generateQR =", generateQR);

router.use(protect);

// GET /api/qr/:urlId
router.get("/:urlId", generateQR);

module.exports = router;

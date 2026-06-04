const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

/**
 * PURPOSE:
 *   Maps HTTP endpoints to controller functions and attaches
 *   express-validator middleware for input sanitization and validation.
 *   Routes are thin — no business logic lives here.
 *
 * REQUEST FLOW:
 *   index.js mounts this router at /api/auth
 *   POST /api/auth/register → [validation chain] → register()
 *   POST /api/auth/login    → [validation chain] → login()
 *   GET  /api/auth/me       → protect middleware  → getMe()
 *
 * SECURITY CONSIDERATIONS:
 *   - express-validator sanitizes and validates ALL user input before it reaches
 *     the controller. This is the first line of defense against injection.
 *   - trim() and normalizeEmail() strip whitespace and normalize casing.
 *   - Password strength is enforced here (minLength, complexity).
 *   - /me is protected — requires a valid JWT. No token = 401 before getMe() runs.
 */

const router = express.Router();

// ── Validation chains ───────────────────────────────────────

const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(), // lowercases, strips dots in gmail, etc.

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// ── Routes ───────────────────────────────────────────────────

// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerValidation, register);

// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginValidation, login);

// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, getMe);

module.exports = router;

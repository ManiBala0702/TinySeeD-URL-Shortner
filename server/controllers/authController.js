const { validationResult } = require("express-validator");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

/**
 * PURPOSE:
 *   Handles all authentication business logic: registering new users and logging in.
 *   Controllers are the bridge between routes (HTTP layer) and models (data layer).
 *   They never directly touch the DB — that's the model's job.
 *
 * REQUEST FLOW:
 *   POST /api/auth/register → authRoutes → register()
 *   POST /api/auth/login    → authRoutes → login()
 *   GET  /api/auth/me       → authMiddleware → getMe()
 *
 * DATABASE INTERACTION:
 *   register: User.findOne (check duplicate) → new User().save() (create)
 *   login:    User.findOne with +password (load hash) → comparePassword()
 *   getMe:    User.findById (req.user set by middleware)
 *
 * SECURITY CONSIDERATIONS:
 *   - Input validation is handled by express-validator before controller runs.
 *   - Duplicate email: returns 409 with a generic message (don't confirm email existence to strangers).
 *   - Login: same generic error for "user not found" and "wrong password" — prevents user enumeration.
 *   - JWT is returned in the response body (not a cookie) for simplicity.
 *     For production, consider httpOnly cookies to prevent XSS token theft.
 *   - Passwords never appear in responses (model's select:false + toSafeObject).
 */

// ─────────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
const register = async (req, res) => {
  // Check validation errors from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, email, password } = req.body;

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // 409 Conflict — but message is intentionally vague
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create user — password hashing happens in the pre-save hook on the model
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { email, password } = req.body;

  try {
    // Explicitly select password — it's excluded by default (select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Same error for "not found" AND "wrong password" — prevents user enumeration
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Private (requires valid JWT)
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is attached by authMiddleware after token verification
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register, login, getMe };

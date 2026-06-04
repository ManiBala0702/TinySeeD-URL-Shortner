const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * PURPOSE:
 *   Protects private routes by verifying the JWT on every incoming request.
 *   If valid, attaches `req.user` so downstream controllers know who is calling.
 *   If invalid or missing, immediately returns 401 — the request never reaches
 *   the controller.
 *
 * REQUEST FLOW:
 *   Client sends: Authorization: Bearer <token>
 *   Middleware extracts token → verifies signature → looks up user in DB
 *   → attaches req.user → calls next() → controller runs
 *
 *   On any failure: returns 401/403 immediately, next() is never called.
 *
 * DATABASE INTERACTION:
 *   One User.findById() per protected request to confirm the user still exists
 *   and is active. This prevents tokens from working after account deletion.
 *   Cost: one extra DB read per request. Acceptable for a hackathon;
 *   in production you'd cache this or skip the DB call for stateless auth.
 *
 * SECURITY CONSIDERATIONS:
 *   - jwt.verify() checks: signature, expiry, algorithm. All in one call.
 *   - We check user existence in DB — a token can be valid but the user deleted.
 *   - We verify isActive — deactivated accounts can't use old tokens.
 *   - Error messages are intentionally vague — never reveal WHY a token failed.
 *   - Bearer extraction is strict — must start with "Bearer ".
 */

const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify signature and decode payload
    // Throws if expired, malformed, or wrong secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm user still exists and is active
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid",
      });
    }

    // Attach lightweight user reference to request
    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (error) {
    // JsonWebTokenError (bad signature), TokenExpiredError, NotBeforeError
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { protect };

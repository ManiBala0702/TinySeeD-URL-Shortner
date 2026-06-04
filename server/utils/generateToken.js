const jwt = require("jsonwebtoken");

/**
 * PURPOSE:
 *   Centralizes JWT creation logic so the secret and options
 *   are never duplicated across controllers.
 *   If you ever need to rotate the signing algorithm or add claims,
 *   this is the single place to change.
 *
 * SECURITY CONSIDERATIONS:
 *   - JWT_SECRET must be a long, random string (64+ hex chars recommended).
 *   - JWT_EXPIRES_IN controls token lifetime. "7d" is fine for dev;
 *     consider shorter ("15m") + refresh tokens for production.
 *   - We sign with the user's _id only — never embed sensitive data in the payload
 *     since the payload is base64-encoded, not encrypted.
 */

/**
 * Generate a signed JWT for a given user ID.
 * @param {string} userId - The MongoDB ObjectId of the user
 * @returns {string} Signed JWT string
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },          // payload — keep minimal
    process.env.JWT_SECRET,  // secret from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

module.exports = { generateToken };

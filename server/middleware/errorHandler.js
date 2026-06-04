/**
 * PURPOSE:
 *   Centralized error handler — the last middleware in the Express chain.
 *   Any error passed via next(error) lands here instead of crashing the server.
 *   Ensures consistent error response shape across the entire API.
 *
 * REQUEST FLOW:
 *   Any middleware/controller calls next(error) with an Error object
 *   → Express skips remaining route handlers → this runs last.
 *
 * SECURITY CONSIDERATIONS:
 *   - Stack traces are NEVER sent to clients in production — they reveal internals.
 *   - Mongoose validation errors are normalized to the same shape as express-validator errors.
 *   - Duplicate key errors (MongoDB code 11000) surface a clear message without
 *     leaking collection or field details beyond what's needed.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose CastError — invalid ObjectId format in URL params
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID format";
  }

  // Mongoose ValidationError — schema-level validation failed
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // MongoDB duplicate key (unique index violation)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    // Stack trace only in development — never in production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

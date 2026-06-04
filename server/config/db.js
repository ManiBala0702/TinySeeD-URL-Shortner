const mongoose = require("mongoose");

/**
 * PURPOSE:
 *   Establishes and manages the MongoDB Atlas connection using Mongoose.
 *   Centralizes all connection logic so index.js stays clean.
 *
 * REQUEST FLOW:
 *   Called once at server startup (index.js → connectDB()).
 *   If connection fails, the process exits — no point running the API
 *   without a database.
 *
 * DATABASE INTERACTION:
 *   Creates a persistent connection pool that all Mongoose models share.
 *   Mongoose reuses this connection for every query across the app.
 *
 * SECURITY CONSIDERATIONS:
 *   - MONGO_URI must live in .env — never hardcoded.
 *   - Atlas connection string includes credentials; treat it like a password.
 *   - In production, restrict Atlas IP allowlist to your server's IP only.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These suppress deprecation warnings in Mongoose 8+
      // and enforce strict query behavior
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit with failure code — don't silently continue without DB
    process.exit(1);
  }
};

module.exports = connectDB;

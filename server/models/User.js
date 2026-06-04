const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * PURPOSE:
 *   Defines the User schema — the shape of every user document in MongoDB.
 *   Also owns password hashing logic via a pre-save hook and a comparison method.
 *   Keeping this logic in the model follows MVC: the Model handles its own data concerns.
 *
 * REQUEST FLOW:
 *   AuthController imports this model to create users (register) and query them (login).
 *   The JWT middleware also uses it to look up users by ID on protected routes.
 *
 * DATABASE INTERACTION:
 *   Maps to the "users" collection in MongoDB Atlas.
 *   Indexes: email has a unique index for fast lookup and to enforce uniqueness at the DB level.
 *   The password field uses `select: false` — it is never returned in queries unless
 *   explicitly requested with `.select("+password")`.
 *
 * SECURITY CONSIDERATIONS:
 *   - Passwords are hashed with bcrypt (saltRounds: 12) before storage — never stored plaintext.
 *   - `select: false` on password prevents accidental exposure in API responses.
 *   - Email is lowercased and trimmed before save to prevent duplicate accounts via case tricks.
 *   - comparePassword() uses bcrypt.compare() — timing-safe, prevents timing attacks.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // creates a MongoDB unique index
      lowercase: true, // normalize before save
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // NEVER returned by default in queries
    },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Pre-save hook: hash the password before writing to DB.
 * Only runs if the password field was actually modified —
 * avoids re-hashing on unrelated updates (e.g. name change).
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // saltRounds: 12 is a good balance of security and performance.
  // Higher = slower hash (harder to brute force), but adds latency.
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: compare a plaintext candidate password against the stored hash.
 * Called in AuthController during login.
 *
 * bcrypt.compare() is timing-safe — it always takes roughly the same time
 * regardless of where the strings diverge, preventing timing attacks.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance method: return a safe user object for API responses.
 * Explicitly excludes the password hash even if it was loaded.
 */
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    plan: this.plan,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    // ADD these two fields to your existing Url schema:
expiresAt: {
  type: Date,
  default: null,
  index: true,
},

category: {
  type: String,
  default: "Other",
  enum: ["Entertainment","Development","Career","Education",
         "News","Social","Shopping","Finance","Government","Other"],
},
clickHistory: { type: [Date], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);

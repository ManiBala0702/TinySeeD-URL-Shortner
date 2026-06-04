const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    device: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Unknown",
    },
    referrer: {
      type: String,
      default: "Direct",
    },
  },
  { timestamps: false } // timestamp field is explicit above
);

// Compound index for fast per-URL time-range queries
clickSchema.index({ urlId: 1, timestamp: -1 });

module.exports = mongoose.model("Click", clickSchema);


const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const Click = require("../models/Click");
const { parseUserAgent, parseReferrer } = require("../utils/uaParser");
// PATCH for controllers/urlController.js  (createUrl function only)
// Replace / merge your existing createUrl function with this.


const { categorizeUrl } = require("../utils/categorize");


const ALIAS_RE = /^[a-zA-Z0-9-]+$/;

const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.user.id;

    // ── Validate URL ──────────────────────────────────────────
    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required." });
    }
    try { new URL(originalUrl); }
    catch { return res.status(400).json({ message: "Invalid URL format." }); }

    // ── Custom alias validation ───────────────────────────────
    let shortCode;
    if (customAlias) {
      const alias = customAlias.trim();
      if (!ALIAS_RE.test(alias)) {
        return res.status(400).json({ message: "Alias may only contain letters, numbers, and hyphens." });
      }
      if (alias.length > 30) {
        return res.status(400).json({ message: "Alias must be 30 characters or fewer." });
      }
      const existing = await Url.findOne({ shortCode: alias });
      if (existing) {
        return res.status(409).json({ message: "This alias is already taken. Please choose another." });
      }
      shortCode = alias;
    } else {
      // Generate unique nanoid
      let unique = false;
      while (!unique) {
        shortCode = nanoid(7);
        const exists = await Url.findOne({ shortCode });
        if (!exists) unique = true;
      }
    }

    // ── AI categorization ─────────────────────────────────────
    const category = categorizeUrl(originalUrl);

    // ── Create document ───────────────────────────────────────
    const url = await Url.create({
      user: userId,
      originalUrl,
      shortCode,
      category,
      expiresAt: expiresAt || null,
      clicks: 0,
      clickHistory: [],
    });

    res.status(201).json(url);
  } catch (err) {
    console.error("createUrl error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const getUrlById = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (url.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.json(url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUrl };


// POST /api/urls — create a shortened URL
/* const createUrl = async (req, res) => {
  const { originalUrl, expiresAt } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ message: "Original URL is required." });
  }

  // Basic URL validation
  try {
    new URL(originalUrl);
  } catch {
    return res.status(400).json({ message: "Invalid URL format." });
  }

  try {
    const shortCode = nanoid(7); // e.g. "3fG9kQz"
    const url = await Url.create({
      user: req.user.id,
      originalUrl,
      shortCode,
    });

    return res.status(201).json(url);
  } catch (err) {
    console.error("createUrl error:", err);
    return res.status(500).json({ message: "Server error creating URL." });
  }
}; */

// GET /api/urls — get all URLs for the authenticated user
const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(urls);
  } catch (err) {
    console.error("getUserUrls error:", err);
    return res.status(500).json({ message: "Server error fetching URLs." });
  }
};

// DELETE /api/urls/:id — delete a URL owned by the authenticated user
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ message: "URL not found." });
    }
    

    if (url.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized." });
    }

    await url.deleteOne();
    return res.json({ message: "URL deleted." });
  } catch (err) {
    console.error("deleteUrl error:", err);
    return res.status(500).json({ message: "Server error deleting URL." });
  }
};

// GET /:code — public redirect endpoint
const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found." });
    }
if (url.expiresAt && new Date() > url.expiresAt) {
  return res.status(410).json({
    message: "This link has expired."
  });}
    // ── Log the click ──────────────────────────────────────────────────
    const ua = req.headers["user-agent"] || "";
    const { browser, device } = parseUserAgent(ua);
    const referrer = parseReferrer(req.headers["referer"] || req.headers["referrer"] || "");

    // Fire-and-forget — don't block the redirect on analytics write
    Click.create({
      urlId: url._id,
      timestamp: new Date(),
      browser,
      device,
      referrer,
    }).catch((err) => console.error("Click log error:", err));
    url.clickHistory = url.clickHistory || [];
    url.clickHistory.push(new Date());
    // ── Increment legacy counter on Url doc ───────────────────────────
    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error("redirectUrl error:", err);
    return res.status(500).json({ message: "Server error during redirect." });
  }
};

module.exports = {
  createUrl,
  getUserUrls,
  getUrlById,
  deleteUrl,
  redirectUrl
};

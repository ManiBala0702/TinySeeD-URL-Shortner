// analyticsController.js  — ADD this function to your existing analytics controller
// Paste the trendController export at the bottom of your current analyticsController.js

const Url = require("../models/Url");

/**
 * GET /api/analytics/:urlId/trend
 * Returns last 14 days of daily click data for a specific URL.
 */
const getTrend = async (req, res) => {
  try {
    const { urlId } = req.params;
    const userId = req.user.id;

    const urlDoc = await Url.findOne({ _id: urlId, user: userId });
    if (!urlDoc) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Build last-14-days date range
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setDate(today.getDate() - 13);
    start.setHours(0, 0, 0, 0);

    // clickHistory is expected to be an array of Date objects (or ISO strings)
    // stored on the Url document as urlDoc.clickHistory
    const history = urlDoc.clickHistory || [];

    // Build a map: "YYYY-MM-DD" -> count
    const countMap = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().split("T")[0];
      countMap[key] = 0;
    }

    history.forEach((entry) => {
      const d = new Date(entry);
      if (d >= start && d <= today) {
        const key = d.toISOString().split("T")[0];
        if (key in countMap) countMap[key]++;
      }
    });

    const trend = Object.entries(countMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, clicks]) => ({ date, clicks }));

    res.json(trend);
  } catch (err) {
    console.error("Trend error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTrend };

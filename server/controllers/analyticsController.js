const Url = require("../models/Url");
const Click = require("../models/Click");

// ─── GET /api/analytics/:urlId ────────────────────────────────────────────────
// Returns full analytics for one short URL owned by the authenticated user.
const getUrlAnalytics = async (req, res) => {
  try {
    // 1. Verify the URL exists and belongs to this user
    const url = await Url.findById(req.params.urlId);
    if (!url) return res.status(404).json({ message: "URL not found." });
    if (url.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized." });

    const urlId = url._id;

    // ── Run all aggregations in parallel ──────────────────────────────────
    const [
      totalClicks,
      lastVisitArr,
      dailyTrend,
      recentVisits,
      browserBreakdown,
      deviceBreakdown,
    ] = await Promise.all([

      // 2. Total clicks
      Click.countDocuments({ urlId }),

      // 3. Last visited timestamp
      Click.findOne({ urlId }).sort({ timestamp: -1 }).select("timestamp").lean(),

      // 4. Daily click trend — last 14 days
      Click.aggregate([
        {
          $match: {
            urlId,
            timestamp: {
              $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            clicks: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", clicks: 1 } },
      ]),

      // 5. Recent 10 visits
      Click.find({ urlId })
        .sort({ timestamp: -1 })
        .limit(10)
        .select("timestamp browser device referrer")
        .lean(),

      // 6. Browser breakdown
      Click.aggregate([
        { $match: { urlId } },
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, browser: "$_id", count: 1 } },
      ]),

      // 7. Device breakdown
      Click.aggregate([
        { $match: { urlId } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, device: "$_id", count: 1 } },
      ]),
    ]);

    // Fill in zero-click days so the chart has a continuous 14-day range
    const filledTrend = fillDailyGaps(dailyTrend, 14);

    // Unique visits = distinct days with at least 1 click (simple heuristic)
    const uniqueVisits = filledTrend.filter((d) => d.clicks > 0).length;

    return res.json({
      url: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
      },
      summary: {
        totalClicks,
        lastVisit: lastVisitArr ? lastVisitArr.timestamp : null,
        uniqueVisits,
      },
      dailyTrend: filledTrend,
      recentVisits,
      browserBreakdown,
      deviceBreakdown,
    });
  } catch (err) {
    console.error("getUrlAnalytics error:", err);
    return res.status(500).json({ message: "Server error fetching analytics." });
  }
};

// ─── GET /api/analytics ───────────────────────────────────────────────────────
// Dashboard-level summary: total clicks across ALL user URLs (last 7 days trend)
const getDashboardAnalytics = async (req, res) => {
  try {
    // Get all URL IDs belonging to this user
    const urls = await Url.find({ user: req.user.id }).select("_id shortCode originalUrl clicks").lean();
    const urlIds = urls.map((u) => u._id);

    if (urlIds.length === 0) {
      return res.json({
        totalClicks: 0,
        lastVisit: null,
        dailyTrend: fillDailyGaps([], 7),
        topUrls: [],
      });
    }

    const [totalClicks, lastVisitArr, dailyTrend, topUrls] = await Promise.all([
      Click.countDocuments({ urlId: { $in: urlIds } }),

      Click.findOne({ urlId: { $in: urlIds } })
        .sort({ timestamp: -1 })
        .select("timestamp")
        .lean(),

      Click.aggregate([
        {
          $match: {
            urlId: { $in: urlIds },
            timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            clicks: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", clicks: 1 } },
      ]),

      // Top 5 URLs by click count
      Click.aggregate([
        { $match: { urlId: { $in: urlIds } } },
        { $group: { _id: "$urlId", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Enrich topUrls with shortCode/originalUrl
    const enriched = topUrls.map((t) => {
      const match = urls.find((u) => u._id.toString() === t._id.toString());
      return {
        urlId: t._id,
        clicks: t.clicks,
        shortCode: match?.shortCode,
        originalUrl: match?.originalUrl,
      };
    });

    return res.json({
      totalClicks,
      lastVisit: lastVisitArr ? lastVisitArr.timestamp : null,
      dailyTrend: fillDailyGaps(dailyTrend, 7),
      topUrls: enriched,
    });
  } catch (err) {
    console.error("getDashboardAnalytics error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ─── Helper: fill missing dates with 0 clicks ────────────────────────────────
function fillDailyGaps(data, days) {
  const map = {};
  data.forEach((d) => (map[d.date] = d.clicks));

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, clicks: map[key] || 0 });
  }
  return result;
}

module.exports = { getUrlAnalytics, getDashboardAnalytics };

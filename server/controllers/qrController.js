const QRCode = require("qrcode");
const Url = require("../models/Url");

// GET /api/qr/:urlId
// Returns a base64 PNG data-URL of the QR code for the short link
const generateQR = async (req, res) => {
  try {
    const url = await Url.findById(req.params.urlId);

    if (!url) {
      return res.status(404).json({ message: "URL not found." });
    }

    // Ownership check
    if (url.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const BASE = process.env.BASE_URL || "http://localhost:5000";
    const shortUrl = `${BASE}/${url.shortCode}`;
    console.log("QR URL =", shortUrl);

    // Generate as base64 data-URI (PNG)
    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 300,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    return res.json({
      qrCode: qrDataUrl,       // "data:image/png;base64,..."
      shortUrl,
      shortCode: url.shortCode,
    });
  } catch (err) {
    console.error("generateQR error:", err);
    return res.status(500).json({ message: "Failed to generate QR code." });
  }
};

module.exports = { generateQR };

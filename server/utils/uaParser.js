/**
 * Lightweight User-Agent parser.
 * No external dependency — uses regex against the UA string.
 */

/**
 * @param {string} ua  — req.headers['user-agent']
 * @returns {{ browser: string, device: string }}
 */
function parseUserAgent(ua = "") {
  const browser = detectBrowser(ua);
  const device = detectDevice(ua);
  return { browser, device };
}

function detectBrowser(ua) {
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/SamsungBrowser/i.test(ua)) return "Samsung Browser";
  if (/Chrome\/\d/i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Firefox\/\d/i.test(ua)) return "Firefox";
  if (/Safari\/\d/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/MSIE|Trident/i.test(ua)) return "Internet Explorer";
  if (/curl\//i.test(ua)) return "cURL";
  return "Other";
}

function detectDevice(ua) {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua))
    return "Mobile";
  return "Desktop";
}

/**
 * Normalise a Referer header into a readable source label.
 * Falls back to "Direct" if empty.
 */
function parseReferrer(referer = "") {
  if (!referer || referer.trim() === "") return "Direct";
  try {
    const { hostname } = new URL(referer);
    return hostname.replace(/^www\./, ""); // e.g. "google.com"
  } catch {
    return "Unknown";
  }
}

module.exports = { parseUserAgent, parseReferrer };

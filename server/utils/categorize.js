/**
 * TinySeed — AI Categorization (domain-based intelligent mapping)
 * No external API required.
 */

const categoryMap = {
  // Entertainment
  youtube: "Entertainment",
  youtu: "Entertainment",
  netflix: "Entertainment",
  twitch: "Entertainment",
  spotify: "Entertainment",
  soundcloud: "Entertainment",
  tiktok: "Entertainment",
  instagram: "Entertainment",
  pinterest: "Entertainment",
  reddit: "Entertainment",
  imgur: "Entertainment",
  vimeo: "Entertainment",
  dailymotion: "Entertainment",
  hulu: "Entertainment",
  primevideo: "Entertainment",
  disneyplus: "Entertainment",
  "9gag": "Entertainment",

  // Development
  github: "Development",
  gitlab: "Development",
  bitbucket: "Development",
  stackoverflow: "Development",
  npmjs: "Development",
  pypi: "Development",
  codepen: "Development",
  codesandbox: "Development",
  replit: "Development",
  vercel: "Development",
  netlify: "Development",
  heroku: "Development",
  digitalocean: "Development",
  aws: "Development",
  "cloud.google": "Development",
  azure: "Development",
  docker: "Development",
  "hub.docker": "Development",
  devto: "Development",
  hackernews: "Development",
  "news.ycombinator": "Development",
  leetcode: "Development",
  hackerrank: "Development",
  codeforces: "Development",
  "developer.mozilla": "Development",
  "docs.": "Development",

  // Career
  linkedin: "Career",
  glassdoor: "Career",
  indeed: "Career",
  naukri: "Career",
  monster: "Career",
  upwork: "Career",
  fiverr: "Career",
  toptal: "Career",
  "wellfound": "Career",
  angel: "Career",
  "jobs.": "Career",
  "careers.": "Career",

  // Education
  coursera: "Education",
  udemy: "Education",
  edx: "Education",
  khanacademy: "Education",
  "khan": "Education",
  udacity: "Education",
  pluralsight: "Education",
  skillshare: "Education",
  freecodecamp: "Education",
  "w3schools": "Education",
  "geeksforgeeks": "Education",
  "tutorialspoint": "Education",
  medium: "Education",
  hashnode: "Education",
  "wikipedia": "Education",
  "britannica": "Education",
  "scholar.google": "Education",
  researchgate: "Education",
  arxiv: "Education",
  academia: "Education",
  "mit.edu": "Education",
  "stanford.edu": "Education",
  ".edu": "Education",

  // News
  cnn: "News",
  bbc: "News",
  reuters: "News",
  "apnews": "News",
  nytimes: "News",
  theguardian: "News",
  washingtonpost: "News",
  forbes: "News",
  techcrunch: "News",
  wired: "News",
  theverge: "News",
  arstechnica: "News",
  engadget: "News",
  "zdnet": "News",
  "businessinsider": "News",
  "economictimes": "News",
  "ndtv": "News",
  "timesofindia": "News",
  hindustantimes: "News",
  aljazeera: "News",
  "huffpost": "News",
  vice: "News",
  axios: "News",
  "politico": "News",

  // Social
  twitter: "Social",
  "x.com": "Social",
  facebook: "Social",
  snapchat: "Social",
  whatsapp: "Social",
  telegram: "Social",
  discord: "Social",
  slack: "Social",
  mastodon: "Social",

  // Shopping
  amazon: "Shopping",
  flipkart: "Shopping",
  ebay: "Shopping",
  shopify: "Shopping",
  etsy: "Shopping",
  aliexpress: "Shopping",

  // Finance
  "paypal": "Finance",
  stripe: "Finance",
  coinbase: "Finance",
  binance: "Finance",
  robinhood: "Finance",
  zerodha: "Finance",
  groww: "Finance",
  "moneycontrol": "Finance",
};

/**
 * Categorize a URL based on its domain.
 * @param {string} url - Full URL string
 * @returns {string} Category label
 */
function categorizeUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (hostname.includes(keyword)) {
        return category;
      }
    }

    // TLD-based fallbacks
    if (hostname.endsWith(".edu")) return "Education";
    if (hostname.endsWith(".gov")) return "Government";
    if (hostname.endsWith(".org")) return "Education";

    return "Other";
  } catch {
    return "Other";
  }
}

module.exports = { categorizeUrl };

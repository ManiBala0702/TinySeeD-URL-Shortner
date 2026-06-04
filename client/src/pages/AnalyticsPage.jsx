import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { StatCard, StatCardSkeleton, Skeleton, EmptyState } from "../components/ui";

const API = import.meta.env.VITE_API_URL || "";
const COLORS = ["#00d4aa", "#7c6ff7", "#3b82f6", "#f472b6", "#fbbf24", "#f97316"];

// Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1322] border border-[#1e2d45] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-[#4a5a76] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.value} {entry.name || "clicks"}
        </p>
      ))}
    </div>
  );
}

function DonutChart({ data, title }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const total = data.reduce((s, d) => s + d.count, 0);

  if (!data.length) return (
    <div className="glass-card rounded-2xl p-6">
      <p className="text-xs font-semibold text-[#4a5a76] uppercase tracking-wider mb-4">{title}</p>
      <div className="flex items-center justify-center h-32 text-[#4a5a76] text-sm">No data</div>
    </div>
  );

  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="text-xs font-semibold text-[#4a5a76] uppercase tracking-wider mb-5">{title}</p>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <PieChart width={112} height={112}>
            <Pie
              data={data.slice(0, 6)}
              dataKey="count"
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={52}
              paddingAngle={3}
              onMouseEnter={(_, i) => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.slice(0, 6).map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  opacity={activeIndex === null || activeIndex === i ? 1 : 0.5}
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-lg font-bold text-[#f0f4ff]">{total}</span>
            <span className="text-[9px] text-[#4a5a76]">total</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {data.slice(0, 5).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-[#8b9cba] truncate flex-1">{item._id || "Unknown"}</span>
              <span className="text-xs font-semibold font-mono-custom" style={{ color: COLORS[i % COLORS.length] }}>
                {Math.round((item.count / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { id } = useParams();
  console.log("Analytics ID:", id);
  const [urlInfo, setUrlInfo] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [trend, setTrend] = useState([]);
  const [recentClicks, setRecentClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [urlRes, analyticsRes] = await Promise.all([
          axios.get(`${API}/api/urls/${id}`, { headers }),
          axios.get(`${API}/api/analytics/${id}`, { headers }),
          //axios.get(`${API}/api/analytics/${id}/trend`, { headers })
          //axios.get(`${API}/api/analytics/${id}/recent`, { headers }),
        ]);
        setUrlInfo(urlRes.data);
        console.log(analyticsRes.data);

setAnalytics({
  totalClicks: analyticsRes.data.summary.totalClicks,
  browsers: analyticsRes.data.browserBreakdown.map(b => ({
    _id: b.browser,
    count: b.count
  })),
  devices: analyticsRes.data.deviceBreakdown.map(d => ({
    _id: d.device,
    count: d.count
  }))
});

setRecentClicks(analyticsRes.data.recentVisits);
setTrend(
  analyticsRes.data.dailyTrend.map(item => ({
    _id: item.date,
    count: item.clicks
  }))
);
        setTrend(trendRes.data);
        setRecentClicks(clicksRes.data);
        console.log("URL:", urlRes.data);
console.log("Analytics:", analyticsRes.data);
console.log("Trend:", trendRes.data);
console.log("Recent:", clicksRes.data);
      } catch {
        // handle gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const shortUrl = urlInfo ? `http://localhost:5000/${urlInfo.shortCode}` : "";
  const totalClicks = analytics?.totalClicks || 0;
  const uniqueDays = trend.filter((t) => t.count > 0).length;
  const lastVisit = recentClicks[0]?.timestamp
    ? new Date(recentClicks[0].timestamp).toLocaleString()
    : "—";

  const formatDate = (str) => {
    const d = new Date(str);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const trendData = trend.map((t) => ({
    date: formatDate(t._id),
    clicks: t.count,
  }));

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#080c14]">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-[#080c14]/80 backdrop-blur-xl border-b border-[#1e2d45] flex items-center gap-4 px-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm text-[#4a5a76] hover:text-[#f0f4ff] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <span className="text-[#1e2d45]">/</span>
        <div className="flex-1 min-w-0">
          {loading ? (
            <Skeleton className="h-4 w-40" />
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#f0f4ff] truncate">/{urlInfo?.shortCode}</span>
              <span className="hidden sm:block text-xs text-[#4a5a76] truncate max-w-xs">{urlInfo?.originalUrl}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
        {/* Link info card */}
        {!loading && urlInfo && (
          <div className="glass-card rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 fade-in-up">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#4a5a76] mb-1">Short Link</p>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                className="text-[#00d4aa] font-mono-custom text-sm hover:text-[#00b899] transition-colors">
                {shortUrl}
              </a>
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <p className="text-xs text-[#4a5a76] mb-1">Destination</p>
              <p className="text-sm text-[#8b9cba] font-mono-custom truncate">{urlInfo.originalUrl}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot active" />
              <span className="text-xs text-[#8b9cba]">Active</span>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 fade-in-up delay-100">
          {loading ? (
            <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
          ) : (
            <>
              <StatCard
                title="Total Clicks"
                value={totalClicks.toLocaleString()}
                subtitle="All time"
                accent="teal"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                }
              />
              <StatCard
                title="Last Visit"
                value={recentClicks[0] ? "Recent" : "—"}
                subtitle={lastVisit}
                accent="violet"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                title="Active Days"
                value={uniqueDays}
                subtitle="Days with clicks (14d)"
                accent="blue"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </>
          )}
        </div>

        {/* Trend Chart */}
        <div className="glass-card rounded-2xl p-6 mb-6 fade-in-up delay-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-[#f0f4ff]">Daily Click Trend</h2>
              <p className="text-xs text-[#4a5a76] mt-0.5">Last 14 days</p>
            </div>
            <span className="text-xs font-mono-custom text-[#4a5a76] bg-[#0d1322] border border-[#1e2d45] px-3 py-1 rounded-full">
              {totalClicks} total
            </span>
          </div>
          {loading ? (
            <Skeleton className="h-52 w-full rounded-xl" />
          ) : trendData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-[#4a5a76] text-sm">No trend data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#172033" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#4a5a76", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a5a76", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#00d4aa"
                  strokeWidth={2.5}
                  fill="url(#gradTeal)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#00d4aa", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Browsers + Devices row */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-52 rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 fade-in-up delay-300">
            <DonutChart data={analytics?.browsers || []} title="Browsers" />
            <DonutChart data={analytics?.devices || []} title="Devices" />
          </div>
        )}

        {/* Recent visits */}
        <div className="glass-card rounded-2xl overflow-hidden fade-in-up delay-300">
          <div className="px-6 py-4 border-b border-[#1e2d45]">
            <h2 className="text-sm font-semibold text-[#f0f4ff]">Recent Visits</h2>
            <p className="text-xs text-[#4a5a76] mt-0.5">Last 10 clicks</p>
          </div>
          {loading ? (
            <div className="p-4 flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : recentClicks.length === 0 ? (
            <EmptyState
              title="No visits yet"
              description="Share your link and visits will appear here in real time."
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#172033]">
                    <th className="text-left px-6 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest">Time</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest">Browser</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest">Device</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172033]">
                  {recentClicks.map((click, i) => (
                    <tr key={i} className="table-row-hover transition-colors">
                      <td className="px-6 py-3.5 text-sm text-[#8b9cba] font-mono-custom whitespace-nowrap">
                        {new Date(click.timestamp).toLocaleString("en-US", {
                          month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-[#00d4aa] font-medium">{click.browser || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-[#8b9cba]">{click.device || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-[#4a5a76]">{click.referrer || "Direct"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

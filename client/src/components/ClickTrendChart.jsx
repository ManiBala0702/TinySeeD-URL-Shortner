// src/components/ClickTrendChart.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="trend-tooltip">
        <p className="trend-tooltip__date">{label}</p>
        <p className="trend-tooltip__value">{payload[0].value} clicks</p>
      </div>
    );
  }
  return null;
};

const ClickTrendChart = ({ urlId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!urlId) return;
    const fetchTrend = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/analytics/${urlId}/trend`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Format date labels: "Jun 01"
        const formatted = res.data.map((d) => ({
          ...d,
          date: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          }),
        }));
        setData(formatted);
      } catch (err) {
        console.error("Trend fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrend();
  }, [urlId]);

  if (loading) {
    return (
      <div className="trend-card trend-card--loading">
        <div className="trend-skeleton" />
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.clicks, 0);
  const peak = Math.max(...data.map((d) => d.clicks));

  return (
    <div className="trend-card">
      <div className="trend-card__header">
        <div>
          <h3 className="trend-card__title">Click Trend</h3>
          <p className="trend-card__subtitle">Last 14 days</p>
        </div>
        <div className="trend-card__stats">
          <div className="trend-stat">
            <span className="trend-stat__val">{total}</span>
            <span className="trend-stat__label">Total</span>
          </div>
          <div className="trend-stat">
            <span className="trend-stat__val">{peak}</span>
            <span className="trend-stat__label">Peak</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(20,184,166,0.2)", strokeWidth: 2 }} />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            dot={{ fill: "#14b8a6", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 6, fill: "#14b8a6", strokeWidth: 3, stroke: "#0f172a" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClickTrendChart;

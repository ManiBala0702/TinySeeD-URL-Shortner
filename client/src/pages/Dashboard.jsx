import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { StatCard, StatCardSkeleton, TableSkeleton, EmptyState, Badge } from "../components/ui";
//import CategoryBadge from "../components/CategoryBadge";
import { useToast } from "../components/ui";

const API = import.meta.env.VITE_API_URL || "";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
        ${copied
          ? "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20"
          : "bg-[#111827] text-[#8b9cba] border border-[#1e2d45] hover:border-[#8b9cba]/40 hover:text-[#f0f4ff]"
        }`}
      title="Copy short URL"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
    
  );
}

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [qrModal, setQrModal] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const { data } = await axios.get(`${API}/api/urls`, { headers });
      setUrls(data);
    } catch {
      toast({ message: "Failed to load URLs", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/api/urls/${id}`, { headers });
      setUrls((prev) => prev.filter((u) => u._id !== id));
      toast({ message: "Link deleted successfully", type: "success" });
    } catch {
      toast({ message: "Failed to delete link", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);
  const activeLinks = urls.filter((u) => !u.expiresAt || new Date(u.expiresAt) > new Date()).length;

  const formatExpiry = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (d < new Date()) return { label: "Expired", variant: "red" };
    const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
    return { label: `${diff}d left`, variant: diff <= 3 ? "amber" : "teal" };
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#080c14]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 h-16 bg-[#080c14]/80 backdrop-blur-xl border-b border-[#1e2d45] flex items-center justify-between px-6 gap-4">
        <div>
          <h1 className="text-base font-semibold text-[#f0f4ff]">Dashboard</h1>
          <p className="text-xs text-[#4a5a76] hidden sm:block">Manage all your shortened links</p>
        </div>
        <Link
          to="/create"
          className="btn-primary flex items-center gap-2 px-4 h-9 text-sm font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Link</span>
        </Link>
      </header>

      <main className="flex-1 p-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 fade-in-up">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Links"
                value={urls.length}
                subtitle="All time created"
                accent="teal"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m.83-5.656a4 4 0 015.656 0l1 1a4 4 0 01-5.657 5.657l-1-1" />
                  </svg>
                }
              />
              <StatCard
                title="Total Clicks"
                value={totalClicks.toLocaleString()}
                subtitle="Across all links"
                accent="violet"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                }
              />
              <StatCard
                title="Active Links"
                value={activeLinks}
                subtitle="Currently working"
                accent="blue"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </>
          )}
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden fade-in-up delay-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2d45]">
            <div>
              <h2 className="text-sm font-semibold text-[#f0f4ff]">Your Links</h2>
              <p className="text-xs text-[#4a5a76] mt-0.5">{urls.length} total links</p>
            </div>
            {urls.length > 0 && (
              <Link to="/analytics" className="text-xs text-[#00d4aa] hover:text-[#00b899] font-medium flex items-center gap-1 transition-colors">
                View analytics
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="p-2">
              <TableSkeleton rows={3} />
            </div>
          ) : urls.length === 0 ? (
            <EmptyState
              title="No links yet"
              description="Create your first shortened link and start tracking clicks in real time."
              action={
                <Link to="/create" className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create your first link
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#172033]">
                    <th className="text-left px-6 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest">Original URL</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest">Short Link</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest hidden sm:table-cell">Clicks</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest hidden md:table-cell">Expires</th>
                    
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172033]">
                  {urls.map((url) => {
                    const expiry = formatExpiry(url.expiresAt);
                    const shortUrl = `http://localhost:5000/${url.shortCode}`;
                    return (
                      <tr key={url._id} className="table-row-hover transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#8b9cba] font-mono-custom truncate block max-w-[200px]" title={url.originalUrl}>
                            {url.originalUrl}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono-custom text-[#00d4aa] hover:text-[#00b899] transition-colors"
                          >
                            /{url.shortCode}
                          </a>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span className="inline-flex items-center justify-center w-9 h-7 rounded-lg bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-bold font-mono-custom">
                            {url.clicks || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          {expiry ? (
                            <Badge variant={expiry.variant}>{expiry.label}</Badge>
                          ) : (
                            <span className="text-xs text-[#4a5a76]">Never</span>
                          )}
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <CopyButton text={shortUrl} />
                            <button
                              onClick={() => navigate(`/analytics/${url._id}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#7c6ff7]/10 text-[#7c6ff7] border border-[#7c6ff7]/20 hover:bg-[#7c6ff7]/20 transition-all duration-200"
                              title="View analytics"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <span className="hidden sm:inline">Stats</span>
                            </button>
                            
            

                            <button
                              onClick={() => handleDelete(url._id)}
                              disabled={deletingId === url._id}
                              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#4a5a76] hover:text-[#f87171] hover:bg-[#f87171]/8 border border-transparent hover:border-[#f87171]/20 transition-all duration-200 disabled:opacity-40"
                              title="Delete"
                            >
                              {deletingId === url._id ? (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
{qrModal && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setQrModal(null)}
  >
    <div
      className="bg-white p-6 rounded-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={qrModal.qr}
        alt="QR Code"
        className="w-72 h-72 mx-auto"
      />

      <p className="mt-4 text-center text-sm break-all">
        {qrModal.shortUrl}
      </p>

      <button
        onClick={() => setQrModal(null)}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}

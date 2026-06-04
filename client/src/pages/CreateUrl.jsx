import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui";
import { useToast } from "../components/ui";

const API = import.meta.env.VITE_API_URL || "";

export default function CreateUrl() {
  const [form, setForm] = useState({ originalUrl: "", customAlias: "", expiresAt: "" });
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { originalUrl: form.originalUrl };
      if (form.customAlias.trim()) payload.customAlias = form.customAlias.trim();
      if (form.expiresAt) payload.expiresAt = new Date(form.expiresAt).toISOString();

      const { data } = await axios.post(`${API}/api/urls`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreated(data);
      toast({ message: "Short link created!", type: "success" });
    } catch (err) {
      toast({ message: err.response?.data?.message || "Failed to create link", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const shortUrl = created ? `http://localhost:5000/${created.shortCode}` : "";

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#080c14]">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-[#080c14]/80 backdrop-blur-xl border-b border-[#1e2d45] flex items-center px-6">
        <div>
          <h1 className="text-base font-semibold text-[#f0f4ff]">Shorten a URL</h1>
          <p className="text-xs text-[#4a5a76] hidden sm:block">Create a memorable short link with optional custom alias</p>
        </div>
      </header>

      <main className="flex-1 p-6 pb-24 md:pb-6 max-w-2xl mx-auto w-full">
        {!created ? (
          <div className="glass-card rounded-2xl overflow-hidden fade-in-up">
            {/* Card header */}
            <div className="px-8 pt-8 pb-6 border-b border-[#172033]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#0095ff] flex items-center justify-center mb-4 shadow-lg shadow-[#00d4aa]/15">
                <svg className="w-5 h-5 text-[#080c14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m.83-5.656a4 4 0 015.656 0l1 1a4 4 0 01-5.657 5.657l-1-1" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#f0f4ff]">New Short Link</h2>
              <p className="text-sm text-[#8b9cba] mt-1">Fill in the details below to generate your short URL</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-6">
              {/* Destination URL */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#8b9cba] uppercase tracking-wider flex items-center gap-2">
                  Destination URL
                  <span className="text-[#f87171] text-sm leading-none">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5a76]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                  <input
                    className="input-dark w-full h-12 pl-10 pr-4 text-sm"
                    type="url"
                    placeholder="https://example.com/your-long-url-here"
                    value={form.originalUrl}
                    onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Custom alias */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#8b9cba] uppercase tracking-wider flex items-center gap-2">
                  Custom Alias
                  <span className="text-xs normal-case font-normal text-[#4a5a76] tracking-normal border border-[#1e2d45] px-2 py-0.5 rounded-full">optional</span>
                </label>
                <div className="flex items-center gap-0 rounded-xl border border-[#1e2d45] overflow-hidden focus-within:border-[#00d4aa]/50 focus-within:shadow-[0_0_0_3px_rgba(0,212,170,0.08)] transition-all duration-200 bg-[#0d1322]">
                  <span className="flex items-center px-4 h-12 text-sm text-[#4a5a76] bg-[#080c14] border-r border-[#1e2d45] whitespace-nowrap font-mono-custom select-none flex-shrink-0">
                    {window.location.host}/
                  </span>
                  <input
                    className="flex-1 h-12 px-4 text-sm bg-transparent text-[#f0f4ff] outline-none placeholder-[#4a5a76] font-mono-custom"
                    type="text"
                    placeholder="my-link"
                    value={form.customAlias}
                    onChange={(e) => setForm({ ...form, customAlias: e.target.value.replace(/[^a-zA-Z0-9-]/g, "") })}
                    maxLength={30}
                  />
                </div>
                <p className="text-xs text-[#4a5a76]">Letters, numbers, hyphens only · Max 30 chars · Leave blank to auto-generate</p>
              </div>

              {/* Expiry */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#8b9cba] uppercase tracking-wider flex items-center gap-2">
                  Link Expiry
                  <span className="text-xs normal-case font-normal text-[#4a5a76] tracking-normal border border-[#1e2d45] px-2 py-0.5 rounded-full">optional</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5a76]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    className="input-dark w-full h-12 pl-10 pr-4 text-sm"
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <p className="text-xs text-[#4a5a76]">After this date/time the link will stop working</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-12 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating link...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Short URL
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success state */
          <div className="glass-card rounded-2xl overflow-hidden fade-in-up glow-teal">
            <div className="px-8 pt-8 pb-6 border-b border-[#172033]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center text-[#00d4aa]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#f0f4ff]">Link Created!</h2>
                  <p className="text-xs text-[#8b9cba]">Your short URL is ready to share</p>
                </div>
              </div>
            </div>
            <div className="px-8 py-6 flex flex-col gap-5">
              {/* Short URL display */}
              <div>
                <p className="text-xs font-semibold text-[#4a5a76] uppercase tracking-wider mb-2">Your Short Link</p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#080c14] border border-[#1e2d45]">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-[#00d4aa] font-mono-custom text-sm hover:text-[#00b899] transition-colors break-all"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={handleCopy}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${copied
                        ? "bg-[#00d4aa]/15 text-[#00d4aa] border border-[#00d4aa]/30"
                        : "bg-[#111827] text-[#8b9cba] border border-[#1e2d45] hover:text-[#f0f4ff]"
                      }`}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Original URL */}
              <div className="p-4 rounded-xl bg-[#080c14] border border-[#172033]">
                <p className="text-xs text-[#4a5a76] mb-1">Original URL</p>
                <p className="text-sm text-[#8b9cba] font-mono-custom truncate">{created.originalUrl}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setCreated(null); setForm({ originalUrl: "", customAlias: "", expiresAt: "" }); }}
                  className="btn-secondary flex-1 h-10 text-sm"
                >
                  Create another
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary flex-1 h-10 text-sm"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        {!created && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in-up delay-200">
            {[
              { icon: "⚡", title: "Instant redirect", desc: "Links redirect instantly with no delay" },
              { icon: "📊", title: "Click tracking", desc: "Track every click with device & browser info" },
              { icon: "🔗", title: "Custom aliases", desc: "Make links memorable with custom slugs" },
              { icon: "⏱️", title: "Link expiry", desc: "Set expiry dates for time-limited links" },
            ].map((tip) => (
              <div key={tip.title} className="flex items-start gap-3 p-4 rounded-xl bg-[#0d1322] border border-[#172033]">
                <span className="text-xl leading-none mt-0.5">{tip.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-[#f0f4ff]">{tip.title}</p>
                  <p className="text-xs text-[#4a5a76] mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button } from "../components/ui";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "⚡", text: "Instant short links" },
    { icon: "📊", text: "Detailed analytics" },
    { icon: "🔒", text: "Secure & private" },
    { icon: "📱", text: "QR code generation" },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 relative overflow-hidden noise-bg">
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#7c6ff7]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#00d4aa]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c6ff7] to-[#c471ed] flex items-center justify-center mb-4 shadow-xl shadow-[#7c6ff7]/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m.83-5.656a4 4 0 015.656 0l1 1a4 4 0 01-5.657 5.657l-1-1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#f0f4ff] tracking-tight">Create your account</h1>
          <p className="text-sm text-[#8b9cba] mt-1">Start shortening links for free</p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-7">
          {features.map((f) => (
            <span key={f.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111827] border border-[#1e2d45] text-xs text-[#8b9cba]">
              <span>{f.icon}</span>{f.text}
            </span>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          {error && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f87171]/8 border border-[#f87171]/20">
              <svg className="w-4 h-4 text-[#f87171] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[#f87171]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, #7c6ff7, #c471ed)" }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1e2d45] text-center">
            <p className="text-sm text-[#8b9cba]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#7c6ff7] font-medium hover:text-[#9b8fff] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#4a5a76] mt-6">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

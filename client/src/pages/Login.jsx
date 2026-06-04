import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button } from "../components/ui";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 relative overflow-hidden noise-bg">
      {/* Background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00d4aa]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#7c6ff7]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3b82f6]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#0095ff] flex items-center justify-center mb-4 shadow-xl shadow-[#00d4aa]/20">
            <svg className="w-6 h-6 text-[#080c14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m.83-5.656a4 4 0 015.656 0l1 1a4 4 0 01-5.657 5.657l-1-1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#f0f4ff] tracking-tight">Welcome back</h1>
          <p className="text-sm text-[#8b9cba] mt-1">Sign in to your TinySeed account</p>
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1e2d45] text-center">
            <p className="text-sm text-[#8b9cba]">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#00d4aa] font-medium hover:text-[#00b899] transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#4a5a76] mt-6">
          Secure · Fast · Reliable link shortening
        </p>
      </div>
    </div>
  );
}

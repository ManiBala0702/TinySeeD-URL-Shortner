import axios from "axios";

/**
 * PURPOSE:
 *   A pre-configured Axios instance used by every service module.
 *   Centralizes the base URL, default headers, and token injection.
 *   Instead of importing axios directly everywhere, all API calls go through this.
 *
 * REQUEST FLOW:
 *   service function → api.get/post() → request interceptor (adds JWT)
 *   → server → response interceptor (handles 401 globally) → service caller
 *
 * SECURITY CONSIDERATIONS:
 *   - JWT is read from localStorage per request — always fresh after login/logout.
 *   - On 401, the interceptor clears the token and redirects to /login.
 *     This handles token expiry transparently across the whole app.
 *   - BASE_URL points to /api — the Vite proxy forwards to Express in dev,
 *     and in production you'd set VITE_API_URL to your deployed API.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 second timeout
});

// ── Request Interceptor ─────────────────────────────────────
// Attach the JWT to every outgoing request automatically.
// Controllers will receive it in Authorization: Bearer <token>
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────
// Handle 401 globally — expired or invalid token → force logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth state
      localStorage.removeItem("token");
      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";

/**
 * PURPOSE:
 *   Provides authentication state (user, token, loading) to the entire app
 *   via React Context. Any component can call useAuth() to access the current
 *   user and the login/logout/register functions.
 *
 *   Avoids prop-drilling auth state through every component layer.
 *
 * REQUEST FLOW:
 *   App mounts → AuthProvider reads token from localStorage → calls /auth/me
 *   to restore session → sets user in state → child components render.
 *
 *   login() → authService.login() → stores token in localStorage → sets user state
 *   logout() → clears localStorage → clears user state
 *
 * SECURITY CONSIDERATIONS:
 *   - Token lives in localStorage. Simpler than cookies for a hackathon, but
 *     note: localStorage is accessible to JS — XSS could steal it.
 *     For production, prefer httpOnly cookies.
 *   - On mount, we re-validate the token via /auth/me. If the server rejects it
 *     (expired, invalid), we clear it silently.
 *   - User state in memory is cleared on logout — the UI reacts immediately.
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // Restore session on mount: if a token exists, validate it with the server
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch {
        // Token is invalid or expired — clear it silently
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — throws if used outside AuthProvider (catches wiring mistakes early)
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

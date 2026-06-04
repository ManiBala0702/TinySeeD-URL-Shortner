import api from "./api";

/**
 * PURPOSE:
 *   Encapsulates all auth-related API calls. Components never call
 *   axios/api directly — they go through this service layer.
 *   This makes it trivial to swap the API implementation later.
 *
 * REQUEST FLOW:
 *   AuthContext → authService.login() → api.post("/auth/login")
 *   → Express route → authController.login() → JWT response
 *   → authService returns data → AuthContext stores token + user
 */

export const authService = {
  /**
   * Register a new user account.
   * @param {{ name: string, email: string, password: string }} data
   * @returns {{ token: string, user: object }}
   */
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  /**
   * Log in with email + password.
   * @param {{ email: string, password: string }} data
   * @returns {{ token: string, user: object }}
   */
  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  /**
   * Fetch the currently authenticated user's profile.
   * Requires a valid JWT (injected by request interceptor).
   * @returns {{ user: object }}
   */
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

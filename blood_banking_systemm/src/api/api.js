import axios from "axios";

/**
 * Shared Axios instance.
 *
 * Why /api and not http://localhost:8081/api?
 *   Using a relative URL means all requests go through the Vite dev-server
 *   proxy (configured in vite.config.js). This makes the browser and backend
 *   share the SAME origin (localhost:5173), so the httpOnly JWT cookie is
 *   automatically included in every request — no manual token attachment needed.
 *
 * withCredentials: true
 *   Tells Axios to include cookies (and other credentials) on cross-origin
 *   requests. Required even with the proxy when backend sets Set-Cookie.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,                // sends httpOnly cookie automatically
  headers: { "Content-Type": "application/json" },
});

// No request interceptor needed — cookie is sent by the browser automatically.

// Response interceptor: clear UI state on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove any stale user info from localStorage
      localStorage.removeItem("user");
      // Only redirect if not already on auth pages
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import React, { createContext, useState, useEffect } from "react";
import { getMe, logout as apiLogout } from "../api/authService";

export const AuthContext = createContext();

/**
 * AuthProvider — manages global authentication state.
 *
 * Cookie-based auth design:
 *  - JWT lives in an httpOnly cookie (set/cleared by the server).
 *  - JS cannot read the token → XSS-safe.
 *  - Non-sensitive user info (name, email, role) is cached in localStorage
 *    so the UI shows the correct name immediately on refresh without waiting
 *    for the /me network call.
 *  - On mount, we call /api/auth/me to verify the cookie is still valid.
 *    If it's expired or missing, we clear local state.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // true while verifying session

  // ── Restore session on page load ──────────────────────────────────────────
  useEffect(() => {
    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        // Optimistically show the cached user while we verify
        setUser(JSON.parse(cached));
        setLoggedIn(true);
      } catch {
        localStorage.removeItem("user");
      }
    }

    // Verify cookie is still valid with the server
    getMe()
      .then((res) => {
        const serverUser = res.data?.data;
        if (serverUser) {
          setUser(serverUser);
          setLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(serverUser));
        } else {
          clearState();
        }
      })
      .catch(() => {
        // 401 or network error → clear stale state
        clearState();
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Called after successful login or register ─────────────────────────────
  const login = (userData) => {
    // userData = { name, email, bloodType, role } — no token, it's in the cookie
    setUser(userData);
    setLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ── Called on logout ──────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await apiLogout(); // asks server to clear the httpOnly cookie
    } catch {
      // ignore network errors on logout
    }
    clearState();
  };

  const clearState = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loggedIn, loading, login, logout, setLoggedIn, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

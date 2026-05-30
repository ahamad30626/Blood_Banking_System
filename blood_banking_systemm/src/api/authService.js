/**
 * authService.js
 * Centralises all auth-related API calls.
 * Components import functions from here — not from raw api.js.
 */
import api from "./api";

/** Register a new user. Returns { data: { name, email, bloodType, role } } */
export const register = (payload) => api.post("/auth/register", payload);

/** Login with email + password. Sets httpOnly cookie on success. */
export const login = (payload) => api.post("/auth/login", payload);

/**
 * Clear the httpOnly cookie on the server side.
 * Frontend cannot clear an httpOnly cookie itself — must ask the server.
 */
export const logout = () => api.post("/auth/logout");

/**
 * Check if the current cookie is still valid and get user info.
 * Called on page load to restore session without asking user to log in again.
 */
export const getMe = () => api.get("/auth/me");

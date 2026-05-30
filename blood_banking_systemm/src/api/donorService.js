/**
 * donorService.js
 * All donor-related API calls in one place.
 */
import api from "./api";

/** Register a new donor */
export const registerDonor = (donor) => api.post("/donors", donor);

/**
 * Get paginated donor list.
 * @param {number} page  - zero-based page index
 * @param {number} size  - items per page
 * @param {string} sortBy - field to sort by (default: 'id')
 */
export const getDonors = (page = 0, size = 10, sortBy = "id", direction = "asc") =>
  api.get("/donors", { params: { page, size, sortBy, direction } });

/** Get a single donor by ID */
export const getDonorById = (id) => api.get(`/donors/${id}`);

/** Donor-specific login */
export const donorLogin = (username, password) =>
  api.post("/donors/login", { username, password });

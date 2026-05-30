/**
 * requestService.js
 * All blood-request API calls in one place.
 */
import api from "./api";

/** Submit a new blood request */
export const createRequest = (request) => api.post("/requests", request);

/**
 * Get paginated blood requests list.
 * Defaults to newest-first (requestedAt desc).
 */
export const getRequests = (page = 0, size = 10, sortBy = "requestedAt", direction = "desc") =>
  api.get("/requests", { params: { page, size, sortBy, direction } });

/** Get a single blood request by ID */
export const getRequestById = (id) => api.get(`/requests/${id}`);

/** Update request status (ADMIN only on backend) */
export const updateStatus = (id, status) =>
  api.put(`/requests/${id}/status`, { status });

/** Delete a blood request (ADMIN only on backend) */
export const deleteRequest = (id) => api.delete(`/requests/${id}`);

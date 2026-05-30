import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRequests, createRequest, deleteRequest } from "../api/requestService";
import {
  FaTint, FaPlus, FaTimes, FaCheckCircle, FaClipboardList,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaExclamationCircle,
  FaTrash, FaChevronLeft, FaChevronRight, FaExclamationTriangle
} from "react-icons/fa";
import "./Request.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const emptyForm = {
  name: "", bloodGroup: "", phone: "", email: "", location: "", reason: "",
};

const Request = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN";

  const [requests, setRequests]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [apiError, setApiError]   = useState("");
  const [success, setSuccess]     = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deletingId, setDeletingId]     = useState(null);  // confirm dialog

  // Pagination
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => { fetchRequests(0); }, []);

  const fetchRequests = async (pageNum = 0) => {
    setFetching(true);
    setApiError("");
    try {
      const res = await getRequests(pageNum, PAGE_SIZE);
      const pageData = res.data.data;
      setRequests(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalItems(pageData.totalElements || 0);
      setPage(pageNum);
    } catch {
      setApiError("Failed to load blood requests. Is the backend running?");
    } finally {
      setFetching(false);
    }
  };

  // ── Field validation ──────────────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === "name"       && !value.trim()) return "Patient name is required";
    if (name === "bloodGroup" && !value)        return "Blood group is required";
    if (name === "phone"      && !value.trim()) return "Phone is required";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(""); setSuccess("");

    const newErrors = {};
    ["name", "bloodGroup", "phone"].forEach((f) => {
      const err = validateField(f, form[f] || "");
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await createRequest(form);
      setSuccess("✓ Blood request submitted successfully!");
      setForm(emptyForm);
      setErrors({});
      setShowModal(false);
      fetchRequests(0);
    } catch (err) {
      if (err.response?.data?.data && typeof err.response.data.data === "object") {
        setErrors(err.response.data.data);
      } else {
        setApiError(err.response?.data?.message || "Submission failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Delete with confirmation dialog ──────────────────────────────────────
  const handleDeleteConfirm = (id) => setDeletingId(id);  // show dialog
  const handleDeleteCancel  = ()  => setDeletingId(null);

  const handleDeleteExecute = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      await deleteRequest(deletingId);
      setSuccess("✓ Request deleted successfully.");
      setDeletingId(null);
      fetchRequests(page);
    } catch (err) {
      setApiError(err.response?.data?.message || "Delete failed.");
      setDeletingId(null);
    } finally {
      setLoading(false);
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const filtered = filterStatus
    ? requests.filter((r) => r.status === filterStatus)
    : requests;

  const statusBadge = (status) => {
    const map = { PENDING: "badge-pending", FULFILLED: "badge-fulfilled", CANCELLED: "badge-cancelled" };
    return `badge ${map[status] || "badge-pending"}`;
  };

  const formatDate = (dt) =>
    dt ? new Date(dt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="request-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><FaClipboardList /> Blood Requests</h1>
          <p>{totalItems} total request{totalItems !== 1 ? "s" : ""} · Page {page + 1} of {totalPages || 1}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setApiError(""); setSuccess(""); setErrors({}); }}>
          <FaPlus /> New Request
        </button>
      </div>

      {success  && <div className="alert alert-success"><FaCheckCircle /> {success}</div>}
      {apiError && <div className="alert alert-error"><FaExclamationCircle /> {apiError}</div>}

      {/* Status filter */}
      <div className="filters-bar">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span className="donor-count"><FaTint /> {filtered.length} shown</span>
      </div>

      {/* Table */}
      {fetching ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FaTint className="empty-icon" />
          <p>No blood requests found. Submit the first one!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Patient</th><th>Blood Group</th>
                <th>Contact</th><th>Location</th><th>Reason</th>
                <th>Date</th><th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{page * PAGE_SIZE + i + 1}</td>
                  <td><strong>{r.name}</strong></td>
                  <td><span className="blood-badge">{r.bloodGroup}</span></td>
                  <td style={{ fontSize: "0.82rem" }}>
                    <div><FaPhone className="row-icon" />{r.phone}</div>
                    {r.email && <div><FaEnvelope className="row-icon" />{r.email}</div>}
                  </td>
                  <td><FaMapMarkerAlt className="row-icon" />{r.location || "—"}</td>
                  <td style={{ maxWidth: 140, color: "#94a3b8", fontSize: "0.82rem" }}>{r.reason || "—"}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{formatDate(r.requestedAt)}</td>
                  <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                  {isAdmin && (
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteConfirm(r.id)}
                        title="Delete request"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => fetchRequests(page - 1)} disabled={page === 0 || fetching}>
            <FaChevronLeft /> Prev
          </button>
          <span className="page-info">Page {page + 1} / {totalPages}</span>
          <button className="page-btn" onClick={() => fetchRequests(page + 1)} disabled={page >= totalPages - 1 || fetching}>
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deletingId && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon"><FaExclamationTriangle /></div>
            <h3>Delete Blood Request?</h3>
            <p>This action cannot be undone. The request will be permanently removed.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={handleDeleteCancel}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteExecute} disabled={loading}>
                {loading ? <span className="btn-spinner" /> : <><FaTrash /> Yes, Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Request Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaTint /> Blood Request Form</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            {apiError && <div className="alert alert-error">{apiError}</div>}
            <form onSubmit={handleSubmit} className="modal-form" noValidate>
              <div className="form-row">
                <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                  <label>Patient Name *</label>
                  <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
                  {errors.name && <span className="field-error"><FaExclamationCircle />{errors.name}</span>}
                </div>
                <div className={`form-group ${errors.bloodGroup ? "has-error" : ""}`}>
                  <label>Blood Group *</label>
                  <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.bloodGroup && <span className="field-error"><FaExclamationCircle />{errors.bloodGroup}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
                  <label>Phone *</label>
                  <input type="tel" name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                  {errors.phone && <span className="field-error"><FaExclamationCircle />{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="hospital@example.com" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" placeholder="Hospital name, City" value={form.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Reason for Request</label>
                <textarea name="reason" placeholder="Emergency surgery, accident…" value={form.reason} onChange={handleChange} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : <><FaTint /> Submit Request</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;

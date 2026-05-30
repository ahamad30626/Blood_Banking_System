import React, { useState, useEffect } from "react";
import { getDonors, registerDonor } from "../api/donorService";
import {
  FaHandHoldingHeart, FaUsers, FaTint, FaPhone,
  FaEnvelope, FaMapMarkerAlt, FaPlus, FaTimes,
  FaCheckCircle, FaExclamationCircle, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import "./Donar.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const emptyForm = {
  name: "", location: "", phone: "", email: "",
  bloodGroup: "", username: "", password: "",
};

const Donar = () => {
  const [donors, setDonors]     = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess]   = useState("");
  const [search, setSearch]     = useState("");
  const [filterBG, setFilterBG] = useState("");

  // Pagination state
  const [page, setPage]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => { fetchDonors(0); }, []);

  const fetchDonors = async (pageNum = 0) => {
    setFetching(true);
    setApiError("");
    try {
      const res = await getDonors(pageNum, PAGE_SIZE);
      const pageData = res.data.data; // Spring Page object
      setDonors(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalItems(pageData.totalElements || 0);
      setPage(pageNum);
    } catch {
      setApiError("Failed to load donors. Is the backend running?");
    } finally {
      setFetching(false);
    }
  };

  // ── Real-time form validation ─────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === "name"     && !value.trim()) return "Name is required";
    if (name === "bloodGroup" && !value)      return "Blood group is required";
    if (name === "phone"    && !value.trim()) return "Phone is required";
    if (name === "username" && !value.trim()) return "Username is required";
    if (name === "password" && value.length < 6) return "Password must be 6+ characters";
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

    // Full validation
    const requiredFields = ["name", "bloodGroup", "phone", "username", "password"];
    const newErrors = {};
    requiredFields.forEach((f) => {
      const err = validateField(f, form[f] || "");
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await registerDonor(form);
      setSuccess("✓ Donor registered successfully!");
      setForm(emptyForm);
      setErrors({});
      setShowForm(false);
      fetchDonors(0);
    } catch (err) {
      if (err.response?.data?.data && typeof err.response.data.data === "object") {
        setErrors(err.response.data.data); // field-level backend errors
      } else {
        setApiError(err.response?.data?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Client-side filter ────────────────────────────────────────────────────
  const filtered = donors.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      d.name?.toLowerCase().includes(q)     ||
      d.location?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q);
    return matchSearch && (filterBG ? d.bloodGroup === filterBG : true);
  });

  return (
    <div className="donar-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><FaHandHoldingHeart /> Blood Donors</h1>
          <p>
            {totalItems} donor{totalItems !== 1 ? "s" : ""} registered ·
            Page {page + 1} of {totalPages || 1}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setApiError(""); setSuccess(""); setErrors({}); }}>
          <FaPlus /> Register as Donor
        </button>
      </div>

      {/* Messages */}
      {apiError && <div className="alert alert-error"><FaExclamationCircle /> {apiError}</div>}
      {success  && <div className="alert alert-success"><FaCheckCircle /> {success}</div>}

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text" placeholder="Search name, location or email…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={filterBG} onChange={(e) => setFilterBG(e.target.value)} className="filter-select">
          <option value="">All Blood Groups</option>
          {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <span className="donor-count"><FaUsers /> {filtered.length} shown</span>
      </div>

      {/* Table */}
      {fetching ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FaTint className="empty-icon" />
          <p>No donors found. Be the first to register!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="donors-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Blood Group</th>
                <th>Location</th><th>Phone</th><th>Email</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id}>
                  <td>{page * PAGE_SIZE + i + 1}</td>
                  <td><strong>{d.name}</strong></td>
                  <td><span className="blood-badge">{d.bloodGroup}</span></td>
                  <td><FaMapMarkerAlt className="row-icon" /> {d.location || "—"}</td>
                  <td><FaPhone className="row-icon" /> {d.phone}</td>
                  <td><FaEnvelope className="row-icon" /> {d.email || "—"}</td>
                  <td>
                    <span className={`badge ${d.available ? "badge-fulfilled" : "badge-cancelled"}`}>
                      {d.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => fetchDonors(page - 1)}
            disabled={page === 0 || fetching}
          >
            <FaChevronLeft /> Prev
          </button>
          <span className="page-info">Page {page + 1} / {totalPages}</span>
          <button
            className="page-btn"
            onClick={() => fetchDonors(page + 1)}
            disabled={page >= totalPages - 1 || fetching}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* Registration Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaHandHoldingHeart /> Donor Registration</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}><FaTimes /></button>
            </div>

            {apiError && <div className="alert alert-error">{apiError}</div>}

            <form onSubmit={handleSubmit} className="modal-form" noValidate>
              <div className="form-row">
                <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                  <label>Full Name *</label>
                  <input type="text" name="name" placeholder="John Doe"
                    onChange={handleChange} value={form.name} />
                  {errors.name && <span className="field-error"><FaExclamationCircle />{errors.name}</span>}
                </div>
                <div className={`form-group ${errors.bloodGroup ? "has-error" : ""}`}>
                  <label>Blood Group *</label>
                  <select name="bloodGroup" onChange={handleChange} value={form.bloodGroup}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.bloodGroup && <span className="field-error"><FaExclamationCircle />{errors.bloodGroup}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
                  <label>Phone *</label>
                  <input type="tel" name="phone" placeholder="9876543210"
                    onChange={handleChange} value={form.phone} />
                  {errors.phone && <span className="field-error"><FaExclamationCircle />{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="you@example.com"
                    onChange={handleChange} value={form.email} />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" placeholder="City, State"
                  onChange={handleChange} value={form.location} />
              </div>
              <div className="form-row">
                <div className={`form-group ${errors.username ? "has-error" : ""}`}>
                  <label>Username *</label>
                  <input type="text" name="username" placeholder="donor_username"
                    onChange={handleChange} value={form.username} />
                  {errors.username && <span className="field-error"><FaExclamationCircle />{errors.username}</span>}
                </div>
                <div className={`form-group ${errors.password ? "has-error" : ""}`}>
                  <label>Password *</label>
                  <input type="password" name="password" placeholder="6+ characters"
                    onChange={handleChange} value={form.password} />
                  {errors.password && <span className="field-error"><FaExclamationCircle />{errors.password}</span>}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : <><FaHandHoldingHeart /> Register Donor</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donar;

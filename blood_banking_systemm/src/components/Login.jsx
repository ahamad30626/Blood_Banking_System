import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login as apiLogin } from "../api/authService";
import { FaTint, FaEnvelope, FaLock, FaSignInAlt, FaExclamationCircle } from "react-icons/fa";
import "./Auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});          // field-level errors
  const [apiError, setApiError] = useState("");         // server-level error
  const [loading, setLoading] = useState(false);

  // ── Real-time field validation ────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    }
    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear field error as user types
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
    setApiError("");
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields before sending
    const newErrors = {
      email:    validateField("email",    form.email),
      password: validateField("password", form.password),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const res  = await apiLogin(form);
      const data = res.data?.data;             // { name, email, bloodType, role }
      login(data);                             // update AuthContext + localStorage
      navigate("/");
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      // Handle validation errors from backend (Map<field, message>)
      if (err.response?.data?.data && typeof err.response.data.data === "object") {
        setErrors(err.response.data.data);
      } else {
        setApiError(serverMsg || "Login failed. Please try again.");
      }
      // Show rate-limit message
      if (err.response?.status === 429) {
        setApiError(serverMsg || "Too many attempts. Please wait a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><FaTint /></div>
          <h1>Welcome Back</h1>
          <p>Sign in to your BloodBank account</p>
        </div>

        {/* Server-level error banner */}
        {apiError && (
          <div className="alert alert-error">
            <FaExclamationCircle /> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="field-error"><FaExclamationCircle /> {errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <label>Password</label>
            <div className="input-icon-wrap">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <span className="field-error"><FaExclamationCircle /> {errors.password}</span>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? <span className="btn-spinner" />
              : <><FaSignInAlt /> Sign In</>
            }
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

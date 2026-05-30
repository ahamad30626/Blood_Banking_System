import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register as apiRegister } from "../api/authService";
import {
  FaTint, FaUser, FaEnvelope, FaLock, FaUserPlus, FaExclamationCircle, FaCheckCircle
} from "react-icons/fa";
import "./Auth.css";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

/** Field-level validators — mirror the backend @Valid constraints */
const validators = {
  name: (v) => {
    if (!v.trim()) return "Name is required";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email: (v) => {
    if (!v) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
    return "";
  },
  password: (v) => {
    if (!v) return "Password is required";
    if (v.length < 6) return "Password must be at least 6 characters";
    return "";
  },
  bloodType: () => "", // optional
};

/** Password strength indicator */
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: "" };
  if (pw.length < 6) return { level: 1, label: "Weak" };
  if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { level: 2, label: "Fair" };
  return { level: 3, label: "Strong" };
};

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ name: "", email: "", password: "", bloodType: "" });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Real-time validation feedback
    setErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) || "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Full validation pass
    const newErrors = Object.fromEntries(
      Object.entries(validators).map(([field, fn]) => [field, fn(form[field] || "")])
    );
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const res  = await apiRegister(form);
      const data = res.data?.data;
      login(data);
      navigate("/");
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (err.response?.data?.data && typeof err.response.data.data === "object") {
        setErrors(err.response.data.data);   // field-level server errors
      } else {
        setApiError(serverMsg || "Registration failed. Please try again.");
      }
      if (err.response?.status === 429) {
        setApiError(serverMsg || "Too many attempts. Please wait a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><FaTint /></div>
          <h1>Create Account</h1>
          <p>Join the BloodBank community today</p>
        </div>

        {apiError && (
          <div className="alert alert-error">
            <FaExclamationCircle /> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Name */}
          <div className={`form-group ${errors.name ? "has-error" : ""}`}>
            <label>Full Name</label>
            <div className="input-icon-wrap">
              <FaUser className="input-icon" />
              <input
                type="text" name="name" placeholder="John Doe"
                value={form.name} onChange={handleChange}
                className={errors.name ? "input-error" : ""}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="field-error"><FaExclamationCircle /> {errors.name}</span>}
          </div>

          {/* Email */}
          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <FaEnvelope className="input-icon" />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="field-error"><FaExclamationCircle /> {errors.email}</span>}
          </div>

          {/* Password + strength */}
          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <label>Password</label>
            <div className="input-icon-wrap">
              <FaLock className="input-icon" />
              <input
                type="password" name="password" placeholder="At least 6 characters"
                value={form.password} onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                autoComplete="new-password"
              />
            </div>
            {form.password && (
              <div className="strength-bar">
                <div className={`strength-fill level-${strength.level}`} />
                <span className={`strength-label level-${strength.level}`}>
                  {strength.level === 3 && <FaCheckCircle />} {strength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="field-error"><FaExclamationCircle /> {errors.password}</span>}
          </div>

          {/* Blood Type (optional) */}
          <div className="form-group">
            <label>Blood Type <span className="optional">(optional)</span></label>
            <select name="bloodType" value={form.bloodType} onChange={handleChange}>
              <option value="">Select your blood type</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.bloodType && <span className="field-error"><FaExclamationCircle /> {errors.bloodType}</span>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? <span className="btn-spinner" />
              : <><FaUserPlus /> Create Account</>
            }
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

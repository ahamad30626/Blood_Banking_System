import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTint, FaUser, FaSignOutAlt, FaBars, FaTimes, FaShieldAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { loggedIn, user, logout } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /** Logout — calls the server to clear the httpOnly cookie */
  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();       // AuthContext calls /api/auth/logout
    navigate("/");
    setMenuOpen(false);
    setLoggingOut(false);
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";
  const close = () => setMenuOpen(false);
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={close}>
          <FaTint className="logo-icon" />
          <span>BloodBank</span>
        </Link>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links */}
        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/"        className={isActive("/")}        onClick={close}>Home</Link>
          {loggedIn && (
            <>
              <Link to="/donar"   className={isActive("/donar")}   onClick={close}>Donors</Link>
              <Link to="/request" className={isActive("/request")} onClick={close}>Blood Request</Link>
            </>
          )}
          <Link to="/contact" className={isActive("/contact")} onClick={close}>Contact</Link>
        </div>

        {/* Auth section */}
        <div className="nav-actions">
          {loggedIn ? (
            <div className="user-info">
              <div className="avatar">
                {isAdmin ? <FaShieldAlt title="Admin" /> : <FaUser />}
              </div>
              <span className="user-name">{user?.name}</span>
              {isAdmin && <span className="admin-badge">ADMIN</span>}
              <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
                <FaSignOutAlt />
                {loggingOut ? "…" : "Logout"}
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <button className="btn btn-outline" onClick={() => navigate("/login")}>Login</button>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>Register</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

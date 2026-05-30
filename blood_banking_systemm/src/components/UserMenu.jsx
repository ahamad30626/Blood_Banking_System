import React, { useContext } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * UserMenu — shown in the navbar when user is logged in.
 * Now uses the `logout` helper from AuthContext for clean session clearing.
 */
const UserMenu = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <FaUserCircle style={{ fontSize: 28, color: "#dc2626" }} title={user?.name} />
      <span style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.9rem" }}>
        {user?.name}
      </span>
      <button
        onClick={handleLogout}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
          color: "#ef4444", borderRadius: 8, padding: "6px 12px",
          cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
          fontFamily: "inherit", transition: "all 0.2s",
        }}
        title="Logout"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default UserMenu;

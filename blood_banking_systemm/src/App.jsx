import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Donar from "./components/Donar";
import Request from "./components/Request";
import Contact from "./components/Contact";

/* ── Protected Route wrapper ── */
const ProtectedRoute = ({ children }) => {
  const { loggedIn, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }
  return loggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/donar"    element={<ProtectedRoute><Donar /></ProtectedRoute>} />
          <Route path="/request"  element={<ProtectedRoute><Request /></ProtectedRoute>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

export default App;

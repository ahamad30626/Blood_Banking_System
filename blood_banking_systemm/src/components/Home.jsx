import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTint, FaHandHoldingHeart, FaHeartbeat, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { loggedIn } = useContext(AuthContext);

  const handleProtected = (path) => {
    if (loggedIn) navigate(path);
    else navigate("/login");
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaTint /> Life-Saving Platform
          </div>
          <h1 className="hero-title">
            Save Lives Through
            <span className="highlight"> Blood Donation</span>
          </h1>
          <p className="hero-subtitle">
            Connect blood donors with those in need. Our platform makes blood
            donation simple, safe, and efficient — one drop at a time.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary hero-btn" onClick={() => handleProtected("/donar")}>
              Become a Donor <FaArrowRight />
            </button>
            <button className="btn btn-outline hero-btn" onClick={() => handleProtected("/request")}>
              Request Blood
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Active Donors</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">1,200+</span>
              <span className="stat-label">Lives Saved</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">8</span>
              <span className="stat-label">Blood Types</span>
            </div>
          </div>
        </div>

        {/* Decorative blood drop */}
        <div className="hero-visual">
          <div className="blood-drop-ring ring1" />
          <div className="blood-drop-ring ring2" />
          <div className="blood-drop-ring ring3" />
          <div className="blood-drop-center">
            <FaTint />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="features">
        <h2 className="section-title">How It Works</h2>
        <div className="cards-grid">
          <div className="feature-card" onClick={() => handleProtected("/donar")}>
            <div className="card-icon-wrap red">
              <FaHandHoldingHeart />
            </div>
            <h3>Register as Donor</h3>
            <p>
              Create your donor profile with your blood group and location. Help
              save lives in your community.
            </p>
            <span className="card-link">Get Started <FaArrowRight /></span>
          </div>

          <div className="feature-card" onClick={() => handleProtected("/request")}>
            <div className="card-icon-wrap orange">
              <FaTint />
            </div>
            <h3>Request Blood</h3>
            <p>
              Submit a blood request with urgency level and location. We'll match
              you with available donors instantly.
            </p>
            <span className="card-link">Request Now <FaArrowRight /></span>
          </div>

          <div className="feature-card">
            <div className="card-icon-wrap green">
              <FaShieldAlt />
            </div>
            <h3>Safe & Secure</h3>
            <p>
              Your data is protected with JWT authentication. All communications
              are encrypted and private.
            </p>
            <span className="card-link">Learn More <FaArrowRight /></span>
          </div>
        </div>
      </section>

      {/* Blood Types Banner */}
      <section className="blood-types-section">
        <h2 className="section-title">Blood Types We Support</h2>
        <div className="blood-types-grid">
          {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((type) => (
            <div className="blood-type-badge" key={type}>
              <FaTint className="drop-icon" />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      {!loggedIn && (
        <section className="cta-banner">
          <div className="cta-content">
            <FaHeartbeat className="cta-icon" />
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of donors who have already saved lives.</p>
            <div className="cta-actions">
              <button className="btn btn-primary" onClick={() => navigate("/register")}>
                Register Now — It's Free
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/login")}>
                Already have an account? Login
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2024 BloodBank System · Built with ❤️ for saving lives</p>
      </footer>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send (no backend endpoint for contact yet)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="contact-layout">
        {/* Left Info Panel */}
        <div className="contact-info">
          <h1>Get in Touch</h1>
          <p>
            Have questions about blood donation or need help? We're here for you.
            Reach out and our team will respond within 24 hours.
          </p>

          <div className="info-items">
            <div className="info-item">
              <div className="info-icon"><FaPhone /></div>
              <div>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><FaEnvelope /></div>
              <div>
                <strong>Email</strong>
                <p>support@bloodbank.in</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><FaMapMarkerAlt /></div>
              <div>
                <strong>Address</strong>
                <p>Blood Bank HQ, Hyderabad, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="contact-form-box">
          <h2>Send Us a Message</h2>

          {success && (
            <div className="alert alert-success">
              <FaCheckCircle /> Message sent! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row-2">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text" name="name" placeholder="John Doe"
                  value={form.name} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text" name="subject" placeholder="How can we help you?"
                value={form.subject} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message" placeholder="Write your message here..."
                value={form.message} onChange={handleChange}
                rows={5} required
              />
            </div>
            <button type="submit" className="btn btn-primary contact-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <><FaPaperPlane /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

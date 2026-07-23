import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdSend,
  MdCheckCircle,
  MdError,
  MdPerson,
  MdSubject,
  MdMessage,
} from "react-icons/md";
import { FaFire, FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.contact-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  padding-bottom: 80px;
}

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.a1 { animation: fadeUp .5s ease .00s both; }
.a2 { animation: fadeUp .5s ease .10s both; }
.a3 { animation: fadeUp .5s ease .20s both; }
.a4 { animation: fadeUp .5s ease .30s both; }
.a5 { animation: fadeUp .5s ease .40s both; }

@media (prefers-reduced-motion: reduce) {
  .a1,.a2,.a3,.a4,.a5 { animation: none; opacity: 1; }
}

/* ── Back Button ── */
.contact-back {
  position: fixed;
  top: 18px;
  left: clamp(16px, 4vw, 40px);
  z-index: 200;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(9,9,14,.7);
  backdrop-filter: blur(12px);
  border: 1px solid #1e1e28;
  border-radius: 100px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px 8px 10px;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}
.contact-back:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(9,9,14,.9);
}

/* ── Hero ── */
.contact-hero {
  position: relative;
  width: 100%;
  height: clamp(240px, 35vw, 380px);
  overflow: hidden;
}
.contact-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.contact-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(9,9,14,.92) 0%,
    rgba(9,9,14,.6) 50%,
    rgba(9,9,14,.3) 75%,
    transparent 100%
  );
}
@media (max-width: 640px) {
  .contact-hero-overlay {
    background: linear-gradient(
      0deg,
      rgba(9,9,14,.95) 0%,
      rgba(9,9,14,.6) 50%,
      transparent 100%
    );
  }
}
.contact-hero-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(to top, #09090E, transparent);
}
.contact-hero-content {
  position: absolute;
  bottom: clamp(30px, 5vw, 60px);
  left: clamp(20px, 5vw, 56px);
  max-width: min(560px, 80%);
}
@media (max-width: 640px) {
  .contact-hero-content { max-width: 90%; left: 16px; bottom: 24px; }
}
.contact-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(245,166,35,.12);
  border: 1px solid rgba(245,166,35,.3);
  border-radius: 100px;
  padding: 4px 14px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  color: #F5A623;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.contact-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 4.5vw, 48px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.025em;
  color: #F0EDE8;
}
.contact-hero-title span { color: #F5A623; }
.contact-hero-desc {
  font-size: clamp(13px, 1vw, 16px);
  color: #aaa;
  line-height: 1.7;
  max-width: 420px;
  margin-top: 10px;
}

/* ── Container ── */
.contact-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 40px);
}

/* ── Main Grid ── */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-top: clamp(32px, 5vw, 48px);
}
@media (min-width: 768px) {
  .contact-grid {
    grid-template-columns: 3fr 2fr;
    gap: 40px;
  }
}

/* ── Form ── */
.contact-form-wrapper {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 16px;
  padding: clamp(24px, 3vw, 36px);
}
.contact-form-title {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #F0EDE8;
  margin-bottom: 4px;
}
.contact-form-sub {
  font-size: 13px;
  color: #555;
  margin-bottom: 24px;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.contact-form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.contact-form-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  color: #444;
  text-transform: uppercase;
}
.contact-form-input {
  display: flex;
  align-items: center;
  background: #09090E;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  padding: 0 14px;
  transition: border-color .2s;
}
.contact-form-input:focus-within {
  border-color: rgba(245,166,35,.5);
}
.contact-form-input .icon {
  color: #444;
  font-size: 18px;
  margin-right: 10px;
  flex-shrink: 0;
}
.contact-form-input input,
.contact-form-input textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  padding: 12px 0;
}
.contact-form-input textarea {
  resize: vertical;
  min-height: 100px;
  padding: 12px 0;
}
.contact-form-input input::placeholder,
.contact-form-input textarea::placeholder {
  color: #333;
}

.contact-form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 480px) {
  .contact-form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-form-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #F5A623;
  border: none;
  border-radius: 11px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  padding: 14px 24px;
  cursor: pointer;
  transition: background .15s, transform .1s;
  margin-top: 4px;
}
.contact-form-btn:hover {
  background: #E09920;
}
.contact-form-btn:active {
  transform: scale(.97);
}
.contact-form-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.contact-form-success {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(16,185,129,.08);
  border: 1px solid rgba(16,185,129,.2);
  border-radius: 10px;
  padding: 14px 18px;
  color: #10B981;
  font-size: 14px;
  font-weight: 500;
}
.contact-form-error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239,68,68,.08);
  border: 1px solid rgba(239,68,68,.2);
  border-radius: 10px;
  padding: 14px 18px;
  color: #EF4444;
  font-size: 14px;
  font-weight: 500;
}

/* ── Info Sidebar ── */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.contact-info-card {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 14px;
  padding: 24px 22px;
  transition: border-color .2s;
}
.contact-info-card:hover {
  border-color: rgba(245,166,35,.15);
}
.contact-info-icon {
  font-size: 28px;
  color: #F5A623;
  margin-bottom: 10px;
  display: inline-block;
}
.contact-info-title {
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #F0EDE8;
  margin-bottom: 4px;
}
.contact-info-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
.contact-info-text a {
  color: #F5A623;
  text-decoration: none;
  transition: color .15s;
}
.contact-info-text a:hover {
  color: #E09920;
}

/* ── Social Links ── */
.contact-social {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.contact-social-btn {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255,255,255,.04);
  border: 1px solid #1e1e28;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  cursor: pointer;
  transition: all .25s ease;
  font-size: 20px;
}
.contact-social-btn:hover {
  background: rgba(245,166,35,.08);
  border-color: rgba(245,166,35,.3);
  color: #F5A623;
  transform: translateY(-3px);
}

/* ── Map Placeholder ── */
.contact-map {
  background: #0d0d14;
  border: 1px solid #18181f;
  border-radius: 14px;
  padding: 40px 20px;
  text-align: center;
  overflow: hidden;
}
.contact-map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #444;
}
.contact-map-placeholder .icon {
  font-size: 40px;
  color: #2a2a38;
}
.contact-map-placeholder .text {
  font-size: 13px;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .contact-hero { height: 200px; }
  .contact-form-wrapper { padding: 18px 16px; }
  .contact-info-card { padding: 18px 16px; }
  .contact-form-row { grid-template-columns: 1fr; }
}
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // ✅ Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="contact-root">

        {/* ── Back Button ── */}
        <button className="contact-back" onClick={() => navigate(-1)}>
          <MdArrowBack size={16} /> Back
        </button>

        {/* ── Hero ── */}
        <div className="contact-hero">
          <img
            className="contact-hero-img"
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=85"
            alt="Contact us"
            loading="eager"
          />
          <div className="contact-hero-overlay" />
          <div className="contact-hero-bottom" />
          <div className="contact-hero-content a1">
            <div className="contact-hero-tag">
              <FaFire size={10} /> Get in Touch
            </div>
            <h1 className="contact-hero-title">
              Let's <span>connect</span>
            </h1>
            <p className="contact-hero-desc">
              Have a question, feedback, or just want to say hello?
              We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="contact-container">

          <div className="contact-grid">

            {/* ── Left: Contact Form ── */}
            <div className="contact-form-wrapper a2">
              <h2 className="contact-form-title">Send us a message</h2>
              <p className="contact-form-sub">
                We'll get back to you within 24 hours.
              </p>

              {success && (
                <div className="contact-form-success a3">
                  <MdCheckCircle size={20} />
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="contact-form-error a3">
                  <MdError size={20} />
                  {error}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-form-label" htmlFor="name">Your Name</label>
                    <div className="contact-form-input">
                      <MdPerson className="icon" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="contact-form-group">
                    <label className="contact-form-label" htmlFor="email">Email</label>
                    <div className="contact-form-input">
                      <MdEmail className="icon" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="subject">Subject</label>
                  <div className="contact-form-input">
                    <MdSubject className="icon" />
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="message">Message</label>
                  <div className="contact-form-input">
                    <MdMessage className="icon" style={{ alignSelf: "flex-start", marginTop: 14 }} />
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what's on your mind..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="contact-form-btn" disabled={loading}>
                  {loading ? "Sending..." : <><MdSend size={18} /> Send Message</>}
                </button>
              </form>
            </div>

            {/* ── Right: Contact Info ── */}
            <div className="contact-info a3">

              {/* Email */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><MdEmail /></div>
                <div className="contact-info-title">Email</div>
                <p className="contact-info-text">
                  <a href="mailto:support@bookit.com">support@bookit.com</a>
                  <br />
                  <span style={{ color: "#444", fontSize: "12px" }}>We reply within 24 hours</span>
                </p>
              </div>

              {/* Phone */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><MdPhone /></div>
                <div className="contact-info-title">Phone</div>
                <p className="contact-info-text">
                  <a href="tel:+919876543210">+91 98765 43210</a>
                  <br />
                  <span style={{ color: "#444", fontSize: "12px" }}>Mon–Sat, 10 AM – 8 PM</span>
                </p>
              </div>

              {/* Address */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><MdLocationOn /></div>
                <div className="contact-info-title">Address</div>
                <p className="contact-info-text">
                  bookit Cinemas HQ
                  <br />
                  Mumbai, Maharashtra 400001
                  <br />
                  India
                </p>
              </div>

              {/* Social */}
              <div className="contact-info-card">
                <div className="contact-info-title" style={{ marginBottom: 8 }}>Follow Us</div>
                <div className="contact-social">
                  {[
                    { Icon: FaInstagram, label: "Instagram", color: "#E4405F" },
                    { Icon: FaFacebook, label: "Facebook", color: "#1877F2" },
                    { Icon: FaTwitter, label: "Twitter", color: "#1DA1F2" },
                    { Icon: FaYoutube, label: "YouTube", color: "#FF0000" },
                  ].map((social) => (
                    <button
                      key={social.label}
                      className="contact-social-btn"
                      aria-label={social.label}
                      style={{ fontSize: 20 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = social.color;
                        e.currentTarget.style.borderColor = social.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#666";
                        e.currentTarget.style.borderColor = "#1e1e28";
                      }}
                    >
                      <social.Icon />
                    </button>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="contact-map">
                <div className="contact-map-placeholder">
                  <MdLocationOn className="icon" />
                  <span className="text">📍 Find us on Google Maps</span>
                  <span style={{ color: "#222", fontSize: "11px" }}>Mumbai, India</span>
                </div>
              </div>

            </div>
          </div>

          <div style={{ height: 40 }} />

        </div>
      </div>
    </>
  );
}
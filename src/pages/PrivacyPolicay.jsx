import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSecurity,
  MdVerified,
  MdLock,
  MdDataUsage,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdInfo,
  MdCheckCircle,
  MdWarning,
  MdShield,
  MdPrivacyTip,
  MdStore,
  MdPeople,
  MdAnalytics,
  MdCookie,
  MdGavel,
} from "react-icons/md";
import { FaFire, FaShieldAlt } from "react-icons/fa";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.pp-root {
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

.a1 { animation: fadeUp .5s ease .00s both; }
.a2 { animation: fadeUp .5s ease .10s both; }
.a3 { animation: fadeUp .5s ease .20s both; }
.a4 { animation: fadeUp .5s ease .30s both; }
.a5 { animation: fadeUp .5s ease .40s both; }
.a6 { animation: fadeUp .5s ease .50s both; }

@media (prefers-reduced-motion: reduce) {
  .a1,.a2,.a3,.a4,.a5,.a6 { animation: none; opacity: 1; }
}

/* ── Back Button ── */
.pp-back {
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
.pp-back:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(9,9,14,.9);
}

/* ── Hero ── */
.pp-hero {
  position: relative;
  width: 100%;
  height: clamp(220px, 30vw, 340px);
  overflow: hidden;
}
.pp-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pp-hero-overlay {
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
  .pp-hero-overlay {
    background: linear-gradient(
      0deg,
      rgba(9,9,14,.95) 0%,
      rgba(9,9,14,.6) 50%,
      transparent 100%
    );
  }
}
.pp-hero-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(to top, #09090E, transparent);
}
.pp-hero-content {
  position: absolute;
  bottom: clamp(28px, 4vw, 50px);
  left: clamp(20px, 5vw, 56px);
  max-width: min(540px, 80%);
}
@media (max-width: 640px) {
  .pp-hero-content { max-width: 90%; left: 16px; bottom: 20px; }
}
.pp-hero-tag {
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
.pp-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(26px, 4vw, 44px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.025em;
  color: #F0EDE8;
}
.pp-hero-title span { color: #F5A623; }
.pp-hero-desc {
  font-size: clamp(13px, 1vw, 16px);
  color: #aaa;
  line-height: 1.7;
  max-width: 420px;
  margin-top: 8px;
}

/* ── Container ── */
.pp-container {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 40px);
}

/* ── Table of Contents ── */
.pp-toc {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 14px;
  padding: 24px 28px;
  margin-top: clamp(28px, 4vw, 40px);
}
.pp-toc-title {
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #F0EDE8;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.pp-toc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 24px;
}
@media (max-width: 480px) {
  .pp-toc-grid { grid-template-columns: 1fr; }
}
.pp-toc-link {
  background: none;
  border: none;
  color: #555;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  padding: 4px 0;
  transition: color .15s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.pp-toc-link:hover {
  color: #F5A623;
}
.pp-toc-link .dot {
  color: #F5A623;
  font-size: 6px;
}

/* ── Section ── */
.pp-section {
  margin-top: clamp(36px, 5vw, 52px);
}
.pp-section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}
.pp-section-icon {
  font-size: 24px;
  color: #F5A623;
  flex-shrink: 0;
}
.pp-section-title {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #F0EDE8;
}
.pp-section-line {
  flex: 1;
  height: 1px;
  background: #16161e;
}
.pp-section-body {
  padding-left: 4px;
}
.pp-section-body p {
  font-size: 14px;
  color: #777;
  line-height: 1.8;
  margin-bottom: 12px;
}
.pp-section-body ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}
.pp-section-body ul li {
  font-size: 14px;
  color: #666;
  padding: 6px 0 6px 24px;
  position: relative;
  line-height: 1.6;
}
.pp-section-body ul li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: #F5A623;
  font-size: 18px;
}
.pp-section-body strong {
  color: #F0EDE8;
}
.pp-section-body .highlight {
  background: rgba(245,166,35,.06);
  border-left: 3px solid #F5A623;
  padding: 12px 18px;
  border-radius: 0 8px 8px 0;
  margin: 12px 0;
}
.pp-section-body .highlight p {
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* ── Last Updated ── */
.pp-updated {
  margin-top: 48px;
  padding: 20px 24px;
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  text-align: center;
}
.pp-updated-text {
  font-size: 13px;
  color: #444;
}
.pp-updated-text strong {
  color: #F5A623;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .pp-hero { height: 180px; }
  .pp-toc { padding: 18px 16px; }
  .pp-toc-grid { grid-template-columns: 1fr; }
  .pp-section-body p { font-size: 13px; }
  .pp-section-body ul li { font-size: 13px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "info",
    icon: <MdInfo />,
    title: "Information We Collect",
    content: (
      <>
        <p>
          We collect information to provide you with a seamless ticket booking experience.
          This includes data you provide directly and data collected automatically.
        </p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and payment details when you create an account or make a booking</li>
          <li><strong>Booking History:</strong> Movies you've watched, seats selected, theaters visited, and booking preferences</li>
          <li><strong>Device Information:</strong> IP address, browser type, device type, and operating system</li>
          <li><strong>Usage Data:</strong> Pages visited, features used, and time spent on our platform</li>
          <li><strong>Location Data:</strong> City and theater preferences to show relevant listings</li>
        </ul>
        <div className="highlight">
          <p>
            <strong>🔒 We never store your payment card details.</strong> All payments are processed
            through secure, PCI-DSS compliant third-party gateways.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "use",
    icon: <MdDataUsage />,
    title: "How We Use Your Data",
    content: (
      <>
        <p>
          Your information helps us deliver a personalized and secure movie booking experience.
          Here's how we use your data:
        </p>
        <ul>
          <li><strong>Process Bookings:</strong> To confirm your seat selection, generate tickets, and send booking confirmations</li>
          <li><strong>Personalization:</strong> To recommend movies and showtimes based on your preferences</li>
          <li><strong>Communication:</strong> To send you booking updates, promotional offers, and important service announcements</li>
          <li><strong>Improvement:</strong> To analyze usage patterns and enhance our platform's features and performance</li>
          <li><strong>Security:</strong> To detect and prevent fraudulent activities and unauthorized access</li>
        </ul>
      </>
    ),
  },
  {
    id: "share",
    icon: <MdPeople />,
    title: "Data Sharing & Disclosure",
    content: (
      <>
        <p>
          We value your privacy and do not sell your personal information.
          We share data only when necessary:
        </p>
        <ul>
          <li><strong>Service Providers:</strong> Payment processors, email delivery services, and cloud hosting providers that help us operate the platform</li>
          <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets (with your prior consent where required)</li>
          <li><strong>With Your Consent:</strong> We will always ask for your permission before sharing data for any other purpose</li>
        </ul>
        <div className="highlight">
          <p>
            <strong>✅ We never sell your data.</strong> Your trust is important to us, and we're committed
            to protecting your privacy.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "security",
    icon: <MdSecurity />,
    title: "Data Security",
    content: (
      <>
        <p>
          We implement industry-standard security measures to protect your data from
          unauthorized access, alteration, and loss.
        </p>
        <ul>
          <li><strong>Encryption:</strong> All data transmission is encrypted using SSL/TLS protocols</li>
          <li><strong>Access Control:</strong> Strict role-based access to sensitive data</li>
          <li><strong>Monitoring:</strong> Continuous security monitoring and vulnerability assessments</li>
          <li><strong>Secure Infrastructure:</strong> ISO-certified data centers with advanced physical security</li>
          <li><strong>Data Minimization:</strong> We only collect and retain data that is necessary for our services</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    icon: <MdCookie />,
    title: "Cookies & Tracking",
    content: (
      <>
        <p>
          We use cookies and similar technologies to enhance your experience on our platform.
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> Enable core functionality like booking and authentication</li>
          <li><strong>Preference Cookies:</strong> Remember your language, city, and seating preferences</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how you interact with our platform</li>
          <li><strong>Marketing Cookies:</strong> Used to show you relevant movie recommendations (you can opt-out)</li>
        </ul>
        <p>
          You can manage your cookie preferences through your browser settings at any time.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    icon: <MdGavel />,
    title: "Your Privacy Rights",
    content: (
      <>
        <p>
          You have the following rights regarding your personal data:
        </p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the data we hold about you</li>
          <li><strong>Correction:</strong> Update or correct your personal information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
          <li><strong>Objection:</strong> Opt-out of marketing communications and certain data processing</li>
          <li><strong>Portability:</strong> Request your data in a structured, commonly used format</li>
        </ul>
        <div className="highlight">
          <p>
            <strong>📧 To exercise your rights, contact us at:</strong> privacy@bookit.com
          </p>
        </div>
      </>
    ),
  },
  {
    id: "updates",
    icon: <MdVerified />,
    title: "Policy Updates",
    content: (
      <>
        <p>
          We may update this privacy policy from time to time to reflect changes in our
          practices or legal requirements.
        </p>
        <ul>
          <li>We will notify you of significant changes via email or platform notification</li>
          <li>The date of the latest revision will always be displayed at the bottom of this page</li>
          <li>Continued use of our platform constitutes acceptance of the updated policy</li>
        </ul>
        <p>
          We encourage you to review this policy periodically to stay informed about how
          we protect your data.
        </p>
      </>
    ),
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-root">

        {/* ── Back Button ── */}
        <button className="pp-back" onClick={() => navigate(-1)}>
          <MdArrowBack size={16} /> Back
        </button>

        {/* ── Hero ── */}
        <div className="pp-hero">
          <img
            className="pp-hero-img"
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=85"
            alt="Privacy Policy"
            loading="eager"
          />
          <div className="pp-hero-overlay" />
          <div className="pp-hero-bottom" />
          <div className="pp-hero-content a1">
            <div className="pp-hero-tag">
              <FaFire size={10} /> Privacy
            </div>
            <h1 className="pp-hero-title">
              Your <span>Privacy</span> Matters
            </h1>
            <p className="pp-hero-desc">
              We're committed to protecting your data and being transparent
              about how we use it.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="pp-container">

          {/* ── Table of Contents ── */}
          <div className="pp-toc a2">
            <div className="pp-toc-title">
              <MdShield size={18} color="#F5A623" /> Table of Contents
            </div>
            <div className="pp-toc-grid">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  className="pp-toc-link"
                  onClick={() => scrollToSection(section.id)}
                >
                  <span className="dot">●</span>
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* ── Sections ── */}
          {SECTIONS.map((section, index) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className={`pp-section a${Math.min(index + 3, 6)}`}
            >
              <div className="pp-section-header">
                <span className="pp-section-icon">{section.icon}</span>
                <h2 className="pp-section-title">{section.title}</h2>
                <div className="pp-section-line" />
              </div>
              <div className="pp-section-body">
                {section.content}
              </div>
            </div>
          ))}

          {/* ── Last Updated ── */}
          <div className="pp-updated a6">
            <p className="pp-updated-text">
              <strong>📅 Last Updated:</strong> 26 June 2026
            </p>
            <p className="pp-updated-text" style={{ marginTop: 6, color: "#333", fontSize: 12 }}>
              This policy applies to all users of the bookit platform.
            </p>
          </div>

          <div style={{ height: 32 }} />

        </div>
      </div>
    </>
  );
}
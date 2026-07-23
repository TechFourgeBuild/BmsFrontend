import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdGavel,
  MdVerified,
  MdLock,
  MdPayment,
  MdCancel,
  MdConfirmationNumber,
  MdAccountCircle,
  MdSecurity,
  MdInfo,
  MdWarning,
  MdCheckCircle,
  MdStore,
  MdPeople,
  MdAnalytics,
  MdCookie,
  MdPrivacyTip,
} from "react-icons/md";
import { FaFire } from "react-icons/fa";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.tc-root {
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
.tc-back {
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
.tc-back:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(9,9,14,.9);
}

/* ── Hero ── */
.tc-hero {
  position: relative;
  width: 100%;
  height: clamp(220px, 30vw, 340px);
  overflow: hidden;
}
.tc-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.tc-hero-overlay {
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
  .tc-hero-overlay {
    background: linear-gradient(
      0deg,
      rgba(9,9,14,.95) 0%,
      rgba(9,9,14,.6) 50%,
      transparent 100%
    );
  }
}
.tc-hero-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(to top, #09090E, transparent);
}
.tc-hero-content {
  position: absolute;
  bottom: clamp(28px, 4vw, 50px);
  left: clamp(20px, 5vw, 56px);
  max-width: min(540px, 80%);
}
@media (max-width: 640px) {
  .tc-hero-content { max-width: 90%; left: 16px; bottom: 20px; }
}
.tc-hero-tag {
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
.tc-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(26px, 4vw, 44px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.025em;
  color: #F0EDE8;
}
.tc-hero-title span { color: #F5A623; }
.tc-hero-desc {
  font-size: clamp(13px, 1vw, 16px);
  color: #aaa;
  line-height: 1.7;
  max-width: 420px;
  margin-top: 8px;
}

/* ── Container ── */
.tc-container {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 40px);
}

/* ── Table of Contents ── */
.tc-toc {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 14px;
  padding: 24px 28px;
  margin-top: clamp(28px, 4vw, 40px);
}
.tc-toc-title {
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #F0EDE8;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tc-toc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 24px;
}
@media (max-width: 480px) {
  .tc-toc-grid { grid-template-columns: 1fr; }
}
.tc-toc-link {
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
.tc-toc-link:hover {
  color: #F5A623;
}
.tc-toc-link .dot {
  color: #F5A623;
  font-size: 6px;
}

/* ── Section ── */
.tc-section {
  margin-top: clamp(36px, 5vw, 52px);
}
.tc-section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}
.tc-section-icon {
  font-size: 24px;
  color: #F5A623;
  flex-shrink: 0;
}
.tc-section-title {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #F0EDE8;
}
.tc-section-line {
  flex: 1;
  height: 1px;
  background: #16161e;
}
.tc-section-body {
  padding-left: 4px;
}
.tc-section-body p {
  font-size: 14px;
  color: #777;
  line-height: 1.8;
  margin-bottom: 12px;
}
.tc-section-body ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}
.tc-section-body ul li {
  font-size: 14px;
  color: #666;
  padding: 6px 0 6px 24px;
  position: relative;
  line-height: 1.6;
}
.tc-section-body ul li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: #F5A623;
  font-size: 18px;
}
.tc-section-body strong {
  color: #F0EDE8;
}
.tc-section-body .highlight {
  background: rgba(245,166,35,.06);
  border-left: 3px solid #F5A623;
  padding: 12px 18px;
  border-radius: 0 8px 8px 0;
  margin: 12px 0;
}
.tc-section-body .highlight p {
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* ── Last Updated ── */
.tc-updated {
  margin-top: 48px;
  padding: 20px 24px;
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  text-align: center;
}
.tc-updated-text {
  font-size: 13px;
  color: #444;
}
.tc-updated-text strong {
  color: #F5A623;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .tc-hero { height: 180px; }
  .tc-toc { padding: 18px 16px; }
  .tc-toc-grid { grid-template-columns: 1fr; }
  .tc-section-body p { font-size: 13px; }
  .tc-section-body ul li { font-size: 13px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "acceptance",
    icon: <MdVerified />,
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By using the bookit platform, you agree to comply with and be bound by
          these Terms and Conditions. If you do not agree to these terms,
          please do not use our services.
        </p>
        <ul>
          <li>These terms apply to all users, including registered users and guests</li>
          <li>Using our platform constitutes your acceptance of these terms</li>
          <li>We reserve the right to update these terms at any time</li>
          <li>Continued use implies acceptance of any changes</li>
        </ul>
        <div className="highlight">
          <p>
            <strong>📋 Last updated:</strong> This version of the Terms and Conditions
            is effective as of 26 June 2026.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "account",
    icon: <MdAccountCircle />,
    title: "User Accounts",
    content: (
      <>
        <p>
          To access certain features of our platform, you must create an account.
          You are responsible for maintaining the confidentiality of your credentials.
        </p>
        <ul>
          <li><strong>Account Creation:</strong> You must provide accurate and complete information</li>
          <li><strong>Security:</strong> You are responsible for all activities under your account</li>
          <li><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate our terms</li>
          <li><strong>Age Requirement:</strong> You must be at least 18 years old to create an account</li>
          <li><strong>One Account:</strong> Each user is allowed only one active account</li>
        </ul>
      </>
    ),
  },
  {
    id: "booking",
    icon: <MdConfirmationNumber />,
    title: "Booking & Ticketing",
    content: (
      <>
        <p>
          Our booking system is designed to be fair and transparent. Please review
          these policies before making a booking.
        </p>
        <ul>
          <li><strong>Seat Availability:</strong> Seats are allocated on a first-come, first-served basis</li>
          <li><strong>Payment:</strong> Full payment is required at the time of booking</li>
          <li><strong>Confirmation:</strong> A confirmation email will be sent after successful booking</li>
          <li><strong>Limit:</strong> There is a limit of 10 seats per booking</li>
          <li><strong>Accuracy:</strong> It is your responsibility to verify all booking details</li>
        </ul>
      </>
    ),
  },
  {
    id: "payment",
    icon: <MdPayment />,
    title: "Payments & Fees",
    content: (
      <>
        <p>
          All payments are processed securely through our trusted payment partners.
          Please read our fee structure carefully.
        </p>
        <ul>
          <li><strong>Pricing:</strong> Ticket prices are displayed before booking and are subject to change</li>
          <li><strong>Convenience Fee:</strong> A small convenience fee may apply to certain bookings</li>
          <li><strong>Currency:</strong> All transactions are processed in Indian Rupees (₹)</li>
          <li><strong>Security:</strong> We never store your payment card information</li>
          <li><strong>Disputes:</strong> For payment disputes, please contact support within 7 days</li>
        </ul>
        <div className="highlight">
          <p>
            <strong>🔒 Secure Payments:</strong> All transactions are encrypted and
            processed through PCI-DSS compliant gateways.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "cancellation",
    icon: <MdCancel />,
    title: "Cancellation & Refunds",
    content: (
      <>
        <p>
          We understand that plans can change. Our cancellation policy is designed
          to be fair while ensuring seat availability for other moviegoers.
        </p>
        <ul>
          <li><strong>Cancellation Window:</strong> Bookings can be cancelled up to 2 hours before the show</li>
          <li><strong>Refund Processing:</strong> Refunds are processed within 3-5 business days</li>
          <li><strong>Full Refund:</strong> Full refund for cancellations within the allowed window</li>
          <li><strong>No-Shows:</strong> No refund will be issued for no-shows</li>
          <li><strong>Service Fee:</strong> The service fee is non-refundable</li>
        </ul>
      </>
    ),
  },
  {
    id: "conduct",
    icon: <MdInfo />,
    title: "User Conduct",
    content: (
      <>
        <p>
          We strive to maintain a positive environment for all users. You agree to
          use our platform responsibly.
        </p>
        <ul>
          <li><strong>Respectful Use:</strong> Treat other users and staff with respect</li>
          <li><strong>No Misrepresentation:</strong> Do not impersonate others or provide false information</li>
          <li><strong>No Abuse:</strong> Do not exploit system vulnerabilities or engage in fraudulent activities</li>
          <li><strong>No Spam:</strong> Do not use our platform for unsolicited communications</li>
          <li><strong>Compliance:</strong> Comply with all applicable laws and regulations</li>
        </ul>
        <div className="highlight">
          <p>
            <strong>⚠️ Violations:</strong> We reserve the right to take action against
            any user who violates our terms, including account suspension or legal action.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "content",
    icon: <MdStore />,
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content on the bookit platform is protected by copyright and other
          intellectual property laws.
        </p>
        <ul>
          <li><strong>Ownership:</strong> All platform content is owned by bookit or its licensors</li>
          <li><strong>Permitted Use:</strong> You may use the platform for personal, non-commercial purposes</li>
          <li><strong>Prohibited Use:</strong> You may not copy, modify, or distribute platform content without permission</li>
          <li><strong>User Content:</strong> By posting content, you grant us a license to use it</li>
          <li><strong>Trademarks:</strong> The bookit name and logo are registered trademarks</li>
        </ul>
      </>
    ),
  },
  {
    id: "liability",
    icon: <MdWarning />,
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          We are committed to providing a reliable service, but we cannot be held
          liable for certain circumstances beyond our control.
        </p>
        <ul>
          <li><strong>No Guarantee:</strong> We do not guarantee uninterrupted or error-free service</li>
          <li><strong>External Factors:</strong> We are not liable for events outside our reasonable control</li>
          <li><strong>Maximum Liability:</strong> Our liability is limited to the amount paid for the booking</li>
          <li><strong>Consequential Damages:</strong> We are not liable for any indirect or consequential damages</li>
          <li><strong>Third-Party Sites:</strong> We are not responsible for third-party content or services</li>
        </ul>
      </>
    ),
  },
  {
    id: "termination",
    icon: <MdSecurity />,
    title: "Suspension & Termination",
    content: (
      <>
        <p>
          We reserve the right to suspend or terminate your account in certain
          circumstances.
        </p>
        <ul>
          <li><strong>Violation:</strong> If you violate any of our terms or policies</li>
          <li><strong>Suspicious Activity:</strong> If we suspect fraudulent or unauthorized activity</li>
          <li><strong>Inactivity:</strong> Accounts with no activity for over 12 months may be terminated</li>
          <li><strong>Convenience:</strong> You may close your account at any time through your profile settings</li>
          <li><strong>Data Retention:</strong> Some data may be retained for legal compliance after termination</li>
        </ul>
      </>
    ),
  },
  {
    id: "governing",
    icon: <MdGavel />,
    title: "Governing Law",
    content: (
      <>
        <p>
          These Terms and Conditions are governed by and construed in accordance
          with the laws of India.
        </p>
        <ul>
          <li><strong>Jurisdiction:</strong> Courts in Mumbai, India shall have exclusive jurisdiction</li>
          <li><strong>Disputes:</strong> We encourage resolving disputes through amicable negotiations</li>
          <li><strong>Arbitration:</strong> If resolution is not possible, disputes may be referred to arbitration</li>
          <li><strong>Severability:</strong> If any provision is found invalid, the remainder remains in effect</li>
          <li><strong>Waiver:</strong> Failure to enforce a provision does not waive our right to enforce it later</li>
        </ul>
        <div className="highlight">
          <p>
            <strong>⚖️ Contact for Legal Matters:</strong> legal@bookit.com
          </p>
        </div>
      </>
    ),
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TermsAndCondition() {
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
      <div className="tc-root">

        {/* ── Back Button ── */}
        <button className="tc-back" onClick={() => navigate(-1)}>
          <MdArrowBack size={16} /> Back
        </button>

        {/* ── Hero ── */}
        <div className="tc-hero">
          <img
            className="tc-hero-img"
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=85"
            alt="Terms and Conditions"
            loading="eager"
          />
          <div className="tc-hero-overlay" />
          <div className="tc-hero-bottom" />
          <div className="tc-hero-content a1">
            <div className="tc-hero-tag">
              <FaFire size={10} /> Legal
            </div>
            <h1 className="tc-hero-title">
              Terms & <span>Conditions</span>
            </h1>
            <p className="tc-hero-desc">
              Understanding the rules that govern your experience on the bookit platform.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="tc-container">

          {/* ── Table of Contents ── */}
          <div className="tc-toc a2">
            <div className="tc-toc-title">
              <MdGavel size={18} color="#F5A623" /> Table of Contents
            </div>
            <div className="tc-toc-grid">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  className="tc-toc-link"
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
              className={`tc-section a${Math.min(index + 3, 6)}`}
            >
              <div className="tc-section-header">
                <span className="tc-section-icon">{section.icon}</span>
                <h2 className="tc-section-title">{section.title}</h2>
                <div className="tc-section-line" />
              </div>
              <div className="tc-section-body">
                {section.content}
              </div>
            </div>
          ))}

          {/* ── Last Updated ── */}
          <div className="tc-updated a6">
            <p className="tc-updated-text">
              <strong>📅 Last Updated:</strong> 26 June 2026
            </p>
            <p className="tc-updated-text" style={{ marginTop: 6, color: "#333", fontSize: 12 }}>
              These Terms and Conditions apply to all users of the bookit platform.
            </p>
          </div>

          <div style={{ height: 32 }} />

        </div>
      </div>
    </>
  );
}
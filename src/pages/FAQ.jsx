import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdArrowForward,
  MdArrowDropDown,
  MdArrowDropUp,
  MdSearch,
  MdHelp,
  MdConfirmationNumber,
  MdPayment,
  MdCancel,
  MdEventSeat,
  MdMovie,
  MdAccountCircle,
  MdSecurity,
  MdSupportAgent,
} from "react-icons/md";
import { FaFire } from "react-icons/fa";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.faq-root {
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
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.a1 { animation: fadeUp .5s ease .00s both; }
.a2 { animation: fadeUp .5s ease .10s both; }
.a3 { animation: fadeUp .5s ease .20s both; }
.a4 { animation: fadeUp .5s ease .30s both; }

@media (prefers-reduced-motion: reduce) {
  .a1,.a2,.a3,.a4 { animation: none; opacity: 1; }
}

/* ── Back Button ── */
.faq-back {
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
.faq-back:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(9,9,14,.9);
}

/* ── Hero ── */
.faq-hero {
  position: relative;
  width: 100%;
  height: clamp(220px, 30vw, 340px);
  overflow: hidden;
}
.faq-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.faq-hero-overlay {
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
  .faq-hero-overlay {
    background: linear-gradient(
      0deg,
      rgba(9,9,14,.95) 0%,
      rgba(9,9,14,.6) 50%,
      transparent 100%
    );
  }
}
.faq-hero-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(to top, #09090E, transparent);
}
.faq-hero-content {
  position: absolute;
  bottom: clamp(28px, 4vw, 50px);
  left: clamp(20px, 5vw, 56px);
  max-width: min(540px, 80%);
}
@media (max-width: 640px) {
  .faq-hero-content { max-width: 90%; left: 16px; bottom: 20px; }
}
.faq-hero-tag {
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
.faq-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(26px, 4vw, 44px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.025em;
  color: #F0EDE8;
}
.faq-hero-title span { color: #F5A623; }
.faq-hero-desc {
  font-size: clamp(13px, 1vw, 16px);
  color: #aaa;
  line-height: 1.7;
  max-width: 400px;
  margin-top: 8px;
}

/* ── Container ── */
.faq-container {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 40px);
}

/* ── Search Bar ── */
.faq-search-wrapper {
  margin-top: clamp(28px, 4vw, 40px);
}
.faq-search {
  display: flex;
  align-items: center;
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 12px;
  padding: 0 18px;
  transition: border-color .2s;
}
.faq-search:focus-within {
  border-color: rgba(245,166,35,.5);
}
.faq-search .search-icon {
  color: #444;
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}
.faq-search input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  padding: 14px 0;
}
.faq-search input::placeholder {
  color: #333;
}
.faq-search .clear-btn {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  padding: 4px;
  font-size: 18px;
  transition: color .15s;
}
.faq-search .clear-btn:hover {
  color: #F5A623;
}

/* ── Category Filters ── */
.faq-categories {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
}
.faq-cat-btn {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 100px;
  color: #666;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 18px;
  cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
  white-space: nowrap;
}
.faq-cat-btn:hover {
  background: #1a1a24;
  color: #ccc;
}
.faq-cat-btn.active {
  background: rgba(245,166,35,.08);
  border-color: rgba(245,166,35,.35);
  color: #F5A623;
}

/* ── FAQ List ── */
.faq-list {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color .2s;
}
.faq-item:hover {
  border-color: rgba(245,166,35,.15);
}
.faq-item.open {
  border-color: rgba(245,166,35,.25);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 22px;
  cursor: pointer;
  width: 100%;
  background: none;
  border: none;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  transition: background .15s;
}
.faq-question:hover {
  background: rgba(255,255,255,.02);
}
.faq-question .icon {
  font-size: 20px;
  color: #F5A623;
  flex-shrink: 0;
}
.faq-question .arrow {
  color: #444;
  font-size: 22px;
  flex-shrink: 0;
  transition: transform .25s ease;
}
.faq-item.open .faq-question .arrow {
  transform: rotate(180deg);
}
.faq-question .q-label {
  flex: 1;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height .35s ease, padding .35s ease;
  padding: 0 22px;
}
.faq-item.open .faq-answer {
  max-height: 500px;
  padding: 0 22px 20px;
}
.faq-answer p {
  font-size: 14px;
  color: #777;
  line-height: 1.8;
}
.faq-answer p strong {
  color: #F5A623;
}
.faq-answer ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}
.faq-answer ul li {
  font-size: 13px;
  color: #666;
  padding: 4px 0 4px 22px;
  position: relative;
  line-height: 1.6;
}
.faq-answer ul li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: #F5A623;
  font-size: 18px;
}

/* ── No Results ── */
.faq-no-results {
  text-align: center;
  padding: 60px 20px;
  color: #555;
}
.faq-no-results .icon {
  font-size: 48px;
  color: #2a2a38;
  margin-bottom: 12px;
}
.faq-no-results .title {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #F0EDE8;
}
.faq-no-results .sub {
  font-size: 14px;
  margin-top: 4px;
}

/* ── Still Have Questions ── */
.faq-cta {
  background: linear-gradient(135deg, #111116 0%, #0d0d14 100%);
  border: 1px solid #1a1a24;
  border-radius: 16px;
  padding: clamp(32px, 4vw, 48px) clamp(20px, 4vw, 40px);
  text-align: center;
  margin-top: 40px;
}
.faq-cta-icon {
  font-size: 32px;
  color: #F5A623;
  margin-bottom: 10px;
}
.faq-cta-title {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #F0EDE8;
}
.faq-cta-text {
  font-size: 14px;
  color: #555;
  max-width: 400px;
  margin: 6px auto 20px;
  line-height: 1.7;
}
.faq-cta-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.faq-cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #F5A623;
  border: none;
  border-radius: 10px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  padding: 11px 24px;
  cursor: pointer;
  transition: background .15s;
}
.faq-cta-btn-primary:hover {
  background: #E09920;
}
.faq-cta-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  padding: 11px 24px;
  cursor: pointer;
  transition: border-color .15s;
}
.faq-cta-btn-secondary:hover {
  border-color: rgba(245,166,35,.4);
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .faq-hero { height: 180px; }
  .faq-question { padding: 14px 16px; font-size: 14px; }
  .faq-item.open .faq-answer { padding: 0 16px 16px; }
  .faq-answer p { font-size: 13px; }
}
`;

// ─── FAQ Data ──────────────────────────────────────────────────────────────────

const FAQ_DATA = [
  {
    id: 1,
    category: "booking",
    icon: <MdConfirmationNumber />,
    question: "How do I book a ticket?",
    answer: (
      <p>
        Booking a ticket on <strong>bookit</strong> is simple:
        <ul>
          <li>Browse movies and select a showtime</li>
          <li>Pick your preferred seats from the interactive seat map</li>
          <li>Review your booking and complete the payment</li>
          <li>You'll receive a confirmation email with your ticket details</li>
        </ul>
      </p>
    ),
  },
  {
    id: 2,
    category: "payment",
    icon: <MdPayment />,
    question: "What payment methods do you accept?",
    answer: (
      <p>
        We accept a variety of payment methods to make your booking convenient:
        <ul>
          <li>Credit & Debit Cards (Visa, Mastercard, RuPay)</li>
          <li>UPI (Google Pay, PhonePe, Paytm, Amazon Pay)</li>
          <li>Net Banking (all major banks)</li>
          <li>Wallets (Paytm, Amazon Pay)</li>
        </ul>
      </p>
    ),
  },
  {
    id: 3,
    category: "booking",
    icon: <MdCancel />,
    question: "Can I cancel my booking?",
    answer: (
      <p>
        Yes, you can cancel your booking up to <strong>2 hours</strong> before the show starts.
        <ul>
          <li>Go to "My Bookings" in your account</li>
          <li>Select the booking you want to cancel</li>
          <li>Click "Cancel Booking" and confirm</li>
          <li>The refund will be processed to your original payment method within 3-5 business days</li>
        </ul>
      </p>
    ),
  },
  {
    id: 4,
    category: "seats",
    icon: <MdEventSeat />,
    question: "How do seat selection works?",
    answer: (
      <p>
        Our interactive seat map gives you full control over your seating experience:
        <ul>
          <li><strong>Green seats</strong> are available for selection</li>
          <li><strong>Red seats</strong> are already booked by others</li>
          <li><strong>VIP seats</strong> are marked with a special label and may have a higher price</li>
          <li>You can select multiple seats for group bookings</li>
          <li>Your selected seats will be held for 10 minutes while you complete payment</li>
        </ul>
      </p>
    ),
  },
  {
    id: 5,
    category: "account",
    icon: <MdAccountCircle />,
    question: "How do I create an account?",
    answer: (
      <p>
        Creating an account is quick and free:
        <ul>
          <li>Click on "Register" in the top right corner</li>
          <li>Fill in your name, email, phone number, and password</li>
          <li>You'll receive a welcome email after successful registration</li>
          <li>You can also sign up using your Google or Facebook account</li>
        </ul>
      </p>
    ),
  },
  {
    id: 6,
    category: "booking",
    icon: <MdConfirmationNumber />,
    question: "Where can I find my booking details?",
    answer: (
      <p>
        You can find all your booking details in two places:
        <ul>
          <li><strong>Email:</strong> You'll receive a confirmation email with your ticket</li>
          <li><strong>My Bookings:</strong> Log in and visit "My Bookings" to see all your past and upcoming bookings</li>
          <li>You can also view and download your ticket from the confirmation page</li>
        </ul>
      </p>
    ),
  },
  {
    id: 7,
    category: "payment",
    icon: <MdPayment />,
    question: "Is it safe to pay online?",
    answer: (
      <p>
        Absolutely! We take security very seriously:
        <ul>
          <li>All payments are processed through secure, PCI-DSS compliant gateways</li>
          <li>Your card details are never stored on our servers</li>
          <li>We use industry-standard encryption (SSL/TLS) for all transactions</li>
          <li>We support 3D Secure (OTP) for added protection</li>
        </ul>
      </p>
    ),
  },
  {
    id: 8,
    category: "support",
    icon: <MdSupportAgent />,
    question: "How do I contact support?",
    answer: (
      <p>
        We're here to help! You can reach us through:
        <ul>
          <li><strong>Email:</strong> support@bookit.com (We reply within 24 hours)</li>
          <li><strong>Phone:</strong> +91 98765 43210 (Mon–Sat, 10 AM – 8 PM)</li>
          <li><strong>Live Chat:</strong> Available on the website during business hours</li>
          <li><strong>FAQ:</strong> You're already here! Check more questions below</li>
        </ul>
      </p>
    ),
  },
  {
    id: 9,
    category: "security",
    icon: <MdSecurity />,
    question: "How do you protect my data?",
    answer: (
      <p>
        Your privacy and data security are our top priorities:
        <ul>
          <li>We use end-to-end encryption for all data transmission</li>
          <li>We never share your personal information with third parties</li>
          <li>All data is stored in secure, ISO-certified data centers</li>
          <li>We follow GDPR and Indian data protection guidelines</li>
        </ul>
      </p>
    ),
  },
  {
    id: 10,
    category: "movies",
    icon: <MdMovie />,
    question: "How often do you add new movies?",
    answer: (
      <p>
        We update our movie catalog regularly:
        <ul>
          <li><strong>New releases</strong> are added as soon as theaters confirm showtimes</li>
          <li><strong>Coming soon</strong> section shows movies that will be available for booking soon</li>
          <li>We also feature classic and award-winning films from time to time</li>
          <li>You can subscribe to our newsletter to get updates about new movies</li>
        </ul>
      </p>
    ),
  },
];

const CATEGORIES = [
  { key: "all", label: "All Questions", icon: <MdHelp /> },
  { key: "booking", label: "Booking", icon: <MdConfirmationNumber /> },
  { key: "payment", label: "Payment", icon: <MdPayment /> },
  { key: "seats", label: "Seats", icon: <MdEventSeat /> },
  { key: "account", label: "Account", icon: <MdAccountCircle /> },
  { key: "support", label: "Support", icon: <MdSupportAgent /> },
  { key: "security", label: "Security", icon: <MdSecurity /> },
  { key: "movies", label: "Movies", icon: <MdMovie /> },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FAQ() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filtered = FAQ_DATA.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const clearSearch = () => setSearch("");

  return (
    <>
      <style>{CSS}</style>
      <div className="faq-root">

        {/* ── Back Button ── */}
        <button className="faq-back" onClick={() => navigate(-1)}>
          <MdArrowBack size={16} /> Back
        </button>

        {/* ── Hero ── */}
        <div className="faq-hero">
          <img
            className="faq-hero-img"
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=85"
            alt="FAQ"
            loading="eager"
          />
          <div className="faq-hero-overlay" />
          <div className="faq-hero-bottom" />
          <div className="faq-hero-content a1">
            <div className="faq-hero-tag">
              <FaFire size={10} /> Help Center
            </div>
            <h1 className="faq-hero-title">
              Frequently Asked <span>Questions</span>
            </h1>
            <p className="faq-hero-desc">
              Everything you need to know about booking tickets,
              payments, and more.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="faq-container">

       

          {/* ── Categories ── */}
          <div className="faq-categories a2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`faq-cat-btn${category === cat.key ? " active" : ""}`}
                onClick={() => setCategory(cat.key)}
              >
                <span style={{ marginRight: 4 }}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── FAQ List ── */}
          <div className="faq-list a3">
            {filtered.length === 0 ? (
              <div className="faq-no-results">
                <div className="icon">🔍</div>
                <div className="title">No results found</div>
                <p className="sub">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className={`faq-item${openId === item.id ? " open" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggle(item.id)}
                    aria-expanded={openId === item.id}
                  >
                    <span className="icon">{item.icon}</span>
                    <span className="q-label">{item.question}</span>
                    <span className="arrow">
                      {openId === item.id ? <MdArrowDropUp /> : <MdArrowDropDown />}
                    </span>
                  </button>
                  <div className="faq-answer">{item.answer}</div>
                </div>
              ))
            )}
          </div>

          {/* ── Still Have Questions ── */}
          <div className="faq-cta a4">
            <div className="faq-cta-icon">
              <MdSupportAgent />
            </div>
            <h3 className="faq-cta-title">Still have questions?</h3>
            <p className="faq-cta-text">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="faq-cta-btns">
              <button
                className="faq-cta-btn-primary"
                onClick={() => navigate("/contact")}
              >
                <MdSupportAgent size={16} /> Contact Us
              </button>
              <button
                className="faq-cta-btn-secondary"
                onClick={() => navigate("/")}
              >
                Browse Movies
              </button>
            </div>
          </div>

          <div style={{ height: 32 }} />

        </div>
      </div>
    </>
  );
}
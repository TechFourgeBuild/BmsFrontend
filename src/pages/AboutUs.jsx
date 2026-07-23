import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdMovie,
  MdTheaters,
  MdConfirmationNumber,
  MdPeople,
  MdStar,
  MdSecurity,
  MdSupportAgent,
  MdEmojiEvents,
  MdLocalMovies,
  MdEventSeat,
  MdVerified,
  MdPlayCircle,
  MdLocationOn,
  MdEmail,
  MdPhone,
} from "react-icons/md";
import { FaFire, FaFilm, FaTrophy, FaHeart } from "react-icons/fa";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.about-root {
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
  50% { transform: translateY(-8px); }
}
@keyframes shimmer {
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
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

/* ── Hero Section ── */
.about-hero {
  position: relative;
  width: 100%;
  height: clamp(320px, 50vw, 520px);
  overflow: hidden;
}
.about-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.about-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(9,9,14,.92) 0%,
    rgba(9,9,14,.7) 45%,
    rgba(9,9,14,.3) 70%,
    transparent 100%
  );
}
@media (max-width: 640px) {
  .about-hero-overlay {
    background: linear-gradient(
      0deg,
      rgba(9,9,14,.95) 0%,
      rgba(9,9,14,.6) 50%,
      transparent 100%
    );
  }
}
.about-hero-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 160px;
  background: linear-gradient(to top, #09090E, transparent);
}
.about-hero-content {
  position: absolute;
  bottom: clamp(40px, 6vw, 80px);
  left: clamp(24px, 5vw, 64px);
  max-width: min(640px, 80%);
}
@media (max-width: 640px) {
  .about-hero-content { max-width: 90%; left: 20px; bottom: 30px; }
}
.about-hero-tag {
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
  margin-bottom: 12px;
}
.about-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.025em;
  color: #F0EDE8;
}
.about-hero-title span { color: #F5A623; }
.about-hero-desc {
  font-size: clamp(14px, 1.2vw, 18px);
  color: #aaa;
  line-height: 1.8;
  max-width: 480px;
  margin-top: 14px;
}

/* ── Back Button ── */
.about-back {
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
.about-back:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(9,9,14,.9);
}

/* ── Container ── */
.about-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 40px);
}

/* ── Section ── */
.about-section {
  margin-top: clamp(48px, 6vw, 72px);
}
.about-section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}
.about-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .18em;
  color: #F5A623;
  text-transform: uppercase;
  white-space: nowrap;
}
.about-section-line {
  flex: 1;
  height: 1px;
  background: #16161e;
}

/* ── Mission Grid ── */
.about-mission-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .about-mission-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.about-mission-card {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 14px;
  padding: 28px 24px;
  text-align: center;
  transition: border-color .2s, transform .2s;
}
.about-mission-card:hover {
  border-color: rgba(245,166,35,.3);
  transform: translateY(-4px);
}
.about-mission-icon {
  font-size: 32px;
  color: #F5A623;
  margin-bottom: 14px;
  display: inline-block;
}
.about-mission-title {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #F0EDE8;
  margin-bottom: 8px;
}
.about-mission-text {
  font-size: 13px;
  color: #666;
  line-height: 1.7;
}

/* ── Stats ── */
.about-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 480px) {
  .about-stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.about-stat-card {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
}
.about-stat-number {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  color: #F5A623;
  line-height: 1;
}
.about-stat-label {
  font-size: 12px;
  color: #555;
  margin-top: 6px;
}

/* ── Values ── */
.about-values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 640px) {
  .about-values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.about-value-card {
  display: flex;
  gap: 16px;
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  padding: 20px 22px;
  transition: border-color .2s;
}
.about-value-card:hover {
  border-color: rgba(245,166,35,.25);
}
.about-value-icon {
  font-size: 28px;
  flex-shrink: 0;
  margin-top: 2px;
}
.about-value-content {}
.about-value-title {
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #F0EDE8;
  margin-bottom: 4px;
}
.about-value-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* ── Team ── */
.about-team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 480px) {
  .about-team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 768px) {
  .about-team-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.about-team-card {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 14px;
  padding: 24px 20px;
  text-align: center;
  transition: border-color .2s, transform .2s;
}
.about-team-card:hover {
  border-color: rgba(245,166,35,.25);
  transform: translateY(-3px);
}
.about-team-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(245,166,35,.15), rgba(245,166,35,.05));
  border: 2px solid rgba(245,166,35,.2);
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #F5A623;
}
.about-team-name {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #F0EDE8;
}
.about-team-role {
  font-size: 12px;
  color: #555;
  margin-top: 2px;
}
.about-team-bio {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  line-height: 1.6;
}

/* ── CTA ── */
.about-cta {
  background: linear-gradient(135deg, #111116 0%, #0d0d14 100%);
  border: 1px solid #1a1a24;
  border-radius: 20px;
  padding: clamp(40px, 6vw, 64px) clamp(24px, 5vw, 48px);
  text-align: center;
  margin-top: clamp(48px, 6vw, 72px);
}
.about-cta-icon {
  font-size: 40px;
  color: #F5A623;
  margin-bottom: 12px;
}
.about-cta-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  color: #F0EDE8;
  letter-spacing: -.02em;
}
.about-cta-title span { color: #F5A623; }
.about-cta-text {
  font-size: 14px;
  color: #555;
  max-width: 500px;
  margin: 10px auto 28px;
  line-height: 1.7;
}
.about-cta-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.about-cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #F5A623;
  border: none;
  border-radius: 11px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  padding: 13px 28px;
  cursor: pointer;
  transition: background .15s, transform .1s;
}
.about-cta-btn-primary:hover { background: #E09920; }
.about-cta-btn-primary:active { transform: scale(.97); }
.about-cta-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #1e1e28;
  border-radius: 11px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  padding: 13px 28px;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}
.about-cta-btn-secondary:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(255,255,255,.05);
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .about-hero { height: 280px; }
  .about-value-card { flex-direction: column; align-items: center; text-align: center; }
  .about-mission-card { padding: 20px 16px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "15+", label: "Movies" },
  { value: "8", label: "Theaters" },
  { value: "50K+", label: "Bookings" },
  { value: "5", label: "Languages" },
];

const VALUES = [
  {
    icon: "🎯",
    title: "Accessibility",
    text: "We believe everyone deserves access to great cinema, anywhere, anytime.",
  },
  {
    icon: "✨",
    title: "Quality Experience",
    text: "From seat selection to checkout, we design every step to be smooth and delightful.",
  },
  {
    icon: "🔒",
    title: "Trust & Security",
    text: "Your data is safe with us. We use industry-standard security to protect your bookings.",
  },
  {
    icon: "❤️",
    title: "Community First",
    text: "We're building a community of cinema lovers who share the joy of movies.",
  },
];

const TEAM = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    bio: "Cinema enthusiast with 10+ years in tech. Building bookit to make movie booking effortless.",
    initials: "RS",
  },
  {
    name: "Priya Patel",
    role: "Product Lead",
    bio: "Loves crafting user experiences that feel like magic. Previously built products for 5M+ users.",
    initials: "PP",
  },
  {
    name: "Amit Kumar",
    role: "Engineering Head",
    bio: "Full-stack developer with a passion for scalable systems and clean code.",
    initials: "AK",
  },
  {
    name: "Sneha Reddy",
    role: "Design Lead",
    bio: "Believes in design that speaks. Creates interfaces that are both beautiful and functional.",
    initials: "SR",
  },
  {
    name: "Vikram Singh",
    role: "Marketing Lead",
    bio: "Storyteller at heart. Helping movie lovers discover their next favorite film.",
    initials: "VS",
  },
  {
    name: "Ananya Desai",
    role: "Customer Experience",
    bio: "On a mission to make every user feel heard and valued. Cinema fan since childhood.",
    initials: "AD",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <>
      <style>{CSS}</style>
      <div className="about-root">

        {/* ── Back Button ── */}
        <button className="about-back" onClick={() => navigate(-1)}>
          <MdArrowBack size={16} /> Back
        </button>

        {/* ── Hero ── */}
        <div className="about-hero">
          <img
            className="about-hero-img"
            src="https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1400&q=85"
            alt="Cinema experience"
            loading="eager"
          />
          <div className="about-hero-overlay" />
          <div className="about-hero-bottom" />
          <div className="about-hero-content a1">
            <div className="about-hero-tag">
              <FaFire size={10} /> About Us
            </div>
            <h1 className="about-hero-title">
              Your ticket to <span>cinema</span>
            </h1>
            <p className="about-hero-desc">
              We're on a mission to make movie booking simple, joyful, and accessible
              for everyone. Because every story deserves to be seen on the big screen.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="about-container">

          {/* ── Mission Section ── */}
          <div className="about-section a2">
            <div className="about-section-header">
              <span className="about-section-label">Our Mission</span>
              <div className="about-section-line" />
            </div>
            <div className="about-mission-grid">
              <div className="about-mission-card">
                <div className="about-mission-icon">🎬</div>
                <div className="about-mission-title">Curated Selection</div>
                <p className="about-mission-text">
                  We handpick the best movies across languages and genres so you
                  never miss a great story.
                </p>
              </div>
              <div className="about-mission-card">
                <div className="about-mission-icon">💺</div>
                <div className="about-mission-title">Seamless Booking</div>
                <p className="about-mission-text">
                  From picking your seat to getting your ticket — it's all designed
                  to be fast, easy, and delightful.
                </p>
              </div>
              <div className="about-mission-card">
                <div className="about-mission-icon">🌟</div>
                <div className="about-mission-title">Cinema For All</div>
                <p className="about-mission-text">
                  We're building a platform where everyone, regardless of language
                  or location, can experience the magic of movies.
                </p>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="about-section a3">
            <div className="about-section-header">
              <span className="about-section-label">By the Numbers</span>
              <div className="about-section-line" />
            </div>
            <div className="about-stats-grid">
              {STATS.map((stat, i) => (
                <div key={i} className="about-stat-card">
                  <div className="about-stat-number">{stat.value}</div>
                  <div className="about-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Values ── */}
          <div className="about-section a4">
            <div className="about-section-header">
              <span className="about-section-label">Our Values</span>
              <div className="about-section-line" />
            </div>
            <div className="about-values-grid">
              {VALUES.map((val, i) => (
                <div key={i} className="about-value-card">
                  <div className="about-value-icon">{val.icon}</div>
                  <div className="about-value-content">
                    <div className="about-value-title">{val.title}</div>
                    <p className="about-value-text">{val.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Team ── */}
          <div className="about-section a5">
            <div className="about-section-header">
              <span className="about-section-label">Meet the Team</span>
              <div className="about-section-line" />
            </div>
            <div className="about-team-grid">
              {TEAM.map((member, i) => (
                <div key={i} className="about-team-card">
                  <div className="about-team-avatar">{member.initials}</div>
                  <div className="about-team-name">{member.name}</div>
                  <div className="about-team-role">{member.role}</div>
                  <p className="about-team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="about-cta a6">
            <div className="about-cta-icon">
              <MdPlayCircle size={40} />
            </div>
            <h2 className="about-cta-title">
              Join the <span>bookit</span> community
            </h2>
            <p className="about-cta-text">
              Discover your next favorite movie, book tickets in seconds, and
              experience cinema like never before.
            </p>
            <div className="about-cta-btns">
              <button
                className="about-cta-btn-primary"
                onClick={() => navigate("/movies")}
              >
                <MdMovie size={18} /> Browse Movies
              </button>
              <button
                className="about-cta-btn-secondary"
                onClick={() => navigate("/register")}
              >
                <FaHeart size={16} /> Join Now
              </button>
            </div>
          </div>

          <div style={{ height: 20 }} />

        </div>
      </div>
    </>
  );
}
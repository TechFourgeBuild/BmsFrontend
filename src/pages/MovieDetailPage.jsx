import { useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdStar,
  MdAccessTime,
  MdLanguage,
  MdCalendarMonth,
  MdArrowBack,
  MdPlayCircle,
  MdConfirmationNumber,
  MdTheaters,
  MdDateRange,
} from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { fetchMovieById } from "../store/slices/movieSlice";
import { fetchShowsByMovie } from "../store/slices/showSlice";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmtDuration = (mins) => {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
};

const fmtDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getRatingColor = (r) => {
  if (!r) return "#666";
  if (r >= 8.5) return "#10B981";
  if (r >= 7.5) return "#F5A623";
  return "#EF4444";
};

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dp-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  padding-bottom: 100px;
}

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.au1 { animation: fadeUp .55s cubic-bezier(.22,.68,0,1.2) .0s both; }
.au2 { animation: fadeUp .55s cubic-bezier(.22,.68,0,1.2) .1s both; }
.au3 { animation: fadeUp .55s cubic-bezier(.22,.68,0,1.2) .2s both; }
.au4 { animation: fadeUp .55s cubic-bezier(.22,.68,0,1.2) .3s both; }
.af  { animation: fadeIn .7s ease .1s both; }

@media (prefers-reduced-motion: reduce) {
  .au1,.au2,.au3,.au4,.af { animation: none; opacity: 1; }
}

/* ── Back button ── */
.dp-back {
  position: fixed;
  top: 18px; left: clamp(16px, 4vw, 40px);
  z-index: 200;
  display: flex; align-items: center; gap: 7px;
  background: rgba(9,9,14,.7);
  backdrop-filter: blur(12px);
  border: 1px solid #1e1e28;
  border-radius: 100px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 600;
  padding: 8px 16px 8px 10px;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}
.dp-back:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(9,9,14,.9);
}

/* ── Hero ── */
.dp-hero {
  position: relative;
  width: 100%;
  height: clamp(420px, 60vw, 680px);
  overflow: hidden;
}

/* Backdrop image on right */
.dp-backdrop {
  position: absolute;
  top: 0; right: 0;
  width: 65%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

/* Layered gradients */
.dp-grad-left {
  position: absolute; inset: 0;
  background: linear-gradient(
    100deg,
    #09090E 0%,
    #09090E 38%,
    rgba(9,9,14,.85) 55%,
    rgba(9,9,14,.3) 75%,
    transparent 100%
  );
}
.dp-grad-bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 220px;
  background: linear-gradient(to top, #09090E 0%, transparent 100%);
}

/* Hero content */
.dp-hero-content {
  position: absolute;
  bottom: clamp(32px, 5vw, 60px);
  left: clamp(16px, 4vw, 56px);
  max-width: min(580px, 55%);
}
@media (max-width: 640px) {
  .dp-hero-content { max-width: 90%; }
  .dp-backdrop { width: 100%; opacity: .35; }
  .dp-grad-left {
    background: linear-gradient(
      180deg,
      rgba(9,9,14,.5) 0%,
      #09090E 65%
    );
  }
}

.dp-tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(245,166,35,.12);
  border: 1px solid rgba(245,166,35,.3);
  border-radius: 100px;
  padding: 4px 12px;
  font-size: 10px; font-weight: 700;
  letter-spacing: .14em; color: #F5A623;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.dp-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -.028em;
  color: #F0EDE8;
  margin-bottom: 16px;
}

/* Meta row */
.dp-meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}
.dp-meta-chip {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 6px;
  padding: 5px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; font-weight: 600;
  color: #ccc;
  white-space: nowrap;
}
.dp-meta-chip.rating { color: var(--rc); border-color: rgba(var(--rc-rgb),.3); background: rgba(var(--rc-rgb),.08); }

.dp-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.7;
  max-width: 480px;
  margin-bottom: 28px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dp-hero-btns {
  display: flex; gap: 10px; flex-wrap: wrap;
}
.dp-btn-primary {
  display: flex; align-items: center; gap: 8px;
  background: #F5A623; border: none;
  border-radius: 11px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 15px;
  padding: 13px 28px;
  cursor: pointer;
  transition: background .15s, transform .1s;
}
.dp-btn-primary:hover { background: #E09920; }
.dp-btn-primary:active { transform: scale(.97); }
.dp-btn-ghost {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 11px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 15px;
  padding: 13px 28px;
  cursor: pointer;
  transition: border-color .15s, background .15s, transform .1s;
}
.dp-btn-ghost:hover { border-color: rgba(245,166,35,.4); background: rgba(255,255,255,.1); }
.dp-btn-ghost:active { transform: scale(.97); }

/* ── Body ── */
.dp-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 40px);
}

/* ── Section divider label ── */
.dp-section {
  margin-top: clamp(40px, 5vw, 64px);
}
.dp-section-header {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 24px;
}
.dp-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; font-weight: 700;
  letter-spacing: .18em; color: #F5A623;
  text-transform: uppercase; white-space: nowrap;
}
.dp-section-line { flex: 1; height: 1px; background: #16161e; }

/* ── Info cards grid ── */
.dp-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
@media (min-width: 540px) { .dp-info-grid { grid-template-columns: repeat(4, 1fr); } }

.dp-info-card {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dp-info-icon {
  color: #F5A623;
  margin-bottom: 4px;
}
.dp-info-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 600;
  letter-spacing: .12em; color: #444;
  text-transform: uppercase;
}
.dp-info-value {
  font-family: 'Syne', sans-serif;
  font-size: 15px; font-weight: 700;
  color: #F0EDE8;
}

/* ── Description full ── */
.dp-full-desc {
  font-size: 15px;
  color: #777;
  line-height: 1.8;
  max-width: 680px;
}

/* ── Shows section ── */
.dp-shows-state {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 0;
  font-size: 14px; color: #555;
}
.dp-shows-cta {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 14px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
@media (min-width: 640px) {
  .dp-shows-cta {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.dp-shows-cta-text {}
.dp-shows-cta-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px; font-weight: 700;
  color: #F0EDE8; margin-bottom: 6px;
}
.dp-shows-cta-sub { font-size: 13px; color: #555; line-height: 1.5; }
.dp-shows-btn {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 8px;
  background: #F5A623; border: none;
  border-radius: 11px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px;
  padding: 12px 26px;
  cursor: pointer;
  white-space: nowrap;
  transition: background .15s, transform .1s;
}
.dp-shows-btn:hover { background: #E09920; }
.dp-shows-btn:active { transform: scale(.97); }

/* ── More like this ── */
.dp-tags-row {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.dp-tag-pill {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 12px; font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}
.dp-tag-pill:hover {
  border-color: rgba(245,166,35,.4);
  color: #F5A623; background: rgba(245,166,35,.06);
}

/* ── Sticky bottom bar (mobile) ── */
.dp-sticky-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(9,9,14,.92);
  backdrop-filter: blur(16px);
  border-top: 1px solid #1e1e28;
  padding: 12px clamp(16px, 4vw, 40px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dp-sticky-title {
  font-family: 'Syne', sans-serif;
  font-size: 15px; font-weight: 700;
  color: #F0EDE8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.dp-sticky-btn {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 7px;
  background: #F5A623; border: none;
  border-radius: 10px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px;
  padding: 11px 22px;
  cursor: pointer;
  transition: background .15s, transform .1s;
  white-space: nowrap;
}
.dp-sticky-btn:hover { background: #E09920; }
.dp-sticky-btn:active { transform: scale(.97); }

/* ── Loading skeleton ── */
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
.sk {
  background: linear-gradient(90deg, #141418 25%, #1e1e26 50%, #141418 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 8px;
}

/* ── Error / empty ── */
.dp-error {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 60vh; gap: 14px; text-align: center;
  padding: 40px 24px;
}
.dp-error-icon { font-size: 48px; }
.dp-error-title {
  font-family: 'Syne', sans-serif;
  font-size: 22px; font-weight: 700; color: #F0EDE8;
}
.dp-error-sub { font-size: 14px; color: #555; max-width: 320px; line-height: 1.6; }
.dp-error-btn {
  background: #F5A623; border: none; border-radius: 10px;
  color: #09090E; font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px;
  padding: 11px 24px; cursor: pointer; margin-top: 6px;
  transition: background .15s;
}
.dp-error-btn:hover { background: #E09920; }
`;

// ─── Skeleton hero ────────────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <div
      style={{
        padding: "clamp(80px,10vw,120px) clamp(16px,4vw,56px) 48px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        className="sk"
        style={{ height: 14, width: 120, marginBottom: 20 }}
      />
      <div
        className="sk"
        style={{ height: 52, width: "60%", marginBottom: 16 }}
      />
      <div
        className="sk"
        style={{ height: 52, width: "45%", marginBottom: 20 }}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[80, 100, 90, 110].map((w, i) => (
          <div
            key={i}
            className="sk"
            style={{ height: 34, width: w, borderRadius: 6 }}
          />
        ))}
      </div>
      <div
        className="sk"
        style={{ height: 14, width: "70%", marginBottom: 10 }}
      />
      <div
        className="sk"
        style={{ height: 14, width: "55%", marginBottom: 28 }}
      />
      <div style={{ display: "flex", gap: 10 }}>
        <div
          className="sk"
          style={{ height: 50, width: 160, borderRadius: 11 }}
        />
        <div
          className="sk"
          style={{ height: 50, width: 140, borderRadius: 11 }}
        />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);

  const {
    selectedMovie: movie,
    isLoading,
    error,
  } = useSelector((s) => s.movies);
  const { showsByMovie: shows, isLoading: showsLoading } = useSelector(
    (s) => s.shows,
  );

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id));
      dispatch(fetchShowsByMovie(id));
    }
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id, dispatch]);

  // ── Error state ──
  if (!isLoading && error) {
    return (
      <>
        <style>{CSS}</style>
        <div className="dp-root">
          <button className="dp-back" onClick={() => navigate(-1)}>
            <MdArrowBack size={16} /> Back
          </button>
          <div className="dp-error">
            <div className="dp-error-icon">⚠️</div>
            <div className="dp-error-title">Movie not found</div>
            <p className="dp-error-sub">
              We couldn't load this movie. It may have been removed or the link
              is broken.
            </p>
            <button
              className="dp-error-btn"
              onClick={() => navigate("/movies")}
            >
              Browse all movies
            </button>
          </div>
        </div>
      </>
    );
  }

  // Rating color helpers
  const ratingColor = movie ? getRatingColor(movie.rating) : "#666";
  const ratingColorRgb =
    ratingColor === "#10B981"
      ? "16,185,129"
      : ratingColor === "#F5A623"
        ? "245,166,35"
        : "239,68,68";

  // Related tags to browse
  const relatedTags = movie
    ? [movie.genre, movie.language, `${movie.rating}+ Rating`].filter(Boolean)
    : [];

  return (
    <>
      <style>{CSS}</style>
      <div className="dp-root">
        {/* ── BACK BUTTON ─────────────────────────────────────────── */}
        <button className="dp-back" onClick={() => navigate(-1)}>
          <MdArrowBack size={16} /> Back
        </button>

        {/* ── HERO ────────────────────────────────────────────────── */}
        {isLoading || !movie ? (
          <HeroSkeleton />
        ) : (
          <div className="dp-hero af">
            {/* Backdrop poster */}
            <img
              className="dp-backdrop"
              src={movie.posterUrl}
              alt=""
              aria-hidden="true"
              onError={(e) => {
                e.target.style.opacity = "0";
              }}
            />
            <div className="dp-grad-left" />
            <div className="dp-grad-bottom" />

            {/* Text content */}
            <div className="dp-hero-content">
              <div className="dp-tag au1">
                <FaFire size={10} /> {movie.genre}
              </div>

              <h1 className="dp-title au2">{movie.title}</h1>

              {/* Meta chips */}
              <div className="dp-meta-row au3">
                <span
                  className="dp-meta-chip rating"
                  style={{
                    "--rc": ratingColor,
                    "--rc-rgb": ratingColorRgb,
                  }}
                >
                  <MdStar size={13} /> {movie.rating} / 10
                </span>
                <span className="dp-meta-chip">
                  <MdAccessTime size={13} />{" "}
                  {fmtDuration(movie.durationMinutes)}
                </span>
                <span className="dp-meta-chip">
                  <MdLanguage size={13} /> {movie.language}
                </span>
                <span className="dp-meta-chip">
                  <MdCalendarMonth size={13} /> {fmtDate(movie.releaseDate)}
                </span>
              </div>

              <p className="dp-desc au3">{movie.description}</p>

              <div className="dp-hero-btns au4">
                <button
                  className="dp-btn-primary"
                  onClick={() => navigate(`/booking/movie/${movie.id}`)}  // ✅ Added /movie
                >
                  <MdConfirmationNumber size={18} />
                  Book Tickets
                </button>
                {/* <button className="dp-btn-ghost" onClick={() => {}}>
                  <MdPlayCircle size={18} />
                  Watch Trailer
                </button> */}
              </div>
            </div>
          </div>
        )}

        {/* ── BODY ────────────────────────────────────────────────── */}
        {!isLoading && movie && (
          <div className="dp-body">
            {/* ── MOVIE INFO CARDS ──────────────────────────────── */}
            <div className="dp-section au1">
              <div className="dp-section-header">
                <span className="dp-section-label">Movie Info</span>
                <div className="dp-section-line" />
              </div>

              <div className="dp-info-grid">
                <div className="dp-info-card">
                  <div className="dp-info-icon">
                    <MdStar size={20} />
                  </div>
                  <div className="dp-info-label">IMDb Rating</div>
                  <div className="dp-info-value" style={{ color: ratingColor }}>
                    {movie.rating} / 10
                  </div>
                </div>
                <div className="dp-info-card">
                  <div className="dp-info-icon">
                    <MdAccessTime size={20} />
                  </div>
                  <div className="dp-info-label">Duration</div>
                  <div className="dp-info-value">
                    {fmtDuration(movie.durationMinutes)}
                  </div>
                </div>
                <div className="dp-info-card">
                  <div className="dp-info-icon">
                    <MdLanguage size={20} />
                  </div>
                  <div className="dp-info-label">Language</div>
                  <div className="dp-info-value">{movie.language}</div>
                </div>
                <div className="dp-info-card">
                  <div className="dp-info-icon">
                    <MdCalendarMonth size={20} />
                  </div>
                  <div className="dp-info-label">Release Date</div>
                  <div className="dp-info-value" style={{ fontSize: 13 }}>
                    {fmtDate(movie.releaseDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* ── SYNOPSIS ──────────────────────────────────────── */}
            <div className="dp-section au2">
              <div className="dp-section-header">
                <span className="dp-section-label">Synopsis</span>
                <div className="dp-section-line" />
              </div>
              <p className="dp-full-desc">{movie.description}</p>
            </div>

            {/* ── BOOK TICKETS / SHOWS ──────────────────────────── */}
            <div className="dp-section au3">
              <div className="dp-section-header">
                <span className="dp-section-label">
                  <MdTheaters
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 6 }}
                  />
                  Book Tickets
                </span>
                <div className="dp-section-line" />
              </div>

              {showsLoading ? (
                <div className="dp-shows-state">
                  <div className="sk" style={{ height: 14, width: 180 }} />
                </div>
              ) : shows && shows.length > 0 ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {shows.map((show) => {
                    // ✅ Extract theater name safely
                    const theaterName =
                      show.screen?.theater?.name ||
                      show.screen?.name ||
                      "Theater";

                    // ✅ Format start time
                    const startTime = show.startTime
                      ? show.startTime.slice(0, 5)
                      : "—";

                    // ✅ Format end time
                    const endTime = show.endTime
                      ? show.endTime.slice(0, 5)
                      : "—";

                    return (
                      <div
                        key={show.id}
                        style={{
                          background: "#111116",
                          border: "1px solid #1e1e28",
                          borderRadius: 12,
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 12,
                          cursor: "pointer",
                          transition: "border-color .15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(245,166,35,.35)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "#1e1e28")
                        }
                        onClick={() =>
                          navigate(`/booking/movie/${movie.id}?show=${show.id}`)
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Syne',sans-serif",
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#F0EDE8",
                            }}
                          >
                            {theaterName}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#555",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <MdDateRange size={13} />
                            {show.showDate || "—"} &nbsp;·&nbsp;
                            <span style={{ color: "#F0EDE8", fontWeight: 500 }}>
                              {startTime}
                            </span>{" "}
                            —{" "}
                            <span style={{ color: "#F0EDE8", fontWeight: 500 }}>
                              {endTime}
                            </span>
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              color: "#F5A623",
                              fontWeight: 600,
                            }}
                          >
                            ₹{show.ticketPrice || 0}
                          </span>
                        </div>
                        <button
                          className="dp-shows-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                           navigate(`/booking/movie/${movie.id}?show=${show.id}`)
                          }}
                        >
                          <MdConfirmationNumber size={16} /> Select Seats
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="dp-shows-cta">
                  <div className="dp-shows-cta-text">
                    <div className="dp-shows-cta-title">Shows coming soon</div>
                    <p className="dp-shows-cta-sub">
                      Show schedules for{" "}
                      <strong style={{ color: "#F0EDE8" }}>
                        {movie.title}
                      </strong>{" "}
                      haven't been added yet. Check back closer to the release
                      date.
                    </p>
                  </div>
                  <button
                    className="dp-shows-btn"
                    onClick={() => navigate("/movies")}
                  >
                    <MdTheaters size={16} /> Browse other movies
                  </button>
                </div>
              )}
            </div>

            {/* ── BROWSE MORE ───────────────────────────────────── */}
            <div className="dp-section au4">
              <div className="dp-section-header">
                <span className="dp-section-label">Browse More</span>
                <div className="dp-section-line" />
              </div>
              <div className="dp-tags-row">
                {relatedTags.map((tag) => (
                  <button
                    key={tag}
                    className="dp-tag-pill"
                    onClick={() => navigate(`/movies?genre=${movie.genre}`)}
                  >
                    {tag}
                  </button>
                ))}
                <button
                  className="dp-tag-pill"
                  onClick={() => navigate("/movies")}
                >
                  All Movies →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STICKY BOTTOM BAR ───────────────────────────────────── */}
        {!isLoading && movie && (
          <div className="dp-sticky-bar">
            <span className="dp-sticky-title">{movie.title}</span>
            <button
              className="dp-sticky-btn"
              onClick={() => navigate(`/booking/movie/${movie.id}`)}  // ✅ Added /movie
            >
              <MdConfirmationNumber size={16} />
              Book Tickets
            </button>
          </div>
        )}
      </div>
    </>
  );
}

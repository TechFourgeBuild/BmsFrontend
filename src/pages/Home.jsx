import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MdSearch,
  MdLocationOn,
  MdStar,
  MdAccessTime,
  MdArrowForward,
  MdLocalMovies,
  MdEventSeat,
  MdConfirmationNumber,
  MdLanguage,
  MdPlayCircle,
  MdMenu,
  MdClose,
  MdCalendarToday,
  MdPeople,
  MdTheaters,
  MdMovie,
  MdFavorite,
  MdVerified,
  MdEmail,
  MdPhone,
  MdDownload,
  MdStorefront,
  MdNotifications,
  MdEmojiEvents,
  MdTrendingUp,
  MdLogout,
  MdDashboard,
  MdPerson,
} from "react-icons/md";
import {
  FaFire,
  FaTrophy,
  FaStar,
  FaUsers,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import { CSS } from "../utils/constants";
import { logout } from "../store/slices/authSlice";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURED = {
  id: 7,
  title: "Interstellar",
  genre: "Sci-Fi · IMAX",
  rating: 8.6,
  votes: "180K",
  language: "English / Hindi",
  backdrop:
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  tag: "AWARD WINNER",
};

// ✅ All 15 Movies from Database
const MOVIES = [
  {
    id: 1,
    title: "Pushpa 2",
    genre: "Action",
    language: "Telugu",
    rating: 8.2,
    duration: "2h 30m",
    tag: "BLOCKBUSTER",
    poster:
      "https://www.cinejosh.com/newsimg/newsmainimg/allu-arjun-to-make-grand-entry-for-pushpa-2-the-rule-trailer-launch_b_1611240530.jpg",
    langs: ["Telugu", "Hindi", "Tamil"],
  },
  {
    id: 2,
    title: "Jawan",
    genre: "Action",
    language: "Hindi",
    rating: 7.9,
    duration: "2h 40m",
    tag: "TRENDING",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
    langs: ["Hindi", "Tamil", "Telugu"],
  },
  {
    id: 3,
    title: "Animal",
    genre: "Drama",
    language: "Hindi",
    rating: 7.5,
    duration: "3h 00m",
    tag: "TRENDING",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Animal_%282023_film%29_poster.jpg/250px-Animal_%282023_film%29_poster.jpg",
    langs: ["Hindi"],
  },
  {
    id: 4,
    title: "Leo",
    genre: "Thriller",
    language: "Tamil",
    rating: 7.0,
    duration: "2h 35m",
    tag: "NEW",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/7/75/Leo_%282023_Indian_film%29.jpg",
    langs: ["Tamil", "Telugu", "Hindi"],
  },
  {
    id: 5,
    title: "Dunki",
    genre: "Comedy",
    language: "Hindi",
    rating: 6.8,
    duration: "2h 20m",
    tag: "NEW",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Dunki_poster.jpg/250px-Dunki_poster.jpg",
    langs: ["Hindi"],
  },
  {
    id: 6,
    title: "Inception",
    genre: "Sci-Fi",
    language: "English",
    rating: 8.8,
    duration: "2h 28m",
    tag: "AWARD WINNER",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_.jpg",
    langs: ["English", "Hindi"],
  },
  {
    id: 7,
    title: "Interstellar",
    genre: "Sci-Fi",
    language: "English",
    rating: 8.6,
    duration: "2h 49m",
    tag: "AWARD WINNER",
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
    langs: ["English", "Hindi"],
  },
  {
    id: 8,
    title: "The Dark Knight",
    genre: "Action",
    language: "English",
    rating: 9.0,
    duration: "2h 32m",
    tag: "BLOCKBUSTER",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    langs: ["English", "Hindi"],
  },
  {
    id: 9,
    title: "Shawshank Redemption",
    genre: "Drama",
    language: "English",
    rating: 9.3,
    duration: "2h 22m",
    tag: "AWARD WINNER",
    poster:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    langs: ["English"],
  },
  {
    id: 10,
    title: "Kalki 2898 AD",
    genre: "Sci-Fi",
    language: "Telugu",
    rating: 4.5,
    duration: "3h 00m",
    tag: "NEW",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTM3ZGUwYTEtZTI5NS00ZmMyLTk2YmQtMWU4YjlhZTI3NjRjXkEyXkFqcGc@._V1_.jpg",
    langs: ["Telugu", "Tamil", "Hindi", "English"],
  },
  {
    id: 11,
    title: "RRR",
    genre: "Action",
    language: "Telugu",
    rating: 7.8,
    duration: "3h 00m",
    tag: "BLOCKBUSTER",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/RRR_Poster.jpg/250px-RRR_Poster.jpg",
    langs: ["Telugu", "Tamil", "Hindi"],
  },
  {
    id: 12,
    title: "Bahubali 2",
    genre: "Action",
    language: "Telugu",
    rating: 8.0,
    duration: "2h 47m",
    tag: "BLOCKBUSTER",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg",
    langs: ["Telugu", "Tamil", "Hindi"],
  },
  {
    id: 13,
    title: "KGF Chapter 2",
    genre: "Action",
    language: "Kannada",
    rating: 8.2,
    duration: "2h 48m",
    tag: "TRENDING",
    poster:
      "https://m.media-amazon.com/images/M/MV5BZmQzZjVkZTUtYjI4ZC00ZDJmLWI0ZDUtZTFmMGM1Mzc5ZjIyXkEyXkFqcGc@._V1_.jpg",
    langs: ["Kannada", "Hindi", "Tamil", "Telugu"],
  },
  {
    id: 14,
    title: "Vikram",
    genre: "Thriller",
    language: "Tamil",
    rating: 8.4,
    duration: "2h 55m",
    tag: "TRENDING",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNDEyMWQ0ZDktNTY0MC00YWRkLWFlMjQtMDUxMjRlMDhmMmRlXkEyXkFqcGc@._V1_.jpg",
    langs: ["Tamil", "Telugu", "Hindi"],
  },
  {
    id: 15,
    title: "The Godfather",
    genre: "Drama",
    language: "English",
    rating: 9.2,
    duration: "2h 55m",
    tag: "AWARD WINNER",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_.jpg",
    langs: ["English"],
  },
];

// ✅ Coming Soon Movies
const COMING_SOON = [
  {
    id: 16,
    title: "Avatar 3",
    genre: "Sci-Fi",
    language: "English",
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
    releaseDate: "Dec 2026",
  },
  {
    id: 17,
    title: "Spider-Man: Beyond",
    genre: "Action",
    language: "English",
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    releaseDate: "Mar 2027",
  },
  {
    id: 18,
    title: "Dune: Messiah",
    genre: "Sci-Fi",
    language: "English",
    poster:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    releaseDate: "Jun 2027",
  },
  {
    id: 19,
    title: "Mission Impossible 8",
    genre: "Action",
    language: "English",
    poster:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
    releaseDate: "Sep 2027",
  },
];

// ✅ Stats
const STATS = [
  { icon: <MdMovie size={28} />, value: "15+", label: "Movies" },
  { icon: <MdLanguage size={28} />, value: "5", label: "Languages" },
  { icon: <MdTheaters size={28} />, value: "7", label: "Theaters" },
  { icon: <FaUsers size={28} />, value: "50K+", label: "Bookings" },
];

// ✅ Language Filters - Updated with all languages present
const LANG_FILTERS = ["All", "English", "Hindi", "Telugu", "Tamil", "Kannada"];

const GENRES = [
  { label: "Action", emoji: "⚡", color: "#F5A623" },
  { label: "Drama", emoji: "🎭", color: "#E84393" },
  { label: "Thriller", emoji: "🔪", color: "#8B5CF6" },
  { label: "Comedy", emoji: "😄", color: "#10B981" },
  { label: "Sci-Fi", emoji: "🚀", color: "#3B82F6" },
  { label: "Romance", emoji: "❤️", color: "#EF4444" },
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

const STEPS = [
  {
    icon: <MdLocalMovies size={22} />,
    title: "Pick a movie",
    desc: "Browse hundreds of titles across genres and languages.",
  },
  {
    icon: <MdEventSeat size={22} />,
    title: "Choose your seat",
    desc: "See the live seat map — pick exactly where you want to sit.",
  },
  {
    icon: <MdConfirmationNumber size={22} />,
    title: "Confirm booking",
    desc: "Pay securely and get your ticket confirmation instantly.",
  },
];

const TAG_META = {
  BLOCKBUSTER: { bg: "#F5A623", color: "#09090E" },
  NEW: { bg: "#10B981", color: "#fff" },
  TRENDING: { bg: "#EF4444", color: "#fff" },
  "AWARD WINNER": { bg: "#8B5CF6", color: "#fff" },
};

// ─── Film strip ────────────────────────────────────────────────────────────────
function FilmBg() {
  return (
    <div className="film-bg" aria-hidden="true">
      {Array.from({ length: 240 }, (_, i) => (
        <div
          key={i}
          className={`f-cell${Math.random() < 0.055 ? " on" : ""}`}
        />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Delhi");
  const [lang, setLang] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/movies?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // ✅ Filter movies by language
  const filtered =
    lang === "All" ? MOVIES : MOVIES.filter((m) => m.langs.includes(lang));

  // ✅ Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="h-root">
        {/* ── NAVBAR ──────────────────────────────────────────────── */}
        <nav className="nav">
          <div className="nav-logo">
            book<span>it</span>
          </div>
          <form className="nav-search" onSubmit={handleSearch}>
            <MdSearch size={17} color="#3a3a48" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search movies, genres…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
          </form>

          {/* ── Desktop Nav Right ── */}
          <div className="nav-right">
            <div className="city-pill">
              <MdLocationOn size={14} color="#F5A623" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="City"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              // ✅ Logged in - Show user menu
              <div className="flex items-center gap-3">
                {/* Admin link (only for admin) */}
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-[#555] hover:text-[#F5A623] transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <MdDashboard size={16} /> Admin
                  </Link>
                )}
                {/* <Link
                  to="/bookings"
                  className="text-[#555] hover:text-[#F5A623] transition-colors text-sm font-medium"
                >
                  My Bookings
                </Link> */}
                <div className="flex items-center gap-2 border-l border-[#1e1e28] pl-3">
                  <div
                    className="w-8 h-8 rounded-full bg-[#F5A623] text-[#09090E] flex items-center justify-center font-bold text-sm cursor-pointer hover:scale-105 transition-transform"
                    title={user.name}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="text-sm text-[#F0EDE8] font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-[#555] hover:text-[#EF4444] transition-colors p-1"
                    title="Sign out"
                  >
                    <MdLogout size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // ❌ Not logged in - Show Sign in / Register
              <>
                <button className="nav-btn" onClick={() => navigate("/login")}>
                  Sign in
                </button>
                <button
                  className="nav-btn primary"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            className="hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </nav>

        {/* ── Mobile Menu ── */}
        <div className={`mobile-menu${isMobileMenuOpen ? " open" : ""}`}>
          <div className="city-pill">
            <MdLocationOn size={14} color="#F5A623" />
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {user ? (
            // ✅ Logged in - Mobile user menu
            <>
              <div className="flex items-center gap-3 px-3 py-2 bg-[#141418] rounded-lg border border-[#1e1e28]">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-[#09090E] flex items-center justify-center font-bold text-lg">
                  {getInitials(user.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#F0EDE8] font-medium">
                    {user.name}
                  </span>
                  <span className="text-xs text-[#555]">
                    {user.role || "USER"}
                  </span>
                </div>
              </div>
              {user.role === "ADMIN" && (
                <button
                  className="nav-btn w-full text-center"
                  onClick={() => {
                    navigate("/admin");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <MdDashboard size={16} className="inline mr-2" /> Admin Panel
                </button>
              )}
              <button
                className="nav-btn w-full text-center"
                onClick={() => {
                  navigate("/bookings");
                  setIsMobileMenuOpen(false);
                }}
              >
                My Bookings
              </button>
              <button
                className="nav-btn w-full text-center border-red-500/30 text-red-400 hover:border-red-500 hover:text-red-500"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <MdLogout size={16} className="inline mr-2" /> Sign Out
              </button>
            </>
          ) : (
            // ❌ Not logged in - Mobile auth buttons
            <>
              <button
                className="nav-btn"
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign in
              </button>
              <button
                className="nav-btn primary"
                onClick={() => {
                  navigate("/register");
                  setIsMobileMenuOpen(false);
                }}
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* ── REST OF THE PAGE (Same as before) ── */}
        {/* ── FEATURED BANNER ─────────────────────────────────────── */}
        <div className="featured a1">
          <img
            src={FEATURED.backdrop}
            alt={FEATURED.title}
            className="featured-img"
            loading="eager"
          />
          <div className="featured-overlay" />
          <div className="featured-overlay-bottom" />
          <div className="featured-content">
            <div className="featured-tag a2">
              <FaFire size={10} /> {FEATURED.tag}
            </div>
            <h1 className="featured-title a2">{FEATURED.title}</h1>
            <div className="featured-meta a3">
              <span className="rating">
                <MdStar size={14} /> {FEATURED.rating}
                <span style={{ color: "#555", fontWeight: 400 }}>
                  ({FEATURED.votes} votes)
                </span>
              </span>
              <span>{FEATURED.genre}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <MdLanguage size={13} /> {FEATURED.language}
              </span>
            </div>
            <div className="featured-btns a4">
              <button
                className="btn-watch"
                onClick={() => navigate(`/movies/${FEATURED.id}`)}
              >
                <MdPlayCircle size={18} /> Book Tickets
              </button>
              <Link to="/movies">
                <button className="btn-outline">More Info</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="gap-sm" />

        {/* ── STATS SECTION ──────────────────────────────────────── */}
        <div className="wrap">
          <div
            className="stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "#141418",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  border: "1px solid #1a1a24",
                }}
              >
                <div style={{ color: "#F5A623", marginBottom: "8px" }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#F0EDE8",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "#666" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── NOW SHOWING ─────────────────────────────────────────── */}
        <div className="wrap">
          <div className="sh">
            <span className="sh-label">
              <FaFire size={12} /> Now Showing
            </span>
            <div className="sh-line" />
            <button className="sh-link" onClick={() => navigate("/movies")}>
              View all <MdArrowForward size={15} />
            </button>
          </div>

          <div
            className="lang-tabs"
            role="group"
            aria-label="Filter by language"
          >
            {LANG_FILTERS.map((l) => (
              <button
                key={l}
                className={`lang-tab${lang === l ? " active" : ""}`}
                onClick={() => setLang(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <Link to="/movies">
            <div className="movie-row">
              {filtered.length === 0 ? (
                <div className="text-center text-gray-400 w-full py-8">
                  No movies found in {lang} language
                </div>
              ) : (
                filtered.map((movie) => {
                  const tag = TAG_META[movie.tag] || {
                    bg: "#2A2A35",
                    color: "#F0EDE8",
                  };
                  return (
                    <div
                      key={movie.id}
                      className="m-card"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="m-img">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          loading="lazy"
                        />
                        <div className="m-fade" />
                        <span
                          className="m-tag"
                          style={{ background: tag.bg, color: tag.color }}
                        >
                          {movie.tag}
                        </span>
                      </div>
                      <div className="m-body">
                        <div className="m-title">{movie.title}</div>
                        <div className="m-meta">
                          <span className="m-meta-i rt">
                            <MdStar size={11} />
                            {movie.rating}
                          </span>
                          <span className="m-meta-i">
                            <MdAccessTime size={11} />
                            {movie.duration}
                          </span>
                          <span className="m-meta-i">
                            <MdLanguage size={11} />
                            {movie.language}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Link>
        </div>

        <div className="gap" />

        {/* ── COMING SOON ─────────────────────────────────────────── */}
        <div className="wrap">
          <div className="sh">
            <span className="sh-label">
              <MdCalendarToday size={14} /> Coming Soon
            </span>
            <div className="sh-line" />
            <button className="sh-link" onClick={() => navigate("/movies")}>
              View all <MdArrowForward size={15} />
            </button>
          </div>
          <div className="movie-row">
            {COMING_SOON.map((movie) => (
              <div
                key={movie.id}
                className="m-card"
                onClick={() => navigate(`/movies/${movie.id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="m-img">
                  <img src={movie.poster} alt={movie.title} loading="lazy" />
                  <div className="m-fade" />
                  <span
                    className="m-tag"
                    style={{ background: "#8B5CF6", color: "#fff" }}
                  >
                    COMING SOON
                  </span>
                </div>
                <div className="m-body">
                  <div className="m-title">{movie.title}</div>
                  <div className="m-meta">
                    <span className="m-meta-i">
                      <MdCalendarToday size={11} />
                      {movie.releaseDate}
                    </span>
                    <span className="m-meta-i">
                      <MdLanguage size={11} />
                      {movie.language}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gap" />

        {/* ── GENRES ──────────────────────────────────────────────── */}
        <div className="wrap">
          <div className="sh">
            <span className="sh-label">Browse by Genre</span>
            <div className="sh-line" />
          </div>
          <div className="g-grid">
            {GENRES.map((g) => (
              <button
                key={g.label}
                className="g-btn"
                onClick={() => navigate(`/movies?genre=${g.label}`)}
              >
                <span className="g-emoji" role="img">
                  {g.emoji}
                </span>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="gap" />

        {/* ── HOW IT WORKS ────────────────────────────────────────── */}
        <div className="wrap">
          <div className="sh">
            <span className="sh-label">How it works</span>
            <div className="sh-line" />
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={i} className="step">
                <span className="step-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="step-ico">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="gap" />

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <div className="wrap">
          <div className="cta">
            <div className="cta-glow" aria-hidden="true" />

            {user ? (
              // ✅ Logged In User
              <>
                <p className="cta-eye">
                  <FaFire
                    size={12}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  Welcome back, {user.name?.split(" ")[0] || "User"}!
                </p>
                <h2 className="cta-h">
                  {user.role === "ADMIN"
                    ? "Manage your cinema 🎬"
                    : "Ready for your next movie? 🎥"}
                </h2>
                <p className="cta-sub">
                  {user.role === "ADMIN"
                    ? "Go to the admin dashboard to manage movies, theaters, shows, and more."
                    : "Browse movies, book tickets, or view your upcoming shows."}
                </p>
                <div className="cta-btns">
                  {user.role === "ADMIN" ? (
                    <>
                      <button
                        className="btn-p"
                        onClick={() => navigate("/admin")}
                      >
                        <MdDashboard
                          size={18}
                          style={{ display: "inline", marginRight: 6 }}
                        />
                        Admin Dashboard
                      </button>
                      <button
                        className="btn-g"
                        onClick={() => navigate("/movies")}
                      >
                        Browse Movies
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-p"
                        onClick={() => navigate("/movies")}
                      >
                        <MdMovie
                          size={18}
                          style={{ display: "inline", marginRight: 6 }}
                        />
                        Browse Movies
                      </button>
                      <button
                        className="btn-g"
                        onClick={() => navigate("/bookings")}
                      >
                        <MdConfirmationNumber
                          size={18}
                          style={{ display: "inline", marginRight: 6 }}
                        />
                        My Bookings
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              // ❌ Not Logged In
              <>
                <p className="cta-eye">Members get more</p>
                {/* <h2 className="cta-h">
                  Sign in to book,
                  <br />
                  cancel &amp; track.
                </h2> */}
                <p className="cta-sub">
                  Free account — reserve seats, manage bookings, and cancel
                  anytime before the show starts.
                </p>
                <div className="cta-btns">
                  <button
                    className="btn-p"
                    onClick={() => navigate("/register")}
                  >
                    Create account
                  </button>
                  {/* <button className="btn-g" onClick={() => navigate("/login")}>
                    Sign in
                  </button> */}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="gap" />

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer
          style={{
            background: "linear-gradient(180deg, #0a0a0e 0%, #0d0d14 100%)",
            borderTop: "1px solid #16161e",
            padding: "60px 16px 32px",
            marginTop: "40px",
          }}
        >
          <div className="wrap">
            {/* Main Footer Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "40px",
                marginBottom: "40px",
              }}
            >
              {/* Column 1 - Brand */}
              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#F5A623",
                    marginBottom: "16px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  book<span style={{ color: "#F0EDE8" }}>it</span>
                </div>
                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    maxWidth: "280px",
                  }}
                >
                  Your one-stop destination for movie tickets, showtimes, and an
                  unforgettable cinema experience.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "rgba(245, 166, 35, 0.1)",
                      border: "1px solid rgba(245, 166, 35, 0.2)",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      fontSize: "11px",
                      color: "#F5A623",
                      fontWeight: 600,
                    }}
                  >
                    🎬 15+ Movies
                  </span>
                  <span
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      fontSize: "11px",
                      color: "#10B981",
                      fontWeight: 600,
                    }}
                  >
                    🌍 5 Languages
                  </span>
                </div>
              </div>

              {/* Column 2 - Quick Links */}
              <div>
                <h4
                  style={{
                    color: "#F0EDE8",
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "20px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    position: "relative",
                    paddingBottom: "12px",
                  }}
                >
                  Quick Links
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "40px",
                      height: "2px",
                      background: "#F5A623",
                      borderRadius: "1px",
                    }}
                  />
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {[
                    { label: "About Us", icon: "ℹ️", redirect:"/about" },
                    { label: "Contact", icon: "📞",  redirect:"/contact"},
                    { label: "FAQ", icon: "❓", redirect:"/faq" },
                    { label: "Privacy Policy", icon: "🔒", redirect:"/privacy" },
                    { label: "Terms of Service", icon: "📜", redirect:"/terms" },
                  ].map((link) => (
                    <button
                      key={link.label}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#888",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "14px",
                        padding: "6px 0",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#F5A623";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#888";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                      onClick={()=>{
                        navigate(`${link.redirect}`);
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>{link.icon}</span>
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 3 - Connect */}
              <div>
                <h4
                  style={{
                    color: "#F0EDE8",
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "20px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    position: "relative",
                    paddingBottom: "12px",
                  }}
                >
                  Connect With Us
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "40px",
                      height: "2px",
                      background: "#F5A623",
                      borderRadius: "1px",
                    }}
                  />
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      color: "#666",
                      fontSize: "14px",
                      transition: "color 0.2s",
                      padding: "6px 0",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(245, 166, 35, 0.1)",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      <MdEmail size={18} color="#F5A623" />
                    </div>
                    <span style={{ color: "#aaa" }}>support@bookit.com</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      color: "#666",
                      fontSize: "14px",
                      transition: "color 0.2s",
                      padding: "6px 0",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(245, 166, 35, 0.1)",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      <MdPhone size={18} color="#F5A623" />
                    </div>
                    <span style={{ color: "#aaa" }}>+91 98765 43210</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      color: "#666",
                      fontSize: "14px",
                      transition: "color 0.2s",
                      padding: "6px 0",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(245, 166, 35, 0.1)",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      <MdLocationOn size={18} color="#F5A623" />
                    </div>
                    <span style={{ color: "#aaa" }}>Mumbai, India</span>
                  </div>
                </div>
              </div>

              {/* Column 4 - Social & Newsletter */}
              <div>
                <h4
                  style={{
                    color: "#F0EDE8",
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "20px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    position: "relative",
                    paddingBottom: "12px",
                  }}
                >
                  Follow Us
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "40px",
                      height: "2px",
                      background: "#F5A623",
                      borderRadius: "1px",
                    }}
                  />
                </h4>

                {/* Social Icons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { Icon: FaInstagram, label: "Instagram", color: "#E4405F" },
                    { Icon: FaFacebook, label: "Facebook", color: "#1877F2" },
                    { Icon: FaYoutube, label: "YouTube", color: "#FF0000" },
                    { Icon: FaTwitter, label: "Twitter", color: "#1DA1F2" },
                  ].map((social) => (
                    <button
                      key={social.label}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid #1a1a24",
                        borderRadius: "10px",
                        padding: "10px",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "44px",
                        height: "44px",
                        color: "#666",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = social.color + "20";
                        e.currentTarget.style.borderColor = social.color;
                        e.currentTarget.style.color = social.color;
                        e.currentTarget.style.transform =
                          "translateY(-4px) scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                        e.currentTarget.style.borderColor = "#1a1a24";
                        e.currentTarget.style.color = "#666";
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                      }}
                    >
                      <social.Icon size={22} />
                    </button>
                  ))}
                </div>

                {/* Newsletter Subscription */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    border: "1px solid #1a1a24",
                  }}
                >
                  <p
                    style={{
                      color: "#888",
                      fontSize: "13px",
                      marginBottom: "12px",
                      fontWeight: 500,
                    }}
                  >
                    📬 Subscribe to our newsletter
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="email"
                      placeholder="Your email"
                      style={{
                        flex: 1,
                        background: "#0a0a0e",
                        border: "1px solid #1e1e28",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#F0EDE8",
                        fontSize: "13px",
                        outline: "none",
                        fontFamily: "'Inter', sans-serif",
                        minWidth: "0",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(245,166,35,0.5)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#1e1e28")
                      }
                    />
                    <button
                      style={{
                        background: "#F5A623",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 18px",
                        color: "#09090E",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        whiteSpace: "nowrap",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#E09920")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#F5A623")
                      }
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                borderTop: "1px solid #16161e",
                paddingTop: "24px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div
                style={{
                  color: "#3a3a48",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                © 2026 <span style={{ color: "#F5A623" }}>bookit</span>. All
                rights reserved.
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {["Privacy", "Terms", "Cookies", "Sitemap"].map((item) => (
                  <button
                    key={item}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3a3a48",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "color 0.2s",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F5A623")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#3a3a48")
                    }
                  >
                    {item}
                  </button>
                ))}
                <span style={{ color: "#3a3a48", fontSize: "12px" }}>
                  Made with <span style={{ color: "#EF4444" }}>❤️</span> in
                  India
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

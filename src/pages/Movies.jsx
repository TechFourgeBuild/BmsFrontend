import { useEffect, useState, useMemo } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdStar,
  MdAccessTime,
  MdLanguage,
  MdSearch,
  MdFilterList,
  MdClose,
  MdSort,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { fetchMovies } from "../store/slices/movieSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmtDuration = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
};

const getRatingColor = (r) => {
  if (r >= 8.5) return "#10B981";
  if (r >= 7.5) return "#F5A623";
  return "#EF4444";
};

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.mv-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
}

/* ── Page header ── */
.mv-header {
  padding: clamp(32px, 5vw, 56px) clamp(16px, 4vw, 40px) 0;
  max-width: 1240px;
  margin: 0 auto;
}
.mv-board {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.mv-board-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(11px, 1.4vw, 13px);
  font-weight: 700;
  letter-spacing: .22em;
  color: #F5A623;
  text-transform: uppercase;
  padding-bottom: 2px;
}
.mv-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 800;
  letter-spacing: -.025em;
  line-height: 1.04;
  color: #F0EDE8;
}
.mv-title span { color: #F5A623; }
.mv-subtitle {
  font-size: 14px;
  color: #555;
  margin-top: 10px;
  font-weight: 400;
}
.mv-divider {
  height: 1px;
  background: linear-gradient(90deg, #F5A623 0%, #1e1e28 40%);
  margin-top: 24px;
}

/* ── Sticky filter bar ── */
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(9, 9, 14, 0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #16161e;
  padding: 12px clamp(16px, 4vw, 40px);
}
.filter-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  color: #444;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
  width: 52px;
}
.pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
}
.pill {
  background: #141418;
  border: 1px solid #1e1e28;
  border-radius: 100px;
  color: #777;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background .15s, border-color .15s, color .15s;
  line-height: 1;
}
.pill:hover { background: #1a1a24; border-color: #2a2a38; color: #ccc; }
.pill.active {
  background: rgba(245,166,35,.12);
  border-color: rgba(245,166,35,.45);
  color: #F5A623;
}

/* Sort + search row */
.filter-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.search-input-wrap {
  display: flex;
  align-items: center;
  background: #141418;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  padding: 0 12px;
  height: 36px;
  gap: 7px;
  transition: border-color .2s;
  min-width: 180px;
  max-width: 260px;
  flex: 1;
}
.search-input-wrap:focus-within { border-color: rgba(245,166,35,.45); }
.search-input-wrap input {
  flex: 1; min-width: 0;
  background: transparent;
  border: none; outline: none;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}
.search-input-wrap input::placeholder { color: #333; }
.clear-search {
  background: none; border: none; cursor: pointer;
  color: #555; padding: 0; display: flex; align-items: center;
  transition: color .15s;
}
.clear-search:hover { color: #F5A623; }

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.sort-label {
  font-size: 12px;
  color: #555;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}
.sort-select {
  background: #141418;
  border: 1px solid #1e1e28;
  border-radius: 8px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 10px;
  cursor: pointer;
  outline: none;
  transition: border-color .15s;
}
.sort-select:focus { border-color: rgba(245,166,35,.45); }
.sort-select option { background: #141418; }

.results-meta {
  font-size: 12px;
  color: #444;
  white-space: nowrap;
  flex-shrink: 0;
}
.results-meta span { color: #F5A623; font-weight: 600; }

/* ── Main grid area ── */
.mv-body {
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px clamp(16px, 4vw, 40px) 60px;
}

/* ── Movie grid ── */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (min-width: 540px)  { .movie-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 768px)  { .movie-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
@media (min-width: 1024px) { .movie-grid { grid-template-columns: repeat(5, 1fr); } }
@media (min-width: 1200px) { .movie-grid { grid-template-columns: repeat(6, 1fr); } }

/* ── Movie card ── */
.m-card {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .22s cubic-bezier(.22,.68,0,1.2), border-color .2s, box-shadow .2s;
  display: flex;
  flex-direction: column;
}
.m-card:hover {
  transform: translateY(-6px);
  border-color: rgba(245,166,35,.4);
  box-shadow: 0 20px 44px rgba(0,0,0,.6);
}
.m-card:focus-visible {
  outline: 2px solid #F5A623;
  outline-offset: 3px;
}

/* poster */
.m-poster {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  flex-shrink: 0;
}
.m-poster img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform .4s ease;
}
.m-card:hover .m-poster img { transform: scale(1.06); }

/* scrim */
.m-scrim {
  position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
  background: linear-gradient(to top, #111116 0%, transparent 100%);
  pointer-events: none;
}

/* rating badge */
.m-rating-badge {
  position: absolute;
  bottom: 10px; right: 10px;
  display: flex; align-items: center; gap: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; font-weight: 700;
  background: rgba(9,9,14,.8);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 6px;
  padding: 4px 8px;
}

/* genre badge */
.m-genre-badge {
  position: absolute;
  top: 10px; left: 10px;
  font-size: 9px; font-weight: 700;
  letter-spacing: .07em;
  padding: 4px 9px;
  border-radius: 6px;
  backdrop-filter: blur(8px);
  background: rgba(9,9,14,.7);
  border: 1px solid rgba(255,255,255,.1);
  color: #ccc;
  text-transform: uppercase;
}

/* card body */
.m-body {
  padding: 12px 13px 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.m-title {
  font-family: 'Syne', sans-serif;
  font-size: 13px; font-weight: 700;
  color: #F0EDE8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
}
.m-desc {
  font-size: 11px;
  color: #555;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}
.m-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: #555;
  margin-top: 2px;
}
.m-meta-i { display: flex; align-items: center; gap: 3px; }

/* book btn */
.m-book-btn {
  margin-top: 10px;
  width: 100%;
  background: rgba(245,166,35,.1);
  border: 1px solid rgba(245,166,35,.2);
  border-radius: 8px;
  color: #F5A623;
  font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 700;
  padding: 9px;
  cursor: pointer;
  transition: background .15s, border-color .15s, transform .1s;
  letter-spacing: .04em;
}
.m-book-btn:hover {
  background: rgba(245,166,35,.18);
  border-color: rgba(245,166,35,.45);
}
.m-book-btn:active { transform: scale(.97); }

/* ── Loading ── */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (min-width: 540px)  { .skeleton-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 768px)  { .skeleton-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
@media (min-width: 1024px) { .skeleton-grid { grid-template-columns: repeat(5, 1fr); } }
@media (min-width: 1200px) { .skeleton-grid { grid-template-columns: repeat(6, 1fr); } }

@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #18181f;
}
.skeleton-poster {
  aspect-ratio: 2/3;
  background: linear-gradient(90deg, #141418 25%, #1e1e26 50%, #141418 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skeleton-body {
  padding: 12px 13px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skeleton-line {
  border-radius: 4px;
  background: linear-gradient(90deg, #141418 25%, #1e1e26 50%, #141418 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}

/* ── Error / Empty ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  gap: 14px;
}
.state-icon { font-size: 48px; line-height: 1; }
.state-title {
  font-family: 'Syne', sans-serif;
  font-size: 20px; font-weight: 700;
  color: #F0EDE8;
}
.state-sub { font-size: 14px; color: #555; line-height: 1.6; max-width: 340px; }
.state-btn {
  background: #F5A623; border: none;
  border-radius: 10px; color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px;
  padding: 11px 24px; cursor: pointer;
  transition: background .15s, transform .1s;
  margin-top: 4px;
}
.state-btn:hover { background: #E09920; }
.state-btn:active { transform: scale(.97); }

@media (prefers-reduced-motion: reduce) {
  .m-card { transition: none !important; }
  .m-card:hover .m-poster img { transform: none; }
  .skeleton-poster, .skeleton-line { animation: none; }
}
`;

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster" />
      <div className="skeleton-body">
        <div className="skeleton-line" style={{ height: 14, width: "80%" }} />
        <div className="skeleton-line" style={{ height: 11, width: "60%" }} />
        <div className="skeleton-line" style={{ height: 11, width: "45%" }} />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Movies() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params] = useSearchParams();

  const { movies, isLoading, error } = useSelector((s) => s.movies);

  const { user } = useSelector((s) => s.auth);
  const [search, setSearch] = useState(params.get("search") || "");
  const [genre, setGenre] = useState(params.get("genre") || "All");
  const [language, setLanguage] = useState("All");
  const [sort, setSort] = useState("rating_desc");

  // Fetch once on mount
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Derive unique filter options from data
  const genres = useMemo(
    () => ["All", ...new Set(movies.map((m) => m.genre))],
    [movies],
  );
  const languages = useMemo(
    () => ["All", ...new Set(movies.map((m) => m.language))],
    [movies],
  );

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...movies];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.toLowerCase().includes(q) ||
          m.language.toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q),
      );
    }
    if (genre !== "All") list = list.filter((m) => m.genre === genre);
    if (language !== "All") list = list.filter((m) => m.language === language);

    list.sort((a, b) => {
      switch (sort) {
        case "rating_desc":
          return b.rating - a.rating;
        case "rating_asc":
          return a.rating - b.rating;
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "duration_asc":
          return a.durationMinutes - b.durationMinutes;
        case "duration_desc":
          return b.durationMinutes - a.durationMinutes;
        default:
          return 0;
      }
    });

    return list;
  }, [movies, search, genre, language, sort]);

  const clearAll = () => {
    setSearch("");
    setGenre("All");
    setLanguage("All");
    setSort("rating_desc");
  };

  const hasFilters = search || genre !== "All" || language !== "All";

  // ✅ FIXED: If loading - show spinner (regardless of movies)
  if (isLoading) {
    return <LoadingSpinner variant="fullscreen" text="Loading Movies" />;
  }

  // ✅ If no user, redirect to register
  if (!user) {
    return <Navigate to="/register" replace />; // ✅ Component return karo
  }

  return (
    <div className="min-h-screen bg-[#09090E] text-[#F0EDE8] font-['Inter',sans-serif]">
      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pt-8 sm:pt-12 max-w-7xl mx-auto">
        <div className="flex items-end gap-4 mb-1 flex-wrap">
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold tracking-[0.22em] text-[#F5A623] uppercase">
            Now Playing
          </span>
        </div>
        <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Every <span className="text-[#F5A623]">film.</span> One place.
        </h1>
        <p className="text-sm text-[#555] mt-2">
          {movies.length > 0
            ? `${movies.length} movies across ${languages.length - 1} languages`
            : "Browse the full catalogue"}
        </p>
        <div className="h-px bg-gradient-to-r from-[#F5A623] via-[#1e1e28] to-transparent mt-6" />
      </div>

      {/* ── STICKY FILTER BAR ───────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#09090E]/90 backdrop-blur-md border-b border-[#16161e]">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto py-3">
          {/* Genre Pills */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold tracking-[0.14em] text-[#444] uppercase w-12 flex-shrink-0">
                Genre
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide flex-1">
                {genres.map((g) => (
                  <button
                    key={g}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      genre === g
                        ? "bg-[#F5A623]/20 border border-[#F5A623]/50 text-[#F5A623]"
                        : "bg-[#141418] border border-[#1e1e28] text-[#777] hover:bg-[#1a1a24] hover:border-[#2a2a38]"
                    }`}
                    onClick={() => setGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language Pills */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold tracking-[0.14em] text-[#444] uppercase w-12 flex-shrink-0">
                Lang
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide flex-1">
                {languages.map((l) => (
                  <button
                    key={l}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      language === l
                        ? "bg-[#F5A623]/20 border border-[#F5A623]/50 text-[#F5A623]"
                        : "bg-[#141418] border border-[#1e1e28] text-[#777] hover:bg-[#1a1a24] hover:border-[#2a2a38]"
                    }`}
                    onClick={() => setLanguage(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search + Sort + Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-[160px] flex items-center bg-[#141418] border border-[#1e1e28] rounded-xl px-3 h-10 gap-2 transition-colors focus-within:border-[#F5A623]/50">
                <MdSearch size={16} color="#444" />
                <input
                  type="text"
                  placeholder="Search title, genre…"
                  className="flex-1 bg-transparent border-none outline-none text-[#F0EDE8] text-sm min-w-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-[#555] hover:text-[#F5A623] transition-colors"
                  >
                    <MdClose size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[#555] flex items-center gap-1">
                  <MdSort size={14} /> Sort
                </span>
                <select
                  className="bg-[#141418] border border-[#1e1e28] rounded-lg text-[#F0EDE8] text-xs font-medium px-3 py-1.5 cursor-pointer outline-none focus:border-[#F5A623]/50"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="rating_desc">Rating ↓</option>
                  <option value="rating_asc">Rating ↑</option>
                  <option value="title_asc">Title A–Z</option>
                  <option value="title_desc">Title Z–A</option>
                  <option value="duration_asc">Shortest first</option>
                  <option value="duration_desc">Longest first</option>
                </select>
              </div>

              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F5A623]/20 border border-[#F5A623]/50 text-[#F5A623] flex items-center gap-1 hover:bg-[#F5A623]/30 transition-colors"
                >
                  <MdClose size={12} /> Clear
                </button>
              )}
            </div>

            <span className="text-xs text-[#444] whitespace-nowrap">
              <span className="text-[#F5A623] font-semibold">
                {filtered.length}
              </span>{" "}
              / {movies.length} films
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto py-6 sm:py-8">
        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="font-['Syne',sans-serif] text-xl font-bold text-[#F0EDE8]">
              Couldn't load movies
            </h2>
            <p className="text-sm text-[#555] max-w-sm">{error}</p>
            <button
              className="bg-[#F5A623] border-none rounded-xl text-[#09090E] font-bold text-sm px-6 py-2.5 hover:bg-[#E09920] transition-colors"
              onClick={() => dispatch(fetchMovies())}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty filter result */}
        {!error && filtered.length === 0 && movies.length > 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="text-5xl">🎬</div>
            <h2 className="font-['Syne',sans-serif] text-xl font-bold text-[#F0EDE8]">
              No movies match
            </h2>
            <p className="text-sm text-[#555] max-w-sm">
              Try adjusting your genre, language, or search term.
            </p>
            <button
              className="bg-[#F5A623] border-none rounded-xl text-[#09090E] font-bold text-sm px-6 py-2.5 hover:bg-[#E09920] transition-colors"
              onClick={clearAll}
            >
              Clear all filters
            </button>
          </div>
        )}
        {
          // ✅ If no user, redirect to register
        }
        {/* Movie grid */}
        {!error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((movie) => {
              const ratingColor = getRatingColor(movie.rating);
              return (
                <div
                  key={movie.id}
                  className="group bg-[#111116] rounded-xl overflow-hidden border border-[#18181f] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-[#F5A623]/40 hover:shadow-2xl hover:shadow-black/60"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/movies/${movie.id}`)
                  }
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x600/141418/555555?text=${encodeURIComponent(movie.title)}`;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111116] to-transparent pointer-events-none" />

                    <span className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.07em] px-2.5 py-1 rounded-md backdrop-blur-md bg-[#09090E]/70 border border-white/10 text-[#ccc] uppercase">
                      {movie.genre}
                    </span>

                    <span
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-xs font-bold bg-[#09090E]/80 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1.5"
                      style={{ color: ratingColor }}
                    >
                      <MdStar size={12} /> {movie.rating}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-['Syne',sans-serif] text-sm font-bold text-[#F0EDE8] line-clamp-2 leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                      {movie.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#555] pt-1">
                      <span className="flex items-center gap-1">
                        <MdAccessTime size={12} />{" "}
                        {fmtDuration(movie.durationMinutes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdLanguage size={12} /> {movie.language}
                      </span>
                    </div>
                    <button
                      className="w-full mt-2 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-lg text-[#F5A623] text-xs font-bold py-2.5 transition-all hover:bg-[#F5A623]/20 hover:border-[#F5A623]/40 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movies/${movie.id}`);
                      }}
                    >
                      Book Tickets 🎫
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

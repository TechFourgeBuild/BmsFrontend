import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdRefresh,
  MdCheck,
  MdStar,
  MdAccessTime,
  MdLanguage,
  MdCalendarMonth,
  MdMovie,
  MdGridView,
  MdTableRows,
  MdFilterList,
} from "react-icons/md";
import { FaStar } from "react-icons/fa";
import {
  fetchMovies,
  deleteMovie,
  updateMovie,
  addMovie,
} from "../../store/slices/movieSlice";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmtDur = (m) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : "—");
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const getRatingColor = (r) =>
  r >= 8.5 ? "#10B981" : r >= 7 ? "#F5A623" : "#EF4444";

const GENRE_COLORS = {
  Action: "#F5A623",
  Drama: "#E84393",
  Thriller: "#8B5CF6",
  Comedy: "#10B981",
  Adventure: "#3B82F6",
  Romance: "#EF4444",
  "Sci-Fi": "#06B6D4",
  Mystery: "#F59E0B",
  Animation: "#A78BFA",
  Horror: "#DC2626",
};
const genreColor = (g) => GENRE_COLORS[g] || "#6B7280";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.am-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
}

/* ── Animations ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes slideIn  { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
@keyframes shimmer  { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
@keyframes panelIn  {
  from { opacity:0; transform:translateX(100%); }
  to   { opacity:1; transform:translateX(0); }
}

.am-a1 { animation: fadeUp .4s ease .00s both; }
.am-a2 { animation: fadeUp .4s ease .05s both; }
.am-a3 { animation: fadeUp .4s ease .10s both; }

@media (prefers-reduced-motion: reduce) {
  .am-a1,.am-a2,.am-a3 { animation: none; opacity: 1; }
  .am-card { transition: none !important; }
}

/* ── Page header ── */
.am-hdr {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: clamp(20px, 3vw, 32px);
  flex-wrap: wrap;
}
.am-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 800;
  letter-spacing: -.022em;
  color: #F0EDE8;
  line-height: 1.05;
}
.am-title span { color: #F5A623; }
.am-sub { font-size: 13px; color: #444; margin-top: 5px; }

.am-hdr-right { display: flex; gap: 8px; align-items: center; }
.am-btn-add {
  display: flex; align-items: center; gap: 7px;
  background: #F5A623; border: none; border-radius: 11px;
  color: #09090E; font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px;
  padding: 11px 22px; cursor: pointer;
  transition: background .15s, transform .1s;
  white-space: nowrap;
}
.am-btn-add:hover  { background: #E09920; }
.am-btn-add:active { transform: scale(.97); }

/* View toggle */
.am-view-toggle {
  display: flex;
  background: #111116;
  border: 1px solid #1a1a24;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}
.am-view-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  background: transparent; border: none;
  color: #444; cursor: pointer;
  transition: background .15s, color .15s;
}
.am-view-btn.active { background: rgba(245,166,35,.12); color: #F5A623; }
.am-view-btn:hover:not(.active) { background: #18181f; color: #888; }

/* ── Filters ── */
.am-filters {
  display: flex;
  gap: 10px;
  margin-bottom: clamp(16px, 2.5vw, 24px);
  flex-wrap: wrap;
  align-items: center;
}
.am-search {
  flex: 1; min-width: 200px;
  display: flex; align-items: center;
  background: #111116; border: 1px solid #1a1a24; border-radius: 10px;
  padding: 0 14px; gap: 9px;
  height: 42px;
  transition: border-color .2s;
}
.am-search:focus-within { border-color: rgba(245,166,35,.45); }
.am-search input {
  flex: 1; background: transparent; border: none; outline: none;
  color: #F0EDE8; font-family: 'Inter', sans-serif;
  font-size: 13px;
}
.am-search input::placeholder { color: #2e2e3a; }
.am-clear-search {
  background: none; border: none; color: #444; cursor: pointer;
  padding: 0; display: flex; align-items: center;
  transition: color .15s;
}
.am-clear-search:hover { color: #F5A623; }

.am-select {
  background: #111116; border: 1px solid #1a1a24; border-radius: 10px;
  color: #F0EDE8; font-family: 'Inter', sans-serif;
  font-size: 13px; padding: 0 14px;
  height: 42px; outline: none; cursor: pointer;
  transition: border-color .2s;
}
.am-select:focus { border-color: rgba(245,166,35,.45); }
.am-select option { background: #111116; }

/* Result meta */
.am-results-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; font-weight: 600; color: #2a2a38;
  white-space: nowrap; flex-shrink: 0;
  display: flex; align-items: center;
}
.am-results-meta b { color: #F5A623; }

/* ── Error ── */
.am-error {
  display: flex; align-items: center; gap: 10px;
  background: rgba(239,68,68,.07); border: 1px solid rgba(239,68,68,.2);
  border-radius: 10px; padding: 13px 16px;
  color: #EF4444; font-size: 13px; margin-bottom: 16px;
}

/* ────────────────────────────────────────────────────────────
   CARD GRID VIEW
──────────────────────────────────────────────────────────── */
.am-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(10px, 1.5vw, 16px);
}
@media (min-width: 560px)  { .am-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 800px)  { .am-grid { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1100px) { .am-grid { grid-template-columns: repeat(5, 1fr); } }
@media (min-width: 1400px) { .am-grid { grid-template-columns: repeat(6, 1fr); } }

.am-card {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  overflow: hidden;
  cursor: default;
  position: relative;
  transition: transform .22s cubic-bezier(.22,.68,0,1.2), border-color .2s, box-shadow .2s;
  animation: fadeUp .35s ease both;
}
.am-card:hover {
  transform: translateY(-5px);
  border-color: #252530;
  box-shadow: 0 16px 40px rgba(0,0,0,.55);
}
.am-card:hover .am-card-overlay { opacity: 1; }

/* Poster */
.am-card-poster { position: relative; aspect-ratio: 2/3; overflow: hidden; }
.am-card-poster img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .4s ease;
}
.am-card:hover .am-card-poster img { transform: scale(1.06); }
.am-card-poster-fb {
  width: 100%; aspect-ratio: 2/3;
  background: #1a1a24;
  display: flex; align-items: center; justify-content: center;
  color: #2a2a38; font-size: 40px;
}

/* Rating badge on poster */
.am-rating-badge {
  position: absolute; bottom: 8px; right: 8px;
  display: flex; align-items: center; gap: 3px;
  background: rgba(9,9,14,.85); backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 6px; padding: 4px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; font-weight: 700;
}
/* Genre badge */
.am-genre-badge {
  position: absolute; top: 8px; left: 8px;
  font-size: 9px; font-weight: 700; letter-spacing: .07em;
  padding: 3px 8px; border-radius: 5px;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
  background: rgba(9,9,14,.75);
  border: 1px solid rgba(255,255,255,.1);
  color: #ccc;
}

/* Hover overlay — actions */
.am-card-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(9,9,14,.95) 0%, rgba(9,9,14,.4) 60%, transparent 100%);
  opacity: 0;
  transition: opacity .25s;
  display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 14px;
  gap: 7px;
}
.am-overlay-title {
  font-family: 'Syne', sans-serif;
  font-size: 14px; font-weight: 800;
  color: #F0EDE8; letter-spacing: -.01em;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.am-overlay-btns { display: flex; gap: 6px; }
.am-overlay-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  border: none; border-radius: 8px;
  font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
  padding: 8px 6px; cursor: pointer;
  transition: transform .1s, background .15s;
}
.am-overlay-btn:active { transform: scale(.96); }
.am-overlay-btn.edit   { background: rgba(245,166,35,.15); color: #F5A623; border: 1px solid rgba(245,166,35,.3); }
.am-overlay-btn.edit:hover   { background: rgba(245,166,35,.25); }
.am-overlay-btn.del    { background: rgba(239,68,68,.12);  color: #EF4444; border: 1px solid rgba(239,68,68,.25); }
.am-overlay-btn.del:hover    { background: rgba(239,68,68,.22); }

/* Card body (below poster) */
.am-card-body { padding: 10px 12px 12px; }
.am-card-title {
  font-family: 'Syne', sans-serif;
  font-size: 13px; font-weight: 700; color: #F0EDE8;
  line-height: 1.25;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: 6px;
}
.am-card-meta {
  display: flex; flex-wrap: wrap; gap: 5px;
  font-size: 11px; color: #555;
}
.am-card-meta-i { display: flex; align-items: center; gap: 3px; }

/* ────────────────────────────────────────────────────────────
   TABLE VIEW
──────────────────────────────────────────────────────────── */
.am-table-wrap {
  background: #111116; border: 1px solid #18181f;
  border-radius: 14px; overflow: hidden; overflow-x: auto;
}
.am-table { width: 100%; border-collapse: collapse; }
.am-table th {
  text-align: left; padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 700; letter-spacing: .16em;
  color: #2a2a38; text-transform: uppercase;
  border-bottom: 1px solid #13131a; white-space: nowrap;
}
.am-table td {
  padding: 12px 16px; border-bottom: 1px solid #0d0d12; vertical-align: middle;
}
.am-table tr:last-child td { border-bottom: none; }
.am-table tr:hover td { background: rgba(255,255,255,.015); }
.am-tbl-poster {
  width: 36px; height: 50px; border-radius: 5px;
  object-fit: cover; border: 1px solid #1e1e28; display: block;
}
.am-tbl-poster-fb {
  width: 36px; height: 50px; border-radius: 5px;
  background: #1a1a24; border: 1px solid #1e1e28;
  display: flex; align-items: center; justify-content: center;
  color: #2e2e3a; font-size: 16px;
}
.am-tbl-title { font-size: 14px; font-weight: 600; color: #F0EDE8; }
.am-tbl-sub   { font-size: 11px; color: #444; margin-top: 2px; }
.am-tbl-badge {
  display: inline-block; font-size: 10px; font-weight: 700;
  letter-spacing: .06em; padding: 2px 8px; border-radius: 5px;
  text-transform: uppercase;
}
.am-tbl-rating {
  display: flex; align-items: center; gap: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; font-weight: 700;
}
.am-tbl-actions { display: flex; gap: 6px; align-items: center; justify-content: flex-end; }
.am-tbl-btn {
  display: flex; align-items: center; gap: 4px;
  background: transparent; border: 1px solid #1a1a24;
  border-radius: 7px; color: #555;
  font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
  padding: 6px 12px; cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
  white-space: nowrap;
}
.am-tbl-btn.edit:hover  { border-color: rgba(245,166,35,.4); color: #F5A623; }
.am-tbl-btn.del:hover   { border-color: rgba(239,68,68,.4);  color: #EF4444; background: rgba(239,68,68,.04); }

/* ── Empty state ── */
.am-empty {
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  padding: clamp(48px, 8vw, 80px) 24px; gap: 12px;
}
.am-empty-icon { font-size: 44px; opacity: .3; }
.am-empty-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px; font-weight: 700; color: #F0EDE8;
}
.am-empty-sub { font-size: 13px; color: #444; max-width: 280px; line-height: 1.6; }
.am-empty-btn {
  display: flex; align-items: center; gap: 6px;
  background: #F5A623; border: none; border-radius: 10px;
  color: #09090E; font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px;
  padding: 11px 22px; cursor: pointer;
  transition: background .15s;
}
.am-empty-btn:hover { background: #E09920; }

/* ── Skeleton ── */
.sk {
  background: linear-gradient(90deg, #141418 25%, #1e1e26 50%, #141418 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 6px;
}
.am-sk-card {
  background: #111116; border: 1px solid #18181f; border-radius: 12px; overflow: hidden;
}
.am-sk-poster { aspect-ratio: 2/3; }

/* ────────────────────────────────────────────────────────────
   EDIT SLIDE PANEL
──────────────────────────────────────────────────────────── */
.am-panel-backdrop {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(6px);
  animation: fadeIn .2s ease both;
}
.am-panel {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: min(480px, 100vw);
  background: #0d0d14;
  border-left: 1px solid #1a1a24;
  z-index: 501;
  display: flex; flex-direction: column;
  overflow: hidden;
  animation: panelIn .3s cubic-bezier(.22,.68,0,1.2) both;
  box-shadow: -24px 0 60px rgba(0,0,0,.6);
}

/* Panel header */
.am-panel-hdr {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #13131a;
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px;
  flex-shrink: 0;
}
.am-panel-hdr-left {}
.am-panel-slate {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 700;
  letter-spacing: .2em; color: #F5A623;
  text-transform: uppercase; margin-bottom: 4px;
}
.am-panel-title {
  font-family: 'Syne', sans-serif;
  font-size: 20px; font-weight: 800;
  color: #F0EDE8; letter-spacing: -.02em;
  line-height: 1.1;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
  max-width: 320px;
}
.am-panel-close {
  background: transparent; border: 1px solid #1a1a24;
  border-radius: 9px; color: #555; padding: 7px;
  cursor: pointer; display: flex; align-items: center;
  transition: border-color .15s, color .15s;
  flex-shrink: 0;
}
.am-panel-close:hover { border-color: #EF4444; color: #EF4444; }

/* Panel scroll body */
.am-panel-body {
  flex: 1; overflow-y: auto; padding: 24px;
  display: flex; flex-direction: column; gap: 18px;
  scrollbar-width: thin; scrollbar-color: #1a1a24 transparent;
}
.am-panel-body::-webkit-scrollbar { width: 4px; }
.am-panel-body::-webkit-scrollbar-thumb { background: #1e1e28; border-radius: 2px; }

/* Form field */
.am-field { display: flex; flex-direction: column; gap: 7px; }
.am-field-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 700; letter-spacing: .18em;
  color: #2e2e3a; text-transform: uppercase;
}
.am-field-input, .am-field-textarea, .am-field-select {
  background: #09090E; border: 1px solid #1a1a24; border-radius: 10px;
  color: #F0EDE8; font-family: 'Inter', sans-serif;
  font-size: 14px; font-weight: 500; padding: 11px 14px;
  outline: none; width: 100%;
  transition: border-color .2s;
}
.am-field-input:focus,
.am-field-textarea:focus,
.am-field-select:focus { border-color: rgba(245,166,35,.5); }
.am-field-input::placeholder,
.am-field-textarea::placeholder { color: #1e1e28; }
.am-field-textarea { resize: vertical; min-height: 80px; line-height: 1.55; }
.am-field-select option { background: #0d0d14; }

/* 2-col grid inside panel */
.am-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* Poster preview */
.am-poster-preview {
  width: 80px; height: 112px; border-radius: 8px;
  object-fit: cover; border: 1px solid #1a1a24;
  flex-shrink: 0;
}
.am-poster-preview-wrap { display: flex; gap: 14px; align-items: flex-start; }
.am-poster-preview-url { flex: 1; }

/* Panel error */
.am-panel-error {
  display: flex; align-items: center; gap: 8px;
  background: rgba(239,68,68,.07); border: 1px solid rgba(239,68,68,.2);
  border-radius: 8px; padding: 10px 14px;
  font-size: 13px; color: #EF4444;
}

/* Panel footer */
.am-panel-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid #13131a;
  display: flex; gap: 10px;
  flex-shrink: 0;
}
.am-panel-save {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  background: #F5A623; border: none; border-radius: 11px;
  color: #09090E; font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px; padding: 13px;
  cursor: pointer; transition: background .15s, transform .1s;
}
.am-panel-save:hover  { background: #E09920; }
.am-panel-save:active { transform: scale(.97); }
.am-panel-save:disabled { opacity: .4; cursor: not-allowed; }
.am-panel-cancel {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  background: transparent; border: 1px solid #1a1a24; border-radius: 11px;
  color: #888; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 14px; padding: 13px 20px;
  cursor: pointer; transition: border-color .15s;
}
.am-panel-cancel:hover { border-color: rgba(245,166,35,.3); }

/* ────────────────────────────────────────────────────────────
   DELETE MODAL
──────────────────────────────────────────────────────────── */
.am-modal-backdrop {
  position: fixed; inset: 0; z-index: 600;
  background: rgba(0,0,0,.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; animation: fadeIn .2s ease both;
}
.am-modal {
  background: #0d0d14; border: 1px solid #1a1a24; border-radius: 16px;
  max-width: 400px; width: 100%;
  box-shadow: 0 28px 70px rgba(0,0,0,.7);
  overflow: hidden;
  animation: fadeUp .3s cubic-bezier(.22,.68,0,1.2) both;
}
.am-modal-top {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 22px 18px;
  border-bottom: 1px solid #13131a;
}
.am-modal-del-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.2);
  display: flex; align-items: center; justify-content: center;
  color: #EF4444; flex-shrink: 0;
}
.am-modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 16px; font-weight: 800; color: #F0EDE8;
  letter-spacing: -.01em;
}
.am-modal-sub { font-size: 13px; color: #555; margin-top: 3px; line-height: 1.5; }
.am-modal-body { padding: 18px 22px 22px; display: flex; gap: 10px; }
.am-modal-btn {
  flex: 1; padding: 12px; border-radius: 10px;
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px;
  border: none; cursor: pointer; transition: background .15s, transform .1s;
}
.am-modal-btn:active { transform: scale(.97); }
.am-modal-btn.cancel  { background: #1a1a24; color: #888; }
.am-modal-btn.cancel:hover { background: #222230; }
.am-modal-btn.del-confirm { background: #EF4444; color: #fff; }
.am-modal-btn.del-confirm:hover { background: #DC2626; }
.am-modal-btn:disabled { opacity: .45; cursor: not-allowed; }

/* ── Footer stat ── */
.am-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 16px; flex-wrap: wrap; gap: 8px;
}
.am-footer-stat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; font-weight: 600; color: #2a2a38;
}
.am-footer-stat b { color: #F5A623; }
`;

// ─── Add movie panel ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "",
  description: "",
  genre: "",
  language: "",
  durationMinutes: "",
  rating: "",
  releaseDate: "",
  posterUrl: "",
};

function AddMoviePanel({ onClose, onAdded }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.genre.trim()) {
      setError("Genre is required.");
      return;
    }
    if (!form.language.trim()) {
      setError("Language is required.");
      return;
    }
    if (!form.durationMinutes) {
      setError("Duration is required.");
      return;
    }
    if (!form.releaseDate) {
      setError("Release date is required.");
      return;
    }
    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setError("Rating must be a number between 0 and 10.");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      genre: form.genre.trim(),
      language: form.language.trim(),
      durationMinutes: parseInt(form.durationMinutes, 10),
      rating,
      releaseDate: form.releaseDate,
      posterUrl: form.posterUrl.trim(),
    };
    const result = await dispatch(addMovie(payload));
    setSaving(false);
    if (addMovie.fulfilled.match(result)) {
      onAdded();
      onClose();
    } else {
      setError(
        result.payload?.message ||
          "Failed to add movie. Check all fields and try again.",
      );
    }
  };

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const posterValid = form.posterUrl.trim().startsWith("http");

  return (
    <>
      <div className="am-panel-backdrop" onClick={onClose} />
      <div
        className="am-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Add new movie"
      >
        {/* Header */}
        <div className="am-panel-hdr">
          <div className="am-panel-hdr-left">
            <div className="am-panel-slate">New Movie</div>
            <div className="am-panel-title">
              {form.title.trim() || "Untitled Movie"}
            </div>
          </div>
          <button
            className="am-panel-close"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="am-panel-body">
          {/* Poster preview + URL */}
          <div className="am-field">
            <label className="am-field-label">Poster URL</label>
            <div className="am-poster-preview-wrap">
              {posterValid && (
                <img
                  src={form.posterUrl}
                  alt="poster preview"
                  className="am-poster-preview"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="am-poster-preview-url">
                <input
                  className="am-field-input"
                  placeholder="https://…"
                  value={form.posterUrl}
                  onChange={set("posterUrl")}
                />
                <div style={{ fontSize: 11, color: "#2a2a38", marginTop: 5 }}>
                  Paste a direct image URL. Preview appears instantly.
                </div>
              </div>
            </div>
          </div>

          <div className="am-field">
            <label className="am-field-label" htmlFor="ap-title">
              Title <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              id="ap-title"
              className="am-field-input"
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Inception"
            />
          </div>

          <div className="am-field">
            <label className="am-field-label" htmlFor="ap-desc">
              Description
            </label>
            <textarea
              id="ap-desc"
              className="am-field-textarea"
              value={form.description}
              onChange={set("description")}
              placeholder="Brief synopsis of the movie…"
              rows={4}
            />
          </div>

          <div className="am-field-row">
            <div className="am-field">
              <label className="am-field-label" htmlFor="ap-genre">
                Genre <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                id="ap-genre"
                className="am-field-input"
                value={form.genre}
                onChange={set("genre")}
                placeholder="e.g. Drama"
              />
            </div>
            <div className="am-field">
              <label className="am-field-label" htmlFor="ap-lang">
                Language <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                id="ap-lang"
                className="am-field-input"
                value={form.language}
                onChange={set("language")}
                placeholder="e.g. Hindi"
              />
            </div>
          </div>

          <div className="am-field-row">
            <div className="am-field">
              <label className="am-field-label" htmlFor="ap-dur">
                Duration (min) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                id="ap-dur"
                className="am-field-input"
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={set("durationMinutes")}
                placeholder="e.g. 135"
              />
            </div>
            <div className="am-field">
              <label className="am-field-label" htmlFor="ap-rating">
                Rating (0–10) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                id="ap-rating"
                className="am-field-input"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.rating}
                onChange={set("rating")}
                placeholder="e.g. 7.7"
              />
            </div>
          </div>

          <div className="am-field">
            <label className="am-field-label" htmlFor="ap-date">
              Release Date <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              id="ap-date"
              className="am-field-input"
              type="date"
              value={form.releaseDate}
              onChange={set("releaseDate")}
            />
          </div>

          {/* Required fields note */}
          <div
            style={{
              fontSize: 11,
              color: "#2a2a38",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ color: "#EF4444" }}>*</span> Required fields
          </div>

          {/* Error */}
          {error && (
            <div className="am-panel-error">
              <MdClose size={14} /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="am-panel-footer">
          <button className="am-panel-cancel" onClick={onClose}>
            Discard
          </button>
          <button
            className="am-panel-save"
            onClick={handleAdd}
            disabled={saving}
          >
            {saving ? (
              "Adding…"
            ) : (
              <>
                <MdAdd size={16} /> Add Movie
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Edit panel ───────────────────────────────────────────────────────────────
function EditPanel({ movie, onClose, onSaved }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: movie.title || "",
    description: movie.description || "",
    genre: movie.genre || "",
    language: movie.language || "",
    durationMinutes: movie.durationMinutes || "",
    rating: movie.rating || "",
    releaseDate: movie.releaseDate || "",
    posterUrl: movie.posterUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      durationMinutes: Number(form.durationMinutes) || movie.durationMinutes,
      rating: parseFloat(form.rating) || movie.rating,
    };
    const result = await dispatch(
      updateMovie({ id: movie.id, movieData: payload }),
    );
    setSaving(false);
    if (updateMovie.fulfilled.match(result)) {
      onSaved();
      onClose();
    } else {
      setError(result.payload?.message || "Failed to save changes.");
    }
  }; // --> Currently we don't have DELETE or UPDATE movie functionality in backend 
 
  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div className="am-panel-backdrop" onClick={onClose} />
      <div
        className="am-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${movie.title}`}
      >
        {/* Header */}
        <div className="am-panel-hdr">
          <div className="am-panel-hdr-left">
            <div className="am-panel-slate">Editing Movie</div>
            <div className="am-panel-title">{movie.title}</div>
          </div>
          <button
            className="am-panel-close"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="am-panel-body">
          {/* Poster preview + URL */}
          <div className="am-field">
            <label className="am-field-label">Poster</label>
            <div className="am-poster-preview-wrap">
              {form.posterUrl && (
                <img
                  src={form.posterUrl}
                  alt="poster preview"
                  className="am-poster-preview"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="am-poster-preview-url">
                <input
                  className="am-field-input"
                  placeholder="Paste poster URL…"
                  value={form.posterUrl}
                  onChange={set("posterUrl")}
                />
              </div>
            </div>
          </div>

          <div className="am-field">
            <label className="am-field-label" htmlFor="ep-title">
              Title
            </label>
            <input
              id="ep-title"
              className="am-field-input"
              value={form.title}
              onChange={set("title")}
              placeholder="Movie title"
            />
          </div>

          <div className="am-field">
            <label className="am-field-label" htmlFor="ep-desc">
              Description
            </label>
            <textarea
              id="ep-desc"
              className="am-field-textarea"
              value={form.description}
              onChange={set("description")}
              placeholder="Synopsis…"
              rows={4}
            />
          </div>

          <div className="am-field-row">
            <div className="am-field">
              <label className="am-field-label" htmlFor="ep-genre">
                Genre
              </label>
              <input
                id="ep-genre"
                className="am-field-input"
                value={form.genre}
                onChange={set("genre")}
                placeholder="e.g. Action"
              />
            </div>
            <div className="am-field">
              <label className="am-field-label" htmlFor="ep-lang">
                Language
              </label>
              <input
                id="ep-lang"
                className="am-field-input"
                value={form.language}
                onChange={set("language")}
                placeholder="e.g. Hindi"
              />
            </div>
          </div>

          <div className="am-field-row">
            <div className="am-field">
              <label className="am-field-label" htmlFor="ep-dur">
                Duration (min)
              </label>
              <input
                id="ep-dur"
                className="am-field-input"
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={set("durationMinutes")}
                placeholder="e.g. 148"
              />
            </div>
            <div className="am-field">
              <label className="am-field-label" htmlFor="ep-rating">
                Rating (0–10)
              </label>
              <input
                id="ep-rating"
                className="am-field-input"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.rating}
                onChange={set("rating")}
                placeholder="e.g. 8.5"
              />
            </div>
          </div>

          <div className="am-field">
            <label className="am-field-label" htmlFor="ep-date">
              Release Date
            </label>
            <input
              id="ep-date"
              className="am-field-input"
              type="date"
              value={form.releaseDate}
              onChange={set("releaseDate")}
            />
          </div>

          {error && (
            <div className="am-panel-error">
              <MdClose size={14} /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="am-panel-footer">
          <button className="am-panel-cancel" onClick={onClose}>
            Discard
          </button>
          <button
            className="am-panel-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              "Saving…"
            ) : (
              <>
                <MdCheck size={16} /> Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Delete modal ─────────────────────────────────────────────────────────────
function DeleteModal({ movie, onClose, onDeleted }) {
  const dispatch  = useDispatch();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    await dispatch(deleteMovie(movie.id));
    setBusy(false);
    dispatch(fetchMovies());
    onDeleted();
    onClose();
  };

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="am-modal-backdrop" onClick={onClose}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="am-modal-top">
          <div className="am-modal-del-icon"><MdDelete size={22} /></div>
          <div>
            <div className="am-modal-title">Delete movie?</div>
            <div className="am-modal-sub">
              "{movie.title}" will be permanently removed from the catalog.
            </div>
          </div>
        </div>
        <div className="am-modal-body">
          <button className="am-modal-btn cancel" onClick={onClose} disabled={busy}>Keep it</button>
          <button className="am-modal-btn del-confirm" onClick={handleDelete} disabled={busy}>
            {busy ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
} // --> Currently we don't have DELETE or UPDATE movie functionality in backend 
   
// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminMovies() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies, isLoading, error } = useSelector((s) => s.movies);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [lang, setLang] = useState("All");
  const [view, setView] = useState("grid"); // "grid" | "table"
  const [showAdd, setShowAdd] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [delMovie, setDelMovie] = useState(null);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Search is handled client-side in the filtered useMemo below

  const genres = useMemo(
    () => ["All", ...new Set(movies.map((m) => m.genre))],
    [movies],
  );
  const languages = useMemo(
    () => ["All", ...new Set(movies.map((m) => m.language))],
    [movies],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movies.filter((m) => {
      if (
        q &&
        !(
          m.title?.toLowerCase().includes(q) ||
          m.genre?.toLowerCase().includes(q) ||
          m.language?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
        )
      )
        return false;
      if (genre !== "All" && m.genre !== genre) return false;
      if (lang !== "All" && m.language !== lang) return false;
      return true;
    });
  }, [movies, search, genre, lang]);

  const handleAdded = useCallback(() => dispatch(fetchMovies()), [dispatch]);
  const handleSaved = useCallback(() => dispatch(fetchMovies()), [dispatch]);
  const handleDeleted = useCallback(() => dispatch(fetchMovies()), [dispatch]);

  return (
    <>
      <style>{CSS}</style>
      <div className="am-root">
        {/* ── Header ── */}
        <div className="am-hdr am-a1">
          <div>
            <h1 className="am-title">
              Movie <span>Catalog</span>
            </h1>
            <p className="am-sub">
              {isLoading
                ? "Loading…"
                : `${movies.length} movies · ${genres.length - 1} genres · ${languages.length - 1} languages`}
            </p>
          </div>
          <div className="am-hdr-right">
            {/* View toggle */}
            <div className="am-view-toggle" role="group" aria-label="View mode">
              <button
                className={`am-view-btn${view === "grid" ? " active" : ""}`}
                onClick={() => setView("grid")}
                aria-label="Grid view"
                title="Grid view"
              >
                <MdGridView size={18} />
              </button>
              <button
                className={`am-view-btn${view === "table" ? " active" : ""}`}
                onClick={() => setView("table")}
                aria-label="Table view"
                title="Table view"
              >
                <MdTableRows size={18} />
              </button>
            </div>
            <button className="am-btn-add" onClick={() => setShowAdd(true)}>
              <MdAdd size={18} /> Add Movie
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="am-filters am-a2">
          <div className="am-search">
            <MdSearch size={17} color="#2a2a38" />
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search movies"
            />
            {search && (
              <button
                className="am-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear"
              >
                <MdClose size={15} />
              </button>
            )}
          </div>
          <select
            className="am-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            aria-label="Filter by genre"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            className="am-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Filter by language"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <div className="am-results-meta">
            <b>{filtered.length}</b>&nbsp;/ {movies.length}
          </div>
        </div>

        {/* ── Error ── */}
        {error && <div className="am-error am-a2">⚠️ {error}</div>}

        {/* ── Grid view ── */}
        {view === "grid" && (
          <>
            {isLoading && movies.length === 0 ? (
              <div className="am-grid">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="am-sk-card">
                    <div className="am-sk-poster sk" />
                    <div
                      style={{
                        padding: "10px 12px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                      }}
                    >
                      <div
                        className="sk"
                        style={{ height: 13, width: "75%" }}
                      />
                      <div
                        className="sk"
                        style={{ height: 10, width: "50%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="am-empty">
                <div className="am-empty-icon">🎬</div>
                <div className="am-empty-title">No movies found</div>
                <p className="am-empty-sub">
                  Adjust your filters or add a new movie to the catalog.
                </p>
                <button
                  className="am-empty-btn"
                  onClick={() => setShowAdd(true)}
                >
                  <MdAdd size={16} /> Add Movie
                </button>
              </div>
            ) : (
              <div className="am-grid am-a3">
                {filtered.map((movie, idx) => {
                  const rc = getRatingColor(movie.rating);
                  const gc = genreColor(movie.genre);
                  return (
                    <div
                      key={movie.id}
                      className="am-card"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="am-card-poster">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="am-card-poster-fb">🎬</div>
                        )}
                        {/* Genre badge */}
                        <span className="am-genre-badge">{movie.genre}</span>
                        {/* Rating badge */}
                        <span className="am-rating-badge" style={{ color: rc }}>
                          <FaStar size={10} /> {movie.rating}
                        </span>
                        {/* Hover overlay */}
                        <div className="am-card-overlay">
                          <div className="am-overlay-title">{movie.title}</div>
                          <div className="am-overlay-btns">
                            <button
                              className="am-overlay-btn edit"
                              onClick={() => setEditMovie(movie)}
                            >
                              <MdEdit size={13} /> Edit
                            </button>
                            <button
                              className="am-overlay-btn del"
                              onClick={() => setDelMovie(movie)}
                            >
                              <MdDelete size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="am-card-body">
                        <div className="am-card-title">{movie.title}</div>
                        <div className="am-card-meta">
                          <span className="am-card-meta-i">
                            <MdAccessTime size={11} />
                            {fmtDur(movie.durationMinutes)}
                          </span>
                          <span className="am-card-meta-i">
                            <MdLanguage size={11} />
                            {movie.language}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Table view ── */}
        {view === "table" && (
          <div className="am-table-wrap am-a3">
            <table className="am-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Language</th>
                  <th>Rating</th>
                  <th>Duration</th>
                  <th>Release</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && movies.length === 0 ? (
                  Array.from({ length: 6 }, (_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }, (__, j) => (
                        <td key={j}>
                          <div
                            className="sk"
                            style={{
                              height: 12,
                              width: `${60 + Math.random() * 30}%`,
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className="am-empty">
                        <div className="am-empty-icon">🎬</div>
                        <div className="am-empty-title">No movies found</div>
                        <p className="am-empty-sub">
                          Adjust filters or add a new movie.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((movie) => {
                    const rc = getRatingColor(movie.rating);
                    const gc = genreColor(movie.genre);
                    return (
                      <tr key={movie.id}>
                        <td>
                          {movie.posterUrl ? (
                            <img
                              className="am-tbl-poster"
                              src={movie.posterUrl}
                              alt={movie.title}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <div className="am-tbl-poster-fb">🎬</div>
                          )}
                        </td>
                        <td>
                          <div className="am-tbl-title">{movie.title}</div>
                          <div
                            className="am-tbl-sub"
                            style={{
                              maxWidth: 220,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {movie.description}
                          </div>
                        </td>
                        <td>
                          <span
                            className="am-tbl-badge"
                            style={{
                              background: `${gc}18`,
                              color: gc,
                              border: `1px solid ${gc}33`,
                            }}
                          >
                            {movie.genre}
                          </span>
                        </td>
                        <td style={{ color: "#666", fontSize: 13 }}>
                          {movie.language}
                        </td>
                        <td>
                          <span className="am-tbl-rating" style={{ color: rc }}>
                            <FaStar size={11} />
                            {movie.rating}
                          </span>
                        </td>
                        <td
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 12,
                            color: "#555",
                          }}
                        >
                          {fmtDur(movie.durationMinutes)}
                        </td>
                        <td
                          style={{
                            fontSize: 12,
                            color: "#444",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fmtDate(movie.releaseDate)}
                        </td>
                        <td>
                          <div className="am-tbl-actions">
                            <button
                              className="am-tbl-btn edit"
                              onClick={() => setEditMovie(movie)}
                            >
                              <MdEdit size={14} /> Edit
                            </button>
                            <button
                              className="am-tbl-btn del"
                              onClick={() => setDelMovie(movie)}
                            >
                              <MdDelete size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Footer ── */}
        {!isLoading && movies.length > 0 && (
          <div className="am-footer">
            <span className="am-footer-stat">
              Showing <b>{filtered.length}</b> of <b>{movies.length}</b> movies
            </span>
            <span className="am-footer-stat">
              Avg rating{" "}
              <b>
                {(
                  movies.reduce((s, m) => s + m.rating, 0) / movies.length
                ).toFixed(1)}
              </b>
            </span>
          </div>
        )}
      </div>

      {/* ── Add movie panel ── */}
      {showAdd && (
        <AddMoviePanel
          onClose={() => setShowAdd(false)}
          onAdded={handleAdded}
        />
      )}

      {/* ── Edit slide panel ── */}
      {editMovie && (
        <EditPanel
          movie={editMovie}
          onClose={() => setEditMovie(null)}
          onSaved={handleSaved}
        />
      )}

      {/* ── Delete modal ── */}
      {delMovie && (
        <DeleteModal
          movie={delMovie}
          onClose={() => setDelMovie(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}

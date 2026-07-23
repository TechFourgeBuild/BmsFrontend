import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdMovie,
  MdTheaters,
  MdEvent,
  MdConfirmationNumber,
  MdPeople,
  MdAttachMoney,
  MdArrowForward,
  MdAdd,
  MdRefresh,
  MdAdminPanelSettings,
  MdTrendingUp,
  MdPlayCircle,
  MdLocationCity,
  MdScreenShare,
  MdClose,
  MdCheck,
} from "react-icons/md";
import { FaFire, FaStar, FaTicketAlt, FaFilm, FaCircle } from "react-icons/fa";
import { fetchMovies } from "../../store/slices/movieSlice";
import { fetchBookingsByUser } from "../../store/slices/bookingSlice";
import { fetchTheaters } from "../../store/slices/theaterSlice";
import { fetchAllBookings } from "../../store/slices/bookingSlice";
import axiosInstance from "../../api/axiosConfig";
import API from "../../api/endpoints";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDateShort = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};
const fmtTime = (d) =>
  d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
const fmtDateFull = (d) =>
  d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

.ad-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
}

/* ── Animations ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:.25; } }
@keyframes shimmer  { 0% { background-position:-700px 0; } 100% { background-position:700px 0; } }
@keyframes modalIn  { from { opacity:0; transform:scale(.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }

.a1 { animation: fadeUp .5s ease .00s both; }
.a2 { animation: fadeUp .5s ease .08s both; }
.a3 { animation: fadeUp .5s ease .16s both; }
.a4 { animation: fadeUp .5s ease .24s both; }
.a5 { animation: fadeUp .5s ease .32s both; }

@media (prefers-reduced-motion: reduce) {
  .a1,.a2,.a3,.a4,.a5 { animation: none; opacity: 1; }
  .live-dot { animation: none !important; }
}

/* ── Operator strip ── */
.op-strip {
  background: #070709;
  border-bottom: 1px solid #13131a;
  padding: 12px clamp(20px, 5vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.op-left  { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.op-live  { display: flex; align-items: center; gap: 7px;
            font-family: 'JetBrains Mono', monospace; font-size: 10px;
            font-weight: 700; letter-spacing: .16em; color: #10B981;
            text-transform: uppercase; }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #10B981;
            animation: pulse 1.6s ease-in-out infinite; flex-shrink: 0; }
.op-time  { font-family: 'JetBrains Mono', monospace; font-size: 15px;
            font-weight: 700; color: #F0EDE8; letter-spacing: .05em; }
.op-date  { font-family: 'JetBrains Mono', monospace; font-size: 11px;
            font-weight: 600; color: #2e2e3a; }
.op-badge { display: flex; align-items: center; gap: 6px;
            background: rgba(245,166,35,.07); border: 1px solid rgba(245,166,35,.18);
            border-radius: 100px; padding: 5px 14px;
            font-size: 11px; font-weight: 600; color: #F5A623; letter-spacing: .06em; }

/* ── Body ── */
.ad-body {
  padding: clamp(28px, 5vw, 56px) clamp(20px, 5vw, 48px);
  max-width: 1400px;
  margin: 0 auto;
}

/* ── Page header ── */
.ad-hdr        { margin-bottom: clamp(32px, 4vw, 52px); }
.ad-eyebrow    { font-family: 'JetBrains Mono', monospace; font-size: 10px;
                 font-weight: 700; letter-spacing: .22em; color: #F5A623;
                 text-transform: uppercase; margin-bottom: 10px; }
.ad-title      { font-family: 'Syne', sans-serif;
                 font-size: clamp(32px, 4vw, 52px); font-weight: 800;
                 letter-spacing: -.025em; color: #F0EDE8; line-height: 1.04; }
.ad-title span { color: #F5A623; }
.ad-sub        { font-size: 15px; color: #444; margin-top: 8px; line-height: 1.6; }
.ad-divider    { height: 1px; background: linear-gradient(90deg, #F5A623, transparent 40%);
                 margin-top: 24px; }

/* ── Stat grid ── */
.ad-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(8px, 1.5vw, 18px);
  margin-bottom: clamp(32px, 4vw, 52px);
}
@media (min-width: 600px)  { .ad-stats { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1100px) { .ad-stats { grid-template-columns: repeat(6, 1fr); } }

/* ── Stat card ── */
.ad-stat {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 16px;
  padding: clamp(14px, 2vw, 28px) clamp(12px, 1.5vw, 24px);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform .22s cubic-bezier(.22,.68,0,1.2), border-color .2s, box-shadow .2s;
}
.ad-stat::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 3px;
  background: var(--sc);
  opacity: .35;
  transition: opacity .2s, height .2s;
}
.ad-stat:hover {
  transform: translateY(-5px);
  border-color: var(--sc-dim);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
}
.ad-stat:hover::after { opacity: 1; height: 3px; }
.ad-stat:focus-visible { outline: 2px solid var(--sc); outline-offset: 3px; }

.ad-stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.ad-stat-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: var(--sc-bg); color: var(--sc); font-size: 18px;
}
.ad-stat-trend {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  background: var(--sc-bg); color: var(--sc);
  display: flex; align-items: center; gap: 3px;
  white-space: nowrap;
}
.ad-stat-val {
  font-family: 'Syne', sans-serif;
  font-size: clamp(18px, 2.5vw, 32px);
  font-weight: 800;
  color: #F0EDE8;
  line-height: 1.1;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ad-stat-lbl {
  font-size: 11px;
  color: #444;
  font-weight: 500;
}

/* ── Main content grid ── */
.ad-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(16px, 2.5vw, 24px);
}
@media (min-width: 900px) { .ad-content { grid-template-columns: 5fr 3fr; } }

/* ── Panel ── */
.ad-panel {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 16px;
  overflow: hidden;
}
.ad-panel-hdr {
  padding: clamp(16px, 2vw, 22px) clamp(18px, 2.5vw, 28px);
  border-bottom: 1px solid #13131a;
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
}
.ad-panel-title {
  font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
  color: #F0EDE8; display: flex; align-items: center; gap: 8px;
}
.ad-panel-link {
  display: flex; align-items: center; gap: 5px;
  background: transparent; border: 1px solid #1e1e28; border-radius: 8px;
  color: #555; font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 600; padding: 6px 14px;
  cursor: pointer; white-space: nowrap;
  transition: border-color .15s, color .15s;
}
.ad-panel-link:hover { border-color: rgba(245,166,35,.4); color: #F5A623; }

/* ── Booking rows ── */
.ad-brows { padding: 0 clamp(18px, 2.5vw, 28px); }
.ad-brow {
  display: flex; align-items: center;
  padding: clamp(14px, 2vw, 18px) 0;
  border-bottom: 1px solid #0f0f14;
  gap: 14px;
}
.ad-brow:last-child { border-bottom: none; }
.ad-brow-poster {
  width: 38px; height: 54px; border-radius: 6px;
  object-fit: cover; flex-shrink: 0;
  border: 1px solid #1e1e28;
}
.ad-brow-poster-fb {
  width: 38px; height: 54px; border-radius: 6px;
  background: #1a1a24; border: 1px solid #1e1e28;
  display: flex; align-items: center; justify-content: center;
  color: #333; flex-shrink: 0;
}
.ad-brow-info  { flex: 1; min-width: 0; }
.ad-brow-movie {
  font-size: 14px; font-weight: 600; color: #F0EDE8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 4px;
}
.ad-brow-meta  { font-size: 12px; color: #444; }
.ad-brow-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
.ad-brow-badge {
  font-size: 10px; font-weight: 700;
  padding: 3px 9px; border-radius: 100px; white-space: nowrap;
}
.ad-brow-badge.confirmed { background: rgba(16,185,129,.1);  color: #10B981; }
.ad-brow-badge.cancelled { background: rgba(239,68,68,.08);  color: #EF4444; }
.ad-brow-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; font-weight: 700; color: #F5A623;
}

/* Revenue strip */
.ad-rev-strip {
  display: flex; align-items: center; justify-content: space-between;
  padding: clamp(14px, 1.5vw, 18px) clamp(18px, 2.5vw, 28px);
  border-top: 1px solid #13131a;
  background: rgba(16,185,129,.03);
}
.ad-rev-lbl {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  font-weight: 700; letter-spacing: .16em; color: #2e2e3a;
  text-transform: uppercase;
}
.ad-rev-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px; font-weight: 700; color: #10B981;
}

/* ── Popular movies ── */
.ad-mrows  { padding: 0 clamp(18px, 2.5vw, 28px); }
.ad-mrow {
  display: flex; align-items: center;
  padding: clamp(12px, 1.5vw, 16px) 0;
  border-bottom: 1px solid #0f0f14; gap: 12px;
}
.ad-mrow:last-child { border-bottom: none; }
.ad-mrow-rank { font-size: 16px; width: 28px; text-align: center; flex-shrink: 0; line-height: 1; }
.ad-mrow-title {
  flex: 1; min-width: 0; font-size: 14px; font-weight: 600; color: #F0EDE8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ad-mrow-count {
  display: flex; align-items: center; gap: 5px;
  background: rgba(245,166,35,.08); border: 1px solid rgba(245,166,35,.15);
  border-radius: 100px; padding: 4px 12px;
  font-size: 11px; font-weight: 600; color: #F5A623;
  white-space: nowrap; flex-shrink: 0;
}
.ad-conf-strip {
  display: flex; align-items: center; justify-content: space-between;
  padding: clamp(14px,1.5vw,18px) clamp(18px,2.5vw,28px);
  border-top: 1px solid #13131a;
}
.ad-conf-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px;
               font-weight: 700; letter-spacing: .16em; color: #2e2e3a; text-transform: uppercase; }
.ad-conf-val { font-family: 'JetBrains Mono', monospace; font-size: 16px;
               font-weight: 700; color: #10B981; }

/* ── Quick actions ── */
.ad-qa-panel { grid-column: 1 / -1; }
.ad-qa-grid  {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(10px, 1.5vw, 16px);
  padding: clamp(18px, 2.5vw, 28px);
}
@media (max-width: 600px) { .ad-qa-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 900px) { .ad-qa-grid { grid-template-columns: repeat(8, 1fr); } }

.ad-qa-btn {
  background: #0d0d12;
  border: 1px solid #1a1a24;
  border-radius: 14px;
  padding: clamp(18px, 2.5vw, 26px) 10px;
  display: flex; flex-direction: column;
  align-items: center; gap: 10px;
  cursor: pointer;
  transition: border-color .2s, transform .22s cubic-bezier(.22,.68,0,1.2), background .15s;
  color: #444; font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 600; text-align: center; line-height: 1.3;
}
.ad-qa-btn:hover {
  border-color: var(--qc);
  color: var(--qc);
  background: #0f0f16;
  transform: translateY(-4px);
}
.ad-qa-btn:focus-visible { outline: 2px solid var(--qc); outline-offset: 3px; }
.ad-qa-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: var(--qbg); color: var(--qc); font-size: 20px;
  transition: background .15s;
}
.ad-qa-btn:hover .ad-qa-icon { background: var(--qbgh); }

/* ── Skeleton ── */
.sk {
  background: linear-gradient(90deg, #141418 25%, #1e1e26 50%, #141418 75%);
  background-size: 700px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 6px;
}

/* ── Empty ── */
.ad-empty {
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  padding: clamp(28px, 4vw, 48px) 24px; gap: 10px;
}
.ad-empty-icon { font-size: 32px; opacity: .35; }
.ad-empty-text { font-size: 13px; color: #444; }

/* ── Modal backdrop ── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: fadeIn .2s ease both;
}
.modal {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 18px;
  width: 100%; max-width: 440px;
  box-shadow: 0 32px 80px rgba(0,0,0,.7);
  animation: modalIn .3s cubic-bezier(.22,.68,0,1.2) both;
  overflow: hidden;
}
.modal-hdr {
  padding: 22px 24px 18px;
  border-bottom: 1px solid #18181f;
  display: flex; align-items: center; justify-content: space-between;
}
.modal-title {
  font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
  color: #F0EDE8; letter-spacing: -.015em;
  display: flex; align-items: center; gap: 9px;
}
.modal-close {
  background: transparent; border: 1px solid #1e1e28; border-radius: 8px;
  color: #555; padding: 6px; cursor: pointer; display: flex;
  transition: border-color .15s, color .15s;
}
.modal-close:hover { border-color: #EF4444; color: #EF4444; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }

/* Form field */
.field { display: flex; flex-direction: column; gap: 7px; }
.field-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  font-weight: 700; letter-spacing: .16em; color: #444;
  text-transform: uppercase;
}
.field-input, .field-select {
  background: #0d0d12; border: 1px solid #1e1e28; border-radius: 10px;
  color: #F0EDE8; font-family: 'Inter', sans-serif;
  font-size: 14px; font-weight: 500; padding: 12px 14px;
  outline: none; width: 100%;
  transition: border-color .2s;
}
.field-input:focus, .field-select:focus { border-color: rgba(245,166,35,.5); }
.field-input::placeholder { color: #2a2a38; }
.field-select option { background: #111116; }

.modal-footer {
  padding: 18px 24px 22px;
  border-top: 1px solid #18181f;
  display: flex; gap: 10px;
}
.modal-btn-primary {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  background: #F5A623; border: none; border-radius: 11px;
  color: #09090E; font-family: 'Inter', sans-serif;
  font-weight: 700; font-size: 14px; padding: 13px;
  cursor: pointer; transition: background .15s, transform .1s;
}
.modal-btn-primary:hover { background: #E09920; }
.modal-btn-primary:active { transform: scale(.97); }
.modal-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
.modal-btn-ghost {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  background: transparent; border: 1px solid #252530; border-radius: 11px;
  color: #888; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 14px; padding: 13px 20px;
  cursor: pointer; transition: border-color .15s;
}
.modal-btn-ghost:hover { border-color: rgba(245,166,35,.35); }

/* Toast */
.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  z-index: 2000;
  display: flex; align-items: center; gap: 10px;
  background: #1a1a24; border: 1px solid #2a2a38;
  border-radius: 100px; padding: 12px 22px;
  font-size: 13px; font-weight: 600; color: #F0EDE8;
  box-shadow: 0 12px 40px rgba(0,0,0,.5);
  animation: fadeUp .3s ease both;
  white-space: nowrap;
}
.toast.success { border-color: rgba(16,185,129,.35); color: #10B981; }
.toast.error   { border-color: rgba(239,68,68,.35);  color: #EF4444; }
`;

// ─── Stat config ──────────────────────────────────────────────────────────────
const STATS = [
  {
    key: "totalMovies",
    label: "Movies",
    icon: <MdMovie size={20} />,
    color: "#F5A623",
    bg: "rgba(245,166,35,.1)",
    route: "/admin/movies",
  },
  {
    key: "totalTheaters",
    label: "Theaters",
    icon: <MdTheaters size={20} />,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,.1)",
    route: "/admin/theaters",
  },
  {
    key: "totalShows",
    label: "Shows",
    icon: <MdEvent size={20} />,
    color: "#3B82F6",
    bg: "rgba(59,130,246,.1)",
    route: "/admin/shows",
  },
  {
    key: "totalBookings",
    label: "Bookings",
    icon: <MdConfirmationNumber size={20} />,
    color: "#10B981",
    bg: "rgba(16,185,129,.1)",
    route: "/admin/bookings",
  },
  {
    key: "totalUsers",
    label: "Users",
    icon: <MdPeople size={20} />,
    color: "#E84393",
    bg: "rgba(232,67,147,.1)",
    route: "/admin/users",
  },
  {
    key: "totalRevenue",
    label: "Revenue",
    icon: <MdAttachMoney size={20} />,
    color: "#10B981",
    bg: "rgba(16,185,129,.1)",
    fmt: fmtPrice,
    route: "/admin/bookings",
  },
];

// ─── Quick actions config ─────────────────────────────────────────────────────
const QA = [
  {
    label: "Add Movie",
    icon: <FaFilm size={18} />,
    color: "#F5A623",
    bg: "rgba(245,166,35,.08)",
    bgh: "rgba(245,166,35,.15)",
    route: "/admin/movies",
  },
  {
    label: "Add Theater",
    icon: <MdTheaters size={20} />,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,.08)",
    bgh: "rgba(139,92,246,.15)",
    route: "/admin/theaters",
  },
  {
    label: "Add Show",
    icon: <MdPlayCircle size={20} />,
    color: "#3B82F6",
    bg: "rgba(59,130,246,.08)",
    bgh: "rgba(59,130,246,.15)",
    route: "/admin/shows",
  },
  
  {
    label: "Add Screen",
    icon: <MdScreenShare size={20} />,
    color: "#F59E0B",
    bg: "rgba(245,158,11,.08)",
    bgh: "rgba(245,158,11,.15)",
    modal: "screen",
  },
  {
    label: "Bookings",
    icon: <FaTicketAlt size={18} />,
    color: "#10B981",
    bg: "rgba(16,185,129,.08)",
    bgh: "rgba(16,185,129,.15)",
    route: "/admin/bookings",
  },
  {
    label: "Users",
    icon: <MdPeople size={20} />,
    color: "#E84393",
    bg: "rgba(232,67,147,.08)",
    bgh: "rgba(232,67,147,.15)",
    route: "/admin/users",
  },
  {
    label: "Refresh",
    icon: <MdRefresh size={20} />,
    color: "#6B7280",
    bg: "rgba(107,114,128,.08)",
    bgh: "rgba(107,114,128,.15)",
    action: "refresh",
  },
];

// ─── Live clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="op-time">{fmtTime(now)}</span>;
}

// ─── Stat skeleton ────────────────────────────────────────────────────────────
function StatSk() {
  return (
    <div
      style={{
        background: "#111116",
        border: "1px solid #18181f",
        borderRadius: 16,
        padding: "24px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          className="sk"
          style={{ width: 44, height: 44, borderRadius: 12 }}
        />
        <div
          className="sk"
          style={{ width: 48, height: 20, borderRadius: 100 }}
        />
      </div>
      <div
        className="sk"
        style={{ height: 30, width: "55%", marginBottom: 8 }}
      />
      <div className="sk" style={{ height: 12, width: "38%" }} />
    </div>
  );
}

// ─── City modal ───────────────────────────────────────────────────────────────
function CityModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !state.trim()) {
      setErr("Both fields are required.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await axiosInstance.post(API.CITIES, {
        name: name.trim(),
        state: state.trim(),
      });
      onSuccess(`City "${name.trim()}" added successfully!`);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to add city. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-modal-title"
      >
        <div className="modal-hdr">
          <span className="modal-title" id="city-modal-title">
            <MdLocationCity size={20} color="#06B6D4" /> Add New City
          </span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <MdClose size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label className="field-label" htmlFor="city-name">
              City Name
            </label>
            <input
              id="city-name"
              className="field-input"
              placeholder="e.g. Jaipur"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="city-state">
              State
            </label>
            <input
              id="city-state"
              className="field-input"
              placeholder="e.g. Rajasthan"
              value={state}
              onChange={(e) => setState(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {err && (
            <div
              style={{
                fontSize: 13,
                color: "#EF4444",
                background: "rgba(239,68,68,.07)",
                border: "1px solid rgba(239,68,68,.2)",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              {err}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Adding…"
            ) : (
              <>
                <MdCheck size={16} /> Add City
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen modal ─────────────────────────────────────────────────────────────
function ScreenModal({ theaters, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !totalSeats || !theaterId) {
      setErr("All fields are required.");
      return;
    }
    const seats = parseInt(totalSeats, 10);
    if (isNaN(seats) || seats < 1) {
      setErr("Total seats must be a positive number.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await axiosInstance.post(API.SCREENS, {
        name: name.trim(),
        totalSeats: seats,
        theaterId: parseInt(theaterId, 10),
      });
      onSuccess(`Screen "${name.trim()}" added successfully!`);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to add screen. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="screen-modal-title"
      >
        <div className="modal-hdr">
          <span className="modal-title" id="screen-modal-title">
            <MdScreenShare size={20} color="#F59E0B" /> Add New Screen
          </span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <MdClose size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label className="field-label" htmlFor="sc-theater">
              Theater
            </label>
            <select
              id="sc-theater"
              className="field-select"
              value={theaterId}
              onChange={(e) => setTheaterId(e.target.value)}
            >
              <option value="">— Select theater —</option>
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {t.city?.name ? ` · ${t.city.name}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sc-name">
              Screen Name
            </label>
            <input
              id="sc-name"
              className="field-input"
              placeholder="e.g. IMAX Screen 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sc-seats">
              Total Seats
            </label>
            <input
              id="sc-seats"
              className="field-input"
              type="number"
              min="1"
              placeholder="e.g. 150"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {err && (
            <div
              style={{
                fontSize: 13,
                color: "#EF4444",
                background: "rgba(239,68,68,.07)",
                border: "1px solid rgba(239,68,68,.2)",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              {err}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Adding…"
            ) : (
              <>
                <MdCheck size={16} /> Add Screen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const { movies, isLoading: ml } = useSelector((s) => s.movies);
  const { bookings, isLoading: bl } = useSelector((s) => s.bookings);
  const { theaters, isLoading: tl } = useSelector((s) => s.theaters);

  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [modal, setModal] = useState(null); // "city" | "screen" | null
  const [toast, setToast] = useState(null); // { msg, type }

  const isLoading = ml || bl;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchTheaters());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  useEffect(() => {
    if (ml || bl) return;
    const revenue = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
    const recent = [...bookings]
      .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
      .slice(0, 6);
    const counts = {};
    bookings.forEach((b) => {
      const m = b.show?.movie;
      if (!m) return;
      if (!counts[m.title])
        counts[m.title] = { title: m.title, poster: m.posterUrl, count: 0 };
      counts[m.title].count++;
    });
    const popular = Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    setStats({
      totalMovies: movies.length,
      totalTheaters: theaters.length || 8,
      totalShows: 45,
      totalBookings: bookings.length,
      totalUsers: 10,
      totalRevenue: revenue,
    });
    setRecentBookings(recent);
    setPopularMovies(popular);
  }, [movies, bookings, theaters, ml, bl, tl]);

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  const handleQA = (qa) => {
    if (qa.action === "refresh") {
      dispatch(fetchMovies());
      dispatch(fetchTheaters());
      dispatch(fetchBookingsByUser(user?.id || 1));
    } else if (qa.modal) setModal(qa.modal);
    else navigate(qa.route);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ad-root">
        {/* ── OPERATOR STRIP ──────────────────────────────────────── */}
        <div className="op-strip">
          <div className="op-left">
            <div className="op-live">
              <div className="live-dot" />
              LIVE
            </div>
            <LiveClock />
            <span className="op-date">{fmtDateFull(new Date())}</span>
          </div>
          <div className="op-badge">
            <MdAdminPanelSettings size={14} />
            {user?.name || "Admin"} · OPERATOR
          </div>
        </div>

        <div className="ad-body">
          {/* ── HEADER ──────────────────────────────────────────────── */}
          <div className="ad-hdr a1">
            <div className="ad-eyebrow">Control Room</div>
            <h1 className="ad-title">
              Cinema <span>Overview</span>
            </h1>
            <p className="ad-sub">
              {isLoading
                ? "Fetching your cinema data…"
                : `${movies.length} movies · ${bookings.length} total bookings · ${confirmed} confirmed · ${cancelled} cancelled`}
            </p>
            <div className="ad-divider" />
          </div>

          {/* ── STAT CARDS ────────────────────────────────────────────── */}
          <div className="ad-stats a2">
            {isLoading || !stats
              ? Array.from({ length: 6 }, (_, i) => <StatSk key={i} />)
              : STATS.map((s) => {
                  const raw = stats[s.key] ?? 0;
                  const val = s.fmt ? s.fmt(raw) : raw;
                  return (
                    <div
                      key={s.key}
                      className="ad-stat"
                      style={{
                        "--sc": s.color,
                        "--sc-dim": s.color + "44",
                        "--sc-bg": s.bg,
                      }}
                      onClick={() => navigate(s.route)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && navigate(s.route)}
                      aria-label={`${s.label}: ${val}`}
                    >
                      <div className="ad-stat-top">
                        <div className="ad-stat-icon">{s.icon}</div>
                        <span className="ad-stat-trend">
                          <MdTrendingUp size={11} />
                          Live
                        </span>
                      </div>
                      <div className="ad-stat-val">{val}</div>
                      <div className="ad-stat-lbl">{s.label}</div>
                    </div>
                  );
                })}
          </div>

          {/* ── CONTENT GRID ────────────────────────────────────────── */}
          <div className="ad-content a3">
            {/* Left: Recent Bookings */}
            <div className="ad-panel">
              <div className="ad-panel-hdr">
                <span className="ad-panel-title">
                  <MdConfirmationNumber size={18} color="#F5A623" />
                  Recent Bookings
                </span>
                <button
                  className="ad-panel-link"
                  onClick={() => navigate("/admin/bookings")}
                >
                  View all <MdArrowForward size={13} />
                </button>
              </div>

              <div className="ad-brows">
                {isLoading ? (
                  Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="ad-brow">
                      <div
                        className="sk"
                        style={{
                          width: 38,
                          height: 54,
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <div
                          className="sk"
                          style={{ height: 14, width: "60%" }}
                        />
                        <div
                          className="sk"
                          style={{ height: 11, width: "45%" }}
                        />
                      </div>
                    </div>
                  ))
                ) : recentBookings.length === 0 ? (
                  <div className="ad-empty">
                    <div className="ad-empty-icon">🎟️</div>
                    <div className="ad-empty-text">No bookings yet</div>
                  </div>
                ) : (
                  recentBookings.map((b) => {
                    const movie = b.show?.movie || {};
                    const theater = b.show?.screen?.theater || {};
                    const sc = (b.status || "CONFIRMED").toLowerCase();
                    return (
                      <div key={b.id} className="ad-brow">
                        {movie.posterUrl ? (
                          <img
                            className="ad-brow-poster"
                            src={movie.posterUrl}
                            alt={movie.title}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="ad-brow-poster-fb">
                            <FaFilm size={14} />
                          </div>
                        )}
                        <div className="ad-brow-info">
                          <div className="ad-brow-movie">
                            {movie.title || "—"}
                          </div>
                          <div className="ad-brow-meta">
                            {theater.name || "—"} · {b.seats?.length || 0} seat
                            {b.seats?.length !== 1 ? "s" : ""} ·{" "}
                            {fmtDateShort(b.bookedAt)}
                          </div>
                        </div>
                        <div className="ad-brow-right">
                          <span className={`ad-brow-badge ${sc}`}>
                            {b.status || "CONFIRMED"}
                          </span>
                          <span className="ad-brow-price">
                            {fmtPrice(b.totalPrice)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {!isLoading && stats && (
                <div className="ad-rev-strip">
                  <span className="ad-rev-lbl">Total Revenue</span>
                  <span className="ad-rev-val">
                    {fmtPrice(stats.totalRevenue)}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Popular Movies */}
            <div className="ad-panel">
              <div className="ad-panel-hdr">
                <span className="ad-panel-title">
                  <FaFire size={15} color="#F5A623" />
                  Popular Movies
                </span>
                <button
                  className="ad-panel-link"
                  onClick={() => navigate("/admin/movies")}
                >
                  Manage <MdArrowForward size={13} />
                </button>
              </div>

              <div className="ad-mrows">
                {isLoading ? (
                  Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="ad-mrow">
                      <div
                        className="sk"
                        style={{ width: 24, height: 22, borderRadius: 4 }}
                      />
                      <div className="sk" style={{ flex: 1, height: 14 }} />
                      <div
                        className="sk"
                        style={{ width: 78, height: 24, borderRadius: 100 }}
                      />
                    </div>
                  ))
                ) : popularMovies.length === 0 ? (
                  <div className="ad-empty">
                    <div className="ad-empty-icon">🎬</div>
                    <div className="ad-empty-text">No booking data yet</div>
                  </div>
                ) : (
                  popularMovies.map((m, i) => (
                    <div key={m.title} className="ad-mrow">
                      <span className="ad-mrow-rank">
                        {i === 0
                          ? "🥇"
                          : i === 1
                            ? "🥈"
                            : i === 2
                              ? "🥉"
                              : `#${i + 1}`}
                      </span>
                      <span className="ad-mrow-title">{m.title}</span>
                      <span className="ad-mrow-count">
                        <FaStar size={10} />
                        {m.count} booked
                      </span>
                    </div>
                  ))
                )}
              </div>

              {!isLoading && (
                <div className="ad-conf-strip">
                  <span className="ad-conf-lbl">Confirmed</span>
                  <span className="ad-conf-val">
                    {confirmed} / {bookings.length}
                  </span>
                </div>
              )}
            </div>

            {/* Full-width: Quick Actions */}
            <div className="ad-panel ad-qa-panel a4">
              <div className="ad-panel-hdr">
                <span className="ad-panel-title">
                  <MdAdd size={18} color="#F5A623" />
                  Quick Actions
                </span>
              </div>
              <div className="ad-qa-grid">
                {QA.map((qa) => (
                  <button
                    key={qa.label}
                    className="ad-qa-btn"
                    style={{
                      "--qc": qa.color,
                      "--qbg": qa.bg,
                      "--qbgh": qa.bgh,
                    }}
                    onClick={() => handleQA(qa)}
                    aria-label={qa.label}
                  >
                    <div className="ad-qa-icon">{qa.icon}</div>
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MODALS ────────────────────────────────────────────────── */}
        {modal === "city" && (
          <CityModal
            onClose={() => setModal(null)}
            onSuccess={(msg) => showToast(msg, "success")}
          />
        )}
        {modal === "screen" && (
          <ScreenModal
            theaters={theaters}
            onClose={() => setModal(null)}
            onSuccess={(msg) => showToast(msg, "success")}
          />
        )}

        {/* ── TOAST ─────────────────────────────────────────────────── */}
        {toast && (
          <div
            className={`toast ${toast.type}`}
            role="status"
            aria-live="polite"
          >
            {toast.type === "success" ? (
              <MdCheck size={16} />
            ) : (
              <MdClose size={16} />
            )}
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}

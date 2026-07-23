import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdConfirmationNumber, MdLocationOn, MdAccessTime,
  MdCalendarMonth, MdEventSeat, MdArrowForward,
  MdCancel, MdCheckCircle, MdMovie, MdWarning,
  MdRefresh, MdScreenShare,
} from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { fetchBookingsByUser, cancelBooking } from "../store/slices/bookingSlice";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt12 = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
};

const fmtDateShort = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const fmtDateLong = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
};

const fmtPrice  = (n)    => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDur    = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;
const genRef    = (id, bookedAt) => {
  const d = bookedAt ? new Date(bookedAt) : new Date();
  return `BMS-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${String(id).padStart(4,"0")}`;
};

const isUpcoming = (showDate) => {
  if (!showDate) return false;
  return new Date(showDate + "T23:59:59") >= new Date();
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.mb-root{
  min-height:100vh;
  background:#09090E;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  padding-bottom:80px;
}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(16px);}
  to  {opacity:1;transform:translateY(0);}
}
@keyframes shimmer{
  0%  {background-position:-600px 0;}
  100%{background-position: 600px 0;}
}
@keyframes slideDown{
  from{opacity:0;transform:translateY(-8px);}
  to  {opacity:1;transform:translateY(0);}
}

.mb-anim{animation:fadeUp .45s ease both;}
@media(prefers-reduced-motion:reduce){
  .mb-anim,.mb-card{animation:none!important;transition:none!important;}
}

.mb-header{
  max-width:860px;margin:0 auto;
  padding:clamp(24px,4vw,52px) clamp(12px,4vw,32px) 0;
}
.mb-eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.2em;color:#F5A623;
  text-transform:uppercase;margin-bottom:6px;
}
@media(min-width:640px){.mb-eyebrow{font-size:10px;margin-bottom:8px;}}
.mb-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(24px,4.5vw,44px);
  font-weight:800;letter-spacing:-.025em;
  color:#F0EDE8;line-height:1.06;
  margin-bottom:4px;
}
.mb-title span{color:#F5A623;}
.mb-divider{
  height:1px;
  background:linear-gradient(90deg,#F5A623,#1a1a24 35%);
  margin-top:16px;
}

.mb-stats{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px;
  margin-top:18px;
  border:1px solid #18181f;
  border-radius:12px;
  overflow:hidden;
  background:#111116;
}
@media(min-width:480px){.mb-stats{grid-template-columns:repeat(4,1fr);gap:0;border:1px solid #18181f;}}
.mb-stat{
  padding:12px 14px;
  border-bottom:1px solid #18181f;
  display:flex;flex-direction:column;gap:2px;
}
@media(min-width:480px){.mb-stat{padding:14px 16px;border-bottom:none;border-right:1px solid #18181f;}}
.mb-stat:last-child{border-bottom:none;border-right:none;}
.mb-stat-val{
  font-family:'JetBrains Mono',monospace;
  font-size:clamp(16px,3vw,26px);
  font-weight:700;
  color:#F0EDE8;line-height:1;
}
.mb-stat-val.green{color:#10B981;}
.mb-stat-val.amber{color:#F5A623;}
.mb-stat-label{
  font-size:10px;color:#444;font-weight:500;
}
@media(min-width:640px){.mb-stat-label{font-size:11px;}}

.mb-filters{
  display:flex;gap:6px;
  padding:0 clamp(12px,4vw,32px);
  margin:20px auto 0;
  max-width:860px;
  flex-wrap:wrap;
}
@media(min-width:640px){.mb-filters{gap:8px;margin:28px auto 0;}}
.mb-tab{
  display:flex;align-items:center;gap:4px;
  background:#111116;
  border:1px solid #1a1a24;
  border-radius:100px;
  color:#666;
  font-family:'Inter',sans-serif;
  font-size:11px;font-weight:600;
  padding:5px 12px;cursor:pointer;
  transition:background .15s,border-color .15s,color .15s;
  white-space:nowrap;
}
@media(min-width:640px){.mb-tab{font-size:13px;padding:7px 18px;gap:6px;}}
.mb-tab:hover{background:#1a1a24;color:#ccc;}
.mb-tab.active{
  background:rgba(245,166,35,.1);
  border-color:rgba(245,166,35,.4);
  color:#F5A623;
}
.mb-tab-count{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;
  background:rgba(255,255,255,.06);
  border-radius:100px;
  padding:0 6px;
  min-width:18px;text-align:center;
}
@media(min-width:640px){.mb-tab-count{font-size:11px;padding:1px 7px;min-width:22px;}}
.mb-tab.active .mb-tab-count{
  background:rgba(245,166,35,.15);color:#F5A623;
}

.mb-list{
  display:flex;flex-direction:column;gap:10px;
  max-width:860px;margin:16px auto 0;
  padding:0 clamp(12px,4vw,32px);
}
@media(min-width:640px){.mb-list{gap:12px;margin:20px auto 0;}}

.mb-card{
  background:#111116;
  border:1px solid #18181f;
  border-radius:12px;
  overflow:hidden;
  transition:border-color .2s,box-shadow .2s;
  animation:fadeUp .4s ease both;
}
@media(min-width:640px){.mb-card{border-radius:14px;}}
.mb-card:hover{
  border-color:#252530;
  box-shadow:0 8px 32px rgba(0,0,0,.4);
}

.mb-card-inner{display:flex;min-height:0;}
.mb-spine{width:4px;flex-shrink:0;border-radius:0;}
.mb-spine.confirmed{background:#10B981;}
.mb-spine.cancelled{background:#EF4444;}

.mb-card-body{flex:1;min-width:0;display:flex;flex-direction:column;}

.mb-card-top{
  display:flex;
  flex-direction:column;
  gap:10px;
  padding:12px 14px;
}
@media(min-width:480px){.mb-card-top{flex-direction:row;padding:14px 16px;gap:0;align-items:stretch;}}

.mb-poster-wrap{flex-shrink:0;}
@media(min-width:480px){.mb-poster-wrap{margin-right:14px;}}
.mb-poster{
  width:48px;height:70px;
  border-radius:6px;
  object-fit:cover;
  display:block;
  border:1px solid #1e1e28;
}
@media(min-width:640px){.mb-poster{width:60px;height:86px;border-radius:8px;}}
.mb-poster-fallback{
  width:48px;height:70px;
  border-radius:6px;
  background:#1a1a24;
  border:1px solid #1e1e28;
  display:flex;align-items:center;justify-content:center;
  color:#333;
}
@media(min-width:640px){.mb-poster-fallback{width:60px;height:86px;border-radius:8px;}}

.mb-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;}
.mb-movie-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(14px,2vw,18px);
  font-weight:800;
  color:#F0EDE8;
  letter-spacing:-.015em;
  line-height:1.1;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.mb-movie-meta{
  display:flex;flex-wrap:wrap;gap:4px;
  font-size:11px;color:#555;
  align-items:center;
}
@media(min-width:640px){.mb-movie-meta{gap:6px;font-size:12px;}}
.mb-genre-pill{
  background:rgba(245,166,35,.08);
  border:1px solid rgba(245,166,35,.15);
  border-radius:4px;
  padding:1px 6px;
  font-size:9px;font-weight:700;
  letter-spacing:.07em;color:#F5A623;
  text-transform:uppercase;
}
@media(min-width:640px){.mb-genre-pill{padding:1px 7px;font-size:10px;}}
.mb-details-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:4px 10px;
  margin-top:4px;
}
@media(max-width:380px){.mb-details-grid{grid-template-columns:1fr;}}
.mb-detail{display:flex;flex-direction:column;gap:1px;}
.mb-detail-label{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;
  letter-spacing:.15em;color:#333;
  text-transform:uppercase;
  display:flex;align-items:center;gap:3px;
}
@media(min-width:640px){.mb-detail-label{font-size:9px;gap:4px;}}
.mb-detail-value{
  font-size:11px;font-weight:600;color:#ccc;
  line-height:1.3;
}
@media(min-width:640px){.mb-detail-value{font-size:12px;}}
.mb-detail-value.mono{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;
}
@media(min-width:640px){.mb-detail-value.mono{font-size:11px;}}

.mb-card-right{
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  flex-shrink:0;
  margin-top:8px;
}
@media(min-width:480px){.mb-card-right{flex-direction:column;align-items:flex-end;justify-content:space-between;gap:10px;padding-left:12px;margin-top:0;}}
.mb-status-badge{
  display:inline-flex;align-items:center;gap:4px;
  border-radius:100px;
  padding:3px 8px;
  font-size:9px;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;
  white-space:nowrap;
}
@media(min-width:640px){.mb-status-badge{gap:5px;padding:4px 10px;font-size:10px;}}
.mb-status-badge.confirmed{
  background:rgba(16,185,129,.1);
  border:1px solid rgba(16,185,129,.25);
  color:#10B981;
}
.mb-status-badge.cancelled{
  background:rgba(239,68,68,.08);
  border:1px solid rgba(239,68,68,.2);
  color:#EF4444;
}
.mb-price{
  font-family:'JetBrains Mono',monospace;
  font-size:clamp(14px,2vw,20px);
  font-weight:700;color:#F5A623;
  text-align:right;
}
.mb-price-sub{
  font-size:9px;color:#444;
  text-align:right;
}
@media(min-width:640px){.mb-price-sub{font-size:10px;}}

.mb-seats-row{
  border-top:1px solid #16161e;
  padding:8px 14px;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:6px;
}
@media(min-width:480px){.mb-seats-row{flex-direction:row;align-items:center;justify-content:space-between;gap:10px;padding:8px 16px;}}
@media(min-width:640px){.mb-seats-row{padding:10px 18px;}}
.mb-seats-label{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;
  letter-spacing:.14em;color:#333;
  text-transform:uppercase;
  white-space:nowrap;
  display:flex;align-items:center;gap:4px;
}
@media(min-width:640px){.mb-seats-label{font-size:9px;gap:5px;}}
.mb-seat-chips{display:flex;flex-wrap:wrap;gap:4px;}
.mb-seat-chip{
  display:inline-flex;align-items:center;gap:2px;
  background:rgba(245,166,35,.07);
  border:1px solid rgba(245,166,35,.18);
  border-radius:4px;
  padding:2px 6px;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;color:#F5A623;
}
@media(min-width:640px){.mb-seat-chip{gap:3px;padding:3px 8px;font-size:10px;border-radius:5px;}}
.mb-seat-chip.vip{
  background:rgba(139,92,246,.07);
  border-color:rgba(139,92,246,.22);
  color:#8B5CF6;
}

.mb-ref{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:600;
  color:#2a2a38;letter-spacing:.06em;
}
@media(min-width:640px){.mb-ref{font-size:10px;}}

.mb-actions-row{
  border-top:1px solid #16161e;
  padding:8px 14px;
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:8px;
}
@media(min-width:480px){.mb-actions-row{flex-direction:row;align-items:center;justify-content:space-between;gap:10px;padding:8px 16px;}}
@media(min-width:640px){.mb-actions-row{padding:10px 18px;}}
.mb-action-left{
  display:flex;
  flex-direction:column;
  gap:6px;
  align-items:stretch;
}
@media(min-width:480px){.mb-action-left{flex-direction:row;gap:8px;align-items:center;flex-wrap:wrap;}}
.mb-btn-view{
  display:flex;align-items:center;justify-content:center;gap:4px;
  background:transparent;border:1px solid #1e1e28;
  border-radius:6px;color:#888;
  font-family:'Inter',sans-serif;
  font-size:11px;font-weight:600;
  padding:6px 12px;cursor:pointer;
  transition:border-color .15s,color .15s;
  white-space:nowrap;
}
@media(min-width:640px){.mb-btn-view{font-size:12px;padding:7px 14px;border-radius:8px;gap:5px;}}
.mb-btn-view:hover{border-color:rgba(245,166,35,.35);color:#F5A623;}
.mb-btn-cancel{
  display:flex;align-items:center;justify-content:center;gap:4px;
  background:transparent;border:1px solid #1e1e28;
  border-radius:6px;color:#666;
  font-family:'Inter',sans-serif;
  font-size:11px;font-weight:600;
  padding:6px 12px;cursor:pointer;
  transition:border-color .15s,color .15s,background .15s;
  white-space:nowrap;
}
@media(min-width:640px){.mb-btn-cancel{font-size:12px;padding:7px 14px;border-radius:8px;gap:5px;}}
.mb-btn-cancel:hover{
  border-color:rgba(239,68,68,.4);
  color:#EF4444;
  background:rgba(239,68,68,.05);
}
.mb-btn-cancel:disabled{opacity:.35;cursor:not-allowed;}

.mb-cancel-confirm{
  background:rgba(239,68,68,.06);
  border-top:1px solid rgba(239,68,68,.15);
  padding:10px 14px;
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:8px;
  animation:slideDown .2s ease both;
}
@media(min-width:480px){.mb-cancel-confirm{flex-direction:row;align-items:center;justify-content:space-between;gap:10px;padding:12px 18px;}}
.mb-cancel-warning{
  display:flex;align-items:center;gap:6px;
  font-size:12px;color:#EF4444;font-weight:500;
}
@media(min-width:640px){.mb-cancel-warning{font-size:13px;gap:7px;}}
.mb-cancel-confirm-btns{display:flex;gap:6px;}
.mb-btn-yes{
  background:#EF4444;border:none;border-radius:6px;
  color:#fff;font-family:'Inter',sans-serif;
  font-size:11px;font-weight:700;
  padding:6px 14px;cursor:pointer;
  transition:background .15s;
}
@media(min-width:640px){.mb-btn-yes{font-size:12px;padding:7px 16px;border-radius:8px;}}
.mb-btn-yes:hover{background:#DC2626;}
.mb-btn-yes:disabled{opacity:.5;cursor:not-allowed;}
.mb-btn-no{
  background:transparent;border:1px solid #2a2a38;
  border-radius:6px;color:#888;
  font-family:'Inter',sans-serif;
  font-size:11px;font-weight:600;
  padding:6px 12px;cursor:pointer;
  transition:border-color .15s,color .15s;
}
@media(min-width:640px){.mb-btn-no{font-size:12px;padding:7px 14px;border-radius:8px;}}
.mb-btn-no:hover{border-color:#444;color:#ccc;}

.sk{
  background:linear-gradient(90deg,#141418 25%,#1e1e26 50%,#141418 75%);
  background-size:600px 100%;
  animation:shimmer 1.4s infinite linear;
  border-radius:6px;
}
.mb-skeleton-card{
  background:#111116;border:1px solid #18181f;
  border-radius:14px;overflow:hidden;
  display:flex;
}
.mb-skeleton-spine{width:4px;background:#1a1a24;flex-shrink:0;}
.mb-skeleton-body{flex:1;padding:16px 18px;display:flex;flex-direction:column;gap:12px;}

.mb-state{
  display:flex;flex-direction:column;
  align-items:center;text-align:center;
  gap:12px;padding:48px 16px;
}
@media(min-width:640px){.mb-state{gap:14px;padding:72px 24px;}}
.mb-state-icon{font-size:36px;line-height:1;}
@media(min-width:640px){.mb-state-icon{font-size:44px;}}
.mb-state-title{
  font-family:'Syne',sans-serif;
  font-size:18px;font-weight:700;color:#F0EDE8;
}
@media(min-width:640px){.mb-state-title{font-size:20px;}}
.mb-state-sub{font-size:13px;color:#555;max-width:300px;line-height:1.6;}
@media(min-width:640px){.mb-state-sub{font-size:14px;}}
.mb-state-btn{
  display:flex;align-items:center;gap:6px;
  background:#F5A623;border:none;border-radius:8px;
  color:#09090E;font-family:'Inter',sans-serif;
  font-weight:700;font-size:13px;
  padding:10px 20px;cursor:pointer;
  transition:background .15s;margin-top:2px;
}
@media(min-width:640px){.mb-state-btn{font-size:14px;padding:11px 24px;border-radius:10px;gap:7px;}}
.mb-state-btn:hover{background:#E09920;}
.mb-state-btn-ghost{
  display:flex;align-items:center;gap:6px;
  background:transparent;border:1px solid #1e1e28;
  border-radius:8px;color:#888;
  font-family:'Inter',sans-serif;
  font-size:13px;font-weight:600;
  padding:10px 20px;cursor:pointer;
  transition:border-color .15s,color .15s;
}
@media(min-width:640px){.mb-state-btn-ghost{font-size:14px;padding:11px 24px;border-radius:10px;gap:7px;}}
.mb-state-btn-ghost:hover{border-color:rgba(245,166,35,.4);color:#F5A623;}

.mb-section-sep{
  display:flex;align-items:center;gap:10px;
  padding:0 clamp(12px,4vw,32px);
  margin:18px auto 0;
  max-width:860px;
}
@media(min-width:640px){.mb-section-sep{gap:12px;margin:24px auto 0;}}
.mb-section-sep-label{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.18em;color:#333;
  text-transform:uppercase;white-space:nowrap;
}
@media(min-width:640px){.mb-section-sep-label{font-size:10px;}}
.mb-section-sep-line{flex:1;height:1px;background:#16161e;}
`;

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="mb-skeleton-card">
      <div className="mb-skeleton-spine" />
      <div className="mb-skeleton-body">
        <div style={{ display: "flex", gap: 14 }}>
          <div className="sk" style={{ width: 60, height: 86, borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="sk" style={{ height: 16, width: "60%" }} />
            <div className="sk" style={{ height: 11, width: "40%" }} />
            <div className="sk" style={{ height: 11, width: "55%" }} />
            <div className="sk" style={{ height: 11, width: "35%" }} />
          </div>
        </div>
        <div style={{ borderTop: "1px solid #16161e", paddingTop: 10, display: "flex", gap: 6 }}>
          {[1,2,3].map(i => <div key={i} className="sk" style={{ height: 22, width: 40, borderRadius: 5 }} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Booking card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onCancel, cancellingId }) {
  const navigate           = useNavigate();
  const [confirming, setConfirming] = useState(false);

  const { id, show = {}, seats = [], totalPrice, status, bookedAt } = booking;
  const { movie = {}, screen = {}, showDate, startTime, endTime, ticketPrice } = show;
  const theater   = screen?.theater || {};
  const isConf    = status === "CONFIRMED";
  const isComing  = isUpcoming(showDate);
  const canCancel = isConf && isComing;
  const bookingRef = genRef(id, bookedAt);
  const isCancelling = cancellingId === id;

  return (
    <div className="mb-card mb-anim">
      <div className="mb-card-inner">
        <div className={`mb-spine ${isConf ? "confirmed" : "cancelled"}`} />

        <div className="mb-card-body">
          {/* ── Top row ── */}
          <div className="mb-card-top">
            {/* Poster */}
            <div className="mb-poster-wrap">
              {movie.posterUrl ? (
                <img
                  className="mb-poster"
                  src={movie.posterUrl}
                  alt={movie.title}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="mb-poster-fallback">
                  <MdMovie size={24} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mb-info">
              <div className="mb-movie-title">{movie.title || "—"}</div>
              <div className="mb-movie-meta">
                {movie.genre && <span className="mb-genre-pill">{movie.genre}</span>}
                {movie.language && <span>{movie.language}</span>}
                {movie.durationMinutes && <span>· {fmtDur(movie.durationMinutes)}</span>}
              </div>

              <div className="mb-details-grid">
                <div className="mb-detail">
                  <span className="mb-detail-label"><MdLocationOn size={9} /> Theater</span>
                  <span className="mb-detail-value">{theater.name || "—"}</span>
                </div>
                <div className="mb-detail">
                  <span className="mb-detail-label"><MdScreenShare size={9} /> Screen</span>
                  <span className="mb-detail-value">{screen.name || "—"}</span>
                </div>
                <div className="mb-detail">
                  <span className="mb-detail-label"><MdCalendarMonth size={9} /> Date</span>
                  <span className="mb-detail-value">{fmtDateLong(showDate)}</span>
                </div>
                <div className="mb-detail">
                  <span className="mb-detail-label"><MdAccessTime size={9} /> Time</span>
                  <span className="mb-detail-value mono">
                    {fmt12(startTime)}{endTime ? ` – ${fmt12(endTime)}` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: status + price */}
            <div className="mb-card-right">
              <div className={`mb-status-badge ${isConf ? "confirmed" : "cancelled"}`}>
                {isConf
                  ? <><FaCheckCircle size={10} /> Confirmed</>
                  : <><FaTimesCircle size={10} /> Cancelled</>
                }
              </div>
              <div>
                <div className="mb-price">{fmtPrice(totalPrice)}</div>
                {ticketPrice && seats.length > 0 && (
                  <div className="mb-price-sub">
                    {seats.length} × {fmtPrice(ticketPrice)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Seats row ── */}
          <div className="mb-seats-row">
            <span className="mb-seats-label">
              <MdEventSeat size={10} />
              {seats.length} seat{seats.length !== 1 ? "s" : ""}
            </span>
            <div className="mb-seat-chips">
              {seats.map((s) => (
                <span
                  key={s.id}
                  className={`mb-seat-chip ${s.seatType === "VIP" ? "vip" : ""}`}
                  title={s.seatType}
                >
                  {s.seatNumber}
                </span>
              ))}
            </div>
            <span className="mb-ref">#{bookingRef}</span>
          </div>

          {/* ── Actions row ── */}
          <div className="mb-actions-row">
            <div className="mb-action-left">
              <button
                className="mb-btn-view"
                onClick={() => navigate(`/booking/confirmation/${id}`)}
              >
                <MdConfirmationNumber size={13} /> View Ticket
              </button>
              {canCancel && !confirming && (
                <button
                  className="mb-btn-cancel"
                  onClick={() => setConfirming(true)}
                  disabled={isCancelling}
                >
                  <MdCancel size={13} />
                  {isCancelling ? "Cancelling…" : "Cancel Booking"}
                </button>
              )}
            </div>
            <span style={{ fontSize: 10, color: "#2a2a38", fontFamily: "'JetBrains Mono',monospace" }}>
              Booked {fmtDateShort(bookedAt?.split("T")[0])}
            </span>
          </div>

          {/* ── Inline cancel confirmation ── */}
          {confirming && (
            <div className="mb-cancel-confirm">
              <div className="mb-cancel-warning">
                <MdWarning size={16} />
                Cancel this booking? This cannot be undone.
              </div>
              <div className="mb-cancel-confirm-btns">
                <button
                  className="mb-btn-yes"
                  disabled={isCancelling}
                  onClick={() => {
                    onCancel(id);
                    setConfirming(false);
                  }}
                >
                  {isCancelling ? "Cancelling…" : "Yes, cancel"}
                </button>
                <button className="mb-btn-no" onClick={() => setConfirming(false)}>
                  Keep it
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section separator ────────────────────────────────────────────────────────
function SectionSep({ label }) {
  return (
    <div className="mb-section-sep">
      <span className="mb-section-sep-label">{label}</span>
      <div className="mb-section-sep-line" />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MyBookings() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const { user }    = useSelector((s) => s.auth);
  const { bookings, isLoading, error } = useSelector((s) => s.bookings);

  const [filter,       setFilter]       = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (user?.id) dispatch(fetchBookingsByUser(user.id));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [user?.id, dispatch]);

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    await dispatch(cancelBooking(bookingId));
    setCancellingId(null);
    if (user?.id) dispatch(fetchBookingsByUser(user.id));
  };

  const confirmed  = bookings.filter((b) => b.status === "CONFIRMED");
  const upcoming   = confirmed.filter((b)  => isUpcoming(b.show?.showDate));
  const cancelled  = bookings.filter((b) => b.status === "CANCELLED");
  const totalSpent = confirmed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const filtered =
    filter === "upcoming"  ? upcoming  :
    filter === "cancelled" ? cancelled :
    bookings;

  const filteredUpcoming = filtered.filter((b) => b.status === "CONFIRMED" && isUpcoming(b.show?.showDate));
  const filteredPast     = filtered.filter((b) => b.status !== "CONFIRMED" || !isUpcoming(b.show?.showDate));

  // ── Auth gate ──
  if (!user) {
    return (
      <>
        <style>{CSS}</style>
        <div className="mb-root">
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
            <div className="mb-state">
              <div className="mb-state-icon">🔒</div>
              <div className="mb-state-title">Sign in to see your bookings</div>
              <p className="mb-state-sub">Your booking history is tied to your account.</p>
              <button className="mb-state-btn" onClick={() => navigate("/login")}>Sign in</button>
              <button className="mb-state-btn-ghost" onClick={() => navigate("/movies")}>
                Browse Movies
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="mb-root">

        <div className="mb-header">
          <div className="mb-eyebrow">My Account</div>
          <h1 className="mb-title">
            Your <span>Bookings</span>
          </h1>

          {!isLoading && bookings.length > 0 && (
            <div className="mb-stats mb-anim">
              <div className="mb-stat">
                <div className="mb-stat-val green">{upcoming.length}</div>
                <div className="mb-stat-label">Upcoming</div>
              </div>
              <div className="mb-stat">
                <div className="mb-stat-val">{bookings.length}</div>
                <div className="mb-stat-label">Total bookings</div>
              </div>
              <div className="mb-stat">
                <div className="mb-stat-val amber">{fmtPrice(totalSpent)}</div>
                <div className="mb-stat-label">Total spent</div>
              </div>
              <div className="mb-stat">
                <div className="mb-stat-val">{cancelled.length}</div>
                <div className="mb-stat-label">Cancelled</div>
              </div>
            </div>
          )}

          <div className="mb-divider" style={{ marginTop: bookings.length > 0 && !isLoading ? 20 : 20 }} />
        </div>

        <div className="mb-filters">
          {[
            { key: "all",       label: "All Bookings", count: bookings.length },
            { key: "upcoming",  label: "Upcoming",     count: upcoming.length  },
            { key: "cancelled", label: "Cancelled",    count: cancelled.length },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`mb-tab${filter === tab.key ? " active" : ""}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <span className="mb-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mb-list">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!isLoading && error && (
          <div className="mb-list">
            <div className="mb-state">
              <div className="mb-state-icon">⚠️</div>
              <div className="mb-state-title">Couldn't load bookings</div>
              <p className="mb-state-sub">{error}</p>
              <button
                className="mb-state-btn"
                onClick={() => dispatch(fetchBookingsByUser(user.id))}
              >
                <MdRefresh size={16} /> Try again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="mb-list">
            <div className="mb-state">
              <div className="mb-state-icon">🎟️</div>
              <div className="mb-state-title">
                {filter === "upcoming"  ? "No upcoming shows"   :
                 filter === "cancelled" ? "No cancelled bookings" :
                 "No bookings yet"}
              </div>
              <p className="mb-state-sub">
                {filter === "all"
                  ? "You haven't booked any tickets yet. Browse movies to get started."
                  : filter === "upcoming"
                  ? "You have no upcoming shows. Book something new!"
                  : "None of your bookings have been cancelled."}
              </p>
              {filter !== "cancelled" && (
                <button className="mb-state-btn" onClick={() => navigate("/movies")}>
                  Browse Movies <MdArrowForward size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <>
            {filteredUpcoming.length > 0 && (
              <>
                {filter === "all" && <SectionSep label="Upcoming" />}
                <div className="mb-list">
                  {filteredUpcoming.map((b, i) => (
                    <div key={b.id} style={{ animationDelay: `${i * 60}ms` }}>
                      <BookingCard
                        booking={b}
                        onCancel={handleCancel}
                        cancellingId={cancellingId}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {filteredPast.length > 0 && (
              <>
                {filter === "all" && filteredUpcoming.length > 0 && (
                  <SectionSep label="Past & Cancelled" />
                )}
                <div className="mb-list" style={{ marginTop: filteredUpcoming.length === 0 ? 20 : 0 }}>
                  {filteredPast.map((b, i) => (
                    <div key={b.id} style={{ animationDelay: `${(filteredUpcoming.length + i) * 60}ms` }}>
                      <BookingCard
                        booking={b}
                        onCancel={handleCancel}
                        cancellingId={cancellingId}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </>
  );
}
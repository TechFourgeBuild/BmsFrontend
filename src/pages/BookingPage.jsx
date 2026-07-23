import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdArrowBack,
  MdEventSeat,
  MdConfirmationNumber,
  MdLocationOn,
  MdAccessTime,
  MdCalendarMonth,
  MdCheckCircle,
  MdCancel,
  MdArrowForward,
  MdLock,
} from "react-icons/md";
import { fetchShowsByMovie } from "../store/slices/showSlice";
import {
  fetchAvailableSeats,
  selectSeat,
  clearSelectedSeats,
} from "../store/slices/seatSlice";
import { createBooking } from "../store/slices/bookingSlice";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt12 = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
};
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const fmtPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.bp-root{
  min-height:100vh;
  background:#09090E;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  padding-bottom:100px;
}

/* back */
.bp-back{
  display:inline-flex;align-items:center;gap:7px;
  background:transparent;border:none;
  color:#888;font-family:'Inter',sans-serif;
  font-size:13px;font-weight:500;
  cursor:pointer;padding:0;
  transition:color .15s;
}
.bp-back:hover{color:#F5A623;}

/* page header */
.bp-header{
  padding:clamp(16px,3vw,40px) clamp(12px,3vw,40px) 0;
  max-width:1180px;margin:0 auto;
}
.bp-eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.2em;color:#F5A623;
  text-transform:uppercase;margin-bottom:6px;
}
@media(min-width:640px){.bp-eyebrow{font-size:10px;margin-bottom:8px;}}
.bp-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(18px,4vw,36px);
  font-weight:800;letter-spacing:-.02em;
  color:#F0EDE8;margin-bottom:2px;
}
@media(min-width:640px){.bp-title{font-size:clamp(22px,3.5vw,36px);margin-bottom:4px;}}
.bp-subtitle{font-size:12px;color:#555;margin-bottom:14px;}
@media(min-width:640px){.bp-subtitle{font-size:13px;margin-bottom:20px;}}
.bp-divider{height:1px;background:linear-gradient(90deg,#F5A623,#1e1e28 40%);}

/* stepper */
.bp-stepper{
  display:flex;align-items:center;gap:0;
  padding:14px clamp(12px,3vw,40px);
  max-width:1180px;margin:0 auto;
  overflow-x:auto;
}
@media(min-width:640px){.bp-stepper{padding:20px clamp(16px,4vw,40px);}}
.bp-step{
  display:flex;align-items:center;gap:5px;
  font-size:10px;font-weight:600;color:#444;
  white-space:nowrap;
}
@media(min-width:640px){.bp-step{gap:8px;font-size:12px;}}
.bp-step.active{color:#F5A623;}
.bp-step.done{color:#10B981;}
.bp-step-num{
  width:20px;height:20px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  background:#1a1a24;border:1px solid #2a2a38;
  flex-shrink:0;
  transition:background .2s,border-color .2s,color .2s;
}
@media(min-width:640px){.bp-step-num{width:24px;height:24px;font-size:11px;}}
.bp-step.active .bp-step-num{background:rgba(245,166,35,.15);border-color:rgba(245,166,35,.5);color:#F5A623;}
.bp-step.done  .bp-step-num{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.4);color:#10B981;}
.bp-step-line{flex:1;height:1px;background:#1a1a24;margin:0 6px;min-width:12px;}
@media(min-width:640px){.bp-step-line{margin:0 10px;min-width:20px;}}

/* main layout */
.bp-layout{
  display:grid;
  grid-template-columns:1fr;
  gap:16px;
  max-width:1180px;margin:0 auto;
  padding:0 clamp(12px,3vw,40px);
}
@media(min-width:640px){.bp-layout{gap:20px;padding:0 clamp(16px,4vw,40px);}}
@media(min-width:900px){.bp-layout{grid-template-columns:1fr 360px;gap:20px;}}

/* panel */
.bp-panel{
  background:#111116;
  border:1px solid #18181f;
  border-radius:12px;
  overflow:hidden;
}
@media(min-width:640px){.bp-panel{border-radius:14px;}}
.bp-panel-header{
  padding:14px 16px;
  border-bottom:1px solid #18181f;
  display:flex;align-items:center;gap:8px;
}
@media(min-width:640px){.bp-panel-header{padding:18px 20px;gap:10px;}}
.bp-panel-title{
  font-family:'Syne',sans-serif;
  font-size:13px;font-weight:700;
  color:#F0EDE8;
}
@media(min-width:640px){.bp-panel-title{font-size:14px;}}
.bp-panel-body{padding:14px 16px;}
@media(min-width:640px){.bp-panel-body{padding:20px;}}

/* section label inside panel */
.bp-slabel{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.16em;color:#444;
  text-transform:uppercase;
  margin-bottom:10px;
}
@media(min-width:640px){.bp-slabel{font-size:10px;margin-bottom:12px;}}

/* ── STEP 1: show cards ── */
.show-list{display:flex;flex-direction:column;gap:8px;}
@media(min-width:640px){.show-list{gap:10px;}}
.show-card{
  background:#09090E;
  border:1px solid #1e1e28;
  border-radius:8px;
  padding:12px 14px;
  cursor:pointer;
  display:flex;
  flex-direction:column;
  gap:8px;
  transition:border-color .2s,background .15s;
}
@media(min-width:480px){.show-card{flex-direction:row;align-items:center;justify-content:space-between;padding:14px 16px;border-radius:10px;gap:12px;}}
.show-card:hover{border-color:rgba(245,166,35,.35);background:#0d0d12;}
.show-card.selected{
  border-color:rgba(245,166,35,.6);
  background:rgba(245,166,35,.04);
}
.show-card-left{display:flex;flex-direction:column;gap:4px;}
@media(min-width:480px){.show-card-left{gap:5px;}}
.show-card-screen{
  font-family:'Syne',sans-serif;
  font-size:13px;font-weight:700;color:#F0EDE8;
}
@media(min-width:640px){.show-card-screen{font-size:14px;}}
.show-card-theater{font-size:11px;color:#555;}
@media(min-width:640px){.show-card-theater{font-size:12px;}}
.show-card-meta{
  display:flex;flex-wrap:wrap;gap:6px;
  font-size:11px;color:#777;
  align-items:center;
}
@media(min-width:640px){.show-card-meta{gap:8px;font-size:12px;}}
.show-card-time{
  font-family:'JetBrains Mono',monospace;
  font-size:13px;font-weight:700;color:#F5A623;
}
@media(min-width:640px){.show-card-time{font-size:14px;}}
.show-card-price{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;font-weight:600;color:#10B981;
}
@media(min-width:640px){.show-card-price{font-size:13px;}}
.show-card-right{
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
}
@media(min-width:480px){.show-card-right{width:auto;flex-direction:column;align-items:flex-end;gap:6px;}}
.show-card-radio{
  width:18px;height:18px;border-radius:50%;
  border:2px solid #2a2a38;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  transition:border-color .15s;
}
.show-card.selected .show-card-radio{border-color:#F5A623;}
.show-card-radio-dot{
  width:8px;height:8px;border-radius:50%;
  background:#F5A623;
  display:none;
}
.show-card.selected .show-card-radio-dot{display:block;}

/* ── STEP 2: seat map ── */
.seat-map-wrap{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
  padding:6px 0;
  overflow-x:auto;
}
@media(min-width:640px){.seat-map-wrap{gap:6px;padding:8px 0;}}

.screen-arc{
  width:min(260px,85%);
  height:22px;
  border-top:3px solid rgba(245,166,35,.4);
  border-radius:50%;
  margin-bottom:10px;
  position:relative;
  display:flex;align-items:flex-start;justify-content:center;
  padding-top:2px;
}
@media(min-width:480px){.screen-arc{width:min(320px,90%);height:26px;margin-bottom:12px;}}
@media(min-width:640px){.screen-arc{width:min(340px,90%);height:28px;margin-bottom:14px;}}
.screen-arc-label{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;
  letter-spacing:.2em;color:rgba(245,166,35,.5);
  text-transform:uppercase;
}
@media(min-width:640px){.screen-arc-label{font-size:9px;}}

.seat-row{
  display:flex;align-items:center;gap:3px;
}
@media(min-width:480px){.seat-row{gap:4px;}}
@media(min-width:640px){.seat-row{gap:5px;}}
.seat-row-label{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;color:#333;
  width:14px;text-align:right;flex-shrink:0;
}
@media(min-width:480px){.seat-row-label{font-size:9px;width:16px;}}
@media(min-width:640px){.seat-row-label{font-size:10px;width:18px;}}
.seats-in-row{display:flex;gap:3px;flex-wrap:nowrap;}
@media(min-width:480px){.seats-in-row{gap:4px;}}
@media(min-width:640px){.seats-in-row{gap:5px;}}

.seat{
  width:22px;height:22px;
  border-radius:4px 4px 2px 2px;
  border:1px solid #2a2a38;
  background:#1a1a24;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;
  font-size:7px;font-weight:700;color:#444;
  flex-shrink:0;
  position:relative;
  transition:background .15s,border-color .15s,transform .12s;
}
@media(min-width:480px){.seat{width:26px;height:26px;font-size:8px;border-radius:5px 5px 2px 2px;}}
@media(min-width:640px){.seat{width:28px;height:28px;font-size:8px;}}
.seat:hover:not(.seat-booked){
  border-color:rgba(245,166,35,.5);
  transform:scale(1.1);
}
.seat-regular{ border-color:#252535; }
.seat-vip{
  border-color:rgba(139,92,246,.4);
  background:rgba(139,92,246,.08);
  color:#8B5CF6;
}
.seat-selected{
  background:rgba(245,166,35,.2);
  border-color:#F5A623;
  color:#F5A623;
}
.seat-booked{
  background:#0d0d12;
  border-color:#141418;
  color:#222;
  cursor:not-allowed;
  opacity:.5;
}
.seat::before{
  content:'';
  position:absolute;
  top:-3px;left:3px;right:3px;height:3px;
  background:inherit;
  border:inherit;
  border-bottom:none;
  border-radius:2px 2px 0 0;
}
@media(min-width:480px){.seat::before{top:-3px;left:3px;right:3px;height:3px;}}
@media(min-width:640px){.seat::before{top:-4px;left:4px;right:4px;height:4px;}}

.seat-legend{
  display:flex;flex-wrap:wrap;gap:10px;
  justify-content:center;
  margin-top:12px;
  padding-top:10px;
  border-top:1px solid #18181f;
}
@media(min-width:640px){.seat-legend{gap:14px;margin-top:16px;padding-top:14px;}}
.legend-item{
  display:flex;align-items:center;gap:4px;
  font-size:9px;color:#666;
}
@media(min-width:640px){.legend-item{font-size:11px;gap:6px;}}
.legend-dot{
  width:10px;height:10px;border-radius:3px;
  border:1px solid;flex-shrink:0;
}
@media(min-width:640px){.legend-dot{width:14px;height:14px;}}

/* ── STEP 3 / Summary panel ── */
.summary-row{
  display:flex;justify-content:space-between;
  align-items:flex-start;
  gap:6px;
  padding:8px 0;
  border-bottom:1px solid #16161e;
}
@media(min-width:640px){.summary-row{gap:8px;padding:10px 0;}}
.summary-row:last-child{border-bottom:none;}
.summary-key{font-size:11px;color:#555;flex-shrink:0;}
@media(min-width:640px){.summary-key{font-size:12px;}}
.summary-val{
  font-size:12px;font-weight:600;color:#F0EDE8;
  text-align:right;
}
@media(min-width:640px){.summary-val{font-size:13px;}}
.summary-total-row{
  display:flex;justify-content:space-between;
  align-items:center;
  gap:6px;
  margin-top:10px;
  padding-top:10px;
  border-top:2px solid #1e1e28;
}
@media(min-width:640px){.summary-total-row{gap:8px;margin-top:14px;padding-top:14px;}}
.summary-total-key{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;
  letter-spacing:.12em;color:#555;
  text-transform:uppercase;
}
@media(min-width:640px){.summary-total-key{font-size:11px;}}
.summary-total-val{
  font-family:'JetBrains Mono',monospace;
  font-size:18px;font-weight:700;color:#F5A623;
}
@media(min-width:640px){.summary-total-val{font-size:20px;}}
.seat-chip{
  display:inline-flex;align-items:center;gap:3px;
  background:rgba(245,166,35,.1);
  border:1px solid rgba(245,166,35,.25);
  border-radius:5px;
  padding:2px 6px;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;color:#F5A623;
  margin:1px;
}
@media(min-width:640px){.seat-chip{gap:4px;padding:3px 8px;font-size:11px;margin:2px;}}
.seat-chip.vip{
  background:rgba(139,92,246,.1);
  border-color:rgba(139,92,246,.3);
  color:#8B5CF6;
}

/* action buttons */
.bp-action-row{
  display:flex;
  flex-direction:column;
  gap:8px;
  margin-top:14px;
}
@media(min-width:480px){.bp-action-row{flex-direction:row;gap:10px;margin-top:16px;}}
@media(min-width:640px){.bp-action-row{margin-top:20px;}}
.bp-btn-primary{
  display:flex;align-items:center;justify-content:center;gap:6px;
  background:#F5A623;border:none;border-radius:10px;
  color:#09090E;font-family:'Inter',sans-serif;
  font-weight:700;font-size:13px;
  padding:11px 16px;cursor:pointer;
  transition:background .15s,transform .1s;
  width:100%;
}
@media(min-width:480px){.bp-btn-primary{width:auto;flex:1;padding:12px 18px;font-size:14px;}}
@media(min-width:640px){.bp-btn-primary{padding:13px;border-radius:11px;}}
.bp-btn-primary:hover:not(:disabled){background:#E09920;}
.bp-btn-primary:active:not(:disabled){transform:scale(.97);}
.bp-btn-primary:disabled{opacity:.4;cursor:not-allowed;}
.bp-btn-ghost{
  display:flex;align-items:center;justify-content:center;gap:5px;
  background:transparent;
  border:1px solid #252530;border-radius:10px;
  color:#F0EDE8;font-family:'Inter',sans-serif;
  font-weight:600;font-size:13px;
  padding:11px 16px;cursor:pointer;
  transition:border-color .15s,transform .1s;
  width:100%;
}
@media(min-width:480px){.bp-btn-ghost{width:auto;padding:12px 18px;font-size:14px;border-radius:11px;}}
@media(min-width:640px){.bp-btn-ghost{padding:13px 20px;}}
.bp-btn-ghost:hover{border-color:rgba(245,166,35,.4);}
.bp-btn-ghost:active{transform:scale(.97);}

/* ── Success screen ── */
.bp-success{
  display:flex;flex-direction:column;
  align-items:center;text-align:center;
  padding:32px 16px;gap:12px;
}
@media(min-width:640px){.bp-success{padding:48px 24px;gap:16px;}}
.bp-success-icon{
  width:56px;height:56px;border-radius:50%;
  background:rgba(16,185,129,.12);
  border:2px solid rgba(16,185,129,.3);
  display:flex;align-items:center;justify-content:center;
  color:#10B981;
}
@media(min-width:640px){.bp-success-icon{width:72px;height:72px;}}
.bp-success-title{
  font-family:'Syne',sans-serif;
  font-size:20px;font-weight:800;color:#F0EDE8;
}
@media(min-width:640px){.bp-success-title{font-size:24px;}}
.bp-success-sub{font-size:13px;color:#555;max-width:300px;line-height:1.6;}
@media(min-width:640px){.bp-success-sub{font-size:14px;}}
.bp-success-id{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;color:#F5A623;
  background:rgba(245,166,35,.08);
  border:1px solid rgba(245,166,35,.2);
  border-radius:8px;padding:8px 16px;
}
@media(min-width:640px){.bp-success-id{font-size:13px;padding:10px 20px;}}

/* ── Auth gate ── */
.bp-auth-gate{
  display:flex;flex-direction:column;
  align-items:center;text-align:center;
  padding:40px 16px;gap:12px;
}
@media(min-width:640px){.bp-auth-gate{padding:64px 24px;gap:14px;}}
.bp-auth-icon{font-size:32px;}
@media(min-width:640px){.bp-auth-icon{font-size:40px;}}
.bp-auth-title{
  font-family:'Syne',sans-serif;
  font-size:18px;font-weight:700;color:#F0EDE8;
}
@media(min-width:640px){.bp-auth-title{font-size:20px;}}
.bp-auth-sub{font-size:13px;color:#555;max-width:300px;line-height:1.6;}
@media(min-width:640px){.bp-auth-sub{font-size:14px;}}

/* ── Empty / loading states ── */
@keyframes shimmer{
  0%{background-position:-600px 0;}
  100%{background-position:600px 0;}
}
.sk{
  background:linear-gradient(90deg,#141418 25%,#1e1e26 50%,#141418 75%);
  background-size:600px 100%;
  animation:shimmer 1.4s infinite linear;
  border-radius:8px;
}
.bp-empty{
  display:flex;flex-direction:column;
  align-items:center;gap:8px;
  padding:30px 16px;text-align:center;
}
@media(min-width:640px){.bp-empty{gap:10px;padding:40px 20px;}}
.bp-empty-icon{font-size:28px;}
@media(min-width:640px){.bp-empty-icon{font-size:32px;}}
.bp-empty-text{font-size:12px;color:#555;}
@media(min-width:640px){.bp-empty-text{font-size:13px;}}

@media(prefers-reduced-motion:reduce){
  .seat{transition:none!important;}
  .sk{animation:none;}
}
`;

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Select Show", "Choose Seats", "Confirm"];
function Stepper({ current }) {
  return (
    <div className="bp-stepper">
      {STEPS.map((label, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < STEPS.length - 1 ? 1 : 0,
          }}
        >
          <div
            className={`bp-step ${i < current ? "done" : i === current ? "active" : ""}`}
          >
            <div className="bp-step-num">
              {i < current ? <MdCheckCircle size={13} /> : i + 1}
            </div>
            <span>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="bp-step-line" />}
        </div>
      ))}
    </div>
  );
}

// ─── Seat map component ───────────────────────────────────────────────────────
function SeatMap({ allSeats, availableIds, selectedSeats, onToggle }) {
  const rows = useMemo(() => {
    const map = {};
    allSeats.forEach((s) => {
      if (!map[s.row]) map[s.row] = [];
      map[s.row].push(s);
    });
    return Object.keys(map)
      .sort()
      .map((row) => ({
        row,
        seats: map[row].sort((a, b) => a.col - b.col),
      }));
  }, [allSeats]);

  if (rows.length === 0)
    return (
      <div className="bp-empty">
        <div className="bp-empty-icon">🪑</div>
        <div className="bp-empty-text">
          No seat data available for this show.
        </div>
      </div>
    );

  return (
    <div className="seat-map-wrap">
      <div className="screen-arc">
        <span className="screen-arc-label">Screen</span>
      </div>

      {rows.map(({ row, seats }) => (
        <div key={row} className="seat-row">
          <span className="seat-row-label">{row}</span>
          <div className="seats-in-row">
            {seats.map((seat) => {
              const isAvailable = availableIds.includes(seat.id);
              const isSelected = selectedSeats.some((s) => s.id === seat.id);
              const isBooked = !isAvailable && !isSelected;
              const isVip = seat.seatType === "VIP";

              let cls = "seat";
              if (isSelected) cls += " seat-selected";
              else if (isBooked) cls += " seat-booked";
              else if (isVip) cls += " seat-vip";
              else cls += " seat-regular";

              return (
                <button
                  key={seat.id}
                  className={cls}
                  title={`${seat.seatNumber} · ${seat.seatType}${isBooked ? " · Booked" : ""}`}
                  disabled={isBooked}
                  onClick={() => !isBooked && onToggle(seat)}
                  aria-label={`Seat ${seat.seatNumber} ${seat.seatType} ${isBooked ? "Booked" : isSelected ? "Selected" : "Available"}`}
                >
                  {seat.col}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="seat-legend">
        <div className="legend-item">
          <div
            className="legend-dot"
            style={{ background: "#1a1a24", borderColor: "#252535" }}
          />
          Available
        </div>
        <div className="legend-item">
          <div
            className="legend-dot"
            style={{
              background: "rgba(139,92,246,.08)",
              borderColor: "rgba(139,92,246,.4)",
            }}
          />
          VIP
        </div>
        <div className="legend-item">
          <div
            className="legend-dot"
            style={{
              background: "rgba(245,166,35,.2)",
              borderColor: "#F5A623",
            }}
          />
          Selected
        </div>
        <div className="legend-item">
          <div
            className="legend-dot"
            style={{
              background: "#0d0d12",
              borderColor: "#141418",
              opacity: 0.5,
            }}
          />
          Booked
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showId = searchParams.get("show");

  const { user } = useSelector((s) => s.auth);
  const { showsByMovie, isLoading: showsLoading } = useSelector((s) => s.shows);
  const {
    availableSeats,
    selectedSeats,
    isLoading: seatsLoading,
  } = useSelector((s) => s.seats);
  const { isLoading: bookingLoading, selectedBooking } = useSelector(
    (s) => s.bookings,
  );

  const [step, setStep] = useState(0);
  const [selectedShow, setSelectedShow] = useState(null);
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const movie = showsByMovie[0]?.movie || null;

  const allSeats = useMemo(() => {
    if (!selectedShow) return [];
    return availableSeats;
  }, [availableSeats, selectedShow]);

  const availableIds = useMemo(
    () => availableSeats.map((s) => s.id),
    [availableSeats],
  );

  const totalPrice = useMemo(() => {
    if (!selectedShow) return 0;
    return selectedSeats.length * selectedShow.ticketPrice;
  }, [selectedSeats, selectedShow]);

  useEffect(() => {
    if (showId) {
      dispatch(fetchAvailableSeats(showId));
    }
  }, [showId, dispatch]);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchShowsByMovie(movieId));
    }
  }, [movieId, dispatch]);

  useEffect(() => {
    if (showsByMovie.length > 0 && !selectedShow && showId) {
      const found = showsByMovie.find((s) => String(s.id) === String(showId));
      if (found) {
        setSelectedShow(found);
      }
    }
  }, [showsByMovie, showId, selectedShow]);

  const handleSelectShow = (show) => {
    setSelectedShow(show);
    dispatch(clearSelectedSeats());
    dispatch(fetchAvailableSeats(show.id));
  };

  const handleToggleSeat = (seat) => {
    dispatch(selectSeat(seat));
  };

  // const handleConfirmBooking = async () => {
  //   if (!user || !selectedShow || selectedSeats.length === 0) return;
  //   setBookingError(null);

  //   const result = await dispatch(
  //     createBooking({
  //       userId: user.id,
  //       showId: selectedShow.id,
  //       seatIds: selectedSeats.map((s) => s.id),
  //     }),
  //   );

  //   if (createBooking.fulfilled.match(result)) {
  //     setBooked(true);
  //     dispatch(clearSelectedSeats());
  //   } else {
  //     setBookingError(
  //       result.payload?.message || "Booking failed. Please try again.",
  //     );
  //   }
  // };

//   const handleConfirmBooking = async () => {
//   if (!user || !selectedShow || selectedSeats.length === 0) return;
//   setBookingError(null);

//   try {
//     const result = await dispatch(
//       createBooking({
//         userId: user.id,
//         showId: selectedShow.id,
//         seatIds: selectedSeats.map((s) => s.id),
//       })
//     );
     
//     if (createBooking.fulfilled.match(result)) {
//       // ✅ Success - Navigate to confirmation page
//       const bookingId = result.payload.id;
//       dispatch(clearSelectedSeats());
//       navigate(`/booking/confirmation/${bookingId}`);
//     } else {
//       setBookingError(
//         result.payload?.message || "Booking failed. Please try again."
//       );
//     }
//   } catch (error) {
//     setBookingError("Something went wrong. Please try again.");
//   }
// };

const handleConfirmBooking = async () => {
  console.log("🟢 handleConfirmBooking called");
  
  // ✅ Check user
  if (!user) {
    console.log("🔴 No user logged in");
    setBookingError("Please login to book tickets");
    return;
  }
  
  // ✅ Check selectedShow
  if (!selectedShow) {
    console.log("🔴 No show selected");
    setBookingError("Please select a show");
    return;
  }
  
  // ✅ Check selectedSeats
  if (selectedSeats.length === 0) {
    console.log("🔴 No seats selected");
    setBookingError("Please select at least one seat");
    return;
  }

  setBookingError(null);

  const bookingData = {
    userId: user.id,
    showId: selectedShow.id,
    seatIds: selectedSeats.map((s) => s.id),
  };
  
  console.log("🟢 Booking Data:", bookingData);

  try {
    const result = await dispatch(createBooking(bookingData));
    console.log("🟢 Result:", result);

    if (createBooking.fulfilled.match(result)) {
      console.log("🟢 Success! Booking ID:", result.payload.id);
      const bookingId = result.payload.id;
      dispatch(clearSelectedSeats());
      navigate(`/booking/confirmation/${bookingId}`);
    } else {
      console.log("🔴 Error:", result.payload);
      setBookingError(
        result.payload?.message || "Booking failed. Please try again."
      );
    }
  } catch (error) {
    console.log("🔴 Catch Error:", error);
    setBookingError("Something went wrong. Please try again.");
  }
};

  // ── Loading state ──
  if (showsLoading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="bp-root">
          <div className="bp-header">
            <button className="bp-back" onClick={() => navigate(-1)}>
              <MdArrowBack size={15} /> Back
            </button>
            <div style={{ height: 12 }} />
            <div className="bp-eyebrow">Booking</div>
            <h1 className="bp-title">Loading...</h1>
            <div className="bp-divider" />
          </div>
          <div style={{ padding: "40px clamp(16px,4vw,40px)", maxWidth: 1180, margin: "0 auto" }}>
            <div className="bp-panel">
              <div className="bp-panel-body" style={{ padding: "40px", textAlign: "center" }}>
                <div className="sk" style={{ height: 200, width: "100%", borderRadius: 12 }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Auth gate ──
  if (!user) {
    return (
      <>
        <style>{CSS}</style>
        <div className="bp-root">
          <div className="bp-header">
            <button className="bp-back" onClick={() => navigate(-1)}>
              <MdArrowBack size={15} /> Back
            </button>
          </div>
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "0 clamp(16px,4vw,40px)",
            }}
          >
            <div className="bp-panel" style={{ marginTop: 32 }}>
              <div className="bp-auth-gate">
                <div className="bp-auth-icon">
                  <MdLock />
                </div>
                <div className="bp-auth-title">Sign in to book tickets</div>
                <p className="bp-auth-sub">
                  You need to be signed in to select seats and complete your
                  booking.
                </p>
                <button
                  className="bp-btn-primary"
                  style={{ width: "auto", paddingLeft: 32, paddingRight: 32 }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
                <button
                  className="bp-btn-ghost"
                  onClick={() => navigate("/register")}
                >
                  Create account
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Success screen ──
  if (booked && selectedBooking) {
    return (
      <>
        <style>{CSS}</style>
        <div className="bp-root">
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              padding: "40px clamp(16px,4vw,40px)",
            }}
          >
            <div className="bp-panel">
              <div className="bp-success">
                <div className="bp-success-icon">
                  <MdCheckCircle size={36} />
                </div>
                <div className="bp-success-title">Booking Confirmed!</div>
                <p className="bp-success-sub">
                  Your tickets have been booked successfully. Check your
                  bookings for the ticket details.
                </p>
                <div className="bp-success-id">
                  Booking ID: #{selectedBooking.id}
                </div>
                <div
                  style={{
                    width: "100%",
                    background: "#09090E",
                    border: "1px solid #1e1e28",
                    borderRadius: 10,
                    padding: "16px 18px",
                    textAlign: "left",
                  }}
                >
                  <div className="summary-row">
                    <span className="summary-key">Movie</span>
                    <span className="summary-val">
                      {selectedBooking.show?.movie?.title}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-key">Theater</span>
                    <span className="summary-val">
                      {selectedBooking.show?.screen?.theater?.name}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-key">Screen</span>
                    <span className="summary-val">
                      {selectedBooking.show?.screen?.name}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-key">Date & Time</span>
                    <span className="summary-val">
                      {fmtDate(selectedBooking.show?.showDate)} ·{" "}
                      {fmt12(selectedBooking.show?.startTime)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-key">Seats</span>
                    <span
                      className="summary-val"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      {selectedBooking.seats?.map((s) => (
                        <span
                          key={s.id}
                          className={`seat-chip ${s.seatType === "VIP" ? "vip" : ""}`}
                        >
                          {s.seatNumber}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="summary-total-row">
                    <span className="summary-total-key">Total Paid</span>
                    <span className="summary-total-val">
                      {fmtPrice(selectedBooking.totalPrice)}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="bp-btn-primary"
                    onClick={() => navigate("/my-bookings")}
                  >
                    <MdConfirmationNumber size={16} /> My Bookings
                  </button>
                  <button
                    className="bp-btn-ghost"
                    onClick={() => navigate("/movies")}
                  >
                    Browse Movies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main booking UI ──
  return (
    <>
      <style>{CSS}</style>
      <div className="bp-root">
        <div className="bp-header">
          <button className="bp-back" onClick={() => navigate(-1)}>
            <MdArrowBack size={15} /> Back
          </button>
          <div style={{ height: 12 }} />
          <div className="bp-eyebrow">Booking</div>
          <h1 className="bp-title">{movie?.title || "Loading…"}</h1>
          {movie && (
            <p className="bp-subtitle">
              {movie.genre} · {movie.language} · {movie.durationMinutes}m
            </p>
          )}
          <div className="bp-divider" />
        </div>

        <Stepper current={step} />

        <div className="bp-layout">
          <div>
            {/* STEP 0: Select Show */}
            {step === 0 && (
              <div className="bp-panel">
                <div className="bp-panel-header">
                  <MdCalendarMonth size={18} color="#F5A623" />
                  <span className="bp-panel-title">Select a Show</span>
                </div>
                <div className="bp-panel-body">
                  {showsLoading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="sk" style={{ height: 72, borderRadius: 10 }} />
                      ))}
                    </div>
                  ) : showsByMovie.length === 0 ? (
                    <div className="bp-empty">
                      <div className="bp-empty-icon">🎬</div>
                      <div className="bp-empty-text">
                        No shows available for this movie yet.
                      </div>
                    </div>
                  ) : (
                    <div className="show-list">
                      {showsByMovie.map((show) => (
                        <div
                          key={show.id}
                          className={`show-card${selectedShow?.id === show.id ? " selected" : ""}`}
                          onClick={() => handleSelectShow(show)}
                        >
                          <div className="show-card-left">
                            <div className="show-card-screen">
                              {show.screen?.name}
                            </div>
                            <div className="show-card-theater">
                              <MdLocationOn size={11} style={{ verticalAlign: "middle" }} />
                              {" "}{show.screen?.theater?.name} ·{" "}
                              {show.screen?.theater?.city?.name}
                            </div>
                            <div className="show-card-meta">
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <MdCalendarMonth size={12} /> {fmtDate(show.showDate)}
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <MdAccessTime size={12} /> {fmt12(show.startTime)} – {fmt12(show.endTime)}
                              </span>
                            </div>
                          </div>
                          <div className="show-card-right">
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                              <span className="show-card-time">{fmt12(show.startTime)}</span>
                              <span className="show-card-price">{fmtPrice(show.ticketPrice)} / seat</span>
                            </div>
                            <div className="show-card-radio">
                              <div className="show-card-radio-dot" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bp-action-row">
                    <button
                      className="bp-btn-primary"
                      disabled={!selectedShow}
                      onClick={() => setStep(1)}
                    >
                      Continue to Seats <MdArrowForward size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Choose Seats */}
            {step === 1 && (
              <div className="bp-panel">
                <div className="bp-panel-header">
                  <MdEventSeat size={18} color="#F5A623" />
                  <span className="bp-panel-title">Choose Seats</span>
                  {selectedShow && (
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#555" }}>
                      {fmt12(selectedShow.startTime)} · {selectedShow.screen?.name}
                    </span>
                  )}
                </div>
                <div className="bp-panel-body">
                  {seatsLoading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 0" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="sk" style={{ height: 28, width: `${90 - i * 5}%` }} />
                      ))}
                    </div>
                  ) : (
                    <SeatMap
                      allSeats={availableSeats}
                      availableIds={availableIds}
                      selectedSeats={selectedSeats}
                      onToggle={handleToggleSeat}
                    />
                  )}

                  <div className="bp-action-row">
                    <button
                      className="bp-btn-ghost"
                      onClick={() => {
                        setStep(0);
                        dispatch(clearSelectedSeats());
                      }}
                    >
                      <MdArrowBack size={15} /> Back
                    </button>
                    <button
                      className="bp-btn-primary"
                      disabled={selectedSeats.length === 0}
                      onClick={() => setStep(2)}
                    >
                      Review Booking <MdArrowForward size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Confirm */}
            {step === 2 && (
              <div className="bp-panel">
                <div className="bp-panel-header">
                  <MdConfirmationNumber size={18} color="#F5A623" />
                  <span className="bp-panel-title">Confirm Booking</span>
                </div>
                <div className="bp-panel-body">
                  <div className="bp-slabel">Show Details</div>
                  <div
                    style={{
                      background: "#09090E",
                      border: "1px solid #1e1e28",
                      borderRadius: 10,
                      padding: "14px 16px",
                      marginBottom: 20,
                    }}
                  >
                    <div className="summary-row" style={{ paddingTop: 0 }}>
                      <span className="summary-key">Theater</span>
                      <span className="summary-val">
                        {selectedShow?.screen?.theater?.name}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Screen</span>
                      <span className="summary-val">
                        {selectedShow?.screen?.name}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Address</span>
                      <span className="summary-val" style={{ textAlign: "right", fontSize: 12, color: "#777" }}>
                        {selectedShow?.screen?.theater?.address}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Date</span>
                      <span className="summary-val">
                        {fmtDate(selectedShow?.showDate)}
                      </span>
                    </div>
                    <div className="summary-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
                      <span className="summary-key">Time</span>
                      <span className="summary-val">
                        {fmt12(selectedShow?.startTime)} – {fmt12(selectedShow?.endTime)}
                      </span>
                    </div>
                  </div>

                  <div className="bp-slabel">Selected Seats</div>
                  <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 20 }}>
                    {selectedSeats.map((s) => (
                      <span key={s.id} className={`seat-chip ${s.seatType === "VIP" ? "vip" : ""}`}>
                        {s.seatNumber}{" "}
                        <span style={{ opacity: 0.6, fontWeight: 400 }}>
                          {s.seatType}
                        </span>
                      </span>
                    ))}
                  </div>

                  <div className="bp-slabel">Pricing</div>
                  <div
                    style={{
                      background: "#09090E",
                      border: "1px solid #1e1e28",
                      borderRadius: 10,
                      padding: "14px 16px",
                      marginBottom: 8,
                    }}
                  >
                    <div className="summary-row" style={{ paddingTop: 0 }}>
                      <span className="summary-key">
                        {selectedSeats.length} × {fmtPrice(selectedShow?.ticketPrice)}
                      </span>
                      <span className="summary-val">
                        {fmtPrice(
                          selectedSeats.length * (selectedShow?.ticketPrice || 0),
                        )}
                      </span>
                    </div>
                    <div className="summary-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
                      <span className="summary-key">Convenience fee</span>
                      <span className="summary-val" style={{ color: "#10B981" }}>
                        Free
                      </span>
                    </div>
                    <div className="summary-total-row">
                      <span className="summary-total-key">Total</span>
                      <span className="summary-total-val">
                        {fmtPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {bookingError && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(239,68,68,.08)",
                        border: "1px solid rgba(239,68,68,.25)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 12,
                        fontSize: 13,
                        color: "#EF4444",
                      }}
                    >
                      <MdCancel size={16} /> {bookingError}
                    </div>
                  )}

                  <div className="bp-action-row">
                    <button className="bp-btn-ghost" onClick={() => setStep(1)}>
                      <MdArrowBack size={15} /> Back
                    </button>
                    <button
                      className="bp-btn-primary"
                      onClick={handleConfirmBooking}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        "Processing…"
                      ) : (
                        <>
                          <MdCheckCircle size={16} /> Pay {fmtPrice(totalPrice)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: sticky summary ── */}
          <div>
            <div className="bp-panel" style={{ position: "sticky", top: 20 }}>
              <div className="bp-panel-header">
                <MdConfirmationNumber size={16} color="#F5A623" />
                <span className="bp-panel-title">Booking Summary</span>
              </div>
              <div className="bp-panel-body">
                {movie && (
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{
                        width: 52,
                        height: 76,
                        objectFit: "cover",
                        borderRadius: 6,
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "#F0EDE8" }}>
                        {movie.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#555" }}>
                        {movie.genre} · {movie.language}
                      </div>
                      <div style={{ fontSize: 11, color: "#444" }}>
                        {movie.durationMinutes}m
                      </div>
                    </div>
                  </div>
                )}

                {selectedShow ? (
                  <>
                    <div className="summary-row" style={{ paddingTop: 0 }}>
                      <span className="summary-key">Theater</span>
                      <span className="summary-val" style={{ fontSize: 12 }}>
                        {selectedShow.screen?.theater?.name}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Screen</span>
                      <span className="summary-val" style={{ fontSize: 12 }}>
                        {selectedShow.screen?.name}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Date</span>
                      <span className="summary-val" style={{ fontSize: 12 }}>
                        {fmtDate(selectedShow.showDate)}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Time</span>
                      <span className="summary-val" style={{ fontSize: 12 }}>
                        {fmt12(selectedShow.startTime)}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Price / seat</span>
                      <span className="summary-val" style={{ color: "#10B981" }}>
                        {fmtPrice(selectedShow.ticketPrice)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="bp-empty" style={{ padding: "16px 0" }}>
                    <div className="bp-empty-icon" style={{ fontSize: 22 }}>
                      🎬
                    </div>
                    <div className="bp-empty-text">
                      Select a show to see summary
                    </div>
                  </div>
                )}

                {selectedSeats.length > 0 && (
                  <>
                    <div className="summary-row">
                      <span className="summary-key">Seats</span>
                      <span
                        className="summary-val"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        {selectedSeats.map((s) => (
                          <span
                            key={s.id}
                            className={`seat-chip ${s.seatType === "VIP" ? "vip" : ""}`}
                            style={{ fontSize: 10 }}
                          >
                            {s.seatNumber}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="summary-total-row">
                      <span className="summary-total-key">Total</span>
                      <span className="summary-total-val">
                        {fmtPrice(totalPrice)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
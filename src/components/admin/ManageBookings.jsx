// src/pages/admin/ManageBookings.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdSearch, MdClose, MdRefresh, MdConfirmationNumber,
  MdAttachMoney, MdEventSeat, MdCancel, MdChevronRight,
  MdPerson, MdWarning, MdTheaters, MdLocationOn,
  MdAccessTime, MdCalendarMonth, MdScreenShare,
} from "react-icons/md";
import { FaCheckCircle, FaTimesCircle, FaTicketAlt } from "react-icons/fa";
import { fetchAllBookings, cancelBooking } from "../../store/slices/bookingSlice";
import { fetchAvailableSeats } from "../../store/slices/seatSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDateTime = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};
const fmtDateOnly = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};
const fmt12 = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
};
const genRef = (id, bookedAt) => {
  const d = bookedAt ? new Date(bookedAt) : new Date();
  return `BMS-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${String(id).padStart(4,"0")}`;
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
  padding: 0 12px;
}
@media (min-width: 768px) {
  .mb-root { padding: 0; }
}

.mb-a1{animation:fadeUp .45s ease .00s both;}
.mb-a2{animation:fadeUp .45s ease .06s both;}
.mb-a3{animation:fadeUp .45s ease .12s both;}
.mb-a4{animation:fadeUp .45s ease .18s both;}
@media(prefers-reduced-motion:reduce){ .mb-a1,.mb-a2,.mb-a3,.mb-a4{animation:none;opacity:1;} }

@keyframes fadeUp  { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
@keyframes fadeIn  { from{opacity:0;}to{opacity:1;} }
@keyframes slideInRight { from{opacity:0;transform:translateX(100%);}to{opacity:1;transform:translateX(0);} }
@keyframes shimmer { 0%{background-position:-600px 0;}100%{background-position:600px 0;} }

.mb-hdr{
  display:flex;
  flex-direction:column;
  gap:12px;
  margin-bottom:clamp(16px,3vw,40px);
}
@media (min-width: 768px) {
  .mb-hdr { flex-direction:row; align-items:flex-end; justify-content:space-between; gap:16px; }
}
.mb-eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.2em;color:#F5A623;
  text-transform:uppercase;margin-bottom:4px;
}
@media (min-width: 768px) {
  .mb-eyebrow { font-size:10px; margin-bottom:8px; }
}
.mb-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(22px,5vw,40px);
  font-weight:800;letter-spacing:-.022em;
  color:#F0EDE8;line-height:1.04;
}
.mb-title span{color:#F5A623;}
.mb-sub{font-size:12px;color:#444;margin-top:4px;}
@media (min-width: 768px) { .mb-sub{font-size:13px;margin-top:6px;} }
.mb-divider{ height:1px;background:linear-gradient(90deg,#F5A623,transparent 35%);margin-top:12px; }
@media (min-width: 768px) { .mb-divider{margin-top:20px;} }
.mb-hdr-actions{display:flex;gap:8px;align-items:center;flex-shrink:0;flex-wrap:wrap;}
.mb-refresh-btn{
  display:flex;align-items:center;gap:5px;
  background:transparent;border:1px solid #1a1a24;border-radius:8px;
  color:#555;font-family:'Inter',sans-serif;
  font-size:12px;font-weight:600;
  padding:7px 14px;cursor:pointer;
  transition:border-color .15s,color .15s;
  white-space:nowrap;
}
@media (min-width: 768px) {
  .mb-refresh-btn { font-size:13px; padding:9px 16px; border-radius:10px; gap:6px; }
}
.mb-refresh-btn:hover{border-color:rgba(245,166,35,.4);color:#F5A623;}

.mb-stats{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px;
  margin-bottom:clamp(16px,3vw,36px);
}
@media (min-width: 500px) { .mb-stats{grid-template-columns:repeat(4,1fr); gap:10px;} }
@media (min-width: 768px) { .mb-stats{gap:0;border:1px solid #18181f;border-radius:16px;overflow:hidden;} }
.mb-stat{
  padding:clamp(12px,2vw,26px) clamp(10px,1.5vw,24px);
  background:#111116;
  border:1px solid #18181f;
  border-radius:10px;
  position:relative;
  cursor:default;
  transition:background .2s;
}
@media (min-width: 500px) { .mb-stat{ border-radius:0; border: none; border-right:1px solid #18181f; } }
@media (min-width: 768px) { .mb-stat{padding:clamp(16px,2.5vw,26px) clamp(14px,2vw,24px);} }
.mb-stat:last-child{ border-right:none; }
.mb-stat:hover{background:rgba(255,255,255,.015);}
.mb-stat-icon{
  width:32px;height:32px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:8px;
  font-size:16px;
}
@media (min-width: 768px) { .mb-stat-icon{width:40px;height:40px;border-radius:11px;font-size:20px;margin-bottom:14px;} }
.mb-stat-icon.gold  {background:rgba(245,166,35,.1); color:#F5A623;}
.mb-stat-icon.green {background:rgba(16,185,129,.1);  color:#10B981;}
.mb-stat-icon.red   {background:rgba(239,68,68,.1);   color:#EF4444;}
.mb-stat-icon.blue  {background:rgba(59,130,246,.1);  color:#3B82F6;}
.mb-stat-val{
  font-family:'Syne',sans-serif;
  font-size:clamp(18px,4vw,30px);font-weight:800;
  color:#F0EDE8;line-height:1;margin-bottom:3px;
}
@media (min-width: 768px) { .mb-stat-val{font-size:clamp(20px,2.5vw,30px);margin-bottom:5px;} }
.mb-stat-lbl{font-size:10px;color:#444;font-weight:500;}
@media (min-width: 768px) { .mb-stat-lbl{font-size:12px;} }

.mb-filters{
  display:flex;
  flex-direction:column;
  gap:8px;
  margin-bottom:clamp(12px,2vw,24px);
}
@media (min-width: 600px) { .mb-filters{flex-direction:row;flex-wrap:wrap;gap:10px;} }
@media (min-width: 768px) { .mb-filters{background:#111116;border:1px solid #18181f;border-radius:12px;padding:14px 18px;} }
/* ── Mobile Search ── */
.mb-search{
  flex:1;min-width:100%;
  display:flex;align-items:center;
  background:#111116;border:1px solid #1a1a24;
  border-radius:10px;  /* ✅ Increased from 8px */
  padding:0 14px;      /* ✅ Increased from 0 12px */
  height:46px;         /* ✅ Increased from 38px */
  gap:10px;            /* ✅ Increased from 8px */
  transition:border-color .2s;
}
.mb-search input{
  flex:1;background:transparent;border:none;outline:none;
  color:#F0EDE8;font-family:'Inter',sans-serif;
  font-size:14px;      /* ✅ Increased from 12px */
}
@media (min-width: 600px) {
  .mb-search{
    min-width:180px;
    height:44px;       /* ✅ Increased from 40px */
    padding:0 14px;
    border-radius:10px;
  }
  .mb-search input{ font-size:13px; }  /* ✅ Increased from 12px */
}
@media (min-width: 768px) {
  .mb-search{
    background:#09090E;
    height:42px;
    border-radius:10px;
    padding:0 14px;
  }
  .mb-search input{ font-size:13px; }
}
.mb-search input::placeholder{color:#2a2a38;}
.mb-search-clear{ background:none;border:none;cursor:pointer;color:#444;padding:0;display:flex;align-items:center;transition:color .15s; }
.mb-search-clear:hover{color:#F5A623;}
.mb-select,.mb-date-input{
  background:#111116;border:1px solid #1a1a24;border-radius:8px;
  color:#F0EDE8;font-family:'Inter',sans-serif;
  font-size:12px;padding:0 12px;
  height:38px;outline:none;cursor:pointer;
  width:100%;
  transition:border-color .2s;
}
@media (min-width: 600px) {
  .mb-select,.mb-date-input{width:auto;min-width:130px;height:40px;padding:0 14px;font-size:13px;}
}
@media (min-width: 768px) {
  .mb-select,.mb-date-input{background:#09090E;height:42px;border-radius:10px;min-width:130px;}
}
.mb-select:focus,.mb-date-input:focus{border-color:rgba(245,166,35,.45);}
.mb-select option{background:#111116;}
.mb-date-input{min-width:120px;}
@media (min-width: 768px) { .mb-date-input{min-width:150px;} }
.mb-date-input::-webkit-calendar-picker-indicator{filter:invert(.5);cursor:pointer;}
.mb-count{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;color:#2a2a38;
  white-space:nowrap;
}
@media (min-width: 768px) { .mb-count{font-size:11px;} }
.mb-count b{color:#F5A623;}
.mb-clear-btn{
  display:flex;align-items:center;gap:4px;
  background:transparent;border:1px solid rgba(245,166,35,.25);border-radius:8px;
  color:#F5A623;font-family:'Inter',sans-serif;
  font-size:11px;font-weight:600;
  padding:0 12px;height:38px;cursor:pointer;
  transition:background .15s;white-space:nowrap;
}
@media (min-width: 768px) {
  .mb-clear-btn{font-size:12px;padding:0 13px;height:42px;border-radius:10px;}
}
.mb-clear-btn:hover{background:rgba(245,166,35,.06);}

.mb-table-wrap{
  background:#111116;border:1px solid #18181f;
  border-radius:12px;overflow:hidden;overflow-x:auto;
}
@media (min-width: 768px) { .mb-table-wrap{border-radius:14px;} }
.mb-table{width:100%;border-collapse:collapse;font-size:12px;}
@media (min-width: 768px) { .mb-table{font-size:14px;} }
.mb-table th{
  text-align:left;padding:10px 12px;
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;letter-spacing:.12em;
  color:#252535;text-transform:uppercase;
  border-bottom:1px solid #13131a;white-space:nowrap;
}
@media (min-width: 768px) {
  .mb-table th{ padding:13px 16px; font-size:9px; letter-spacing:.18em; }
}
.mb-table td{ padding:0;border-bottom:1px solid #0d0d12;vertical-align:middle; }
.mb-table tr:last-child td{border-bottom:none;}
.mb-td{
  display:block;
  padding:8px 10px;
  font-size:11px;color:#888;
}
@media (min-width: 768px) {
  .mb-td{ padding:13px 16px; font-size:13px; }
}

.mb-badge{
  display:inline-flex;align-items:center;gap:4px;
  border-radius:100px;padding:3px 8px;
  font-size:8px;font-weight:700;
  letter-spacing:.05em;text-transform:uppercase;
  white-space:nowrap;
}
@media (min-width: 768px) {
  .mb-badge{ padding:4px 11px; font-size:10px; gap:5px; }
}
.mb-badge.confirmed{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);color:#10B981;}
.mb-badge.cancelled{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#EF4444;}

.mb-seat{
  display:inline-flex;align-items:center;
  background:rgba(245,166,35,.07);
  border:1px solid rgba(245,166,35,.18);
  border-radius:4px;padding:1px 6px;
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;color:#F5A623;
}
@media (min-width: 768px) {
  .mb-seat{ padding:2px 8px; font-size:10px; }
}
.mb-seat.vip{
  background:rgba(139,92,246,.07);
  border-color:rgba(139,92,246,.2);
  color:#8B5CF6;
}

.mb-cards{display:none;flex-direction:column;gap:8px;}
@media(max-width:767px){ .mb-table-wrap{display:none;} .mb-cards{display:flex;} }

.mb-card{
  background:#111116;border:1px solid #18181f;
  border-radius:10px;overflow:hidden;
  animation:fadeUp .35s ease both;
}
.mb-card-inner{display:flex;}
.mb-spine{width:4px;flex-shrink:0;}
.mb-spine.confirmed{background:#10B981;}
.mb-spine.cancelled{background:#EF4444;}
.mb-card-body{flex:1;min-width:0;padding:12px;}
.mb-card-top{
  display:flex;align-items:flex-start;
  justify-content:space-between;gap:8px;
  margin-bottom:8px;
}
.mb-card-movie{
  font-family:'Syne',sans-serif;
  font-size:14px;font-weight:800;
  color:#F0EDE8;letter-spacing:-.01em;
}
.mb-card-meta{
  display:grid;grid-template-columns:1fr 1fr;
  gap:4px 8px;margin-bottom:8px;
}
.mb-card-meta-item{display:flex;flex-direction:column;gap:1px;}
.mb-card-meta-label{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;
  letter-spacing:.12em;color:#2a2a38;
  text-transform:uppercase;
}
.mb-card-meta-val{font-size:11px;font-weight:600;color:#888;}
.mb-card-footer{
  border-top:1px solid #13131a;
  padding:8px 12px;
  display:flex;align-items:center;
  justify-content:space-between;gap:6px;flex-wrap:wrap;
}
.mb-card-ref{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;color:#1e1e28;
}
.mb-card-price{
  font-family:'JetBrains Mono',monospace;
  font-size:14px;font-weight:700;color:#10B981;
}

.sk{
  background:linear-gradient(90deg,#141418 25%,#1e1e26 50%,#141418 75%);
  background-size:600px 100%;
  animation:shimmer 1.4s infinite linear;border-radius:4px;
}

.mb-empty{
  display:flex;flex-direction:column;align-items:center;
  text-align:center;padding:clamp(32px,8vw,80px) 16px;gap:10px;
}
.mb-empty-icon{font-size:32px;opacity:.3;}
@media (min-width: 768px) { .mb-empty-icon{font-size:40px;} }
.mb-empty-title{
  font-family:'Syne',sans-serif;
  font-size:16px;font-weight:700;color:#F0EDE8;
}
@media (min-width: 768px) { .mb-empty-title{font-size:18px;} }
.mb-empty-sub{font-size:12px;color:#444;max-width:280px;line-height:1.6;}
@media (min-width: 768px) { .mb-empty-sub{font-size:13px;} }

.mb-footer{
  display:flex;flex-direction:column;
  align-items:center;
  margin-top:12px;gap:4px;
}
@media (min-width: 600px) {
  .mb-footer{flex-direction:row;justify-content:space-between;margin-top:16px;gap:8px;}
}
.mb-footer-stat{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:600;color:#2a2a38;
}
@media (min-width: 768px) { .mb-footer-stat{font-size:11px;} }
.mb-footer-stat b{color:#F5A623;}

.mb-sidebar-overlay{
  position:fixed;inset:0;z-index:999;
  background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
  animation:fadeIn .2s ease both;
}
.mb-sidebar{
  position:fixed;top:0;right:0;bottom:0;
  width:100%;max-width:480px;
  background:#0d0d14;border-left:1px solid #1a1a24;
  z-index:1000;
  padding:0;
  animation:slideInRight .3s cubic-bezier(.22,.68,0,1.2) both;
  overflow-y:auto;
  display:flex;flex-direction:column;
}
.mb-sidebar-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 18px 12px;
  border-bottom:1px solid #13131a;
  flex-shrink:0;
}
@media (min-width: 480px) { .mb-sidebar-header{ padding:20px 24px 16px; } }
.mb-sidebar-title{
  font-family:'Syne',sans-serif;
  font-size:16px;font-weight:800;
  color:#F0EDE8;
}
@media (min-width: 480px) { .mb-sidebar-title{ font-size:18px; } }
.mb-sidebar-close{
  background:transparent;border:1px solid #1a1a24;border-radius:6px;
  color:#555;padding:4px 8px;cursor:pointer;
  transition:border-color .15s,color .15s;
  display:flex;align-items:center;gap:3px;
  font-size:11px;
}
@media (min-width: 480px) { .mb-sidebar-close{ padding:6px 10px; border-radius:8px; gap:4px; font-size:13px; } }
.mb-sidebar-close:hover{border-color:rgba(239,68,68,.4);color:#EF4444;}
.mb-sidebar-body{
  flex:1;padding:16px 18px 18px;
  overflow-y:auto;
}
@media (min-width: 480px) { .mb-sidebar-body{ padding:20px 24px 24px; } }
.mb-sidebar-section{margin-bottom:14px;}
@media (min-width: 480px) { .mb-sidebar-section{margin-bottom:20px;} }
.mb-sidebar-label{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;font-weight:700;
  letter-spacing:.15em;color:#2a2a38;
  text-transform:uppercase;
  margin-bottom:6px;
  display:flex;align-items:center;gap:5px;
}
@media (min-width: 480px) {
  .mb-sidebar-label{ font-size:9px; letter-spacing:.18em; margin-bottom:10px; gap:6px; }
}
.mb-sidebar-row{
  display:flex;justify-content:space-between;
  align-items:center;
  padding:5px 0;
  border-bottom:1px solid #0d0d12;
  gap:8px;
}
.mb-sidebar-row:last-child{border-bottom:none;}
.mb-sidebar-key{font-size:11px;color:#444;flex-shrink:0;}
@media (min-width: 480px) { .mb-sidebar-key{font-size:12px;} }
.mb-sidebar-val{font-size:11px;font-weight:600;color:#ccc;text-align:right;}
@media (min-width: 480px) { .mb-sidebar-val{font-size:12px;} }
.mb-sidebar-val.mono{font-family:'JetBrains Mono',monospace;font-size:10px;}
@media (min-width: 480px) { .mb-sidebar-val.mono{font-size:11px;} }
.mb-sidebar-val.amber{color:#F5A623;}
.mb-sidebar-val.green{color:#10B981;}
.mb-sidebar-poster{
  width:48px;height:68px;border-radius:6px;
  object-fit:cover;border:1px solid #1e1e28;
  flex-shrink:0;
}
@media (min-width: 480px) {
  .mb-sidebar-poster{ width:60px; height:86px; border-radius:8px; }
}
.mb-sidebar-movie-info{
  display:flex;flex-direction:column;
  gap:10px;
  margin-bottom:12px;
  padding:10px 12px;
  background:#111116;border-radius:8px;
  border:1px solid #13131a;
}
@media (min-width: 480px) {
  .mb-sidebar-movie-info{ flex-direction:row; align-items:center; gap:14px; margin-bottom:16px; padding:12px 16px; border-radius:10px; }
}
.mb-sidebar-movie-title{
  font-family:'Syne',sans-serif;
  font-size:14px;font-weight:800;
  color:#F0EDE8;
}
@media (min-width: 480px) { .mb-sidebar-movie-title{ font-size:16px; } }
.mb-sidebar-movie-meta{ font-size:11px; color:#444; margin-top:1px; }
@media (min-width: 480px) { .mb-sidebar-movie-meta{ font-size:12px; } }

.mb-sidebar-seats{
  display:flex;flex-wrap:wrap;gap:4px;
}
.mb-sidebar-seat{
  display:inline-flex;align-items:center;
  background:rgba(245,166,35,.07);
  border:1px solid rgba(245,166,35,.18);
  border-radius:4px;padding:2px 8px;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;color:#F5A623;
}
@media (min-width: 480px) {
  .mb-sidebar-seat{ padding:3px 10px; font-size:11px; }
}
.mb-sidebar-seat.vip{
  background:rgba(139,92,246,.07);
  border-color:rgba(139,92,246,.2);
  color:#8B5CF6;
}

.mb-sidebar-cancel-btn{
  width:100%;margin-top:12px;
  display:flex;align-items:center;justify-content:center;gap:6px;
  background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);
  border-radius:8px;color:#EF4444;
  font-family:'Inter',sans-serif;font-size:13px;font-weight:600;
  padding:10px;cursor:pointer;
  transition:background .15s,border-color .15s;
}
@media (min-width: 480px) {
  .mb-sidebar-cancel-btn{ font-size:14px; padding:12px; border-radius:10px; gap:8px; margin-top:16px; }
}
.mb-sidebar-cancel-btn:hover{ background:rgba(239,68,68,.15); border-color:rgba(239,68,68,.45); }
.mb-sidebar-cancel-btn:disabled{opacity:.4;cursor:not-allowed;}

.mb-modal-bg{
  position:fixed;inset:0;z-index:1100;
  background:rgba(0,0,0,.75);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;
  padding:16px;animation:fadeIn .2s ease both;
}
.mb-modal{
  background:#0d0d14;border:1px solid #1a1a24;border-radius:14px;
  max-width:400px;width:100%;
  box-shadow:0 28px 70px rgba(0,0,0,.7);
  overflow:hidden;
  animation:fadeUp .3s cubic-bezier(.22,.68,0,1.2) both;
}
@media (min-width: 480px) { .mb-modal{ border-radius:16px; max-width:400px; } }
.mb-modal-top{
  display:flex;align-items:center;gap:12px;
  padding:16px 18px 14px;
  border-bottom:1px solid #13131a;
}
@media (min-width: 480px) {
  .mb-modal-top{ gap:14px; padding:22px 22px 18px; }
}
.mb-modal-warn{
  width:36px;height:36px;border-radius:10px;
  background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);
  display:flex;align-items:center;justify-content:center;
  color:#EF4444;flex-shrink:0;
}
@media (min-width: 480px) { .mb-modal-warn{ width:44px; height:44px; border-radius:12px; } }
.mb-modal-title{
  font-family:'Syne',sans-serif;
  font-size:14px;font-weight:800;color:#F0EDE8;
  letter-spacing:-.01em;
}
@media (min-width: 480px) { .mb-modal-title{ font-size:16px; } }
.mb-modal-sub{ font-size:11px; color:#555; margin-top:2px; line-height:1.5; }
@media (min-width: 480px) { .mb-modal-sub{ font-size:12px; } }
.mb-modal-detail{
  padding:12px 16px;
  display:flex;flex-direction:column;gap:6px;
}
@media (min-width: 480px) {
  .mb-modal-detail{ padding:16px 22px; gap:8px; }
}
.mb-modal-drow{
  display:flex;justify-content:space-between;
  padding:5px 0;border-bottom:1px solid #0d0d12;
  font-size:12px;
}
@media (min-width: 480px) {
  .mb-modal-drow{ padding:7px 0; font-size:13px; }
}
.mb-modal-drow:last-child{border-bottom:none;}
.mb-modal-dkey{color:#444;}
.mb-modal-dval{font-weight:600;color:#ccc;}
.mb-modal-btns{
  display:flex;gap:8px;
  padding:12px 16px 16px;
  border-top:1px solid #13131a;
}
@media (min-width: 480px) {
  .mb-modal-btns{ gap:10px; padding:16px 22px 22px; }
}
.mb-modal-keep{
  flex:1;padding:10px;border-radius:8px;
  background:#1a1a24;border:none;color:#888;
  font-family:'Inter',sans-serif;font-weight:700;font-size:12px;
  cursor:pointer;transition:background .15s;
}
@media (min-width: 480px) {
  .mb-modal-keep{ padding:12px; font-size:14px; border-radius:10px; }
}
.mb-modal-keep:hover{background:#222232;}
.mb-modal-yes{
  flex:1;padding:10px;border-radius:8px;
  background:#EF4444;border:none;color:#fff;
  font-family:'Inter',sans-serif;font-weight:700;font-size:12px;
  cursor:pointer;transition:background .15s,transform .1s;
}
@media (min-width: 480px) {
  .mb-modal-yes{ padding:12px; font-size:14px; border-radius:10px; }
}
.mb-modal-yes:hover{background:#DC2626;}
.mb-modal-yes:active{transform:scale(.97);}
.mb-modal-yes:disabled{opacity:.45;cursor:not-allowed;}

.mb-seats-modal-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(50px, 1fr));
  gap:6px;
  padding:4px 0;
}
@media (min-width: 480px) {
  .mb-seats-modal-grid{ grid-template-columns:repeat(auto-fill, minmax(60px, 1fr)); gap:8px; padding:8px 0; }
}
.mb-seats-modal-item{
  display:flex;flex-direction:column;align-items:center;
  padding:8px 2px;
  background:#0d0d12;border:1px solid #1e1e28;
  border-radius:5px;
  font-size:10px;font-weight:600;color:#555;
  transition:all .15s;
}
@media (min-width: 480px) {
  .mb-seats-modal-item{ padding:10px 4px; border-radius:6px; font-size:11px; }
}
.mb-seats-modal-item.available{ border-color:rgba(16,185,129,.3); color:#10B981; }
.mb-seats-modal-item.booked{ border-color:rgba(239,68,68,.2); color:#EF4444; opacity:.5; }
.mb-seats-modal-item.vip{ border-color:rgba(139,92,246,.3); color:#8B5CF6; }
.mb-seats-modal-item .seat-num{ font-size:9px; }
@media (min-width: 480px) { .mb-seats-modal-item .seat-num{ font-size:10px; } }
.mb-seats-modal-item .seat-type{ font-size:7px; color:#333; margin-top:1px; }
@media (min-width: 480px) { .mb-seats-modal-item .seat-type{ font-size:8px; margin-top:2px; } }
.mb-seats-legend{
  display:flex;gap:10px;
  justify-content:center;
  margin-top:8px;padding-top:8px;
  border-top:1px solid #0f0f14;
  flex-wrap:wrap;
}
@media (min-width: 480px) {
  .mb-seats-legend{ gap:16px; margin-top:12px; padding-top:12px; }
}
.mb-seats-legend-item{
  display:flex;align-items:center;gap:4px;
  font-size:10px;color:#555;
}
@media (min-width: 480px) { .mb-seats-legend-item{ font-size:11px; gap:6px; } }
.mb-seats-legend-dot{
  width:10px;height:10px;border-radius:3px;border:1px solid;
}
@media (min-width: 480px) { .mb-seats-legend-dot{ width:12px; height:12px; } }
.mb-seats-legend-dot.available{ border-color:rgba(16,185,129,.3); background:rgba(16,185,129,.1); }
.mb-seats-legend-dot.booked{ border-color:rgba(239,68,68,.2); background:rgba(239,68,68,.08); }
.mb-seats-legend-dot.vip{ border-color:rgba(139,92,246,.3); background:rgba(139,92,246,.08); }

/* ── Tablet specific ── */
@media (min-width: 481px) and (max-width: 1024px) {
  .mb-stats { grid-template-columns: repeat(4, 1fr); }
  .mb-table th, .mb-table td { padding: 10px 12px; font-size: 12px; }
  .mb-card-meta { grid-template-columns: 1fr 1fr; }
}

/* ── Small mobile ── */
@media (max-width: 380px) {
  .mb-stat { padding: 10px 8px; }
  .mb-stat-val { font-size: 16px; }
  .mb-stat-lbl { font-size: 9px; }
  .mb-stat-icon { width: 28px; height: 28px; font-size: 14px; }
  .mb-card-movie { font-size: 13px; }
  .mb-card-meta-val { font-size: 10px; }
  .mb-card-footer { flex-direction: column; align-items: stretch; gap: 6px; }
  .mb-card-footer .mb-btn-group { justify-content: center; }
}
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkRow() {
  return (
    <tr>
      {[40,80,100,90,70,50,60,70,80].map((w,i) => (
        <td key={i}>
          <span className="mb-td">
            <div className="sk" style={{height:12,width:`${w}%`}}/>
          </span>
        </td>
      ))}
    </tr>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ManageBookings() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { bookings, isLoading, error } = useSelector((s) => s.bookings);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [viewSeatsModal, setViewSeatsModal] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);

  // ✅ Fetch ALL bookings
  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  // ── Stats ──
  const confirmed = useMemo(() => bookings?.filter(b => b.status === "CONFIRMED") || [], [bookings]);
  const cancelled = useMemo(() => bookings?.filter(b => b.status === "CANCELLED") || [], [bookings]);
  const revenue = useMemo(() => confirmed.reduce((s, b) => s + (b.totalPrice || 0), 0), [confirmed]);

  // ── Filter ──
  const filtered = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (status !== "All" && b.status !== status) return false;
      if (dateFilter && !b.bookedAt?.startsWith(dateFilter)) return false;
      if (q && !(
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.show?.movie?.title?.toLowerCase().includes(q) ||
        String(b.id).includes(q)
      )) return false;
      return true;
    });
  }, [bookings, search, status, dateFilter]);

  // ── Handlers ──
  const handleViewDetails = (booking) => setSelectedBooking(booking);
  const handleCancel = (booking) => setToCancel(booking);

  // ✅ View Seats Handler
  const handleViewSeats = async (showId) => {
    setSeatsLoading(true);
    setViewSeatsModal(showId);
    try {
      const result = await dispatch(fetchAvailableSeats(showId)).unwrap();
      setAvailableSeats(result || []);
    } catch (err) {
      console.error("Failed to fetch seats:", err);
      setAvailableSeats([]);
    }
    setSeatsLoading(false);
  };

  const confirmCancel = async () => {
    if (!toCancel) return;
    setCancelling(true);
    await dispatch(cancelBooking(toCancel.id));
    setCancelling(false);
    setToCancel(null);
    setSelectedBooking(null);
    dispatch(fetchAllBookings());
  };

  const clearFilters = () => { setSearch(""); setStatus("All"); setDateFilter(""); };
  const hasFilters = search || status !== "All" || dateFilter;

  if (isLoading && bookings?.length === 0) {
    return <LoadingSpinner variant="fullscreen" text="Loading Bookings..." />;
  }

  // ── Render Sidebar ──
  const renderSidebar = (booking) => {
    const { show = {}, seats = [], user: bookingUser, totalPrice, bookedAt, status: bookingStatus } = booking;
    const { movie = {}, screen = {}, showDate, startTime, endTime, ticketPrice } = show;
    const theater = screen?.theater || {};
    const isConf = bookingStatus === "CONFIRMED";
    const ref = genRef(booking.id, bookedAt);

    return (
      <div className="mb-sidebar-body">
        {/* Movie Info */}
        <div className="mb-sidebar-movie-info">
          {movie.posterUrl ? (
            <img className="mb-sidebar-poster" src={movie.posterUrl} alt={movie.title} />
          ) : (
            <div style={{ width: 48, height: 68, background: "#1a1a24", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 18 }}>🎬</div>
          )}
          <div>
            <div className="mb-sidebar-movie-title">{movie.title || "—"}</div>
            <div className="mb-sidebar-movie-meta">
              {movie.genre || ""}{movie.language ? ` · ${movie.language}` : ""}
            </div>
            <span className={`mb-badge ${isConf ? "confirmed" : "cancelled"}`}>
              {isConf ? <FaCheckCircle size={9} /> : <FaTimesCircle size={9} />}
              {bookingStatus || "CONFIRMED"}
            </span>
          </div>
        </div>

        {/* User */}
        <div className="mb-sidebar-section">
          <div className="mb-sidebar-label"><MdPerson size={11} /> User</div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Name</span><span className="mb-sidebar-val">{bookingUser?.name || "—"}</span></div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Email</span><span className="mb-sidebar-val" style={{ fontSize: 11 }}>{bookingUser?.email || "—"}</span></div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Phone</span><span className="mb-sidebar-val">{bookingUser?.phone || "—"}</span></div>
        </div>

        {/* Venue */}
        <div className="mb-sidebar-section">
          <div className="mb-sidebar-label"><MdTheaters size={11} /> Venue</div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Theater</span><span className="mb-sidebar-val">{theater.name || "—"}</span></div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Screen</span><span className="mb-sidebar-val">{screen.name || "—"}</span></div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Date</span><span className="mb-sidebar-val mono">{fmtDateOnly(showDate)}</span></div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Time</span><span className="mb-sidebar-val mono">{fmt12(startTime)}{endTime ? ` – ${fmt12(endTime)}` : ""}</span></div>
        </div>

        {/* Seats */}
        <div className="mb-sidebar-section">
          <div className="mb-sidebar-label"><MdEventSeat size={11} /> Seats ({seats?.length || 0})</div>
          <div className="mb-sidebar-seats">
            {seats?.map(s => (
              <span key={s.id} className={`mb-sidebar-seat${s.seatType === "VIP" ? " vip" : ""}`}>
                {s.seatNumber}{s.seatType === "VIP" ? " 👑" : ""}
              </span>
            )) || <span style={{ color: "#555" }}>No seats</span>}
          </div>
        </div>

        {/* Booking */}
        <div className="mb-sidebar-section">
          <div className="mb-sidebar-label"><MdConfirmationNumber size={11} /> Booking</div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Reference</span><span className="mb-sidebar-val mono amber">#{ref}</span></div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Booked At</span><span className="mb-sidebar-val" style={{ fontSize: 11 }}>{fmtDateTime(bookedAt)}</span></div>
          <div className="mb-sidebar-row"><span className="mb-sidebar-key">Total</span><span className="mb-sidebar-val green" style={{ fontSize: 16, fontWeight: 700 }}>{fmtPrice(totalPrice)}</span></div>
        </div>

        {isConf && (
          <button className="mb-sidebar-cancel-btn" onClick={() => handleCancel(booking)} disabled={cancelling}>
            <MdCancel size={18} /> {cancelling ? "Cancelling..." : "Cancel this booking"}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="mb-root">

        {/* ── HEADER ── */}
        <div className="mb-hdr mb-a1">
          <div>
            <div className="mb-eyebrow">Admin · Bookings</div>
            <h1 className="mb-title">All <span>Bookings</span></h1>
            <p className="mb-sub">
              {isLoading ? "Loading bookings…" : `${bookings?.length || 0} total · ${confirmed.length} confirmed · ${cancelled.length} cancelled`}
            </p>
            <div className="mb-divider" />
          </div>
          <div className="mb-hdr-actions">
            <button className="mb-refresh-btn" onClick={() => dispatch(fetchAllBookings())}>
              <MdRefresh size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="mb-stats mb-a2">
          <div className="mb-stat">
            <div className="mb-stat-icon gold"><FaTicketAlt size={18} /></div>
            <div className="mb-stat-val">{bookings?.length || 0}</div>
            <div className="mb-stat-lbl">Total</div>
          </div>
          <div className="mb-stat">
            <div className="mb-stat-icon green"><FaCheckCircle size={18} /></div>
            <div className="mb-stat-val">{confirmed.length}</div>
            <div className="mb-stat-lbl">Confirmed</div>
          </div>
          <div className="mb-stat">
            <div className="mb-stat-icon red"><FaTimesCircle size={18} /></div>
            <div className="mb-stat-val">{cancelled.length}</div>
            <div className="mb-stat-lbl">Cancelled</div>
          </div>
          <div className="mb-stat">
            <div className="mb-stat-icon blue"><MdAttachMoney size={22} /></div>
            <div className="mb-stat-val">{fmtPrice(revenue)}</div>
            <div className="mb-stat-lbl">Revenue</div>
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div className="mb-filters mb-a3">
          <div className="mb-search">
            <MdSearch size={17} color="#2a2a38" />
            <input type="text" placeholder="Search user, movie, or booking ID…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="mb-search-clear" onClick={() => setSearch("")}><MdClose size={14} /></button>}
          </div>
          <select className="mb-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="All">All status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <input type="date" className="mb-date-input" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          {hasFilters && (
            <button className="mb-clear-btn" onClick={clearFilters}>
              <MdClose size={13} /> Clear
            </button>
          )}
          <div className="mb-count"><b>{filtered?.length || 0}</b> / {bookings?.length || 0}</div>
        </div>

        {/* ── TABLE ── */}
        <div className="mb-table-wrap mb-a4">
          <table className="mb-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Movie</th>
                <th>User</th>
                <th>Theater</th>
                <th>Date</th>
                <th style={{ textAlign: "center" }}>Seats</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && bookings?.length === 0 ? (
                Array.from({ length: 5 }, (_, i) => <SkRow key={i} />)
              ) : filtered?.length === 0 ? (
                <tr><td colSpan="9">
                  <div className="mb-empty">
                    <div className="mb-empty-icon">🎟️</div>
                    <div className="mb-empty-title">No bookings found</div>
                    <p className="mb-empty-sub">{hasFilters ? "Try adjusting your filters." : "No bookings in the system yet."}</p>
                    {hasFilters && <button className="mb-clear-btn" onClick={clearFilters}>Clear filters</button>}
                  </div>
                </td></tr>
              ) : (
                filtered.map((b) => {
                  const isConf = b.status === "CONFIRMED";
                  const movie = b.show?.movie || {};
                  const theater = b.show?.screen?.theater || {};
                  const seats = b.seats || [];
                  const showId = b.show?.id;
                  return (
                    <tr key={b.id}>
                      <td><span className="mb-td" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#2a2a38" }}>#{b.id}</span></td>
                      <td>
                        <span className="mb-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {movie.posterUrl ? (
                              <img src={movie.posterUrl} alt="" style={{ width: 24, height: 34, borderRadius: 4, objectFit: "cover", border: "1px solid #1e1e28" }} />
                            ) : <div style={{ width: 24, height: 34, borderRadius: 4, background: "#1a1a24", border: "1px solid #1e1e28", display: "flex", alignItems: "center", justifyContent: "center", color: "#2a2a38", fontSize: 12 }}>🎬</div>}
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#F0EDE8" }}>{movie.title || "—"}</div>
                              <div style={{ fontSize: 10, color: "#444" }}>{movie.language || ""}</div>
                            </div>
                          </div>
                        </span>
                      </td>
                      <td>
                        <span className="mb-td">
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#F0EDE8" }}>{b.user?.name || "—"}</div>
                          <div style={{ fontSize: 10, color: "#444" }}>{b.user?.email || ""}</div>
                        </span>
                      </td>
                      <td>
                        <span className="mb-td">
                          <div style={{ fontSize: 12, color: "#888" }}>{theater.name || "—"}</div>
                          <div style={{ fontSize: 10, color: "#444" }}>{b.show?.screen?.name || ""}</div>
                        </span>
                      </td>
                      <td><span className="mb-td" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>{fmtDateOnly(b.show?.showDate)}</span></td>
                      <td style={{ textAlign: "center" }}>
                        <span className="mb-td" style={{ display: "flex", justifyContent: "center" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                            {seats.map(s => (
                              <span key={s.id} className={`mb-seat${s.seatType === "VIP" ? " vip" : ""}`}>
                                {s.seatNumber}
                              </span>
                            ))}
                            {seats.length === 0 && <span style={{ color: "#555", fontSize: 10 }}>—</span>}
                          </div>
                        </span>
                      </td>
                      <td><span className="mb-td" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#10B981" }}>{fmtPrice(b.totalPrice)}</span></td>
                      <td>
                        <span className="mb-td">
                          <span className={`mb-badge ${isConf ? "confirmed" : "cancelled"}`}>
                            {isConf ? <FaCheckCircle size={8} /> : <FaTimesCircle size={8} />}
                            {b.status}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="mb-td">
                          <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <button
                              onClick={() => handleViewDetails(b)}
                              style={{ background: "transparent", border: "1px solid #1a1a24", borderRadius: 5, color: "#555", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, transition: "border-color .15s,color .15s" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,166,35,.4)"; e.currentTarget.style.color = "#F5A623"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a24"; e.currentTarget.style.color = "#555"; }}
                            >
                              <MdChevronRight size={14} /> Details
                            </button>
                            {isConf && (
                              <button
                                onClick={() => handleCancel(b)}
                                style={{ background: "transparent", border: "1px solid rgba(239,68,68,.25)", borderRadius: 5, color: "#EF4444", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, transition: "border-color .15s,background .15s" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,.5)"; e.currentTarget.style.background = "rgba(239,68,68,.06)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,.25)"; e.currentTarget.style.background = "transparent"; }}
                              >
                                <MdCancel size={13} /> Cancel
                              </button>
                            )}
                            {showId && (
                              <button
                                onClick={() => handleViewSeats(showId)}
                                style={{ background: "transparent", border: "1px solid rgba(59,130,246,.25)", borderRadius: 5, color: "#3B82F6", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, transition: "border-color .15s,background .15s" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,.5)"; e.currentTarget.style.background = "rgba(59,130,246,.06)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,.25)"; e.currentTarget.style.background = "transparent"; }}
                              >
                                <MdEventSeat size={13} />
                              </button>
                            )}
                          </div>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="mb-cards">
          {filtered?.length === 0 ? (
            <div className="mb-empty">
              <div className="mb-empty-icon">🎟️</div>
              <div className="mb-empty-title">No bookings found</div>
              <p className="mb-empty-sub">{hasFilters ? "Adjust filters to see results." : "No bookings yet."}</p>
              {hasFilters && <button className="mb-clear-btn" onClick={clearFilters}>Clear filters</button>}
            </div>
          ) : (
            filtered.map((b, i) => {
              const isConf = b.status === "CONFIRMED";
              const movie = b.show?.movie || {};
              const theater = b.show?.screen?.theater || {};
              const seats = b.seats || [];
              const showId = b.show?.id;
              return (
                <div key={b.id} className="mb-card" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="mb-card-inner">
                    <div className={`mb-spine ${isConf ? "confirmed" : "cancelled"}`} />
                    <div className="mb-card-body">
                      <div className="mb-card-top">
                        <div className="mb-card-movie">{movie.title || "—"}</div>
                        <span className={`mb-badge ${isConf ? "confirmed" : "cancelled"}`}>
                          {isConf ? <FaCheckCircle size={8} /> : <FaTimesCircle size={8} />}
                          {b.status || "CONFIRMED"}
                        </span>
                      </div>
                      <div className="mb-card-meta">
                        <div className="mb-card-meta-item"><span className="mb-card-meta-label">Theater</span><span className="mb-card-meta-val">{theater.name || "—"}</span></div>
                        <div className="mb-card-meta-item"><span className="mb-card-meta-label">Screen</span><span className="mb-card-meta-val">{b.show?.screen?.name || "—"}</span></div>
                        <div className="mb-card-meta-item"><span className="mb-card-meta-label">Date</span><span className="mb-card-meta-val">{fmtDateOnly(b.show?.showDate)}</span></div>
                        <div className="mb-card-meta-item"><span className="mb-card-meta-label">Time</span><span className="mb-card-meta-val">{fmt12(b.show?.startTime)}</span></div>
                        <div className="mb-card-meta-item"><span className="mb-card-meta-label">Seats</span><span className="mb-card-meta-val">{seats.map(s => s.seatNumber).join(", ") || "—"}</span></div>
                      </div>
                      {showId && (
                        <button
                          onClick={() => handleViewSeats(showId)}
                          style={{ marginTop: 8, background: "transparent", border: "1px solid rgba(59,130,246,.25)", borderRadius: 5, color: "#3B82F6", padding: "4px 10px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600 }}
                        >
                          <MdEventSeat size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mb-card-footer">
                    <span className="mb-card-ref">#{genRef(b.id, b.bookedAt)}</span>
                    <span className="mb-card-price">{fmtPrice(b.totalPrice)}</span>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleViewDetails(b)}
                        style={{ background: "transparent", border: "1px solid #1a1a24", borderRadius: 5, color: "#555", padding: "4px 8px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600 }}
                      >
                        <MdChevronRight size={13} /> Details
                      </button>
                      {isConf && (
                        <button onClick={() => handleCancel(b)} style={{ background: "transparent", border: "1px solid rgba(239,68,68,.25)", borderRadius: 5, color: "#EF4444", padding: "4px 8px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600 }}><MdCancel size={13} /> Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER ── */}
        {!isLoading && bookings?.length > 0 && (
          <div className="mb-footer">
            <span className="mb-footer-stat">Showing <b>{filtered?.length || 0}</b> of <b>{bookings?.length || 0}</b> bookings</span>
            <span className="mb-footer-stat">Revenue <b>{fmtPrice(revenue)}</b></span>
          </div>
        )}

      </div>

      {/* ── DETAILS SIDEBAR ── */}
      {selectedBooking && (
        <>
          <div className="mb-sidebar-overlay" onClick={() => setSelectedBooking(null)} />
          <div className="mb-sidebar">
            <div className="mb-sidebar-header">
              <span className="mb-sidebar-title">Booking Details</span>
              <button className="mb-sidebar-close" onClick={() => setSelectedBooking(null)}>
                <MdClose size={18} /> Close
              </button>
            </div>
            {renderSidebar(selectedBooking)}
          </div>
        </>
      )}

      {/* ── CANCEL MODAL ── */}
      {toCancel && (
        <div className="mb-modal-bg" onClick={() => !cancelling && setToCancel(null)}>
          <div className="mb-modal" onClick={e => e.stopPropagation()}>
            <div className="mb-modal-top">
              <div className="mb-modal-warn"><MdWarning size={22} /></div>
              <div>
                <div className="mb-modal-title">Cancel booking?</div>
                <div className="mb-modal-sub">This action cannot be undone.</div>
              </div>
            </div>
            <div className="mb-modal-detail">
              <div className="mb-modal-drow"><span className="mb-modal-dkey">Movie</span><span className="mb-modal-dval">{toCancel.show?.movie?.title}</span></div>
              <div className="mb-modal-drow"><span className="mb-modal-dkey">User</span><span className="mb-modal-dval">{toCancel.user?.name}</span></div>
              <div className="mb-modal-drow"><span className="mb-modal-dkey">Amount</span><span className="mb-modal-dval" style={{ color: "#EF4444" }}>{fmtPrice(toCancel.totalPrice)}</span></div>
            </div>
            <div className="mb-modal-btns">
              <button className="mb-modal-keep" onClick={() => setToCancel(null)} disabled={cancelling}>Keep booking</button>
              <button className="mb-modal-yes" onClick={confirmCancel} disabled={cancelling}>{cancelling ? "Cancelling…" : "Yes, cancel"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW SEATS MODAL ── */}
      {viewSeatsModal && (
        <div className="mb-modal-bg" onClick={() => { setViewSeatsModal(null); setAvailableSeats([]); }}>
          <div className="mb-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="mb-modal-top">
              <div className="mb-modal-warn" style={{ background: "rgba(59,130,246,.1)", borderColor: "rgba(59,130,246,.2)", color: "#3B82F6" }}>
                <MdEventSeat size={22} />
              </div>
              <div>
                <div className="mb-modal-title">Available Seats</div>
                <div className="mb-modal-sub">Seat availability for this show</div>
              </div>
              <button
                onClick={() => { setViewSeatsModal(null); setAvailableSeats([]); }}
                style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", padding: "4px" }}
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="mb-modal-detail">
              {seatsLoading ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#555" }}>Loading seats...</div>
              ) : availableSeats.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#555" }}>No seats available</div>
              ) : (
                <>
                  <div className="mb-seats-modal-grid">
                    {availableSeats.map((seat) => {
                      const isAvailable = seat.status === "AVAILABLE";
                      const isVip = seat.seatType === "VIP";
                      return (
                        <div
                          key={seat.id}
                          className={`mb-seats-modal-item ${isAvailable ? "available" : "booked"} ${isVip ? "vip" : ""}`}
                        >
                          <span className="seat-num">{seat.seatNumber}</span>
                          <span className="seat-type">{seat.seatType}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-seats-legend">
                    <div className="mb-seats-legend-item">
                      <span className="mb-seats-legend-dot available" /> Available
                    </div>
                    <div className="mb-seats-legend-item">
                      <span className="mb-seats-legend-dot booked" /> Booked
                    </div>
                    <div className="mb-seats-legend-item">
                      <span className="mb-seats-legend-dot vip" /> VIP
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mb-modal-btns">
              <button
                className="mb-modal-keep"
                onClick={() => { setViewSeatsModal(null); setAvailableSeats([]); }}
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
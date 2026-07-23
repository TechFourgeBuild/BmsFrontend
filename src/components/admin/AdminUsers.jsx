import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';
import { MdSearch, MdClose, MdRefresh, MdWarning, MdPerson, MdEmail,
         MdPhone, MdCalendarMonth, MdBadge, MdAdminPanelSettings,
         MdVisibility, MdEdit, MdDelete, MdSave, MdCancel } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
};
const fmtDateShort = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};
const getInitials = (name) => {
  if (!name) return "U";
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
};
const genAccountRef = (id) => `#${String(id).padStart(6, "0")}`;

// Deterministic avatar color from name
const AVATAR_PALETTES = [
  { bg: "rgba(245,166,35,.14)",  border: "rgba(245,166,35,.3)",  color: "#F5A623" },
  { bg: "rgba(139,92,246,.14)",  border: "rgba(139,92,246,.3)",  color: "#8B5CF6" },
  { bg: "rgba(16,185,129,.14)",  border: "rgba(16,185,129,.3)",  color: "#10B981" },
  { bg: "rgba(59,130,246,.14)",  border: "rgba(59,130,246,.3)",  color: "#3B82F6" },
  { bg: "rgba(232,67,147,.14)",  border: "rgba(232,67,147,.3)",  color: "#E84393" },
  { bg: "rgba(6,182,212,.14)",   border: "rgba(6,182,212,.3)",   color: "#06B6D4" },
];
const getPalette = (name) =>
  AVATAR_PALETTES[(name?.charCodeAt(0) || 0) % AVATAR_PALETTES.length];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.au-root{
  min-height:100vh;
  background:#09090E;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
}

@keyframes fadeUp   { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
@keyframes fadeIn   { from{opacity:0;}to{opacity:1;} }
@keyframes panelIn  { from{opacity:0;transform:translateX(100%);}to{opacity:1;transform:translateX(0);} }
@keyframes shimmer  { 0%{background-position:-600px 0;}100%{background-position:600px 0;} }

.au-a1{animation:fadeUp .45s ease .00s both;}
.au-a2{animation:fadeUp .45s ease .07s both;}
.au-a3{animation:fadeUp .45s ease .14s both;}

@media(prefers-reduced-motion:reduce){
  .au-a1,.au-a2,.au-a3{animation:none;opacity:1;}
  .au-row{transition:none!important;}
}

/* ── Page header ── */
.au-hdr{
  display:flex;align-items:flex-end;
  justify-content:space-between;gap:16px;
  margin-bottom:clamp(24px,4vw,40px);
  flex-wrap:wrap;
}
.au-eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;
  letter-spacing:.2em;color:#F5A623;
  text-transform:uppercase;margin-bottom:8px;
}
.au-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(26px,3.5vw,40px);
  font-weight:800;letter-spacing:-.022em;
  color:#F0EDE8;line-height:1.04;
}
.au-title span{color:#F5A623;}
.au-sub{font-size:13px;color:#444;margin-top:5px;}
.au-divider{
  height:1px;
  background:linear-gradient(90deg,#F5A623,transparent 35%);
  margin-top:20px;
}
.au-hdr-right{display:flex;gap:8px;align-items:center;flex-shrink:0;}
.au-count{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;font-weight:700;
  color:#F5A623;
  background:rgba(245,166,35,.08);
  border:1px solid rgba(245,166,35,.15);
  border-radius:100px;padding:5px 14px;
  white-space:nowrap;
}
.au-refresh{
  display:flex;align-items:center;gap:6px;
  background:transparent;border:1px solid #1a1a24;border-radius:10px;
  color:#555;font-family:'Inter',sans-serif;
  font-size:13px;font-weight:600;
  padding:9px 16px;cursor:pointer;
  transition:border-color .15s,color .15s;white-space:nowrap;
}
.au-refresh:hover{border-color:rgba(245,166,35,.4);color:#F5A623;}

/* ── Search ── */
.au-search-wrap{
  display:flex;align-items:center;
  background:#111116;border:1px solid #1a1a24;border-radius:10px;
  padding:0 14px;height:44px;gap:9px;
  max-width:400px;width:100%;
  transition:border-color .2s;
  margin-bottom:clamp(16px,2.5vw,24px);
}
.au-search-wrap:focus-within{border-color:rgba(245,166,35,.45);}
.au-search-wrap input{
  flex:1;background:transparent;border:none;outline:none;
  color:#F0EDE8;font-family:'Inter',sans-serif;font-size:14px;
}
.au-search-wrap input::placeholder{color:#2a2a38;}
.au-search-clear{
  background:none;border:none;cursor:pointer;
  color:#444;padding:0;display:flex;align-items:center;
  transition:color .15s;
}
.au-search-clear:hover{color:#F5A623;}

/* ── Table ── */
.au-table-wrap{
  background:#111116;border:1px solid #18181f;
  border-radius:14px;overflow:hidden;overflow-x:auto;
}
.au-table{width:100%;border-collapse:collapse;}
.au-table th{
  text-align:left;padding:14px 18px;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;letter-spacing:.18em;
  color:#252535;text-transform:uppercase;
  border-bottom:1px solid #13131a;white-space:nowrap;
  background:#0d0d12;
}
.au-table td{
  padding:12px 18px;
  border-bottom:1px solid #0d0d12;
  font-size:13px;vertical-align:middle;
}
.au-row:last-child td{border-bottom:none;}
.au-row{transition:background .15s;}
.au-row:hover td{background:rgba(255,255,255,.02);}

/* Avatar */
.au-avatar{
  width:36px;height:36px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;
  font-size:13px;font-weight:800;
  flex-shrink:0;
}
.au-user-cell{display:flex;align-items:center;gap:11px;}
.au-user-name{font-size:14px;font-weight:600;color:#F0EDE8;}
.au-user-id{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:600;color:#2a2a38;
  margin-top:2px;
}

/* Role badge */
.au-role{
  display:inline-flex;align-items:center;gap:5px;
  font-size:10px;font-weight:700;
  padding:4px 11px;border-radius:100px;
  text-transform:uppercase;letter-spacing:.06em;
  white-space:nowrap;
}
.au-role.admin{background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);color:#F5A623;}
.au-role.user {background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.15);color:#10B981;}

/* Action buttons */
.au-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
.au-btn{
  display:flex;align-items:center;gap:4px;
  background:transparent;border:1px solid #1a1a24;border-radius:7px;
  color:#555;font-family:'Inter',sans-serif;
  font-size:11px;font-weight:600;
  padding:6px 11px;cursor:pointer;
  transition:border-color .15s,color .15s,background .15s;
  white-space:nowrap;
}
.au-btn:hover{border-color:rgba(245,166,35,.35);color:#F5A623;}
.au-btn.danger:hover{border-color:rgba(239,68,68,.35);color:#EF4444;background:rgba(239,68,68,.04);}
.au-btn:disabled{opacity:.3;cursor:not-allowed;}
.au-btn.view{border-color:rgba(245,166,35,.18);color:#888;}
.au-btn.view:hover{border-color:rgba(245,166,35,.5);color:#F5A623;}

/* ── Skeleton ── */
.sk{
  background:linear-gradient(90deg,#141418 25%,#1e1e26 50%,#141418 75%);
  background-size:600px 100%;animation:shimmer 1.4s infinite linear;border-radius:6px;
}

/* ── Error / empty ── */
.au-error{
  display:flex;align-items:center;gap:10px;
  background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);
  border-radius:10px;padding:13px 16px;
  color:#EF4444;font-size:13px;margin-bottom:16px;
}
.au-empty{
  display:flex;flex-direction:column;align-items:center;
  text-align:center;padding:clamp(48px,8vw,72px) 24px;gap:10px;
}
.au-empty-icon{font-size:36px;opacity:.3;}
.au-empty-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#F0EDE8;}
.au-empty-sub{font-size:13px;color:#444;max-width:260px;line-height:1.6;}

/* ── Footer ── */
.au-footer{
  display:flex;justify-content:space-between;align-items:center;
  margin-top:14px;flex-wrap:wrap;gap:8px;
}
.au-footer-stat{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;font-weight:600;color:#2a2a38;
}
.au-footer-stat b{color:#F5A623;}

/* ════════════════════════════════════════════════════
   SLIDE PANEL — Base styles (shared)
════════════════════════════════════════════════════ */
.au-panel-bg{
  position:fixed;inset:0;z-index:500;
  background:rgba(0,0,0,.65);backdrop-filter:blur(8px);
  animation:fadeIn .2s ease both;
}
.au-panel{
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  height:100vh;  /* ✅ Full viewport height */
  width:min(420px,100%);
  background:#0a0a10;
  border-left:1px solid #18181f;
  z-index:501;
  display:flex;
  flex-direction:column;
  overflow:hidden;  /* ✅ Prevent outer scrolling */
  animation:panelIn .32s cubic-bezier(.22,.68,0,1.2) both;
  box-shadow:-32px 0 80px rgba(0,0,0,.7);
}

/* ID card header - fixed at top */
.au-panel-card{
  position:relative;
  padding:28px 24px 20px;
  border-bottom:1px solid #13131a;
  overflow:hidden;
  flex-shrink:0;  /* ✅ Don't shrink header */
}
.au-panel-card::after{
  content:'';
  position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,#F5A623,transparent 60%);
}
.au-panel-card-inner{position:relative;z-index:1;}
.au-panel-avatar{
  width:64px;height:64px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;
  font-size:24px;font-weight:800;
  margin-bottom:14px;
}
.au-panel-name{
  font-family:'Syne',sans-serif;
  font-size:clamp(20px,3vw,24px);
  font-weight:800;
  color:#F0EDE8;letter-spacing:-.02em;
  line-height:1.08;margin-bottom:4px;
}
.au-panel-account{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;font-weight:700;
  color:#F5A623;letter-spacing:.08em;
  margin-bottom:8px;
}
.au-panel-meta-row{
  display:flex;align-items:center;gap:8px;flex-wrap:wrap;
}

.au-panel-close{
  position:absolute;top:14px;right:14px;
  background:rgba(255,255,255,.05);
  border:1px solid #1a1a24;border-radius:8px;
  color:#555;padding:6px;cursor:pointer;
  display:flex;align-items:center;
  transition:border-color .15s,color .15s;z-index:2;
}
.au-panel-close:hover{border-color:#EF4444;color:#EF4444;}

/* ── Panel body — SCROLLABLE ── */
.au-panel-body{
  flex:1;                /* ✅ Take remaining space */
  overflow-y:auto;       /* ✅ Enable vertical scroll */
  overflow-x:hidden;     /* ✅ Prevent horizontal scroll */
  padding:16px 20px;
  display:flex;
  flex-direction:column;
  gap:12px;
  scrollbar-width:thin;
  scrollbar-color:#1a1a24 transparent;
  min-height:0;          /* ✅ Important for flex scrolling */
}
.au-panel-body::-webkit-scrollbar{width:3px;}
.au-panel-body::-webkit-scrollbar-thumb{background:#1a1a24;border-radius:2px;}

/* Detail sections */
.au-ds{
  background:#111116;border:1px solid #13131a;border-radius:12px;overflow:hidden;
  flex-shrink:0;  /* ✅ Prevent sections from shrinking */
}
.au-ds-hdr{
  display:flex;align-items:center;gap:8px;
  padding:10px 14px;border-bottom:1px solid #0d0d12;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;letter-spacing:.18em;
  color:#2a2a38;text-transform:uppercase;
}
.au-ds-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:10px 14px;border-bottom:1px solid #09090e;gap:10px;
}
.au-ds-row:last-child{border-bottom:none;}
.au-ds-key{font-size:12px;color:#444;flex-shrink:0;display:flex;align-items:center;gap:5px;}
.au-ds-val{
  font-size:13px;font-weight:600;color:#ccc;
  text-align:right;
  word-break:break-word;
  max-width:65%;  /* ✅ Prevent long text from overflowing */
}
.au-ds-val.mono{font-family:'JetBrains Mono',monospace;font-size:11px;}
.au-ds-val.amber{color:#F5A623;}
.au-ds-val.green{color:#10B981;}
.au-ds-val.muted{color:#444;font-size:11px;}

/* ── Edit Panel specific ── */
.au-edit-field{display:flex;flex-direction:column;gap:4px;}
.au-edit-field label{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;letter-spacing:.12em;
  color:#2a2a38;text-transform:uppercase;
}
.au-edit-field input, .au-edit-field select{
  background:#0d0d12;border:1px solid #1a1a24;border-radius:8px;
  padding:10px 12px;color:#F0EDE8;font-family:'Inter',sans-serif;
  font-size:13px;outline:none;transition:border-color .2s;
}
.au-edit-field input:focus, .au-edit-field select:focus{
  border-color:rgba(245,166,35,.5);
}
.au-edit-field input::placeholder{color:#2a2a38;}

/* Panel footer - fixed at bottom */
.au-panel-footer{
  padding:12px 20px 16px;
  border-top:1px solid #13131a;
  display:flex;
  gap:10px;
  flex-shrink:0;      /* ✅ Don't shrink footer */
  flex-wrap:wrap;
}
.au-panel-footer-btn{
  flex:1;min-width:100px;
  display:flex;align-items:center;justify-content:center;gap:7px;
  border:none;border-radius:10px;
  font-family:'Inter',sans-serif;font-weight:700;font-size:13px;
  padding:12px 16px;cursor:pointer;
  transition:background .15s,transform .1s;
}
.au-panel-footer-btn:active{transform:scale(.97);}
.au-panel-footer-btn.primary{background:#F5A623;color:#09090E;}
.au-panel-footer-btn.primary:hover{background:#E09920;}
.au-panel-footer-btn.ghost{
  background:transparent;border:1px solid #1a1a24;color:#888;
}
.au-panel-footer-btn.ghost:hover{border-color:rgba(245,166,35,.35);color:#F5A623;}
.au-panel-footer-btn.danger{
  background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#EF4444;
}
.au-panel-footer-btn.danger:hover{background:rgba(239,68,68,.18);}
.au-panel-footer-btn:disabled{opacity:.4;cursor:not-allowed;}

/* ── Delete modal ── */
@keyframes modalIn{from{opacity:0;transform:scale(.94)translateY(10px);}to{opacity:1;transform:scale(1)translateY(0);}}
.au-modal-bg{
  position:fixed;inset:0;background:rgba(0,0,0,.75);
  backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;
  z-index:1000;padding:20px;animation:fadeIn .2s ease both;
}
.au-modal{
  background:#0d0d14;border:1px solid #1a1a24;border-radius:16px;
  max-width:400px;width:100%;
  box-shadow:0 28px 70px rgba(0,0,0,.7);overflow:hidden;
  animation:modalIn .3s cubic-bezier(.22,.68,0,1.2) both;
}
.au-modal-top{
  display:flex;align-items:center;gap:14px;
  padding:20px 20px 16px;border-bottom:1px solid #13131a;
}
.au-modal-icon{
  width:40px;height:40px;border-radius:12px;
  background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);
  display:flex;align-items:center;justify-content:center;
  color:#EF4444;flex-shrink:0;
}
.au-modal-title{
  font-family:'Syne',sans-serif;
  font-size:16px;font-weight:800;color:#F0EDE8;letter-spacing:-.01em;
}
.au-modal-sub{font-size:12px;color:#555;margin-top:3px;line-height:1.5;}
.au-modal-body{padding:14px 20px;font-size:13px;color:#666;line-height:1.65;}
.au-modal-btns{
  display:flex;gap:10px;padding:14px 20px 20px;border-top:1px solid #13131a;
}
.au-modal-keep{
  flex:1;padding:11px;border-radius:10px;
  background:#1a1a24;border:none;color:#888;
  font-family:'Inter',sans-serif;font-weight:700;font-size:14px;cursor:pointer;
  transition:background .15s;
}
.au-modal-keep:hover{background:#222232;}
.au-modal-del{
  flex:1;padding:11px;border-radius:10px;
  background:#EF4444;border:none;color:#fff;
  font-family:'Inter',sans-serif;font-weight:700;font-size:14px;cursor:pointer;
  transition:background .15s,transform .1s;
}
.au-modal-del:hover{background:#DC2626;}
.au-modal-del:active{transform:scale(.97);}
.au-modal-del:disabled{opacity:.45;cursor:not-allowed;}

/* ── Responsive Fixes ── */
/* Mobile: table columns hide */
@media(max-width:768px){
  .au-panel{
    width:100%;
    border-left:none;
    border-radius:0;
    animation:fadeIn .25s ease both;
  }
  .au-panel-card{padding:20px 16px 16px;}
  .au-panel-body{padding:12px 14px;}
  .au-panel-footer{padding:10px 14px 14px;flex-direction:column;}
  .au-panel-footer-btn{min-width:auto;width:100%;}

  .au-actions{flex-wrap:wrap;}
  .au-btn{font-size:10px;padding:4px 8px;}
  .au-table th,.au-table td{padding:8px 10px;font-size:12px;}
  .au-user-name{font-size:13px;}
  .au-avatar{width:30px;height:30px;font-size:11px;}

  .au-table th:nth-child(3), .au-table td:nth-child(3) { display:none; } /* Phone */
  .au-table th:nth-child(4), .au-table td:nth-child(4) { display:none; } /* Role */
}

@media(max-width:480px){
  .au-hdr{flex-direction:column;align-items:stretch;}
  .au-hdr-right{justify-content:space-between;flex-wrap:wrap;}
  .au-count{font-size:11px;padding:4px 10px;}
  .au-refresh{font-size:12px;padding:7px 12px;}
  .au-search-wrap{height:38px;padding:0 10px;}
  .au-search-wrap input{font-size:13px;}
  .au-table th,.au-table td{padding:6px 8px;font-size:11px;}
  .au-user-cell{gap:8px;}
  .au-user-name{font-size:12px;}
  .au-avatar{width:26px;height:26px;font-size:10px;border-radius:8px;}
  .au-role{font-size:9px;padding:3px 8px;}
  .au-btn{font-size:9px;padding:3px 6px;border-radius:5px;}
  .au-btn span{display:none;}
  .au-btn::after{content:'';}
  .au-panel-card{padding:16px 12px 12px;}
  .au-panel-avatar{width:48px;height:48px;font-size:18px;border-radius:12px;margin-bottom:10px;}
  .au-panel-name{font-size:18px;}
  .au-panel-account{font-size:10px;}
  .au-panel-body{padding:10px 12px;gap:10px;}
  .au-ds-row{padding:8px 12px;}
  .au-ds-key{font-size:11px;}
  .au-ds-val{font-size:12px;}
  .au-panel-footer-btn{font-size:12px;padding:10px;}
}

@media(max-width:400px){
  .au-table th:nth-child(2), .au-table td:nth-child(2) { display:none; } /* Email */
  .au-table th:nth-child(5), .au-table td:nth-child(5) { display:none; } /* Joined */
  .au-user-id{display:none;}
}

/* ── EXTRA SMALL SCREENS (360px and below) ── */
@media(max-width:360px){
  .au-panel {
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 0 !important;
  }
  .au-panel-card {
    padding: 14px 12px 12px !important;
  }
  .au-panel-avatar {
    width: 40px !important;
    height: 40px !important;
    font-size: 16px !important;
    border-radius: 10px !important;
    margin-bottom: 8px !important;
  }
  .au-panel-name {
    font-size: 16px !important;
  }
  .au-panel-account {
    font-size: 9px !important;
  }
  .au-panel-body {
    padding: 8px 10px !important;
    gap: 8px !important;
  }
  .au-panel-close {
    top: 10px !important;
    right: 10px !important;
    padding: 4px !important;
  }
  .au-panel-close svg {
    width: 16px !important;
    height: 16px !important;
  }

  .au-ds-row {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 4px !important;
    padding: 8px 10px !important;
  }
  .au-ds-key {
    font-size: 10px !important;
  }
  .au-ds-val {
    font-size: 12px !important;
    text-align: left !important;
    width: 100% !important;
    word-break: break-all !important;
  }
  .au-ds-val.mono {
    font-size: 10px !important;
  }
  .au-ds-hdr {
    padding: 8px 10px !important;
    font-size: 8px !important;
  }

  .au-role {
    font-size: 8px !important;
    padding: 2px 8px !important;
  }

  .au-panel-footer {
    padding: 8px 10px 10px !important;
    flex-direction: column !important;
    gap: 6px !important;
  }
  .au-panel-footer-btn {
    font-size: 11px !important;
    padding: 8px 12px !important;
    min-width: auto !important;
    width: 100% !important;
  }
}

/* ── VERY SMALL SCREENS (320px and below) ── */
@media(max-width:320px){
  .au-panel-card {
    padding: 10px 8px 10px !important;
  }
  .au-panel-avatar {
    width: 32px !important;
    height: 32px !important;
    font-size: 13px !important;
    border-radius: 8px !important;
  }
  .au-panel-name {
    font-size: 14px !important;
  }
  .au-panel-account {
    font-size: 8px !important;
  }
  .au-panel-body {
    padding: 6px 8px !important;
  }
  .au-ds-row {
    padding: 6px 8px !important;
  }
  .au-ds-key {
    font-size: 9px !important;
  }
  .au-ds-val {
    font-size: 11px !important;
  }
  .au-panel-close {
    top: 6px !important;
    right: 6px !important;
    padding: 3px !important;
  }
  .au-panel-close svg {
    width: 14px !important;
    height: 14px !important;
  }
}
`;

// ─── User Detail Panel (View Only) ──────────────────────────────────────────
function UserDetailPanel({ user, onClose, onDelete, deleting }) {
  const palette = getPalette(user.name);
  const isAdmin = user.role?.toUpperCase() === "ADMIN";

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <div className="au-panel-bg" onClick={onClose} />
      <div className="au-panel" role="dialog" aria-modal="true" aria-label={`${user.name} details`}>
        <div className="au-panel-card">
          <button className="au-panel-close" onClick={onClose} aria-label="Close panel">
            <MdClose size={20} />
          </button>
          <div className="au-panel-card-inner">
            <div className="au-panel-avatar" style={{
              background: palette.bg,
              border: `2px solid ${palette.border}`,
              color: palette.color,
              boxShadow: `0 0 0 4px ${palette.bg}`,
            }}>
              {getInitials(user.name)}
            </div>
            <div className="au-panel-name">{user.name}</div>
            <div className="au-panel-account">{genAccountRef(user.id)}</div>
            <div className="au-panel-meta-row">
              <span className={`au-role ${isAdmin ? "admin" : "user"}`}>
                {isAdmin ? <MdAdminPanelSettings size={11}/> : <MdPerson size={11}/>}
                {user.role || "USER"}
              </span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:"#2a2a38", letterSpacing:".1em" }}>
                ID · {user.id}
              </span>
            </div>
          </div>
        </div>

        <div className="au-panel-body">
          <div className="au-ds">
            <div className="au-ds-hdr"><MdPerson size={12} /> Contact</div>
            <div className="au-ds-row"><span className="au-ds-key"><MdEmail size={13}/>Email</span><span className="au-ds-val" style={{fontSize:12}}>{user.email || "—"}</span></div>
            <div className="au-ds-row"><span className="au-ds-key"><MdPhone size={13}/>Phone</span><span className="au-ds-val mono">{user.phone || "—"}</span></div>
          </div>
          <div className="au-ds">
            <div className="au-ds-hdr"><MdBadge size={12} /> Account</div>
            <div className="au-ds-row"><span className="au-ds-key">User ID</span><span className="au-ds-val amber mono">{genAccountRef(user.id)}</span></div>
            <div className="au-ds-row"><span className="au-ds-key">Role</span><span className="au-ds-val" style={{color: isAdmin ? "#F5A623" : "#10B981"}}>{user.role || "USER"}</span></div>
            <div className="au-ds-row"><span className="au-ds-key"><MdCalendarMonth size={13}/>Member since</span><span className="au-ds-val">{fmtDate(user.createdAt)}</span></div>
          </div>
          <div className="au-ds">
            <div className="au-ds-hdr">System</div>
            <div className="au-ds-row"><span className="au-ds-key">Internal ID</span><span className="au-ds-val mono">{user.id}</span></div>
            <div className="au-ds-row"><span className="au-ds-key">Created at</span><span className="au-ds-val muted" style={{fontSize:11}}>{user.createdAt ? new Date(user.createdAt).toLocaleString("en-IN") : "—"}</span></div>
            <div className="au-ds-row"><span className="au-ds-key">Status</span><span className="au-ds-val green" style={{display:"flex",alignItems:"center",gap:5}}><FaCheckCircle size={11}/> Active</span></div>
          </div>
          {!isAdmin && (
            <div style={{ background:"rgba(245,166,35,.05)", border:"1px solid rgba(245,166,35,.12)", borderRadius:10, padding:"12px 14px", fontSize:12, color:"#3a3a48", lineHeight:1.6 }}>
              ⚙️ Edit and delete endpoints are not yet implemented in the backend. These actions will be available once the admin user management API is ready.
            </div>
          )}
        </div>

        <div className="au-panel-footer">
          <button className="au-panel-footer-btn ghost" onClick={onClose}>Close</button>
          {!isAdmin && (
            <button className="au-panel-footer-btn danger" onClick={() => onDelete(user)} disabled={deleting}>
              <MdDelete size={16}/> {deleting ? "Deleting…" : "Delete user"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── User Edit Panel ──────────────────────────────────────────────────────────
function UserEditPanel({ user, onClose, onSave, saving }) {
  const id = user?.id;
  const palette = getPalette(user.name);
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'USER',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and Email are required.');
      return;
    }
    onSave(user.id, form);
  };

  return (
    <>
      <div className="au-panel-bg" onClick={onClose} />
      <div className="au-panel" role="dialog" aria-modal="true" aria-label={`Edit ${user.name}`}>
        <div className="au-panel-card">
          <button className="au-panel-close" onClick={onClose} aria-label="Close panel">
            <MdClose size={20} />
          </button>
          <div className="au-panel-card-inner">
            <div className="au-panel-avatar" style={{
              background: palette.bg,
              border: `2px solid ${palette.border}`,
              color: palette.color,
              boxShadow: `0 0 0 4px ${palette.bg}`,
            }}>
              {getInitials(user.name)}
            </div>
            <div className="au-panel-name">Edit User</div>
            <div className="au-panel-account">{genAccountRef(user.id)}</div>
          </div>
        </div>

        <div className="au-panel-body">
          {error && (
            <div style={{ background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 14px", color:"#EF4444", fontSize:13 }}>
              ⚠️ {error}
            </div>
          )}

          <div className="au-ds">
            <div className="au-ds-hdr"><MdPerson size={12} /> Edit Details</div>
            <div className="au-ds-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
              <div className="au-edit-field">
                <label htmlFor="edit-name">Full Name</label>
                <input id="edit-name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
              </div>
              <div className="au-edit-field">
                <label htmlFor="edit-email">Email</label>
                <input id="edit-email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" />
              </div>
              <div className="au-edit-field">
                <label htmlFor="edit-phone">Phone</label>
                <input id="edit-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
              </div>
              <div className="au-edit-field">
                <label htmlFor="edit-role">Role</label>
                <select id="edit-role" name="role" value={form.role} onChange={handleChange}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ background:"rgba(245,166,35,.05)", border:"1px solid rgba(245,166,35,.12)", borderRadius:10, padding:"12px 14px", fontSize:12, color:"#3a3a48", lineHeight:1.6 }}>
            💡 Changes will be saved via PUT /api/users/{id}. and currently our backend do not supports this endpoint cause we haven't made it till now.
          </div>
        </div>

        <div className="au-panel-footer">
          <button className="au-panel-footer-btn ghost" onClick={onClose} disabled={saving}>
            <MdCancel size={16}/> Cancel
          </button>
          <button className="au-panel-footer-btn primary" onClick={handleSubmit} disabled={saving}>
            <MdSave size={16}/> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Delete modal ──────────────────────────────────────────────────────────
function DeleteModal({ user, onConfirm, onCancel, loading }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div className="au-modal-bg" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="au-modal" role="dialog" aria-modal="true">
        <div className="au-modal-top">
          <div className="au-modal-icon"><MdDelete size={22}/></div>
          <div>
            <div className="au-modal-title">Delete user?</div>
            <div className="au-modal-sub">This action cannot be undone.</div>
          </div>
        </div>
        <div className="au-modal-body">
          You are about to permanently delete <strong style={{color:"#F0EDE8"}}>{user?.name}</strong>.
          All their data and bookings associated with this account will remain in the system but the login will be revoked.
        </div>
        <div className="au-modal-btns">
          <button className="au-modal-keep" onClick={onCancel} disabled={loading}>Keep user</button>
          <button className="au-modal-del" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkRow() {
  return (
    <tr>
      <td style={{padding:"13px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div className="sk" style={{width:36,height:36,borderRadius:10,flexShrink:0}}/>
          <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
            <div className="sk" style={{height:13,width:"60%"}}/>
            <div className="sk" style={{height:9,width:"35%"}}/>
          </div>
        </div>
      </td>
      {[55,45,40,40,70].map((w,i)=>(
        <td key={i} style={{padding:"13px 18px"}}>
          <div className="sk" style={{height:12,width:`${w}%`}}/>
        </td>
      ))}
    </tr>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminUsers() {
  const navigate = useNavigate();

  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const [viewUser,     setViewUser]     = useState(null);
  const [editUser,     setEditUser]     = useState(null);
  const [deleteModal,  setDeleteModal]  = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [saving,       setSaving]       = useState(false);

  const fetchUsers = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axiosInstance.get(API.USERS);
      setUsers(res.data || []);
    } catch (err) {
      setError("Failed to load users. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  }, [search, users]);

  const admins = users.filter(u => u.role?.toUpperCase() === "ADMIN").length;
  const members = users.length - admins;

  const handleDelete = async (userId) => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`${API.USERS}/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeleteModal(null);
      setViewUser(null);
    } catch (err) {
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveEdit = async (userId, formData) => {
    setSaving(true);
    try {
      // Try to update via PUT; if endpoint not available, show message
      await axiosInstance.put(`${API.USERS}/${userId}`, formData);
      // Update local users list
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...formData } : u));
      setEditUser(null);
    } catch (err) {
      // Fallback: just update locally and inform user
      console.warn("Edit endpoint not available, updating locally only.", err);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...formData } : u));
      setEditUser(null);
      alert("User updated locally. Backend PUT endpoint may be missing.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="au-root">

        <div className="au-hdr au-a1">
          <div>
            <div className="au-eyebrow">Admin · Users</div>
            <h1 className="au-title">User <span>Registry</span></h1>
            <p className="au-sub">
              {loading ? "Loading…" : `${users.length} registered · ${admins} admin${admins!==1?"s":""} · ${members} member${members!==1?"s":""}`}
            </p>
            <div className="au-divider" />
          </div>
          <div className="au-hdr-right">
            {!loading && users.length > 0 && (
              <span className="au-count">{users.length} user{users.length!==1?"s":""}</span>
            )}
            <button className="au-refresh" onClick={fetchUsers} disabled={loading}>
              <MdRefresh size={15}/> Refresh
            </button>
          </div>
        </div>

        <div className="au-search-wrap au-a2">
          <MdSearch size={17} color="#2a2a38"/>
          <input
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search users"
          />
          {search && (
            <button className="au-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
              <MdClose size={15}/>
            </button>
          )}
        </div>

        {error && (
          <div className="au-error">
            <MdWarning size={16}/> {error}
            <button onClick={fetchUsers} style={{ marginLeft:"auto", background:"transparent", border:"none", color:"#F5A623", cursor:"pointer", fontSize:13, fontWeight:600, padding:0, fontFamily:"'Inter',sans-serif" }}>Retry</button>
          </div>
        )}

        <div className="au-table-wrap au-a3">
          <table className="au-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th style={{textAlign:"right"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5},(_,i)=><SkRow key={i}/>)
                : filtered.length === 0
                ? (
                    <tr><td colSpan="6">
                      <div className="au-empty">
                        <div className="au-empty-icon">👤</div>
                        <div className="au-empty-title">{search ? "No users found" : "No users yet"}</div>
                        <p className="au-empty-sub">{search ? `No users match "${search}". Try a different search.` : "No users are registered on the platform yet."}</p>
                      </div>
                    </td></tr>
                  )
                : filtered.map((user) => {
                    const palette  = getPalette(user.name);
                    const isAdmin  = user.role?.toUpperCase() === "ADMIN";
                    return (
                      <tr key={user.id} className="au-row">
                        <td>
                          <div className="au-user-cell">
                            <div className="au-avatar" style={{background:palette.bg,border:`1px solid ${palette.border}`,color:palette.color}}>
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <div className="au-user-name">{user.name}</div>
                              <div className="au-user-id">{genAccountRef(user.id)}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{color:"#666",fontSize:13}}>{user.email || "—"}</td>
                        <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#444"}}>{user.phone || "—"}</td>
                        <td>
                          <span className={`au-role ${isAdmin?"admin":"user"}`}>
                            {isAdmin?<MdAdminPanelSettings size={11}/>:<MdPerson size={11}/>}
                            {user.role||"USER"}
                          </span>
                        </td>
                        <td style={{fontSize:12,color:"#444",whiteSpace:"nowrap"}}>{fmtDateShort(user.createdAt)}</td>
                        <td>
                          <div className="au-actions">
                            <button className="au-btn view" onClick={() => setViewUser(user)} title="View user details">
                              <MdVisibility size={14}/> <span>View</span>
                            </button>
                            <button className="au-btn" onClick={() => setEditUser(user)} title="Edit user">
                              <MdEdit size={14}/> <span>Edit</span>
                            </button>
                            <button className="au-btn danger" onClick={() => setDeleteModal(user)} disabled={isAdmin} title={isAdmin ? "Cannot delete admin" : "Delete user"}>
                              <MdDelete size={14}/> <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {!loading && users.length > 0 && (
          <div className="au-footer">
            <span className="au-footer-stat">Showing <b>{filtered.length}</b> of <b>{users.length}</b> users</span>
            <span className="au-footer-stat"><b>{admins}</b> admin{admins!==1?"s":""} · <b>{members}</b> member{members!==1?"s":""}</span>
          </div>
        )}

      </div>

      {viewUser && (
        <UserDetailPanel
          user={viewUser}
          onClose={() => setViewUser(null)}
          onDelete={(u) => { setViewUser(null); setDeleteModal(u); }}
          deleting={deleting && deleteModal?.id === viewUser?.id}
        />
      )}

      {editUser && (
        <UserEditPanel
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSaveEdit}
          saving={saving}
        />
      )}

      {deleteModal && (
        <DeleteModal
          user={deleteModal}
          onConfirm={() => handleDelete(deleteModal.id)}
          onCancel={() => setDeleteModal(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
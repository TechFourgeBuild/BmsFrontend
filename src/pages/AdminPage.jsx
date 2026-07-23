import { Outlet, useNavigate, useLocation,Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdDashboard, MdMovie, MdTheaters, MdEvent,
  MdConfirmationNumber, MdPeople, MdLogout,
  MdClose, MdAdminPanelSettings, MdMenu,
  MdChevronRight,
} from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { logout } from "../store/slices/authSlice";

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { path: "/admin",          label: "Dashboard", icon: MdDashboard,       short: "Home"    },
  { path: "/admin/movies",   label: "Movies",    icon: MdMovie,            short: "Movies"  },
  { path: "/admin/theaters", label: "Theaters",  icon: MdTheaters,         short: "Venues"  },
  { path: "/admin/shows",    label: "Shows",     icon: MdEvent,            short: "Shows"   },
  { path: "/admin/bookings", label: "Bookings",  icon: MdConfirmationNumber, short: "Tickets"},
  { path: "/admin/users",    label: "Users",     icon: MdPeople,           short: "Users"   },
];

// Helper: get initials
const initials = (name) =>
  name?.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "A";

// ─── CSS ──────────────────────────────────────────────────────────────────────
// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

// *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

// /* ────────────────────────────────────────────────────────────
//    ROOT LAYOUT
// ──────────────────────────────────────────────────────────── */
// .al-root {
//   display: flex;
//   min-height: 100vh;
//   background: #09090E;
//   color: #F0EDE8;
//   font-family: 'Inter', sans-serif;
// }

// /* ────────────────────────────────────────────────────────────
//    SIDEBAR — desktop
// ──────────────────────────────────────────────────────────── */
// .al-sidebar {
//   position: fixed;
//   top: 0; left: 0; bottom: 0;
//   width: 256px;
//   background: #07070B;
//   display: flex;
//   flex-direction: column;
//   z-index: 200;
//   overflow: hidden;
// }

// .al-sidebar::before {
//   content: '';
//   position: absolute;
//   top: 0; left: 0; bottom: 0;
//   width: 4px;
//   background: repeating-linear-gradient(
//     to bottom,
//     transparent 0px,
//     transparent 10px,
//     #F5A623 10px,
//     #F5A623 14px,
//     transparent 14px,
//     transparent 22px
//   );
//   opacity: .18;
//   pointer-events: none;
//   z-index: 1;
// }

// .al-sidebar-inner {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   padding-left: 4px;
//   overflow-y: auto;
//   scrollbar-width: none;
// }
// .al-sidebar-inner::-webkit-scrollbar { display: none; }

// .al-brand {
//   padding: 24px 20px 20px;
//   border-bottom: 1px solid #0f0f18;
//   flex-shrink: 0;
// }
// .al-brand-logo {
//   font-family: 'Syne', sans-serif;
//   font-size: 24px;
//   font-weight: 800;
//   color: #F5A623;
//   letter-spacing: -.02em;
//   line-height: 1;
// }
// .al-brand-logo span { color: #F0EDE8; }
// .al-brand-sub {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 9px; font-weight: 700;
//   letter-spacing: .2em; color: #2a2a38;
//   text-transform: uppercase;
//   margin-top: 4px;
// }

// .al-nav-section {
//   padding: 20px 20px 8px;
//   flex-shrink: 0;
// }
// .al-nav-label {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 9px; font-weight: 700;
//   letter-spacing: .2em; color: #252535;
//   text-transform: uppercase;
// }

// .al-nav {
//   padding: 0 12px;
//   display: flex;
//   flex-direction: column;
//   gap: 3px;
//   flex: 1;
// }
// .al-nav-item {
//   display: flex;
//   align-items: center;
//   gap: 11px;
//   padding: 11px 13px;
//   border-radius: 11px;
//   color: #3e3e50;
//   font-size: 14px;
//   font-weight: 500;
//   cursor: pointer;
//   border: 1px solid transparent;
//   transition: background .15s, color .15s, border-color .15s;
//   position: relative;
//   user-select: none;
// }
// .al-nav-item:hover {
//   background: #0f0f18;
//   color: #9090a0;
// }
// .al-nav-item:focus-visible {
//   outline: 2px solid rgba(245,166,35,.5);
//   outline-offset: 1px;
// }
// .al-nav-item.active {
//   background: rgba(245,166,35,.08);
//   border-color: rgba(245,166,35,.14);
//   color: #F5A623;
// }
// .al-nav-item.active::after {
//   content: '';
//   position: absolute;
//   right: 12px; top: 50%;
//   transform: translateY(-50%);
//   width: 6px; height: 6px;
//   border-radius: 50%;
//   background: #F5A623;
//   box-shadow: 0 0 8px rgba(245,166,35,.6);
// }
// .al-nav-icon { font-size: 20px; flex-shrink: 0; }
// .al-nav-text { flex: 1; }

// .al-sidebar-footer {
//   padding: 12px 12px 24px;
//   border-top: 1px solid #0f0f18;
//   flex-shrink: 0;
//   display: flex;
//   flex-direction: column;
//   gap: 3px;
// }
// .al-sidebar-footer-link {
//   display: flex;
//   align-items: center;
//   gap: 11px;
//   padding: 10px 13px;
//   border-radius: 11px;
//   color: #2a2a38;
//   font-size: 13px;
//   font-weight: 500;
//   cursor: pointer;
//   border: 1px solid transparent;
//   transition: background .15s, color .15s, border-color .15s;
// }
// .al-sidebar-footer-link:hover {
//   background: #0f0f18;
//   color: #555;
// }
// .al-sidebar-footer-link.danger:hover {
//   background: rgba(239,68,68,.07);
//   border-color: rgba(239,68,68,.15);
//   color: #EF4444;
// }

// .al-sidebar-user {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   padding: 14px 13px;
//   background: #0c0c14;
//   border-radius: 12px;
//   margin: 8px 12px 0;
//   border: 1px solid #13131e;
//   flex-shrink: 0;
// }
// .al-sidebar-avatar {
//   width: 34px; height: 34px;
//   border-radius: 10px;
//   background: rgba(245,166,35,.12);
//   border: 1px solid rgba(245,166,35,.22);
//   display: flex; align-items: center; justify-content: center;
//   font-family: 'Syne', sans-serif;
//   font-size: 13px; font-weight: 800;
//   color: #F5A623; flex-shrink: 0;
// }
// .al-sidebar-user-info { min-width: 0; flex: 1; }
// .al-sidebar-user-name {
//   font-size: 13px; font-weight: 600; color: #F0EDE8;
//   white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
// }
// .al-sidebar-user-role {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 9px; font-weight: 700;
//   letter-spacing: .12em; color: #F5A623;
//   text-transform: uppercase; margin-top: 1px;
// }

// /* ────────────────────────────────────────────────────────────
//    MAIN CONTENT
// ──────────────────────────────────────────────────────────── */
// .al-main {
//   flex: 1;
//   margin-left: 256px;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   overflow-x: hidden;
// }

// .al-topbar {
//   position: sticky;
//   top: 0; z-index: 100;
//   background: rgba(9,9,14,.88);
//   backdrop-filter: blur(18px);
//   border-bottom: 1px solid #0f0f18;
//   height: 58px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0 clamp(16px,3vw,36px);
//   flex-shrink: 0;
// }
// .al-topbar-left {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   min-width: 0;
// }
// .al-breadcrumb {
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   font-size: 13px;
//   color: #3e3e50;
//   white-space: nowrap;
// }
// .al-breadcrumb-root {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 10px; font-weight: 700;
//   letter-spacing: .12em; color: #2a2a38;
//   text-transform: uppercase;
// }
// .al-breadcrumb-sep { color: #1e1e28; }
// .al-breadcrumb-page {
//   font-family: 'Syne', sans-serif;
//   font-size: 14px;
//   font-weight: 700;
//   color: #F0EDE8;
//   letter-spacing: -.01em;
// }
// .al-topbar-right {
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   flex-shrink: 0;
// }
// .al-topbar-avatar {
//   width: 30px; height: 30px;
//   border-radius: 8px;
//   background: rgba(245,166,35,.1);
//   border: 1px solid rgba(245,166,35,.2);
//   display: flex; align-items: center; justify-content: center;
//   font-family: 'Syne', sans-serif;
//   font-size: 12px; font-weight: 800;
//   color: #F5A623;
// }
// .al-topbar-name {
//   font-size: 13px; font-weight: 500; color: #555;
//   display: none;
// }
// @media (min-width: 500px) { .al-topbar-name { display: block; } }
// .al-topbar-logout {
//   display: flex; align-items: center; gap: 4px;
//   background: transparent;
//   border: 1px solid #1a1a24; border-radius: 7px;
//   color: #444;
//   font-family: 'Inter', sans-serif;
//   font-size: 12px; font-weight: 600;
//   padding: 5px 10px;
//   cursor: pointer;
//   transition: border-color .15s, color .15s, background .15s;
//   white-space: nowrap;
// }
// .al-topbar-logout:hover {
//   border-color: rgba(239,68,68,.35);
//   color: #EF4444;
//   background: rgba(239,68,68,.04);
// }
// .al-topbar-logout .exit-text {
//   display: inline;
// }
// @media (max-width: 380px) {
//   .al-topbar-logout .exit-text {
//     display: none;
//   }
//   .al-topbar-logout::after {
//     content: '✕';
//     font-size: 14px;
//   }
// }

// /* ── Page body ── */
// .al-body {
//   flex: 1;
//   padding: clamp(16px, 3.5vw, 40px) clamp(12px, 4vw, 48px) 80px;
//   overflow-x: hidden;
// }

// /* ────────────────────────────────────────────────────────────
//    MOBILE — bottom navigation
// ──────────────────────────────────────────────────────────── */
// @media (max-width: 768px) {
//   .al-sidebar { display: none; }
//   .al-main    { margin-left: 0; padding-bottom: 72px; }
//   .al-body    { padding-bottom: 100px; }
//   .al-topbar  { height: 52px; padding: 0 12px; }
// }

// .al-bottomnav {
//   display: none;
//   position: fixed;
//   bottom: 0; left: 0; right: 0;
//   z-index: 200;
//   background: rgba(7,7,11,.96);
//   backdrop-filter: blur(20px);
//   border-top: 1px solid #13131e;
//   padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px));
//   flex-direction: row;
//   align-items: stretch;
//   gap: 0;
// }
// @media (max-width: 768px) { .al-bottomnav { display: flex; } }

// .al-bn-item {
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   gap: 2px;
//   padding: 6px 2px;
//   border-radius: 8px;
//   color: #2e2e42;
//   font-size: 9px; font-weight: 600;
//   cursor: pointer;
//   border: none;
//   background: transparent;
//   font-family: 'Inter', sans-serif;
//   transition: color .15s, background .15s;
//   -webkit-tap-highlight-color: transparent;
// }
// .al-bn-item:active { transform: scale(.93); }
// .al-bn-item.active { color: #F5A623; }
// .al-bn-item.active .al-bn-icon {
//   background: rgba(245,166,35,.1);
//   border-radius: 6px;
// }
// .al-bn-icon {
//   font-size: 20px;
//   padding: 2px 8px;
//   line-height: 1;
//   transition: background .15s;
// }
// .al-bn-label { font-size: 9px; line-height: 1; }

// .al-mobile-logo {
//   display: none;
//   font-family: 'Syne', sans-serif;
//   font-size: 17px;
//   font-weight: 800;
//   color: #F5A623;
//   letter-spacing: -.02em;
//   cursor: pointer;
// }
// .al-mobile-logo span { color: #F0EDE8; }

// @media (max-width: 768px) {
//   .al-breadcrumb-root { display: none; }
//   .al-breadcrumb-sep  { display: none; }
//   .al-mobile-logo     { display: block; }
// }
// @media (min-width: 769px) {
//   .al-mobile-logo { display: none; }
// }

// /* ── EXTRA SMALL SCREENS FIX ── */
// @media (max-width: 380px) {
//   .al-topbar {
//     padding: 0 8px;
//     height: 46px;
//   }
//   .al-topbar-left {
//     gap: 5px;
//   }
//   .al-mobile-logo {
//     font-size: 14px;
//   }
//   .al-breadcrumb-page {
//     font-size: 12px;
//   }
//   .al-topbar-avatar {
//     width: 24px;
//     height: 24px;
//     font-size: 10px;
//     border-radius: 6px;
//   }
//   .al-topbar-name {
//     display: none !important;
//   }
//   .al-topbar-logout {
//     padding: 4px 7px;
//     font-size: 10px;
//     border-radius: 5px;
//   }
//   .al-topbar-logout .exit-text {
//     display: none;
//   }
//   .al-topbar-logout::after {
//     content: '✕';
//     font-size: 13px;
//   }
//   .al-body {
//     padding: 10px 8px 80px;
//   }
// }

// @media (max-width: 320px) {
//   .al-topbar {
//     padding: 0 5px;
//     height: 42px;
//   }
//   .al-mobile-logo {
//     font-size: 12px;
//   }
//   .al-topbar-avatar {
//     width: 20px;
//     height: 20px;
//     font-size: 8px;
//   }
//   .al-topbar-logout {
//     padding: 3px 5px;
//     font-size: 9px;
//   }
//   .al-topbar-logout::after {
//     font-size: 11px;
//   }
// }

// /* ── Scrollbar sidebar ── */
// @media (min-width: 769px) {
//   .al-sidebar-inner::-webkit-scrollbar { width: 3px; display: block; }
//   .al-sidebar-inner::-webkit-scrollbar-track { background: transparent; }
//   .al-sidebar-inner::-webkit-scrollbar-thumb { background: #1a1a28; border-radius: 2px; }
//   .al-sidebar-inner::-webkit-scrollbar-thumb:hover { background: #2a2a38; }
// }

// @media (prefers-reduced-motion: reduce) {
//   .al-nav-item, .al-bn-item,
//   .al-sidebar-footer-link,
//   .al-topbar-logout { transition: none !important; }
// }
// `;

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ────────────────────────────────────────────────────────────
   ROOT LAYOUT
──────────────────────────────────────────────────────────── */
.al-root {
  display: flex;
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
}

/* ────────────────────────────────────────────────────────────
   SIDEBAR — desktop
──────────────────────────────────────────────────────────── */
.al-sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 256px;
  background: #07070B;
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow: hidden;
}

/* ✅ REMOVED: .al-sidebar::before (orange vertical strip) */

.al-sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 0px;  /* ✅ Changed from 4px to 0 since strip is gone */
  overflow-y: auto;
  scrollbar-width: none;
}
.al-sidebar-inner::-webkit-scrollbar { display: none; }

.al-brand {
  padding: 24px 20px 20px;
  border-bottom: 1px solid #0f0f18;
  flex-shrink: 0;
}
.al-brand-logo {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #F5A623;
  letter-spacing: -.02em;
  line-height: 1;
}
.al-brand-logo span { color: #F0EDE8; }
.al-brand-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 700;
  letter-spacing: .2em; color: #2a2a38;
  text-transform: uppercase;
  margin-top: 4px;
}

.al-nav-section {
  padding: 20px 20px 8px;
  flex-shrink: 0;
}
.al-nav-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 700;
  letter-spacing: .2em; color: #252535;
  text-transform: uppercase;
}

.al-nav {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}
.al-nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 13px;
  border-radius: 11px;
  color: #3e3e50;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background .15s, color .15s, border-color .15s;
  position: relative;
  user-select: none;
}
.al-nav-item:hover {
  background: #0f0f18;
  color: #9090a0;
}
.al-nav-item:focus-visible {
  outline: 2px solid rgba(245,166,35,.5);
  outline-offset: 1px;
}
.al-nav-item.active {
  background: rgba(245,166,35,.08);
  border-color: rgba(245,166,35,.14);
  color: #F5A623;
}
/* ✅ REMOVED: .al-nav-item.active::after (orange dot on right) */
.al-nav-icon { font-size: 20px; flex-shrink: 0; }
.al-nav-text { flex: 1; }

.al-sidebar-footer {
  padding: 12px 12px 24px;
  border-top: 1px solid #0f0f18;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.al-sidebar-footer-link {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 13px;
  border-radius: 11px;
  color: #2a2a38;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background .15s, color .15s, border-color .15s;
}
.al-sidebar-footer-link:hover {
  background: #0f0f18;
  color: #555;
}
.al-sidebar-footer-link.danger:hover {
  background: rgba(239,68,68,.07);
  border-color: rgba(239,68,68,.15);
  color: #EF4444;
}

.al-sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 13px;
  background: #0c0c14;
  border-radius: 12px;
  margin: 8px 12px 0;
  border: 1px solid #13131e;
  flex-shrink: 0;
}
.al-sidebar-avatar {
  width: 34px; height: 34px;
  border-radius: 10px;
  background: rgba(245,166,35,.12);
  border: 1px solid rgba(245,166,35,.22);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 13px; font-weight: 800;
  color: #F5A623; flex-shrink: 0;
}
.al-sidebar-user-info { min-width: 0; flex: 1; }
.al-sidebar-user-name {
  font-size: 13px; font-weight: 600; color: #F0EDE8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.al-sidebar-user-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 700;
  letter-spacing: .12em; color: #F5A623;
  text-transform: uppercase; margin-top: 1px;
}

/* ────────────────────────────────────────────────────────────
   MAIN CONTENT
──────────────────────────────────────────────────────────── */
.al-main {
  flex: 1;
  margin-left: 256px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.al-topbar {
  position: sticky;
  top: 0; z-index: 100;
  background: rgba(9,9,14,.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid #0f0f18;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px,3vw,36px);
  flex-shrink: 0;
}
.al-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.al-breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #3e3e50;
  white-space: nowrap;
}
.al-breadcrumb-root {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 700;
  letter-spacing: .12em; color: #2a2a38;
  text-transform: uppercase;
}
.al-breadcrumb-sep { color: #1e1e28; }
.al-breadcrumb-page {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #F0EDE8;
  letter-spacing: -.01em;
}
.al-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.al-topbar-avatar {
  width: 30px; height: 30px;
  border-radius: 8px;
  background: rgba(245,166,35,.1);
  border: 1px solid rgba(245,166,35,.2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 12px; font-weight: 800;
  color: #F5A623;
}
.al-topbar-name {
  font-size: 13px; font-weight: 500; color: #555;
  display: none;
}
@media (min-width: 500px) { .al-topbar-name { display: block; } }
.al-topbar-logout {
  display: flex; align-items: center; gap: 4px;
  background: transparent;
  border: 1px solid #1a1a24; border-radius: 7px;
  color: #444;
  font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 600;
  padding: 5px 10px;
  cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
  white-space: nowrap;
}
.al-topbar-logout:hover {
  border-color: rgba(239,68,68,.35);
  color: #EF4444;
  background: rgba(239,68,68,.04);
}
.al-topbar-logout .exit-text {
  display: inline;
}
@media (max-width: 380px) {
  .al-topbar-logout .exit-text {
    display: none;
  }
  .al-topbar-logout::after {
    content: '✕';
    font-size: 14px;
  }
}

/* ── Page body ── */
.al-body {
  flex: 1;
  padding: clamp(16px, 3.5vw, 40px) clamp(12px, 4vw, 48px) 80px;
  overflow-x: hidden;
}

/* ────────────────────────────────────────────────────────────
   MOBILE — bottom navigation
──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .al-sidebar { display: none; }
  .al-main    { margin-left: 0; padding-bottom: 72px; }
  .al-body    { padding-bottom: 100px; }
  .al-topbar  { height: 52px; padding: 0 12px; }
}

.al-bottomnav {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 200;
  background: rgba(7,7,11,.96);
  backdrop-filter: blur(20px);
  border-top: 1px solid #13131e;
  padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px));
  flex-direction: row;
  align-items: stretch;
  gap: 0;
}
@media (max-width: 768px) { .al-bottomnav { display: flex; } }

.al-bn-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 2px;
  border-radius: 8px;
  color: #2e2e42;
  font-size: 9px; font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  transition: color .15s, background .15s;
  -webkit-tap-highlight-color: transparent;
}
.al-bn-item:active { transform: scale(.93); }
.al-bn-item.active { color: #F5A623; }
.al-bn-item.active .al-bn-icon {
  background: rgba(245,166,35,.1);
  border-radius: 6px;
}
.al-bn-icon {
  font-size: 20px;
  padding: 2px 8px;
  line-height: 1;
  transition: background .15s;
}
.al-bn-label { font-size: 9px; line-height: 1; }

.al-mobile-logo {
  display: none;
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: #F5A623;
  letter-spacing: -.02em;
  cursor: pointer;
}
.al-mobile-logo span { color: #F0EDE8; }

@media (max-width: 768px) {
  .al-breadcrumb-root { display: none; }
  .al-breadcrumb-sep  { display: none; }
  .al-mobile-logo     { display: block; }
}
@media (min-width: 769px) {
  .al-mobile-logo { display: none; }
}

/* ── EXTRA SMALL SCREENS FIX ── */
@media (max-width: 380px) {
  .al-topbar {
    padding: 0 8px;
    height: 46px;
  }
  .al-topbar-left {
    gap: 5px;
  }
  .al-mobile-logo {
    font-size: 14px;
  }
  .al-breadcrumb-page {
    font-size: 12px;
  }
  .al-topbar-avatar {
    width: 24px;
    height: 24px;
    font-size: 10px;
    border-radius: 6px;
  }
  .al-topbar-name {
    display: none !important;
  }
  .al-topbar-logout {
    padding: 4px 7px;
    font-size: 10px;
    border-radius: 5px;
  }
  .al-topbar-logout .exit-text {
    display: none;
  }
  .al-topbar-logout::after {
    content: '✕';
    font-size: 13px;
  }
  .al-body {
    padding: 10px 8px 80px;
  }
}

@media (max-width: 320px) {
  .al-topbar {
    padding: 0 5px;
    height: 42px;
  }
  .al-mobile-logo {
    font-size: 12px;
  }
  .al-topbar-avatar {
    width: 20px;
    height: 20px;
    font-size: 8px;
  }
  .al-topbar-logout {
    padding: 3px 5px;
    font-size: 9px;
  }
  .al-topbar-logout::after {
    font-size: 11px;
  }
}

/* ── Scrollbar sidebar ── */
@media (min-width: 769px) {
  .al-sidebar-inner::-webkit-scrollbar { width: 3px; display: block; }
  .al-sidebar-inner::-webkit-scrollbar-track { background: transparent; }
  .al-sidebar-inner::-webkit-scrollbar-thumb { background: #1a1a28; border-radius: 2px; }
  .al-sidebar-inner::-webkit-scrollbar-thumb:hover { background: #2a2a38; }
}

@media (prefers-reduced-motion: reduce) {
  .al-nav-item, .al-bn-item,
  .al-sidebar-footer-link,
  .al-topbar-logout { transition: none !important; }
}`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { user }  = useSelector((s) => s.auth);

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const currentItem = NAV.find((n) => isActive(n.path)) || NAV[0];

  if (!user || user.role?.toUpperCase() !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNav = (path) => navigate(path);

  return (
    <>
      <style>{CSS}</style>
      <div className="al-root">

        {/* ── SIDEBAR ── */}
        <aside className="al-sidebar" aria-label="Admin navigation">
          <div className="al-sidebar-inner">
            <div className="al-brand">
              <Link to="/"><div className="al-brand-logo">book<span>it</span></div></Link>
              <div className="al-brand-sub">Admin console</div>
            </div>

            <div className="al-sidebar-user">
              <div className="al-sidebar-avatar">{initials(user.name)}</div>
              <div className="al-sidebar-user-info">
                <div className="al-sidebar-user-name">{user.name || "Admin"}</div>
                <div className="al-sidebar-user-role">{user.role || "ADMIN"}</div>
              </div>
            </div>

            <div className="al-nav-section">
              <div className="al-nav-label">Navigation</div>
            </div>

            <nav className="al-nav" role="navigation">
              {NAV.map((item) => {
                const Icon    = item.icon;
                const active  = isActive(item.path);
                return (
                  <div
                    key={item.path}
                    className={`al-nav-item${active ? " active" : ""}`}
                    onClick={() => handleNav(item.path)}
                    role="button"
                    tabIndex={0}
                    aria-current={active ? "page" : undefined}
                    onKeyDown={(e) => e.key === "Enter" && handleNav(item.path)}
                  >
                    <Icon className="al-nav-icon" />
                    <span className="al-nav-text">{item.label}</span>
                  </div>
                );
              })}
            </nav>

            <div className="al-sidebar-footer">
              <div
                className="al-sidebar-footer-link"
                onClick={() => navigate("/")}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/")}
              >
                <FaFire size={16} /> View site
              </div>
              <div
                className="al-sidebar-footer-link danger"
                onClick={handleLogout}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleLogout()}
              >
                <MdLogout size={18} /> Sign out
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="al-main">

          <header className="al-topbar">
            <div className="al-topbar-left">
              <div
                className="al-mobile-logo"
                onClick={() => navigate("/admin")}
                role="button"
                tabIndex={0}
              >
                book<span>it</span>
              </div>

              <div className="al-breadcrumb" aria-label="Breadcrumb">
                <span className="al-breadcrumb-root">Admin</span>
                <MdChevronRight size={14} className="al-breadcrumb-sep" />
                <span className="al-breadcrumb-page">{currentItem.label}</span>
              </div>
            </div>

            <div className="al-topbar-right">
              <span className="al-topbar-name">{user.name}</span>
              <div className="al-topbar-avatar" title={user.name}>
                {initials(user.name)}
              </div>
              <button
                className="al-topbar-logout"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                <MdLogout size={14} />
                <span className="exit-text">Exit</span>
              </button>
            </div>
          </header>

          <div className="al-body">
            <Outlet />
          </div>

        </main>

        {/* ── BOTTOM NAV ── */}
        <nav className="al-bottomnav" aria-label="Mobile navigation">
          {NAV.map((item) => {
            const Icon   = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                className={`al-bn-item${active ? " active" : ""}`}
                onClick={() => handleNav(item.path)}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <div className="al-bn-icon"><Icon /></div>
                <span className="al-bn-label">{item.short}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </>
  );
}
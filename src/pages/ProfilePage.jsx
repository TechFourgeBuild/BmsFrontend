import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdConfirmationNumber, MdLogout, MdEmail,
  MdPhone, MdCalendarMonth, MdBadge,
  MdArrowForward, MdAdminPanelSettings, MdPerson,
} from "react-icons/md";
import { logout } from "../store/slices/authSlice";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const fmtPhone = (p) => {
  if (!p) return "—";
  const s = String(p).replace(/\D/g, "");
  return s.length === 10 ? `+91 ${s.slice(0,5)} ${s.slice(5)}` : p;
};

const getInitials = (name) => {
  if (!name) return "?";
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
};

// Deterministic avatar color from name
const AVATAR_COLORS = [
  ["#F5A623", "#1a1000"],
  ["#8B5CF6", "#0a0014"],
  ["#10B981", "#001a0e"],
  ["#3B82F6", "#00091a"],
  ["#E84393", "#1a0010"],
];
const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.pp-root{
  min-height:100vh;
  background:#09090E;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:clamp(40px,7vw,80px) clamp(16px,4vw,32px) 80px;
}

/* ── Animations ── */
@keyframes fadeUp{
  from{opacity:0;transform:translateY(14px);}
  to  {opacity:1;transform:translateY(0);}
}
@keyframes beamIn{
  from{width:0;opacity:0;}
  to  {width:100%;opacity:1;}
}
@keyframes avatarIn{
  0% {opacity:0;transform:scale(.7);}
  70%{transform:scale(1.05);}
  100%{opacity:1;transform:scale(1);}
}

.pp-a1{animation:avatarIn .5s cubic-bezier(.22,.68,0,1.3) .0s both;}
.pp-a2{animation:fadeUp   .45s ease                        .1s both;}
.pp-a3{animation:fadeUp   .45s ease                        .2s both;}
.pp-a4{animation:fadeUp   .45s ease                        .3s both;}
.pp-a5{animation:fadeUp   .45s ease                        .38s both;}

@media(prefers-reduced-motion:reduce){
  .pp-a1,.pp-a2,.pp-a3,.pp-a4,.pp-a5{animation:none;opacity:1;}
  .pp-beam{animation:none!important;width:100%!important;}
}

/* ── Max-width wrapper ── */
.pp-wrap{width:100%;max-width:520px;}

/* ── Avatar ── */
.pp-avatar-wrap{
  display:flex;justify-content:center;
  margin-bottom:24px;
}
.pp-avatar{
  width:80px;height:80px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;
  font-size:28px;font-weight:800;
  letter-spacing:-.02em;
  position:relative;
  /* Ring */
  box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 0 0 4px var(--av-ring);
}
/* Film-sprocket notches on ring */
.pp-avatar::before,.pp-avatar::after{
  content:'';
  position:absolute;
  width:8px;height:8px;
  background:#09090E;
  border-radius:50%;
  top:50%;transform:translateY(-50%);
}
.pp-avatar::before{left:-6px;}
.pp-avatar::after {right:-6px;}

/* ── Credit block ── */
.pp-credit{
  text-align:center;
  margin-bottom:28px;
}
.pp-name{
  font-family:'Syne',sans-serif;
  font-size:clamp(28px,6vw,42px);
  font-weight:800;
  letter-spacing:-.02em;
  color:#F0EDE8;
  line-height:1.05;
  margin-bottom:10px;
}

/* Animated underline beam */
.pp-beam-wrap{
  display:flex;justify-content:center;
  margin-bottom:12px;
}
.pp-beam{
  height:2px;
  background:linear-gradient(90deg,transparent,#F5A623 20%,#F5A623 80%,transparent);
  width:0;opacity:0;
  animation:beamIn .7s ease .35s forwards;
  max-width:260px;width:60%;
}

.pp-role{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;font-weight:700;
  letter-spacing:.22em;
  color:#3a3a48;
  text-transform:uppercase;
}
.pp-role-admin{color:rgba(245,166,35,.6);}

/* ── Info card ── */
.pp-card{
  background:#111116;
  border:1px solid #18181f;
  border-radius:16px;
  overflow:hidden;
  width:100%;
  margin-bottom:14px;
}
.pp-card-header{
  padding:14px 20px;
  border-bottom:1px solid #16161e;
  display:flex;align-items:center;gap:8px;
}
.pp-card-header-label{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:700;
  letter-spacing:.18em;color:#333;
  text-transform:uppercase;
}

/* Info rows */
.pp-row{
  display:flex;align-items:center;
  padding:14px 20px;
  border-bottom:1px solid #0f0f14;
  gap:14px;
}
.pp-row:last-child{border-bottom:none;}
.pp-row-icon{
  color:#F5A623;flex-shrink:0;
  width:18px;display:flex;align-items:center;justify-content:center;
}
.pp-row-content{flex:1;min-width:0;}
.pp-row-label{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.16em;color:#333;
  text-transform:uppercase;
  margin-bottom:3px;
}
.pp-row-value{
  font-size:14px;font-weight:600;
  color:#ccc;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.pp-row-value.mono{
  font-family:'JetBrains Mono',monospace;
  font-size:13px;
}

/* ── Action buttons ── */
.pp-actions{
  display:flex;flex-direction:column;gap:10px;
  width:100%;
}

.pp-btn-bookings{
  display:flex;align-items:center;justify-content:space-between;
  background:#111116;
  border:1px solid #18181f;
  border-radius:13px;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  font-weight:600;font-size:15px;
  padding:16px 20px;
  cursor:pointer;
  width:100%;
  transition:border-color .2s,background .15s,transform .12s;
  text-align:left;
}
.pp-btn-bookings:hover{
  border-color:rgba(245,166,35,.4);
  background:#161620;
}
.pp-btn-bookings:active{transform:scale(.99);}

.pp-btn-left{
  display:flex;align-items:center;gap:12px;
}
.pp-btn-icon{
  width:38px;height:38px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.pp-btn-icon.amber{
  background:rgba(245,166,35,.1);
  border:1px solid rgba(245,166,35,.18);
  color:#F5A623;
}
.pp-btn-label{font-size:15px;font-weight:600;color:#F0EDE8;}
.pp-btn-sub  {font-size:11px;color:#444;margin-top:1px;}

.pp-btn-arrow{
  color:#444;
  transition:color .15s,transform .15s;
  flex-shrink:0;
}
.pp-btn-bookings:hover .pp-btn-arrow{
  color:#F5A623;
  transform:translateX(3px);
}

/* Admin panel button */
.pp-btn-admin{
  display:flex;align-items:center;justify-content:space-between;
  background:#111116;
  border:1px solid #18181f;
  border-radius:13px;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  font-weight:600;font-size:15px;
  padding:16px 20px;
  cursor:pointer;
  width:100%;
  transition:border-color .2s,background .15s,transform .12s;
  text-align:left;
}
.pp-btn-admin:hover{
  border-color:rgba(139,92,246,.4);
  background:#161620;
}
.pp-btn-admin:active{transform:scale(.99);}
.pp-btn-icon.purple{
  background:rgba(139,92,246,.1);
  border:1px solid rgba(139,92,246,.2);
  color:#8B5CF6;
}
.pp-btn-admin:hover .pp-btn-arrow{
  color:#8B5CF6;
  transform:translateX(3px);
}

/* Logout button */
.pp-btn-logout{
  display:flex;align-items:center;gap:12px;
  background:transparent;
  border:1px solid #18181f;
  border-radius:13px;
  color:#888;
  font-family:'Inter',sans-serif;
  font-weight:600;font-size:14px;
  padding:14px 20px;
  cursor:pointer;
  width:100%;
  transition:border-color .2s,color .15s,background .15s,transform .12s;
  text-align:left;
}
.pp-btn-logout:hover{
  border-color:rgba(239,68,68,.35);
  color:#EF4444;
  background:rgba(239,68,68,.04);
}
.pp-btn-logout:active{transform:scale(.99);}
.pp-btn-icon.red{
  background:rgba(239,68,68,.08);
  border:1px solid rgba(239,68,68,.15);
  color:#EF4444;
}
.pp-btn-logout:hover .pp-btn-icon.red{
  background:rgba(239,68,68,.14);
  border-color:rgba(239,68,68,.3);
}

/* ── Member since footer ── */
.pp-footer{
  margin-top:28px;
  text-align:center;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:600;
  letter-spacing:.14em;color:#222;
  text-transform:uppercase;
  display:flex;flex-direction:column;gap:4px;
  align-items:center;
}
.pp-footer-dot{
  width:4px;height:4px;border-radius:50%;
  background:#2a2a38;margin:0 auto;
}

/* ── Auth gate ── */
.pp-gate{
  display:flex;flex-direction:column;
  align-items:center;text-align:center;
  gap:14px;padding:72px 24px;
}
.pp-gate-icon{font-size:44px;}
.pp-gate-title{
  font-family:'Syne',sans-serif;
  font-size:22px;font-weight:700;color:#F0EDE8;
}
.pp-gate-sub{font-size:14px;color:#555;max-width:300px;line-height:1.6;}
.pp-gate-btn{
  background:#F5A623;border:none;border-radius:11px;
  color:#09090E;font-family:'Inter',sans-serif;
  font-weight:700;font-size:14px;
  padding:12px 28px;cursor:pointer;
  transition:background .15s;margin-top:4px;
}
.pp-gate-btn:hover{background:#E09920;}
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // ── Auth gate ──
  if (!user) {
    return (
      <>
        <style>{CSS}</style>
        <div className="pp-root">
          <div className="pp-gate">
            <div className="pp-gate-icon">🎭</div>
            <div className="pp-gate-title">You're not signed in</div>
            <p className="pp-gate-sub">Sign in to view your profile and booking history.</p>
            <button className="pp-gate-btn" onClick={() => navigate("/login")}>Sign in</button>
          </div>
        </div>
      </>
    );
  }

  const {
    id, name, email, phone, createdAt, role = "USER",
  } = user;

  const initials        = getInitials(name);
  const [avBg, avColor] = getAvatarColor(name);
  const isAdmin         = role?.toUpperCase() === "ADMIN";
  const accountRef      = `#${String(id).padStart(6, "0")}`;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-root">
        <div className="pp-wrap">

          {/* ── AVATAR ───────────────────────────────────────────── */}
          <div className="pp-avatar-wrap pp-a1">
            <div
              className="pp-avatar"
              style={{
                background: avBg,
                color: avColor,
                "--av-ring": `${avBg}55`,
              }}
              aria-label={`Avatar for ${name}`}
            >
              {initials}
            </div>
          </div>

          {/* ── FILM CREDIT NAME ─────────────────────────────────── */}
          <div className="pp-credit pp-a2">
            <h1 className="pp-name">{name}</h1>
            <div className="pp-beam-wrap">
              <div className="pp-beam" />
            </div>
            <p className={`pp-role${isAdmin ? " pp-role-admin" : ""}`}>
              {isAdmin
                ? "★ Admin Production"
                : "A User Production"}
            </p>
          </div>

          {/* ── INFO CARD ────────────────────────────────────────── */}
          <div className="pp-card pp-a3">
            <div className="pp-card-header">
              <MdPerson size={14} color="#333" />
              <span className="pp-card-header-label">Account Details</span>
            </div>

            <div className="pp-row">
              <div className="pp-row-icon"><MdEmail size={16} /></div>
              <div className="pp-row-content">
                <div className="pp-row-label">Email</div>
                <div className="pp-row-value">{email || "—"}</div>
              </div>
            </div>

            <div className="pp-row">
              <div className="pp-row-icon"><MdPhone size={16} /></div>
              <div className="pp-row-content">
                <div className="pp-row-label">Phone</div>
                <div className="pp-row-value mono">{fmtPhone(phone)}</div>
              </div>
            </div>

            <div className="pp-row">
              <div className="pp-row-icon"><MdCalendarMonth size={16} /></div>
              <div className="pp-row-content">
                <div className="pp-row-label">Member since</div>
                <div className="pp-row-value">{fmtDate(createdAt)}</div>
              </div>
            </div>

            <div className="pp-row">
              <div className="pp-row-icon"><MdBadge size={16} /></div>
              <div className="pp-row-content">
                <div className="pp-row-label">Account ID</div>
                <div className="pp-row-value mono">{accountRef}</div>
              </div>
            </div>

            <div className="pp-row">
              <div className="pp-row-icon">
                {isAdmin
                  ? <MdAdminPanelSettings size={16} color="#8B5CF6" />
                  : <MdPerson size={16} color="#F5A623" />
                }
              </div>
              <div className="pp-row-content">
                <div className="pp-row-label">Role</div>
                <div
                  className="pp-row-value mono"
                  style={{ color: isAdmin ? "#8B5CF6" : "#F5A623" }}
                >
                  {role || "USER"}
                </div>
              </div>
            </div>
          </div>

          {/* ── ACTIONS ──────────────────────────────────────────── */}
          <div className="pp-actions pp-a4">

            {/* My Bookings */}
            <button
              className="pp-btn-bookings"
              onClick={() => navigate("/bookings")}
            >
              <div className="pp-btn-left">
                <div className="pp-btn-icon amber">
                  <MdConfirmationNumber size={18} />
                </div>
                <div>
                  <div className="pp-btn-label">My Bookings</div>
                  <div className="pp-btn-sub">View tickets and booking history</div>
                </div>
              </div>
              <MdArrowForward size={18} className="pp-btn-arrow" />
            </button>

            {/* Admin panel — only for admins */}
            {isAdmin && (
              <button
                className="pp-btn-admin"
                onClick={() => navigate("/admin")}
              >
                <div className="pp-btn-left">
                  <div className="pp-btn-icon purple">
                    <MdAdminPanelSettings size={18} />
                  </div>
                  <div>
                    <div className="pp-btn-label">Admin Panel</div>
                    <div className="pp-btn-sub">Manage movies, theaters & shows</div>
                  </div>
                </div>
                <MdArrowForward size={18} className="pp-btn-arrow" style={{ color: "#444" }} />
              </button>
            )}

            {/* Logout */}
            <button className="pp-btn-logout" onClick={handleLogout}>
              <div className="pp-btn-icon red">
                <MdLogout size={16} />
              </div>
              Sign Out
            </button>

          </div>

          {/* ── FOOTER ───────────────────────────────────────────── */}
          <div className="pp-footer pp-a5">
            <div className="pp-footer-dot" />
            <span>Account {accountRef} · {isAdmin ? "Admin" : "Member"}</span>
            <span>Joined {fmtDate(createdAt)}</span>
          </div>

        </div>
      </div>
    </>
  );
}
import { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdConfirmationNumber,
  MdLocationOn,
  MdScreenShare,
  MdCalendarMonth,
  MdAccessTime,
  MdEventSeat,
  MdMovie,
  MdArrowForward,
  MdDownload,
  MdShare,
} from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { fetchBookingById } from "../store/slices/bookingSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const fmtPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const fmtDuration = (mins) => {
  if (!mins) return "";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const genBookingRef = (id, bookedAt) => {
  const d = bookedAt ? new Date(bookedAt) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `BMS-${y}${m}${day}-${String(id).padStart(4, "0")}`;
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.bc-root{
  min-height:100vh;
  background:#09090E;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:clamp(32px,6vw,64px) clamp(16px,4vw,32px) 80px;
}

/* ── Animations ── */
@keyframes popIn{
  0%  {opacity:0;transform:scale(.5);}
  70% {transform:scale(1.12);}
  100%{opacity:1;transform:scale(1);}
}
@keyframes fadeUp{
  from{opacity:0;transform:translateY(18px);}
  to  {opacity:1;transform:translateY(0);}
}
@keyframes ticketIn{
  0%  {opacity:0;transform:scale(.94) translateY(16px);}
  100%{opacity:1;transform:scale(1)   translateY(0);}
}
@keyframes glowPulse{
  0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0);}
  50%    {box-shadow:0 0 32px 8px rgba(16,185,129,.1);}
}

.anim-pop  {animation:popIn   .5s cubic-bezier(.22,.68,0,1.3) both;}
.anim-up1  {animation:fadeUp  .5s ease .15s both;}
.anim-up2  {animation:fadeUp  .5s ease .25s both;}
.anim-up3  {animation:fadeUp  .5s ease .35s both;}
.anim-ticket{animation:ticketIn .6s cubic-bezier(.22,.68,0,1.2) .1s both;}

@media(prefers-reduced-motion:reduce){
  .anim-pop,.anim-up1,.anim-up2,.anim-up3,.anim-ticket{
    animation:none;opacity:1;
  }
}

/* ── Top success area ── */
.bc-top{
  display:flex;flex-direction:column;
  align-items:center;text-align:center;
  gap:10px;margin-bottom:36px;
  width:100%;max-width:560px;
}
.bc-check-icon{
  color:#10B981;
  margin-bottom:4px;
  filter:drop-shadow(0 0 12px rgba(16,185,129,.35));
}
.bc-headline{
  font-family:'Syne',sans-serif;
  font-size:clamp(26px,4vw,40px);
  font-weight:800;
  letter-spacing:-.025em;
  color:#F0EDE8;
  line-height:1.08;
}
.bc-subline{
  font-size:14px;
  color:#555;
  line-height:1.6;
  max-width:360px;
}

/* Booking ref pill */
.bc-ref{
  display:inline-flex;align-items:center;gap:8px;
  background:#111116;
  border:1px solid rgba(245,166,35,.25);
  border-radius:10px;
  padding:10px 18px;
  margin-top:4px;
}
.bc-ref-label{
  font-size:11px;font-weight:600;
  letter-spacing:.12em;color:#555;
  text-transform:uppercase;
  white-space:nowrap;
}
.bc-ref-value{
  font-family:'JetBrains Mono',monospace;
  font-size:14px;font-weight:700;
  color:#F5A623;
  letter-spacing:.06em;
}

/* ── TICKET ── */
.bc-ticket{
  width:100%;max-width:560px;
  background:#111116;
  border-radius:20px;
  overflow:visible;
  position:relative;
  background-image:
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 18px,
      rgba(255,255,255,.012) 18px,
      rgba(255,255,255,.012) 19px
    );
  box-shadow:
    0 0 0 1px #1a1a24,
    0 24px 60px rgba(0,0,0,.6);
  animation:glowPulse 2.5s ease 0.6s 2;
}

/* Notch cutouts on sides for perforation effect */
.bc-ticket::before,
.bc-ticket::after{
  content:'';
  position:absolute;
  width:20px;height:20px;
  background:#09090E;
  border-radius:50%;
  top:calc(var(--perf-top) - 10px);
  z-index:2;
}
.bc-ticket::before{left:-10px;}
.bc-ticket::after {right:-10px;}

/* ── Ticket top: movie + poster ── */
.ticket-top{
  padding:24px 24px 0;
  display:flex;gap:16px;
  align-items:flex-start;
}
.ticket-poster{
  width:72px;
  height:104px;
  border-radius:8px;
  object-fit:cover;
  flex-shrink:0;
  border:1px solid #1e1e28;
}
.ticket-poster-fallback{
  width:72px;height:104px;
  border-radius:8px;
  background:#1a1a24;
  border:1px solid #1e1e28;
  display:flex;align-items:center;justify-content:center;
  color:#333;flex-shrink:0;
}
.ticket-movie-info{
  display:flex;flex-direction:column;gap:5px;
  padding-top:2px;
  min-width:0;
}
.ticket-movie-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(18px,3vw,24px);
  font-weight:800;
  letter-spacing:-.02em;
  color:#F0EDE8;
  line-height:1.1;
}
.ticket-movie-meta{
  font-size:12px;color:#555;
  display:flex;flex-wrap:wrap;gap:6px;align-items:center;
}
.ticket-dot{color:#333;}
.ticket-genre-badge{
  background:rgba(245,166,35,.1);
  border:1px solid rgba(245,166,35,.2);
  border-radius:4px;
  padding:2px 8px;
  font-size:10px;font-weight:700;
  letter-spacing:.08em;color:#F5A623;
  text-transform:uppercase;
}
.ticket-status{
  display:inline-flex;align-items:center;gap:5px;
  background:rgba(16,185,129,.1);
  border:1px solid rgba(16,185,129,.25);
  border-radius:100px;
  padding:4px 10px;
  font-size:11px;font-weight:700;
  color:#10B981;
  margin-top:4px;
  width:fit-content;
}

/* ── Perforation divider ── */
.ticket-perf{
  position:relative;
  margin:20px 0 0;
  height:1px;
  --perf-top:100%;
}
.ticket-perf-line{
  position:absolute;inset:0;
  border-top:2px dashed #1e1e28;
  margin:0 20px;
}

/* ── Ticket body: show details ── */
.ticket-body{
  padding:20px 24px;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px 12px;
}
@media(max-width:380px){
  .ticket-body{grid-template-columns:1fr;}
}

.ticket-field{}
.ticket-field-label{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.18em;color:#3a3a48;
  text-transform:uppercase;
  margin-bottom:4px;
  display:flex;align-items:center;gap:5px;
}
.ticket-field-value{
  font-size:13px;font-weight:600;color:#F0EDE8;
  line-height:1.35;
}
.ticket-field-value.mono{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;
}

/* seats row — full width */
.ticket-seats-row{
  grid-column:1/-1;
}
.seat-chips{
  display:flex;flex-wrap:wrap;gap:6px;
  margin-top:4px;
}
.seat-chip{
  display:inline-flex;align-items:center;gap:4px;
  background:rgba(245,166,35,.08);
  border:1px solid rgba(245,166,35,.2);
  border-radius:6px;
  padding:4px 10px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;font-weight:700;
  color:#F5A623;
}
.seat-chip.vip{
  background:rgba(139,92,246,.08);
  border-color:rgba(139,92,246,.25);
  color:#8B5CF6;
}

/* ── Ticket bottom: price + QR ── */
.ticket-bottom{
  border-top:1px solid #18181f;
  padding:20px 24px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
}
.ticket-price-block{
  display:flex;flex-direction:column;gap:3px;
}
.ticket-price-label{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:700;
  letter-spacing:.18em;color:#3a3a48;
  text-transform:uppercase;
}
.ticket-price-value{
  font-family:'JetBrains Mono',monospace;
  font-size:28px;font-weight:700;
  color:#F5A623;
  line-height:1;
}
.ticket-price-breakdown{
  font-size:11px;color:#444;margin-top:3px;
}

/* QR */
.ticket-qr{
  display:flex;flex-direction:column;align-items:center;gap:6px;
}
.ticket-qr img{
  width:80px;height:80px;
  border-radius:8px;
  border:1px solid #1e1e28;
  display:block;
  background:#fff;
  image-rendering:pixelated;
}
.ticket-qr-label{
  font-size:9px;font-weight:600;
  letter-spacing:.1em;color:#333;
  text-transform:uppercase;
}

/* ── Actions ── */
.bc-actions{
  width:100%;max-width:560px;
  display:flex;flex-direction:column;gap:10px;
  margin-top:24px;
}
.bc-actions-row{
  display:flex;gap:10px;
}
.btn-primary{
  flex:1;
  display:flex;align-items:center;justify-content:center;gap:8px;
  background:#F5A623;border:none;border-radius:12px;
  color:#09090E;font-family:'Inter',sans-serif;
  font-weight:700;font-size:14px;
  padding:14px;cursor:pointer;
  transition:background .15s,transform .1s;
}
.btn-primary:hover {background:#E09920;}
.btn-primary:active{transform:scale(.97);}
.btn-ghost{
  flex:1;
  display:flex;align-items:center;justify-content:center;gap:8px;
  background:transparent;
  border:1px solid #1e1e28;border-radius:12px;
  color:#F0EDE8;font-family:'Inter',sans-serif;
  font-weight:600;font-size:14px;
  padding:14px;cursor:pointer;
  transition:border-color .15s,transform .1s;
}
.btn-ghost:hover {border-color:rgba(245,166,35,.4);}
.btn-ghost:active{transform:scale(.97);}
.btn-secondary{
  display:flex;align-items:center;justify-content:center;gap:7px;
  background:transparent;border:none;
  color:#444;font-family:'Inter',sans-serif;
  font-size:13px;font-weight:500;
  cursor:pointer;padding:8px;
  transition:color .15s;
  text-decoration:none;
}
.btn-secondary:hover{color:#F0EDE8;}

/* ── No booking fallback ── */
.bc-fallback{
  display:flex;flex-direction:column;
  align-items:center;text-align:center;
  gap:14px;padding:80px 24px;
}
.bc-fallback-icon{font-size:40px;}
.bc-fallback-title{
  font-family:'Syne',sans-serif;
  font-size:20px;font-weight:700;color:#F0EDE8;
}
.bc-fallback-sub{font-size:14px;color:#555;max-width:300px;line-height:1.6;}
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ticketRef = useRef(null);

  // ✅ Fetch booking from Redux
  const { selectedBooking: booking, isLoading, error } = useSelector((s) => s.bookings);

  // ✅ Fetch booking by ID when component mounts
  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [bookingId, dispatch]);

  // ── Loading state ──
  if (isLoading) {
    return <LoadingSpinner variant="fullscreen" text="Loading Booking..." />;
  }

  // ── Error state ──
  if (error || !booking) {
    return (
      <>
        <style>{CSS}</style>
        <div className="bc-root">
          <div className="bc-fallback">
            <div className="bc-fallback-icon">🎟️</div>
            <div className="bc-fallback-title">Booking not found</div>
            <p className="bc-fallback-sub">
              We couldn't find your booking. Please try again.
            </p>
            <button
              className="btn-primary"
              style={{ width: "auto", padding: "13px 28px" }}
              onClick={() => navigate("/bookings")}
            >
              Go to My Bookings <MdArrowForward size={16} />
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Destructure booking ──
  const { id, bookedAt, status, totalPrice, seats = [], show = {} } = booking;
  const { movie = {}, screen = {}, showDate, startTime, endTime, ticketPrice } = show;
  const theater = screen?.theater || {};
  const city = theater?.city || {};
  const bookingRef = genBookingRef(id, bookedAt);

  // QR code via free API — encodes the booking reference
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(bookingRef)}&bgcolor=ffffff&color=09090E&margin=6`;
  const perfTop = "185px";

  return (
    <>
      <style>{CSS}</style>
      <div className="bc-root">
        {/* ── TOP: success message ── */}
        <div className="bc-top">
          <FaCheckCircle className="bc-check-icon anim-pop" size={56} />
          <h1 className="bc-headline anim-up1">Booking Confirmed!</h1>
          <p className="bc-subline anim-up2">
            Your seats are reserved. Show this ticket at the cinema entrance.
          </p>

          {/* Booking reference */}
          <div className="bc-ref anim-up2">
            <span className="bc-ref-label">Booking ID</span>
            <span className="bc-ref-value">#{bookingRef}</span>
          </div>
        </div>

        {/* ── TICKET ── */}
        <div
          className="bc-ticket anim-ticket"
          ref={ticketRef}
          style={{ "--perf-top": perfTop }}
        >
          {/* TOP SECTION: Movie info */}
          <div className="ticket-top">
            {movie.posterUrl ? (
              <img
                className="ticket-poster"
                src={movie.posterUrl}
                alt={movie.title}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="ticket-poster-fallback">
                <MdMovie size={28} />
              </div>
            )}

            <div className="ticket-movie-info">
              <div className="ticket-movie-title">{movie.title || "—"}</div>
              <div className="ticket-movie-meta">
                {movie.genre && (
                  <span className="ticket-genre-badge">{movie.genre}</span>
                )}
                {movie.language && (
                  <>
                    <span className="ticket-dot">·</span>
                    <span>{movie.language}</span>
                  </>
                )}
                {movie.durationMinutes && (
                  <>
                    <span className="ticket-dot">·</span>
                    <span>{fmtDuration(movie.durationMinutes)}</span>
                  </>
                )}
              </div>
              <div className="ticket-status">
                <FaCheckCircle size={11} />
                {status || "CONFIRMED"}
              </div>
            </div>
          </div>

          {/* Perforation divider */}
          <div className="ticket-perf">
            <div className="ticket-perf-line" />
          </div>

          {/* BODY SECTION: Show details grid */}
          <div className="ticket-body">
            <div className="ticket-field">
              <div className="ticket-field-label">
                <MdLocationOn size={11} /> Theater
              </div>
              <div className="ticket-field-value">{theater.name || "—"}</div>
              {city.name && (
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                  {theater.address
                    ? theater.address.split(",").slice(-2).join(",").trim()
                    : city.name}
                </div>
              )}
            </div>

            <div className="ticket-field">
              <div className="ticket-field-label">
                <MdScreenShare size={11} /> Screen
              </div>
              <div className="ticket-field-value">{screen.name || "—"}</div>
              {screen.totalSeats && (
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                  {screen.totalSeats} seats total
                </div>
              )}
            </div>

            <div className="ticket-field">
              <div className="ticket-field-label">
                <MdCalendarMonth size={11} /> Date
              </div>
              <div className="ticket-field-value">{fmtDate(showDate)}</div>
            </div>

            <div className="ticket-field">
              <div className="ticket-field-label">
                <MdAccessTime size={11} /> Time
              </div>
              <div className="ticket-field-value mono">
                {fmt12(startTime)}
                {endTime && (
                  <span style={{ color: "#555", fontWeight: 400 }}>
                    {" "}
                    – {fmt12(endTime)}
                  </span>
                )}
              </div>
            </div>

            {/* Seats — full width */}
            <div className="ticket-field ticket-seats-row">
              <div className="ticket-field-label">
                <MdEventSeat size={11} /> Seats Booked
                <span style={{ color: "#F5A623", marginLeft: 4 }}>
                  ({seats.length})
                </span>
              </div>
              <div className="seat-chips">
                {seats.length > 0 ? (
                  seats.map((s) => (
                    <span
                      key={s.id}
                      className={`seat-chip${s.seatType === "VIP" ? " vip" : ""}`}
                      title={`${s.seatNumber} · ${s.seatType}`}
                    >
                      {s.seatNumber}
                      {s.seatType === "VIP" && (
                        <span
                          style={{ fontSize: 9, opacity: 0.7, marginLeft: 2 }}
                        >
                          VIP
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: "#555" }}>—</span>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: price + QR */}
          <div className="ticket-bottom">
            <div className="ticket-price-block">
              <div className="ticket-price-label">
                <MdConfirmationNumber size={10} /> Total Paid
              </div>
              <div className="ticket-price-value">{fmtPrice(totalPrice)}</div>
              {ticketPrice && seats.length > 0 && (
                <div className="ticket-price-breakdown">
                  {seats.length} seat{seats.length > 1 ? "s" : ""} ×{" "}
                  {fmtPrice(ticketPrice)}
                </div>
              )}
            </div>

            {/* QR code */}
            <div className="ticket-qr">
              <img
                src={qrUrl}
                alt={`QR for booking ${bookingRef}`}
                onError={(e) => {
                  e.target.src = `https://placehold.co/80x80/ffffff/09090E?text=QR`;
                }}
              />
              <span className="ticket-qr-label">Scan at gate</span>
            </div>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div className="bc-actions anim-up3">
          <div className="bc-actions-row">
            {/* <Link to="/bookings"> */}
            <button
              className="btn-primary"
              onClick={() => navigate("/bookings")}
            >
              <MdConfirmationNumber size={16} />
              My Bookings
            </button>
            {/* </Link> */}
            <button className="btn-ghost" onClick={() => navigate("/movies")}>
              <MdMovie size={16} />
              Browse Movies
            </button>
          </div>

          {/* Secondary: share / download */}
          <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <button
              className="btn-secondary"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: `Ticket for ${movie.title}`,
                      text: `Booking confirmed! ${movie.title} at ${theater.name} on ${fmtDate(showDate)} · ${fmt12(startTime)}\nRef: #${bookingRef}`,
                    })
                    .catch(() => {});
                }
              }}
            >
              <MdShare size={15} /> Share ticket
            </button>
          </div>
        </div>

        {/* Booked at timestamp */}
        {bookedAt && (
          <div
            style={{
              marginTop: 20,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#2a2a38",
              letterSpacing: ".06em",
            }}
          >
            Booked at {new Date(bookedAt).toLocaleString("en-IN")}
          </div>
        )}
      </div>
    </>
  );
}
import { useNavigate } from "react-router-dom";
import { 
  MdHome, 
  MdArrowBack, 
  MdMovie, 
  MdSearch,
  MdConfirmationNumber 
} from "react-icons/md";
import { FaFire } from "react-icons/fa";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.nf-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* ── Background Glow ── */
.nf-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,166,35,.06) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: nfPulse 4s ease-in-out infinite;
}

@keyframes nfPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}

/* ── Film Strip Background ── */
.nf-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(40, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 2px;
  padding: 2px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.3;
}
.nf-cell {
  border-radius: 1px;
  background: #F5A623;
  opacity: 0;
}
.nf-cell.on {
  opacity: 0.15;
}

/* ── Main Container ── */
.nf-container {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 24px;
  max-width: 600px;
}

/* ── 404 Number ── */
.nf-code {
  font-family: 'Syne', sans-serif;
  font-size: clamp(120px, 25vw, 200px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #F5A623 0%, #E09920 50%, #d4a5c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  margin-bottom: 8px;
  position: relative;
}

/* ── Film Reel Animation ── */
.nf-reel {
  display: inline-block;
  margin-bottom: 16px;
  animation: nfReelSpin 20s linear infinite;
}

@keyframes nfReelSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ── Title ── */
.nf-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: #F0EDE8;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.nf-title span {
  color: #F5A623;
}

/* ── Description ── */
.nf-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  max-width: 460px;
  margin: 0 auto 32px;
}

/* ── Search Box ── */
.nf-search {
  display: flex;
  align-items: center;
  gap: 0;
  background: #141418;
  border: 1px solid #1e1e28;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color .2s;
  max-width: 420px;
  margin: 0 auto 24px;
}

.nf-search:focus-within {
  border-color: rgba(245,166,35,.4);
}

.nf-search input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  padding: 14px 18px;
}

.nf-search input::placeholder {
  color: #3a3a48;
}

.nf-search button {
  background: #F5A623;
  border: none;
  padding: 14px 20px;
  cursor: pointer;
  transition: background .15s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nf-search button:hover {
  background: #E09920;
}

.nf-search button svg {
  color: #09090E;
}

/* ── Action Buttons ── */
.nf-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.nf-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F5A623;
  border: none;
  border-radius: 11px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  padding: 13px 28px;
  cursor: pointer;
  transition: background .15s, transform .1s;
}
.nf-btn-primary:hover { background: #E09920; }
.nf-btn-primary:active { transform: scale(.97); }

.nf-btn-ghost {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.06);
  border: 1px solid #1e1e28;
  border-radius: 11px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  padding: 13px 28px;
  cursor: pointer;
  transition: border-color .15s, background .15s, transform .1s;
}
.nf-btn-ghost:hover {
  border-color: rgba(245,166,35,.4);
  background: rgba(255,255,255,.08);
}
.nf-btn-ghost:active { transform: scale(.97); }

/* ── Quick Links ── */
.nf-quick {
  margin-top: 32px;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.nf-quick-link {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #444;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color .15s;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.nf-quick-link:hover {
  color: #F5A623;
  border-color: rgba(245,166,35,.15);
}

/* ── Error Emoji ── */
.nf-emoji {
  font-size: 64px;
  margin-bottom: 8px;
  display: block;
  animation: nfFloat 3s ease-in-out infinite;
}

@keyframes nfFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .nf-container { padding: 24px 16px; }
  .nf-desc { font-size: 14px; }
  .nf-btns { flex-direction: column; align-items: center; }
  .nf-btn-primary, .nf-btn-ghost { width: 100%; justify-content: center; }
  .nf-quick { gap: 8px; }
  .nf-quick-link { font-size: 11px; padding: 4px 10px; }
}
`;

export default function NotFound() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input');
    if (input.value.trim()) {
      navigate(`/movies?search=${encodeURIComponent(input.value.trim())}`);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="nf-root">

        {/* ── Background Glow ── */}
        <div className="nf-glow" aria-hidden="true" />

        {/* ── Film Strip ── */}
        <div className="nf-strip" aria-hidden="true">
          {Array.from({ length: 800 }, (_, i) => (
            <div key={i} className={`nf-cell${Math.random() < 0.12 ? " on" : ""}`} />
          ))}
        </div>

        {/* ── Main Content ── */}
        <div className="nf-container">

          {/* ── 404 Number ── */}
          <div className="nf-code">404</div>

          {/* ── Emoji ── */}
          <span className="nf-emoji" role="img" aria-label="Lost">🎬</span>

          {/* ── Title ── */}
          <h1 className="nf-title">
            Page <span>Lost</span> in the Reel
          </h1>

          {/* ── Description ── */}
          <p className="nf-desc">
            Looks like this scene was cut from the final version. 
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* ── Search Box ── */}
          <form className="nf-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for a movie…"
              aria-label="Search movies"
            />
            <button type="submit" aria-label="Search">
              <MdSearch size={22} />
            </button>
          </form>

          {/* ── Action Buttons ── */}
          <div className="nf-btns">
            <button className="nf-btn-primary" onClick={() => navigate("/")}>
              <MdHome size={18} /> Go Home
            </button>
            <button className="nf-btn-ghost" onClick={() => navigate(-1)}>
              <MdArrowBack size={18} /> Go Back
            </button>
          </div>

          {/* ── Quick Links ── */}
          <div className="nf-quick">
            <button className="nf-quick-link" onClick={() => navigate("/movies")}>
              <MdMovie size={14} /> Movies
            </button>
            <button className="nf-quick-link" onClick={() => navigate("/bookings")}>
              <MdConfirmationNumber size={14} /> My Bookings
            </button>
            <button className="nf-quick-link" onClick={() => navigate("/")}>
              <FaFire size={12} /> Home
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
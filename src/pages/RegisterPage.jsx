import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdArrowBack, MdPerson, MdPhone, MdCheckCircle,
  MdKey,  // ✅ Secret key icon
} from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { registerUser } from "../store/slices/authSlice";

// ✅ Secret Key - Frontend pe rakho (temporary)
const ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

.auth-root {
  min-height: 100vh;
  background: #09090E;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.auth-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,166,35,.06) 0%, transparent 70%);
  top: -80px;
  right: -80px;
  pointer-events: none;
}

.auth-glow-2 {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,166,35,.04) 0%, transparent 70%);
  bottom: -60px;
  left: -60px;
  pointer-events: none;
}

.auth-strip {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(40, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 2px;
  padding: 2px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.12;
}
.auth-cell {
  border-radius: 1px;
  background: #F5A623;
  opacity: 0;
}
.auth-cell.on {
  opacity: 0.08;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 20px;
  padding: 28px 28px 24px;
  box-shadow: 0 20px 56px rgba(0,0,0,.6);
}

.auth-brand {
  text-align: center;
  margin-bottom: 20px;
}
.auth-brand-logo {
  font-family: 'Syne', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #F5A623;
  letter-spacing: -0.02em;
}
.auth-brand-logo span {
  color: #F0EDE8;
}
.auth-brand-sub {
  font-size: 12px;
  color: #555;
  margin-top: 2px;
  letter-spacing: 0.3px;
}
.auth-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(245,166,35,.1);
  border: 1px solid rgba(245,166,35,.2);
  border-radius: 100px;
  padding: 2px 10px;
  font-size: 9px;
  font-weight: 700;
  color: #F5A623;
  letter-spacing: .1em;
  text-transform: uppercase;
  margin-top: 4px;
}

.auth-title {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #F0EDE8;
  text-align: center;
  letter-spacing: -0.02em;
}
.auth-sub {
  text-align: center;
  color: #555;
  font-size: 13px;
  margin-top: 2px;
  margin-bottom: 18px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-input-group {
  position: relative;
}
.auth-input-group .auth-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #444;
  font-size: 16px;
}
.auth-input-group input {
  width: 100%;
  background: #09090E;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  padding: 11px 12px 11px 38px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color .2s;
}
.auth-input-group input:focus {
  border-color: rgba(245,166,35,.5);
}
.auth-input-group input::placeholder {
  color: #333;
}

.auth-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  padding: 2px;
  transition: color .15s;
}
.auth-toggle:hover {
  color: #F5A623;
}

.auth-btn {
  width: 100%;
  background: #F5A623;
  border: none;
  border-radius: 10px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;
  transition: background .15s, transform .1s;
  margin-top: 4px;
}
.auth-btn:hover {
  background: #E09920;
}
.auth-btn:active {
  transform: scale(.97);
}
.auth-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.auth-error {
  background: rgba(239,68,68,.08);
  border: 1px solid rgba(239,68,68,.25);
  border-radius: 8px;
  padding: 8px 12px;
  color: #EF4444;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.auth-success {
  background: rgba(16,185,129,.08);
  border: 1px solid rgba(16,185,129,.25);
  border-radius: 8px;
  padding: 8px 12px;
  color: #10B981;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.auth-footer {
  text-align: center;
  margin-top: 16px;
  color: #555;
  font-size: 13px;
}
.auth-footer a {
  color: #F5A623;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color .15s;
}
.auth-footer a:hover {
  color: #E09920;
  text-decoration: underline;
}

.auth-back {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #555;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: color .15s;
  padding: 0;
  margin-bottom: 8px;
}
.auth-back:hover {
  color: #F5A623;
}

.auth-terms {
  font-size: 11px;
  color: #444;
  text-align: center;
  margin-top: 8px;
  line-height: 1.5;
}
.auth-terms a {
  color: #555;
  text-decoration: none;
  transition: color .15s;
}
.auth-terms a:hover {
  color: #F5A623;
}

/* ✅ Secret Key field - subtle styling */
.secret-key-hint {
  font-size: 10px;
  color: #333;
  text-align: center;
  margin-top: 2px;
}

@media (max-width: 480px) {
  .auth-card { padding: 20px 16px; }
  .auth-brand-logo { font-size: 22px; }
  .auth-title { font-size: 20px; }
  .auth-input-group input { padding: 10px 12px 10px 36px; font-size: 12px; }
}
`;

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [secretKey, setSecretKey] = useState("");  // ✅ New state
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);  // ✅ Toggle for secret key
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Determine role based on secret key
    let role = "USER";
    if (secretKey === ADMIN_SECRET_KEY) {
      role = "ADMIN";
    }

    const result = await dispatch(registerUser({ 
      name, 
      email, 
      password, 
      phone,
      role  // ✅ Send role to backend
    }));

    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setSecretKey("");
      setPhone(""); 
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.payload?.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return ( 
    <>
      <style>{CSS}</style>
      <div className="auth-root">
        <div className="auth-glow" />
        <div className="auth-glow-2" />
        <div className="auth-strip">
          {Array.from({ length: 800 }, (_, i) => (
            <div key={i} className={`auth-cell${Math.random() < 0.08 ? " on" : ""}`} />
          ))}
        </div>

        <div className="auth-card">
          <Link to="/">
            <button className="auth-back">
              <MdArrowBack size={15} /> Back
            </button>
          </Link>

          <div className="auth-brand">
            <div className="auth-brand-logo">book<span>it</span></div>
            <div className="auth-brand-sub">Join the cinema community</div>
            <div className="auth-brand-badge">
              <FaFire size={7} /> Get Started
            </div>
          </div>

          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Start booking tickets in seconds</p>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <MdCheckCircle size={16} /> Account created! Redirecting...
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <span className="auth-icon"><MdPerson size={16} /></span>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="auth-input-group">
              <span className="auth-icon"><MdEmail size={16} /></span>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <span className="auth-icon"><MdPhone size={16} /></span>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <span className="auth-icon"><MdLock size={16} /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>

            {/* ✅ Secret Key Field (Optional) */}
            <div className="auth-input-group">
              <span className="auth-icon"><MdKey size={16} /></span>
              <input
                type={showSecretKey ? "text" : "password"}
                placeholder="Secret Key (optional)"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowSecretKey(!showSecretKey)}
                aria-label={showSecretKey ? "Hide secret key" : "Show secret key"}
              >
                {showSecretKey ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
            <div className="secret-key-hint">
              ℹ️ Leave empty for regular user. Admin access requires a valid secret key.
            </div>

            <button type="submit" className="auth-btn" disabled={loading || success}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="auth-terms">
            By creating an account, you agree to our{" "}
            <a href="#">Terms</a> & <a href="#">Privacy Policy</a>
          </div>

          <div className="auth-footer">
            Already have an account? <a onClick={() => navigate("/login")}>Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}
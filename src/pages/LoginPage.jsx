import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdArrowBack } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { loginUser } from "../store/slices/authSlice";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

.auth-root {
  min-height: 100vh;
  background: #09090E;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Background Glow */
.auth-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,166,35,.06) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  pointer-events: none;
}

.auth-glow-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,166,35,.04) 0%, transparent 70%);
  bottom: -80px;
  left: -80px;
  pointer-events: none;
}

/* Film Strip Background */
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
  opacity: 0.15;
}
.auth-cell {
  border-radius: 1px;
  background: #F5A623;
  opacity: 0;
}
.auth-cell.on {
  opacity: 0.1;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 24px 64px rgba(0,0,0,.6);
}

.auth-brand {
  text-align: center;
  margin-bottom: 32px;
}
.auth-brand-logo {
  font-family: 'Syne', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #F5A623;
  letter-spacing: -0.02em;
}
.auth-brand-logo span {
  color: #F0EDE8;
}
.auth-brand-sub {
  font-size: 13px;
  color: #555;
  margin-top: 4px;
  letter-spacing: 0.3px;
}
.auth-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(245,166,35,.1);
  border: 1px solid rgba(245,166,35,.2);
  border-radius: 100px;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: 700;
  color: #F5A623;
  letter-spacing: .1em;
  text-transform: uppercase;
  margin-top: 8px;
}

.auth-title {
  font-family: 'Syne', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #F0EDE8;
  text-align: center;
  letter-spacing: -0.02em;
}
.auth-sub {
  text-align: center;
  color: #555;
  font-size: 14px;
  margin-top: 6px;
  margin-bottom: 28px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-input-group {
  position: relative;
}
.auth-input-group .auth-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #444;
  font-size: 18px;
}
.auth-input-group input {
  width: 100%;
  background: #09090E;
  border: 1px solid #1e1e28;
  border-radius: 12px;
  padding: 14px 14px 14px 44px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
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
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  padding: 4px;
  transition: color .15s;
}
.auth-toggle:hover {
  color: #F5A623;
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-top: 4px;
}
.auth-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  cursor: pointer;
}
.auth-remember input[type="checkbox"] {
  accent-color: #F5A623;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.auth-forgot {
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
  transition: color .15s;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}
.auth-forgot:hover {
  color: #F5A623;
}

.auth-btn {
  width: 100%;
  background: #F5A623;
  border: none;
  border-radius: 12px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  padding: 14px;
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
  border-radius: 10px;
  padding: 10px 14px;
  color: #EF4444;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  color: #555;
  font-size: 14px;
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
  gap: 6px;
  background: none;
  border: none;
  color: #555;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: color .15s;
  padding: 0;
  margin-bottom: 16px;
}
.auth-back:hover {
  color: #F5A623;
}

@media (max-width: 480px) {
  .auth-card { padding: 28px 20px; }
  .auth-brand-logo { font-size: 26px; }
  .auth-title { font-size: 22px; }
  .auth-options { flex-direction: column; gap: 10px; align-items: flex-start; }
}
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 // LoginPage.jsx - handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const result = await dispatch(loginUser({ email, password }));

  if (loginUser.fulfilled.match(result)) {
    navigate("/");  // ✅ Redirect to home after login
  } else {
    setError(result.payload?.message || "Invalid email or password");
  }
  setLoading(false);
};

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-root">
        {/* Background Effects */}
        <div className="auth-glow" />
        <div className="auth-glow-2" />
        <div className="auth-strip">
          {Array.from({ length: 800 }, (_, i) => (
            <div key={i} className={`auth-cell${Math.random() < 0.08 ? " on" : ""}`} />
          ))}
        </div>

        <div className="auth-card">
          {/* Back Button */}
          <Link to="/">
          <button className="auth-back">
            <MdArrowBack size={16} /> Back
          </button>
          </Link>

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-logo">book<span>it</span></div>
            <div className="auth-brand-sub">Your ticket to cinema</div>
            <div className="auth-brand-badge">
              <FaFire size={8} /> Book Smart
            </div>
          </div>

          {/* Title */}
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to book tickets & manage bookings</p>

          {/* Error */}
          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <span className="auth-icon">
                <MdEmail size={18} />
              </span>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="auth-input-group">
              <span className="auth-icon">
                <MdLock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>

            {/* <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="auth-forgot">
                Forgot password?
              </button>
            </div> */}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            Don't have an account? <a onClick={() => navigate("/register")}>Create one</a>
          </div>
        </div>
      </div>
    </>
  );
}
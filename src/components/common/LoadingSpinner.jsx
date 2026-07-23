import React from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

.ls-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 9, 14, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  gap: 24px;
}

/* ── Spinner Container ── */
.ls-spinner {
  position: relative;
  width: 80px;
  height: 80px;
}

/* ── Outer Ring ── */
.ls-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #F5A623;
  animation: lsSpin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.ls-ring:nth-child(1) {
  animation-duration: 1s;
}

.ls-ring:nth-child(2) {
  animation-duration: 1.5s;
  border-top-color: #E09920;
  inset: 8px;
}

.ls-ring:nth-child(3) {
  animation-duration: 2s;
  border-top-color: #d4a5c0;
  inset: 16px;
}

/* ── Center Icon ── */
.ls-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5A623;
  animation: lsPulse 1.5s ease-in-out infinite;
}

/* ── Text ── */
.ls-text {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #F0EDE8;
  letter-spacing: 0.05em;
  animation: lsPulse 1.5s ease-in-out infinite;
}

.ls-text span {
  color: #F5A623;
}

/* ── Dots Animation ── */
.ls-dots {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.ls-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F5A623;
  animation: lsDotBounce 1.4s ease-in-out infinite;
}

.ls-dot:nth-child(1) { animation-delay: 0s; }
.ls-dot:nth-child(2) { animation-delay: 0.2s; }
.ls-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes lsSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes lsPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes lsDotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}

/* ── Small variant ── */
.ls-small .ls-spinner {
  width: 48px;
  height: 48px;
}
.ls-small .ls-ring:nth-child(2) { inset: 4px; }
.ls-small .ls-ring:nth-child(3) { inset: 8px; }
.ls-small .ls-text { font-size: 13px; }
.ls-small .ls-icon svg { width: 20px; height: 20px; }
.ls-small .ls-dot { width: 6px; height: 6px; }

/* ── Extra Small variant ── */
.ls-xs .ls-spinner {
  width: 32px;
  height: 32px;
}
.ls-xs .ls-ring:nth-child(2) { inset: 3px; }
.ls-xs .ls-ring:nth-child(3) { inset: 6px; }
.ls-xs .ls-text { font-size: 11px; }
.ls-xs .ls-icon svg { width: 14px; height: 14px; }
.ls-xs .ls-dot { width: 4px; height: 4px; }

/* ── Inline variant ── */
.ls-inline {
  position: relative;
  background: transparent;
  backdrop-filter: none;
  padding: 20px;
}
.ls-inline .ls-overlay {
  position: relative;
  background: transparent;
  backdrop-filter: none;
  min-height: 120px;
}

/* ── Fullscreen Variant ── */
.ls-fullscreen {
  min-height: 100vh;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .ls-spinner { width: 60px; height: 60px; }
  .ls-ring:nth-child(2) { inset: 6px; }
  .ls-ring:nth-child(3) { inset: 12px; }
  .ls-text { font-size: 14px; }
}
`;

const LoadingSpinner = ({ 
  variant = "fullscreen", // "fullscreen" | "inline" | "small" | "xs"
  text = "Loading",
  showDots = true,
  showIcon = true,
  className = "",
}) => {
  // Determine variant class
  const variantClass = {
    fullscreen: "ls-fullscreen",
    inline: "ls-inline",
    small: "ls-small",
    xs: "ls-xs",
  }[variant] || "";

  return (
    <>
      <style>{CSS}</style>
      <div className={`ls-overlay ${variantClass} ${className}`}>
        <div className="ls-spinner">
          {/* Outer Rings */}
          <div className="ls-ring" />
          <div className="ls-ring" />
          <div className="ls-ring" />

          {/* Center Icon */}
          {showIcon && (
            <div className="ls-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4L20 20" />
                <path d="M20 4L4 20" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          )}
        </div>

        {/* Loading Text */}
        <div className="ls-text">
          {text} <span>✦</span>
        </div>

        {/* Animated Dots */}
        {showDots && (
          <div className="ls-dots">
            <span className="ls-dot" />
            <span className="ls-dot" />
            <span className="ls-dot" />
          </div>
        )}
      </div>
    </>
  );
};

export default LoadingSpinner;
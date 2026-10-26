import React from "react";

export default function DiyaIcon({ size = 26, className = "", style = {} }) {
  const uniqueId = React.useId ? React.useId().replace(/:/g, "") : "diya";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`diya-svg-icon ${className}`}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
      {/* Diya Base */}
      <path
        d="M8 38C8 38 12 56 32 56C52 56 56 38 56 38C56 38 48 44 32 44C16 44 8 38 8 38Z"
        fill={`url(#${uniqueId}-base)`}
        stroke="#ffd700"
        strokeWidth="1.5"
      />
      <ellipse cx="32" cy="38" rx="24" ry="7" fill="#8b4513" stroke="#ffd700" strokeWidth="1.5" />
      <ellipse cx="32" cy="38" rx="20" ry="5" fill="#daa520" />

      {/* Flame Outer Glow */}
      <path
        d="M32 6C32 6 20 22 20 33C20 39.5 25.4 43 32 43C38.6 43 44 39.5 44 33C44 22 32 6 32 6Z"
        fill={`url(#${uniqueId}-flame-out)`}
        filter="drop-shadow(0 0 6px rgba(255,140,0,0.8))"
      />

      {/* Flame Inner Core */}
      <path
        d="M32 14C32 14 25 25 25 33C25 36.8 28.1 39 32 39C35.9 39 39 36.8 39 33C39 25 32 14 32 14Z"
        fill={`url(#${uniqueId}-flame-in)`}
      />

      <defs>
        <linearGradient id={`${uniqueId}-base`} x1="8" y1="38" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd700" />
          <stop offset="0.5" stopColor="#ff8c00" />
          <stop offset="1" stopColor="#b8860b" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-flame-out`} x1="32" y1="6" x2="32" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff1744" />
          <stop offset="0.4" stopColor="#ff9100" />
          <stop offset="0.9" stopColor="#ffd700" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-flame-in`} x1="32" y1="14" x2="32" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#fff9c4" />
          <stop offset="1" stopColor="#ffeb3b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

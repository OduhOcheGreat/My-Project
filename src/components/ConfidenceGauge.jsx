import React from "react";

/* ---------------------------------------------------------------
   Confidence gauge — semicircular arc, signature visual element.
---------------------------------------------------------------- */
export default function ConfidenceGauge({ pct, color }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <svg viewBox="0 0 180 100" className="ts-gauge">
      <path
        d="M 20 90 A 70 70 0 0 1 160 90"
        fill="none"
        stroke="#E4E0D2"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 20 90 A 70 70 0 0 1 160 90"
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.4,0,.2,1)" }}
      />
      <text x="90" y="78" textAnchor="middle" className="ts-gauge-number">
        {clamped.toFixed(1)}%
      </text>
    </svg>
  );
}

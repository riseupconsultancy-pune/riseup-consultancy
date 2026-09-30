"use client";

import React from "react";

interface VerificationBadgeProps {
  label?: string;
  sublabel?: string;
  variant?: "blue" | "dark" | "outline" | "solid";
  size?: "sm" | "md";
  className?: string;
}

export default function VerificationBadge({
  label = "DIRECT SOURCING",
  sublabel,
  variant = "blue",
  size = "sm",
  className = "",
}: VerificationBadgeProps) {
  // Institutional styling: sharp edges (rounded-none), cobalt & slate hues, no generic green ticks
  const variantStyles = {
    blue: "bg-blue-50 border-blue-300 text-blue-900 shadow-2xs",
    dark: "bg-slate-900 border-slate-700 text-white shadow-xs",
    outline: "bg-white border-slate-300 text-slate-900 shadow-2xs",
    solid: "bg-blue-600 border-blue-600 text-white shadow-xs",
  }[variant];

  const sizeStyles = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider border rounded-full shrink-0 select-none ${variantStyles} ${sizeStyles} ${className}`}
      title="Verified Direct Sourcing Standard • Zero Sub-Brokering • 100% Free for Candidates"
    >
      {/* Authentic Institutional Direct Sourcing Seal Emblem (Shield with Direct Diamond Check) */}
      <span className="shrink-0 flex items-center justify-center">
        <svg
          className={`w-3.5 h-3.5 ${variant === "solid" ? "text-white" : variant === "dark" ? "text-blue-400" : "text-blue-600"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {/* Institutional Shield */}
          <path d="M12 2L4 6v6.5C4 17.5 7.4 21.8 12 23c4.6-1.2 8-5.5 8-10.5V6l-8-4z" />
          {/* Internal Geometric Check */}
          <path d="M8.5 12.5l2.5 2.5 5-5" strokeWidth="2.4" />
        </svg>
      </span>

      <span className="truncate tracking-widest">{label}</span>

      {sublabel && (
        <span
          className={`text-[9px] font-semibold tracking-normal pl-1.5 border-l ${
            variant === "solid"
              ? "border-blue-400 text-blue-100"
              : variant === "dark"
              ? "border-slate-700 text-slate-200"
              : variant === "blue"
              ? "border-blue-300 text-blue-950 font-bold"
              : "border-slate-300 text-slate-800 font-semibold"
          }`}
        >
          {sublabel}
        </span>
      )}
    </span>
  );
}


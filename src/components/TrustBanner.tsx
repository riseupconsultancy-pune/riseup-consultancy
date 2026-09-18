"use client";

import React from "react";
import { Shield, Ban, Gift } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

export default function TrustBanner() {
  const BADGES = [
    {
      icon: Shield,
      title: "Direct Corporate Mandates",
      badge: "Zero Sub-Brokers",
      description:
        "100% independent operations. Direct engagement with enterprise HR teams without intermediaries.",
      sealText: "DIRECT SOURCING ONLY",
    },
    {
      icon: Ban,
      title: "Authorized Channels Only",
      badge: "No WorkIndia / Naukri",
      description:
        "Never posted on WorkIndia or Naukri. All interviews are issued strictly by our authorized team.",
      sealText: "AUTHORIZED PORTAL",
    },
    {
      icon: Gift,
      title: "100% Free for Candidates",
      badge: "Zero Candidate Fees",
      description:
        "Enterprise-funded staffing. Never pay registration, interview deposits, or document processing charges.",
      sealText: "ZERO CANDIDATE FEES",
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-8 sm:py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Authentic Direct Sourcing Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                Official Integrity Standard
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Authentic Direct Sourcing. Uncompromising Integrity.
            </h2>
          </div>
          <div className="self-start sm:self-auto">
            <VerificationBadge label="DIRECT SOURCING" sublabel="PUNE HQ AUDITED" variant="blue" size="md" />
          </div>
        </div>

        {/* 3 Square Cards Grid with Compact Padding (p-4 sm:p-5) & Mobile Horizontal Snap */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 sm:pb-0 gap-3.5 sm:grid sm:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {BADGES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[80vw] max-w-[320px] sm:w-auto p-4 sm:p-5 bg-slate-50 border border-slate-200 hover:border-slate-900 hover:bg-white transition-all duration-200 flex flex-col justify-between rounded-none group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-9 h-9 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 px-2 py-0.5">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <VerificationBadge label={item.sealText} variant="outline" size="sm" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-2">
          <span>Swipe horizontally to view verification policies →</span>
        </div>

      </div>
    </section>
  );
}


"use client";

import React from "react";
import { ShieldCheck, Lock, CheckCircle2, Award } from "lucide-react";

export default function TrustBanner() {
  const BADGES = [
    {
      icon: ShieldCheck,
      title: "Direct Sourcing Guarantee",
      badge: "Zero Agency Collaboration",
      description:
        "Rise Up Consultancy operates 100% independently and does not collaborate with third-party recruitment agencies for its hiring operations. Clients and candidates work directly with our authorized team.",
    },
    {
      icon: Lock,
      title: "Authorized Channels Only",
      badge: "No WorkIndia or Naukri",
      description:
        "Rise Up Consultancy does not post openings on WorkIndia or Naukri. All official openings and interview invitations are communicated strictly through our authorized recruitment channels.",
    },
    {
      icon: Award,
      title: "100% Free for Job Seekers",
      badge: "Zero Candidate Fees",
      description:
        "We are an authorized enterprise staffing partner. We never charge registration fees, interview security deposits, or documentation charges from job seekers. Placement assistance is 100% free.",
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-10 sm:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                Official Trust & Verification Standards
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Authentic Direct Sourcing. Uncompromising Integrity.
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-1.5 self-start sm:self-auto rounded-none">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Authorized Recruitment Operations</span>
          </div>
        </div>

        {/* 3 Square Cards Grid (Mobile Horizontal Snap Scrollable) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 sm:pb-0 gap-4 sm:grid sm:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {BADGES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[82vw] max-w-[340px] sm:w-auto p-6 bg-slate-50 border border-slate-200 hover:border-slate-900 hover:bg-white transition-all duration-200 flex flex-col justify-between rounded-none"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 px-2 py-0.5">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified Operational Policy</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 mt-2">
          <span>Swipe horizontally for more verification details →</span>
        </div>

      </div>
    </section>
  );
}

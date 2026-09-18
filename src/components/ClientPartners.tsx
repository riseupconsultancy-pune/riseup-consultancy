"use client";

import React from "react";
import { Building2, ShieldCheck, CheckCircle } from "lucide-react";

interface SectorPartner {
  title: string;
  scope: string;
  locations: string;
  payrollType: string;
  tag: string;
}

const SECTORS: SectorPartner[] = [
  {
    title: "Global BPM & Tier-1 BPO Leaders",
    scope: "Customer Care & Inbound Voice",
    locations: "Viman Nagar & Kharadi, Pune",
    payrollType: "Direct Company Payroll",
    tag: "300+ Hired / Mo",
  },
  {
    title: "Private Banking & BFSI Operations",
    scope: "KYC Verification & Account Processing",
    locations: "Magarpatta & Hadapsar, Pune",
    payrollType: "Permanent Corporate Payroll",
    tag: "Day Shifts",
  },
  {
    title: "E-Commerce & Digital CX Giants",
    scope: "Live Chat, Email & Ticket Resolution",
    locations: "Kalyani Nagar & Yerwada, Pune",
    payrollType: "Direct Client Payroll",
    tag: "Free Cab Facility",
  },
  {
    title: "International Shared Services (GIC)",
    scope: "Cross-Border & Regional Ops",
    locations: "Hinjewadi & Baner, Pune",
    payrollType: "Corporate MNC Payroll",
    tag: "UK/US Shifts",
  },
  {
    title: "Fintech & WealthTech Back Office",
    scope: "Records Audit, MIS & Data Ops",
    locations: "Chandan Nagar & Camp, Pune",
    payrollType: "Direct Client Payroll",
    tag: "Mon - Fri Shifts",
  },
  {
    title: "Enterprise Telecom & Tech Desk",
    scope: "L1 Support & Inbound Solutions",
    locations: "Pune & Mumbai Corridors",
    payrollType: "Direct Enterprise Payroll",
    tag: "Immediate Joiners",
  },
];

export default function ClientPartners() {
  return (
    <section className="bg-slate-50 border-b border-slate-200 py-8 sm:py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Subhead without AI blue square dot */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Corporate Client Ecosystem
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
              Hiring for Premier MNCs & Tier-1 BPM Centers Across Pune & Mumbai
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase tracking-wide">
              Direct Client Payroll
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 uppercase tracking-wide">
              100% Free Placement
            </span>
          </div>
        </div>

        {/* 6 Enterprise Sector Cards with High Visual Hierarchy */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 sm:pb-0 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {SECTORS.map((sector, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-[75vw] max-w-[300px] sm:w-auto p-4 bg-white border border-slate-200 hover:border-slate-900 transition-all duration-200 flex flex-col justify-between rounded-none shadow-2xs group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wide">
                    {sector.scope}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5">
                    {sector.tag}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {sector.title}
                </h4>

                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-slate-400 rounded-full" />
                  <span>{sector.locations}</span>
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  ✓ {sector.payrollType}
                </span>
                <span className="text-slate-400 font-mono">No Brokerage</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-2">
          <span>Swipe horizontally to view hiring sectors →</span>
        </div>

      </div>
    </section>
  );
}


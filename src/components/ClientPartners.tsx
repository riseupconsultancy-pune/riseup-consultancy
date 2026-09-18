"use client";

import React from "react";
import { Building2, ShieldCheck } from "lucide-react";

interface PartnerCompany {
  name: string;
  category: string;
  location: string;
  initials: string;
}

const PARTNERS: PartnerCompany[] = [
  {
    name: "Apex Global BPM",
    category: "Customer Operations & Voice",
    location: "Pune & Mumbai",
    initials: "AG",
  },
  {
    name: "Stratum Services",
    category: "Back Office & Financial Ops",
    location: "Pune & Bengaluru",
    initials: "ST",
  },
  {
    name: "FinEdge Banking",
    category: "BFSI & KYC Verification",
    location: "Mumbai & Delhi NCR",
    initials: "FE",
  },
  {
    name: "Cognix Digital",
    category: "Chat & Email Support Desk",
    location: "Pune Headquarters",
    initials: "CX",
  },
  {
    name: "TeleVanguard BPO",
    category: "Inbound Enterprise Voice",
    location: "Hyderabad & Pune",
    initials: "TV",
  },
  {
    name: "Lumina Shared Services",
    category: "International Talent Corridor",
    location: "India & Lagos",
    initials: "LM",
  },
];

export default function ClientPartners() {
  return (
    <section className="bg-slate-50 border-b border-slate-200 py-10 sm:py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Trust Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Trusted Recruitment & Staffing Partner
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline-block">
            Direct Corporate Mandates • Zero Sub-Brokering
          </span>
        </div>

        {/* 6 Partner Logos Grid (Mobile Horizontal Snap Carousel, Desktop 6-Col Grid) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 sm:pb-0 gap-3.5 sm:grid sm:grid-cols-3 lg:grid-cols-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          {PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-[58vw] max-w-[220px] sm:w-auto p-3.5 sm:p-4 bg-white border border-slate-200 hover:border-slate-900 transition-all duration-200 flex flex-col justify-between rounded-none group cursor-default"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                {/* Monogram Emblem */}
                <div className="w-8 h-8 bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {partner.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate tracking-tight">
                    {partner.name}
                  </h4>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {partner.location}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-blue-600 uppercase tracking-wider truncate">
                  {partner.category}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-none shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-2">
          <span>Swipe horizontally to view enterprise partners →</span>
        </div>

      </div>
    </section>
  );
}

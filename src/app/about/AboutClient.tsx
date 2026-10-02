"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import VerificationBadge from "@/components/VerificationBadge";
import { 
  Target, 
  ShieldCheck 
} from "lucide-react";
import Link from "next/link";

const LEADERSHIP = [
  {
    name: "Miss M. Patil",
    role: "Founder & Executive Management",
    department: "Executive Leadership",
    initials: "MP",
    description: "Spearheading strategic vision, enterprise partnerships, and operational expansion across Pan-India and global markets.",
  },
  {
    name: "Mrs. Y. S. Patil",
    role: "Management & Ownership",
    department: "Corporate Governance",
    initials: "YP",
    description: "Overseeing corporate governance, financial stewardship, and institutional compliance for Rise Up Consultancy.",
  },
  {
    name: "Meenakshi Patel",
    role: "HR Manager & Management Team",
    department: "Talent Acquisition & Client Relations",
    initials: "MeP",
    description: "Leading recruitment workflows, candidate screening pipelines, and corporate client relations in the Pune headquarters.",
  },
  {
    name: "Cynthia Glenn",
    role: "Nigeria Virtual Operations",
    department: "Cross-Border Talent Corridor",
    initials: "CG",
    description: "Directing virtual international staffing operations and enterprise talent corridors across Nigeria and regional African markets.",
  },
  {
    name: "Shaziya Khan",
    role: "Operations Manager",
    department: "BPO & Process Coordination",
    initials: "SK",
    description: "Driving operational execution, candidate coordination, and process compliance across high-volume staffing mandates.",
  },
];

export default function AboutClient() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-slate-50/60 border-b border-slate-200/80 py-14 sm:py-20">
        {/* Ambient Glow & Micro-Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/90 border border-blue-200/60 rounded-full mb-4 shadow-2xs backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                About Riseup Consultancy Pune
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Talent Aligned. <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">Futures Elevated.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Established in January 2025 in Pune. Founded with an agile core of recruitment professionals, scaling into a verified Pan-India and cross-border corporate talent force.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <VerificationBadge label="ESTABLISHED JANUARY 2025" />
              <VerificationBadge label="ZERO AGENCY SUB-BROKERING" variant="blue" />
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Story */}
            <div className="lg:col-span-7 group relative bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 p-6 sm:p-10 border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Top Sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-3">
                  Company Background
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
                  Purpose-Built Sourcing for High-Growth Sectors
                </h2>
                <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  <p>
                    <strong className="text-slate-900 font-semibold">Riseup Consultancy Pune – Staffing & Recruiting Services</strong> was established in January 2025 to deliver reliable, professional, and end-to-end recruitment solutions.
                  </p>
                  <p>
                    We operate directly with our corporate clients, eliminating the confusion and delays caused by third-party agency brokering. Every mandate is managed by our dedicated recruitment team based in Chandan Nagar, Pune.
                  </p>
                  <p>
                    Our primary focus is high-performance BPO, customer care, back-office operations, and corporate non-technical roles, with expanding virtual operations in international markets like Nigeria.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 bg-white/90 border border-slate-200/80 rounded-2xl shadow-2xs">
                  <span className="block text-xl font-extrabold text-slate-900">Jan 2025</span>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Founded</span>
                </div>
                <div className="p-3.5 bg-white/90 border border-slate-200/80 rounded-2xl shadow-2xs">
                  <span className="block text-xl font-extrabold text-slate-900">Pan-India</span>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Coverage</span>
                </div>
                <div className="p-3.5 bg-white/90 border border-slate-200/80 rounded-2xl shadow-2xs">
                  <span className="block text-xl font-extrabold text-slate-900">100%</span>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Direct Hire</span>
                </div>
              </div>
            </div>

            {/* Mission Card - Luxury Navy Blue Gradient */}
            <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0B1528] to-slate-950 text-white p-6 sm:p-10 border border-blue-900/40 rounded-3xl shadow-xl shadow-slate-950/20 flex flex-col justify-between">
              {/* Radial glow orb */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-6 shadow-md shadow-blue-500/10">
                  <Target className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-3">
                  Official Mission
                </div>
                <blockquote className="text-base sm:text-lg font-medium italic text-slate-100 leading-relaxed mb-5">
                  &ldquo;Our mission is to connect the right talent with the right opportunities while providing transparent, professional, and efficient recruitment solutions to clients and candidates.&rdquo;
                </blockquote>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  We bridge the gap between verified job seekers and corporate employers, fostering career acceleration and high workforce retention.
                </p>
              </div>

              <div className="relative mt-8 pt-5 border-t border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Riseup Consultancy Pune Charter</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Executive Governance Roster */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-2">
                Executive Governance & Portfolio Leadership
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Management Team Directory
              </h2>
            </div>
            <div className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-2xs">
              Chandan Nagar Pune HQ & Cross-Border Desk
            </div>
          </div>

          {/* 6 Clean Editorial Governance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {LEADERSHIP.map((item, idx) => (
              <div
                key={idx}
                className="group relative p-6 bg-gradient-to-b from-white via-slate-50/80 to-blue-50/25 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-2xl flex flex-col justify-between shadow-2xs overflow-hidden"
              >
                {/* Top Sheen */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wide bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                      {item.department}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      AUTHORIZED
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {item.name}
                  </h3>
                  <div className="text-xs font-bold text-slate-600 mb-2.5">
                    {item.role}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Pune Headquarters Portfolio</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Quick Link to Contact - Luxury Navy Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0B1528] to-slate-950 text-white py-14 sm:py-16 border-t border-blue-900/30">
        {/* Radial glow orb */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Corporate Partnerships
            </div>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Want to partner with Riseup Consultancy?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Reach our Chandan Nagar Pune headquarters or get in touch with our recruiting team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-lg shadow-blue-600/30 active:scale-[0.98]"
            >
              Contact Office
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all rounded-xl backdrop-blur-sm"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingDock onHireClick={() => setIsHireModalOpen(true)} />
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </main>
  );
}

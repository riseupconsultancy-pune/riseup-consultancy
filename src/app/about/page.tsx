"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import VerificationBadge from "@/components/VerificationBadge";
import { 
  Target, 
  ShieldCheck, 
  Building2, 
  Globe2, 
  Briefcase, 
  ArrowUpRight 
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
    name: "Muskaan Mulani",
    role: "Operations Manager",
    department: "BPO & Process Coordination",
    initials: "MM",
    description: "Driving operational execution, candidate coordination, and process compliance across high-volume staffing mandates.",
  },
  {
    name: "Shaziya Khan",
    role: "Recruitment & Sourcing Manager",
    department: "Talent Sourcing & Candidate Pipeline",
    initials: "SK",
    description: "Managing candidate outreach, structured interview schedules, and applicant tracking systems.",
  },
];

export default function AboutPage() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white pb-28 sm:pb-36">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                About Rise Up Consultancy Pune
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Talent Aligned. <span className="text-blue-600">Futures Elevated.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Established in January 2025 in Pune. Founded with an agile core of 2 professionals, scaling into a verified Pan-India and cross-border recruitment force.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <VerificationBadge label="ESTABLISHED JANUARY 2025" />
              <VerificationBadge label="ZERO AGENCY SUB-BROKERING" variant="blue" />
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Story */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-slate-200 rounded-none">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-2">
                Company Background
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
                Purpose-Built Sourcing for High-Growth Sectors
              </h2>
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong className="text-slate-900 font-semibold">Rise Up Consultancy Pune – Staffing & Recruiting Services</strong> was established in January 2025 to deliver reliable, professional, and end-to-end recruitment solutions.
                </p>
                <p>
                  We operate directly with our corporate clients, eliminating the confusion and delays caused by third-party agency brokering. Every mandate is managed by our dedicated recruitment team based in Chandan Nagar, Pune.
                </p>
                <p>
                  Our primary focus is high-performance BPO, customer care, back-office operations, and corporate non-technical roles, with expanding virtual operations in international markets like Nigeria.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="block text-xl font-extrabold text-slate-900">Jan 2025</span>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Founded</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="block text-xl font-extrabold text-slate-900">Pan-India</span>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Coverage</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="block text-xl font-extrabold text-slate-900">100%</span>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Direct Hire</span>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 rounded-none flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block mb-2">
                  Official Mission
                </span>
                <blockquote className="text-sm sm:text-base font-medium italic text-slate-200 leading-relaxed mb-4">
                  &ldquo;Our mission is to connect the right talent with the right opportunities while providing transparent, professional, and efficient recruitment solutions to clients and candidates.&rdquo;
                </blockquote>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We bridge the gap between verified job seekers and corporate employers, fostering career acceleration and high workforce retention.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rise Up Consultancy Pune Charter</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Leadership Directory (No photos, clean typographic executive styling) */}
      <section className="py-12 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-1">
              Leadership & Management
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Directory
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              The management team directing Rise Up Consultancy’s domestic and international sourcing operations:
            </p>
          </div>

          {/* 6 Compact Monogram Cards (Low Padding: p-4 sm:p-5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {LEADERSHIP.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-all rounded-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Monogram Badge */}
                    <div className="w-10 h-10 bg-white border border-slate-200 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {item.initials}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-0.5">
                      {item.department}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-0.5">
                    {item.name}
                  </h3>
                  <div className="text-xs font-semibold text-blue-600 mb-2.5">
                    {item.role}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Authorized Management</span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-none" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Quick Link to Contact */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
              Want to partner with Rise Up Consultancy?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Reach our Chandan Nagar Pune headquarters or get in touch with our recruiting team.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
            >
              Contact Office
            </Link>
            <Link
              href="/jobs"
              className="px-5 py-3 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors rounded-none"
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

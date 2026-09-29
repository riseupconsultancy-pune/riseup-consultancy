"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import VerificationBadge from "@/components/VerificationBadge";
import FeaturedClients from "@/components/FeaturedClients";
import { 
  Users, 
  Workflow, 
  Award, 
  GraduationCap, 
  ArrowUpRight, 
  CheckCircle2, 
  Briefcase, 
  Clock, 
  Headphones, 
  FileText, 
  MessageSquare, 
  Building, 
  TrendingUp, 
  UserCheck 
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const BPO_SPECIALIZATIONS = [
    {
      icon: Headphones,
      title: "Voice Process & Telecalling",
      badge: "Inbound & Outbound",
      description: "Customer service associates, telecalling representatives, and voice-based relationship officers.",
      skills: ["English & Hindi Fluency", "Active Listening", "Day/Rotational Shift"],
    },
    {
      icon: FileText,
      title: "Non-Voice & Back Office",
      badge: "Operations & Records",
      description: "Data processing executives, transaction verification specialists, and back-office documentation staff.",
      skills: ["35+ WPM Typing", "MS Excel", "Accuracy & Audit"],
    },
    {
      icon: MessageSquare,
      title: "Chat & Email Support",
      badge: "Digital Care",
      description: "High-speed live chat agents, email support representatives, and escalation resolution staff.",
      skills: ["Written Grammar", "Fast Typing", "Multi-Chat Handling"],
    },
    {
      icon: Building,
      title: "Banking & BFSI Operations",
      badge: "Financial Services",
      description: "KYC verification officers, loan documentation associates, and retail banking support specialists.",
      skills: ["BFSI Knowledge", "Compliance", "Document Check"],
    },
    {
      icon: TrendingUp,
      title: "Sales & Account Acquisition",
      badge: "Sales / Non-Sales",
      description: "Inside sales representatives, client acquisition executives, and retention specialists.",
      skills: ["Negotiation", "B2B / B2C", "Goal Oriented"],
    },
    {
      icon: Users,
      title: "Team Leader & Supervisory",
      badge: "Leadership",
      description: "BPO team leaders, quality analysts (QA), process trainers, and operations floor managers.",
      skills: ["KPI Tracking", "Attrition Control", "Coaching"],
    },
  ];

  const SERVICE_PILLARS = [
    {
      icon: Users,
      title: "Permanent Staffing & Executive Selection",
      scope: "Pan-India & Global Mandates",
      points: [
        "Rigorous 3-tier candidate screening & skill verification",
        "Direct permanent hire matching corporate culture",
        "Domestic Indian metro coverage (Pune, Mumbai, Bengaluru)",
        "International corridor placements (Nigeria & Regional Hubs)",
      ],
    },
    {
      icon: Workflow,
      title: "High-Volume BPO & Contract Staffing",
      scope: "Immediate Joiner Turnaround",
      points: [
        "Voice, non-voice, and digital chat support batches",
        "Dedicated sourcing pipeline for 25 to 100+ headcounts",
        "Strict SLA turnaround (shortlists delivered in 24-48 hrs)",
        "Zero agency sub-brokering; 100% directly sourced candidates",
      ],
    },
    {
      icon: Award,
      title: "Recruitment Process Outsourcing (RPO)",
      scope: "Turnkey Workforce Sourcing",
      points: [
        "End-to-end management of client recruitment funnels",
        "Structured interview coordination and feedback collection",
        "Applicant tracking system (ATS) pipeline updates",
        "Reduction in internal HR administrative workload",
      ],
    },
    {
      icon: GraduationCap,
      title: "HR Enablement & Recruiter Training",
      scope: "Capability & Process Coaching",
      points: [
        "Recruitment lifecycle coaching for sourcing executives",
        "Candidate assessment methodologies and screening techniques",
        "Cold calling, telephonic etiquette & WhatsApp outreach",
        "Compliance, offer management & attrition prevention",
      ],
    },
  ];

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
                Practice Areas & Sourcing Matrix
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Specialized Staffing & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">Sourcing Solutions</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Tailored recruitment frameworks engineered for high-volume BPO operations, non-technical corporate hiring, and permanent staffing across India and international corridors.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsHireModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 rounded-xl cursor-pointer active:scale-[0.98]"
              >
                <Briefcase className="w-4 h-4" />
                <span>Request Custom Mandate</span>
              </button>
              <VerificationBadge label="AUDITED DIRECT SOURCING" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Client Partners Marquee */}
      <FeaturedClients 
        headline="Our Corporate Clients & Hiring Partners"
        subheadline="Trusted by top BPM, BPO, and enterprise leaders across Pune, Bengaluru, Hyderabad, and Pan-India."
      />

      {/* Part 1: BPO & Non-Technical Specialization Grid */}
      <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-2">
                Core Sourcing Focus
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                BPO & Operational Roles We Deliver
              </h2>
            </div>
            <span className="text-xs text-slate-600 font-semibold bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
              Immediate Joiner & Experienced Pipelines
            </span>
          </div>

          {/* 6 Ultra-Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {BPO_SPECIALIZATIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-6 bg-gradient-to-b from-white via-slate-50/80 to-blue-50/25 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xs"
                >
                  {/* Top Glossy Sheen Highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-sm group-hover:shadow-blue-500/10 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-5 font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-semibold text-slate-600 bg-white/90 border border-slate-200/70 px-2.5 py-0.5 rounded-full shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Part 2: Strategic Pillars */}
      <section className="py-14 sm:py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
        {/* Ambient Subtle Orb */}
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-2">
              Enterprise Engagement Models
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              4 Pillars of Our Recruitment Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {SERVICE_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-6 sm:p-8 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xs"
                >
                  {/* Top Glossy Sheen Highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <VerificationBadge label={pillar.scope} size="sm" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                      {pillar.title}
                    </h3>

                    <ul className="space-y-2.5 mb-8">
                      {pillar.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setIsHireModalOpen(true)}
                    type="button"
                    className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer text-left w-full"
                  >
                    <span>Inquire for Your Company</span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Strip - Luxury Navy Blue Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0B1528] to-slate-950 text-white py-14 sm:py-16 border-t border-blue-900/30">
        {/* Ambient Glow Orb */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Corporate Desk
            </div>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Have an active hiring requirement?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Speak directly with HR Manager Meenakshi Patel or submit a custom mandate.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+919359892819"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-lg shadow-blue-600/30 active:scale-[0.98]"
            >
              Call +91 93598 92819
            </a>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all rounded-xl backdrop-blur-sm"
            >
              Office Details
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

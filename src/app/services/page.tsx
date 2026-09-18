"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import VerificationBadge from "@/components/VerificationBadge";
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
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white pb-28 sm:pb-36">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Practice Areas & Services
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Specialized Staffing & Sourcing Solutions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Tailored recruitment frameworks engineered for high-volume BPO operations, non-technical corporate hiring, and permanent staffing across India and international markets.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsHireModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors rounded-none cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Request Custom Mandate</span>
              </button>
              <VerificationBadge label="AUDITED DIRECT SOURCING" />
            </div>
          </div>
        </div>
      </section>

      {/* Part 1: BPO & Non-Technical Specialization Grid */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-1">
                Core Sourcing Focus
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                BPO & Operational Roles We Deliver
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Immediate Joiner & Experienced Pipelines
            </span>
          </div>

          {/* 6 Compact Cards (Low Padding, High Legibility) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {BPO_SPECIALIZATIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 bg-white border border-slate-200 hover:border-slate-900 transition-all rounded-none flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5"
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
      <section className="py-12 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-1">
              Enterprise Engagement Models
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              4 Pillars of Our Recruitment Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICE_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-all rounded-none flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <VerificationBadge label={pillar.scope} size="sm" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      {pillar.title}
                    </h3>

                    <ul className="space-y-2 mb-6">
                      {pillar.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 bg-blue-600 shrink-0 mt-1" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setIsHireModalOpen(true)}
                    type="button"
                    className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors cursor-pointer text-left w-full"
                  >
                    <span>Inquire for Your Company</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
              Have an active hiring requirement?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Speak with HR Manager Meenakshi Patel or submit a custom mandate.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+919359892819"
              className="px-5 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors rounded-none"
            >
              Call +91 93598 92819
            </a>
            <Link
              href="/contact"
              className="px-5 py-3 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors rounded-none"
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

"use client";

import React from "react";
import { 
  Users, 
  Award, 
  Workflow, 
  GraduationCap, 
  ArrowUpRight, 
  CheckCircle2,
  Globe2
} from "lucide-react";

interface ServicesSectionProps {
  onHireClick?: () => void;
}

const SERVICE_PILLARS = [
  {
    icon: Users,
    title: "Permanent & Strategic Staffing",
    tag: "Domestic & Global",
    description: "End-to-end recruitment and selection connecting organizations with rigorously vetted professionals across India and international markets.",
    services: [
      "Permanent Staffing & Direct Hire",
      "Executive & Leadership Selection",
      "Domestic Pan-India Recruitment",
      "International Cross-Border Hiring",
    ],
  },
  {
    icon: Workflow,
    title: "BPO & Non-Technical Staffing",
    tag: "High-Volume SLA",
    description: "Rapid, SLA-driven deployment of high-caliber talent for voice processes, back-office operations, customer support, and financial services.",
    services: [
      "BPO & Customer Experience Staffing",
      "Non-Technical Operational Roles",
      "Contract & Flexible Staffing Solutions",
      "Immediate Joiner Talent Pipelines",
    ],
  },
  {
    icon: Award,
    title: "RPO & Sourcing Management",
    tag: "Turnkey Execution",
    description: "Turnkey Recruitment Process Outsourcing that manages your sourcing funnel, background checks, and candidate lifecycle seamlessly.",
    services: [
      "Recruitment Process Outsourcing (RPO)",
      "Multi-Tier Sourcing & Resume Screening",
      "Structured Interview Coordination",
      "Client Acquisition & Hiring Support",
    ],
  },
  {
    icon: GraduationCap,
    title: "HR & Recruitment Training",
    tag: "Capability Building",
    description: "Professional coaching and structured training modules for aspiring recruiters, sourcing specialists, and corporate HR teams.",
    services: [
      "End-to-End Recruiter Training Modules",
      "Talent Sourcing & Portal Mastery",
      "Interview Coordination Best Practices",
      "Candidate Assessment & Culture Fit",
    ],
  },
];

export default function ServicesSection({ onHireClick }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Practice Areas & Services
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Comprehensive Recruitment & Staffing Solutions
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              From individual strategic placements to high-volume operational hiring, Rise Up Consultancy delivers structured recruitment frameworks tailored to enterprise requirements.
            </p>
          </div>

          <button
            onClick={onHireClick}
            type="button"
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors rounded-none cursor-pointer"
          >
            <span>Request Custom Mandate</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Square Pillar Cards (Mobile Horizontal Snap Scrollable) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 sm:pb-0 gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {SERVICE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[84vw] max-w-[340px] sm:w-auto p-7 bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-900 hover:shadow-xl transition-all duration-200 flex flex-col justify-between rounded-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200 px-2 py-1 bg-white">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    {pillar.description}
                  </p>

                  {/* Included Services Bullet List */}
                  <div className="pt-4 border-t border-slate-200/80 space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Deliverables:
                    </span>
                    {pillar.services.map((item, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onHireClick}
                  type="button"
                  className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors w-full cursor-pointer text-left"
                >
                  <span>Inquire Solution</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 mt-2">
          <span>Swipe horizontally to view all services →</span>
        </div>

      </div>
    </section>
  );
}
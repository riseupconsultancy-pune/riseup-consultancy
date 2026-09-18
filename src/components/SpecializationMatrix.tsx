"use client";

import React from "react";
import { 
  PhoneCall, 
  FileText, 
  Headphones, 
  MessageSquare, 
  Building, 
  TrendingUp, 
  UserCheck, 
  Users, 
  ArrowUpRight,
  Info
} from "lucide-react";
import Link from "next/link";

interface SpecializationMatrixProps {
  onJobsClick?: () => void;
}

const SPECIALIZATIONS = [
  {
    icon: PhoneCall,
    title: "Voice Process & Telecalling",
    category: "Inbound & Outbound",
    roles: ["Customer Care Executive", "Inbound Voice Support", "Outbound Telesales", "Relationship Officer"],
    tags: ["English & Hindi Fluency", "Active Listening", "Day/Rotational Shift"],
  },
  {
    icon: FileText,
    title: "Non-Voice & Back Office",
    category: "Operations & Records",
    roles: ["Back Office Executive", "Data Processing Associate", "Transaction Verification", "Records Auditor"],
    tags: ["35+ WPM Typing", "MS Excel", "Detail Oriented"],
  },
  {
    icon: MessageSquare,
    title: "Chat & Email Support",
    category: "Digital Customer Care",
    roles: ["Live Chat Specialist", "Email Resolution Officer", "Escalation Desk Associate", "Helpdesk Agent"],
    tags: ["Written English", "Problem Solving", "Multi-tasking"],
  },
  {
    icon: Building,
    title: "Banking & BFSI Operations",
    category: "Financial Services",
    roles: ["KYC Verification Officer", "Loan Processing Associate", "Banking Operations", "Account Servicing"],
    tags: ["BFSI Knowledge", "Compliance", "Document Verification"],
  },
  {
    icon: TrendingUp,
    title: "Sales & Account Acquisition",
    category: "Sales & Non-Sales",
    roles: ["Corporate Sales Executive", "Inside Sales Specialist", "Retention Executive", "Field Sales"],
    tags: ["Negotiation", "B2B / B2C", "Incentive Driven"],
  },
  {
    icon: Users,
    title: "Team Leader & Supervisory",
    category: "Operations Management",
    roles: ["BPO Team Leader", "Quality Analyst (QA)", "Operations Supervisor", "Floor Manager"],
    tags: ["People Leadership", "SLA & KPI Tracking", "Attrition Control"],
  },
  {
    icon: UserCheck,
    title: "HR & Recruitment Operations",
    category: "Internal & Corporate HR",
    roles: ["HR Recruiter", "Talent Sourcing Specialist", "Onboarding Coordinator", "HR Generalist"],
    tags: ["Candidate Screening", "Portal Sourcing", "Interview Scheduling"],
  },
  {
    icon: Headphones,
    title: "International Staffing",
    category: "Cross-Border Corridor",
    roles: ["Overseas BPO Roles", "Multinational Customer Service", "International Shared Services", "Lagos & Regional Hubs"],
    tags: ["Global Client SLA", "Neutral Accent", "Cross-Border Support"],
  },
];

export default function SpecializationMatrix({ onJobsClick }: SpecializationMatrixProps) {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Current Hiring Specialization
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Specialized in High-Volume BPO & Non-Technical Talent
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Purpose-built sourcing pipelines for enterprise BPO, customer care, back office, and operations in Pune and beyond.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors self-start sm:self-auto shrink-0 pb-1"
          >
            <span>Explore All 13 Sourcing Services</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Cards: Responsive Grid on Desktop, Horizontal Snap Carousel on Mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 sm:pb-0 gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {SPECIALIZATIONS.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[80vw] max-w-[320px] sm:w-auto p-4 sm:p-5 bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md transition-all duration-200 flex flex-col justify-between rounded-none group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-slate-50 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5">
                      {spec.category}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                    {spec.title}
                  </h3>

                  {/* Representative Roles List */}
                  <ul className="space-y-1 mb-3">
                    {spec.roles.slice(0, 3).map((role, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-blue-600 shrink-0" />
                        <span className="truncate">{role}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skill Pill Badges */}
                  <div className="flex flex-wrap gap-1 pt-2.5 border-t border-slate-100">
                    {spec.tags.slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/jobs"
                  className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>Explore Openings</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-2">
          <span>Swipe horizontally to browse all specializations →</span>
        </div>

        {/* Official Note regarding IT / Future expansion */}
        <div className="mt-10 p-4 sm:p-5 bg-white border border-blue-200 flex items-start sm:items-center gap-3.5 rounded-none">
          <div className="w-8 h-8 bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="font-bold text-slate-900">Future Scope Announcement:</strong> IT and Technical recruitment may be undertaken for specific enterprise client mandates when officially announced through authorized Rise Up Consultancy channels.
          </div>
        </div>

      </div>
    </section>
  );
}

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
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Current Hiring Specialization
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Specialized in High-Volume BPO & Non-Technical Talent
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Rise Up Consultancy operates a purpose-built sourcing infrastructure designed to fulfill enterprise BPO, customer support, back office, and operational staffing mandates with verified turnaround times.
          </p>
        </div>

        {/* 8 Cards: Responsive Grid on Desktop, Horizontal Snap Carousel on Mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 sm:pb-0 gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {SPECIALIZATIONS.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[84vw] max-w-[340px] sm:w-auto p-6 bg-white border border-slate-200 hover:border-slate-900 hover:shadow-lg transition-all duration-200 flex flex-col justify-between rounded-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-slate-50 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1">
                      {spec.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
                    {spec.title}
                  </h3>

                  {/* Representative Roles List */}
                  <ul className="space-y-1.5 mb-4">
                    {spec.roles.map((role, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-600 shrink-0" />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skill Pill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {spec.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/jobs"
                  className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>Explore Openings</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 mt-2">
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

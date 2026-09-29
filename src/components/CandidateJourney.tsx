"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, PhoneCall, Sparkles, Building, FileCheck2 } from "lucide-react";

interface Step {
  number: string;
  title: string;
  timeline: string;
  description: string;
  checklist: string[];
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Application & Fast HR Screening",
    timeline: "Within 2 - 4 Hours",
    description: "Submit your profile or resume. Our Pune recruitment team calls you for a 15-minute voice assessment and shift preference check.",
    checklist: ["Resume & Contact Check", "Language & Fluency Review", "Shift Flexibility Check"],
  },
  {
    number: "02",
    title: "Mock Interview & Skill Prep",
    timeline: "Same-Day Coaching",
    description: "We prepare you for the client's exact evaluation criteria: typing test practice, customer scenario handling, and voice modulation.",
    checklist: ["30+ WPM Typing Drill", "Grammar & Versant Tips", "Client Expectation Alignment"],
  },
  {
    number: "03",
    title: "Direct Client Walk-In Round",
    timeline: "Next Working Day",
    description: "You attend the client interview with our verified recommendation. No queues, no sub-brokers — direct interview with operations leads.",
    checklist: ["Operations Manager Round", "HR & Salary Discussion", "Spot Evaluation Feedback"],
  },
  {
    number: "04",
    title: "Offer Release & Day-1 Onboarding",
    timeline: "100% Free Placement",
    description: "Receive your official appointment letter on the client company's direct payroll with full medical, cab, and incentive entitlements.",
    checklist: ["Direct Company Payroll", "Zero Charges or Deductions", "Free Drop & Pick Cab Facility"],
  },
];

export default function CandidateJourney() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Transparent Placement Pathway
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              From Resume Submission to Job Offer in 48 Hours
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              No endless waiting. A clear, structured hiring process designed to secure verified BPO and corporate placements.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 self-start sm:self-auto rounded-xl shadow-sm hover:shadow-md"
          >
            <span>Browse Active Openings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Step Connected Journey Timeline (Grid with sequential track connecting line) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="relative p-5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-all duration-200 flex flex-col justify-between rounded-2xl group shadow-2xs hover:shadow-md"
            >
              {/* Step Number Tag & Timeline Pill */}
              <div>
                <div className="flex items-baseline justify-between mb-3 border-b border-slate-200/80 pb-2.5">
                  <span className="font-mono text-2xl font-black text-blue-600">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {step.timeline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              {/* Checklist verification items */}
              <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                {step.checklist.map((item, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Practical Candidate Reassurance Strip */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950 rounded-2xl shadow-2xs">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            <span>Candidate Guarantee: Rise Up Consultancy never charges registration fees, security deposits, or commission from job seekers.</span>
          </div>
          <span className="text-[11px] text-blue-700 font-semibold shrink-0">
            Assistance is 100% Free • Direct Client Payroll
          </span>
        </div>

      </div>
    </section>
  );
}

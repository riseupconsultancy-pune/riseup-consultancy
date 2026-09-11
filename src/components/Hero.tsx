"use client";

import React, { useState } from "react";
import { ArrowUpRight, Search, Briefcase, Users, Building2, CheckCircle2, Sparkles } from "lucide-react";

interface HeroProps {
  onHireClick?: () => void;
  onJobsClick?: () => void;
}

export default function Hero({ onHireClick, onJobsClick }: HeroProps) {
  return (
    <section className="relative pt-12 pb-24 sm:pt-16 sm:pb-32 overflow-hidden">
      {/* Ambient Blue Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 ambient-glow pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Minimalist Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/70 shadow-xs mb-8">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide uppercase text-blue-800">
            Thrive Together • Premier Recruitment Partner
          </span>
        </div>

        {/* Minimalist High-Impact Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          Connecting Talent with{" "}
          <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Opportunity
          </span>
        </h1>

        {/* Crisp Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Right people. Right jobs. Accelerating visionary companies and ambitious careers across{" "}
          <span className="font-semibold text-slate-800">Pune</span> &{" "}
          <span className="font-semibold text-slate-800">Dubai</span>.
        </p>

        {/* The Two Main Action Buttons (Samsung / Apple Flagship UI) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {/* Button 1: Looking to Hire Talent */}
          <button
            onClick={onHireClick}
            type="button"
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span>Looking to Hire Talent</span>
            <ArrowUpRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Button 2: Looking for Jobs */}
          <button
            onClick={onJobsClick}
            type="button"
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-800 font-semibold text-base shadow-sm hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
            <span>Looking for Jobs</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Minimalist Trust & Proof Badges */}
        <div className="mt-14 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Stat 1 */}
            <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900 tracking-tight">500+</div>
                <div className="text-xs text-slate-500 font-medium">Companies Served</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900 tracking-tight">10,000+</div>
                <div className="text-xs text-slate-500 font-medium">Candidates Placed</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900 tracking-tight">48 Hours</div>
                <div className="text-xs text-slate-500 font-medium">Candidate Match</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
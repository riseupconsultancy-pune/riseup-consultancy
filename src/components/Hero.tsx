"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Search, Briefcase, Building2, Users, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface HeroProps {
  onHireClick?: () => void;
  onJobsClick?: () => void;
}

export default function Hero({ onHireClick, onJobsClick }: HeroProps) {
  return (
    <section className="relative pt-10 pb-20 sm:pt-14 sm:pb-28 overflow-hidden bg-white">
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/50 via-sky-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-slate-100/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two-Column Modern Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authentic Typography & Two Action Buttons */}
          <div className="lg:col-span-7 flex flex-col text-left">
            
            {/* Minimal Sub-Headline Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
                Staffing & Executive Recruitment
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
              Connecting top talent with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                visionary companies
              </span>
            </h1>

            {/* Editorial Value Proposition Subhead */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              RiseUp is your strategic recruitment partner across India and Nigeria. We help companies fill critical vacancies with verified professionals, while fast-tracking candidates into high-growth careers.
            </p>

            {/* The Two Main Action Buttons (High contrast, spacious, non-generic) */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Button 1: Looking to Hire Talent */}
              <button
                onClick={onHireClick}
                type="button"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                <Briefcase className="w-4 h-4 text-white/90" />
                <span>Looking to Hire Talent</span>
                <ArrowUpRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              {/* Button 2: Looking for Jobs */}
              <button
                onClick={onJobsClick}
                type="button"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white border border-slate-300/90 text-slate-800 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50/40 font-semibold text-sm sm:text-base shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                <Search className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                <span>Looking for Jobs</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Minimalist Trust & Proof Bar */}
            <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">500+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Partner Companies</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">10k+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Vetted Candidates</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">48 hrs</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Shortlist Guarantee</div>
              </div>
            </div>

          </div>

          {/* Right Column: Professional Image Blended with Background */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Background Glow Behind Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-sky-100/30 to-white rounded-3xl -z-10" />

            {/* Main Blended Talent Image Container */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100">
              <Image
                src="/images/hero-talent.jpg"
                alt="RiseUp Recruitment Professional"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              
              {/* Subtle Gradient Overlay to Blend Edges with White Canvas */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Glass Micro-Card 1: Shortlist Speed */}
            <div className="absolute -bottom-5 -left-4 sm:left-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-900/10 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">48h Candidate Match</div>
                <div className="text-[11px] text-slate-500">Fast-tracked interview slots</div>
              </div>
            </div>

            {/* Floating Glass Micro-Card 2: Verified Partner */}
            <div className="absolute -top-4 -right-3 sm:right-2 p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-900/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">100% Vetted Talent</div>
                <div className="text-[10px] text-blue-600 font-semibold">India & Nigeria Network</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
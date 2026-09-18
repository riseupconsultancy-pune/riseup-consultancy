"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Search, Briefcase } from "lucide-react";

interface HeroProps {
  onHireClick?: () => void;
  onJobsClick?: () => void;
}

export default function Hero({ onHireClick, onJobsClick }: HeroProps) {
  return (
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative Editorial & Square Action Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left z-10">
            
            {/* Minimalist Top Indicator */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-2 h-2 bg-blue-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Est. January 2025 • Pune Headquarters & Global Markets
              </span>
            </div>

            {/* Main Authoritative Headline with Official Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Talent Aligned.{" "}
              <span className="text-blue-600">Futures Elevated.</span>
            </h1>

            {/* Grounded Corporate Subtitle with Tagline Dual Meaning */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              <strong className="text-slate-900 font-semibold">Rise Up Consultancy Pune</strong> connects organizations with high-performing BPO, corporate, and non-technical talent. Aligning top talent with opportunity, elevating futures for candidates and businesses.
            </p>

            {/* Two Square Action Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Button 1: Request Talent (Employers) */}
              <button
                onClick={onHireClick}
                type="button"
                className="group inline-flex items-center justify-center gap-3 px-9 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-none cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-white" />
                <span>Request Talent</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              {/* Button 2: Apply to Jobs (Job Seekers) */}
              <button
                onClick={onJobsClick}
                type="button"
                className="group inline-flex items-center justify-center gap-3 px-9 py-4 bg-transparent border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-none cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Browse Vacancies</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Architectural Proof Metrics with Square Hairlines */}
            <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-lg">
              <div className="border-l-2 border-blue-600 pl-4">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Jan 2025</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">
                  Est. in Pune
                </div>
              </div>
              <div className="border-l-2 border-slate-300 pl-4">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Pan-India</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">
                  & Global Sourcing
                </div>
              </div>
              <div className="border-l-2 border-slate-300 pl-4">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">100%</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">
                  Direct Sourcing
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Seamlessly Blended & Zoomed Talent Image (No borders, No shadow, No floating widgets) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end min-h-[440px] lg:min-h-[560px]">
            
            {/* The Zoomed Image with Multiple Smooth Edge Gradients */}
            <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] overflow-hidden">
              <Image
                src="/images/hero-talent.jpg"
                alt="Corporate Recruiter & Executive Talent"
                fill
                priority
                className="object-cover object-top scale-110 lg:scale-120 transform transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 600px"
              />

              {/* Edge Gradient Blends (Fading smoothly into white canvas) */}
              {/* Left Edge Fade */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
              {/* Bottom Edge Fade */}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
              {/* Top Edge Fade */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
              {/* Right Edge Fade */}
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/60 to-transparent pointer-events-none" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
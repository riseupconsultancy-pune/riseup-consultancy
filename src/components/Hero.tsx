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
    <section className="relative pt-6 pb-16 sm:pt-10 sm:pb-20 lg:pt-16 lg:pb-24 bg-gradient-to-b from-slate-50 via-blue-50/25 to-white border-b border-slate-200/80 overflow-hidden">
      
      {/* Decorative Atmospheric Ambient Glow Orbs */}
      <div className="absolute -top-32 -right-24 w-96 sm:w-[540px] h-96 sm:h-[540px] bg-gradient-to-br from-blue-400/15 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-28 -left-20 w-80 sm:w-[480px] h-80 sm:h-[480px] bg-gradient-to-tr from-sky-400/10 via-blue-200/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      
      {/* Precision Micro Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Column 1: Desktop Left (Text & Buttons) | Mobile Order 2 (Below Top Logo) */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center items-center text-center lg:items-start lg:text-left z-10">
            
            {/* Hero Text Headlines */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-slate-900 tracking-tight uppercase font-heading leading-tight sm:leading-[1.04]">
                RISE UP <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent block sm:inline">CONSULTANCY</span>
              </h1>
              <span className="mt-1.5 sm:mt-2 text-xs sm:text-sm lg:text-base font-extrabold uppercase tracking-widest text-slate-500 block">
                Staffing &amp; Recruiting Services
              </span>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-600 font-normal leading-relaxed max-w-md sm:max-w-xl mx-auto lg:mx-0">
                Direct company payroll staffing and verified recruitment across Pune, Pan-India, and international corridors. Connecting ambitious talent with premier organizations with 100% free placement assistance.
              </p>
            </div>

            {/* Two Action Buttons with Natural Rounded Corners & Ambient Shadows */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mt-6 sm:mt-7">
              {/* Button 1: Request Talent (Employers) */}
              <button
                onClick={onHireClick}
                type="button"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-9 sm:py-4 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-xl cursor-pointer w-full sm:w-auto shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Briefcase className="w-4 h-4 text-white shrink-0" />
                <span>Request Talent</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* Button 2: Apply to Jobs (Job Seekers) */}
              <button
                onClick={onJobsClick}
                type="button"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-9 sm:py-4 bg-white/90 backdrop-blur-xs border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-xl cursor-pointer w-full sm:w-auto shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>Browse Vacancies</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>
            </div>

            {/* Proof Metrics with Natural Rounded Gradient Cards */}
            <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-7 border-t border-slate-200/80 grid grid-cols-3 gap-2.5 sm:gap-4 max-w-lg w-full">
              <div className="bg-gradient-to-b from-white/95 to-slate-50/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-3.5 text-left shadow-2xs hover:shadow-md hover:border-blue-300/80 transition-all duration-200">
                <div className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight font-heading">Jan 2025</div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5 sm:mt-1">
                  Est. in Pune
                </div>
              </div>
              <div className="bg-gradient-to-b from-white/95 to-slate-50/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-3.5 text-left shadow-2xs hover:shadow-md hover:border-blue-300/80 transition-all duration-200">
                <div className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight font-heading">Pan-India</div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5 sm:mt-1">
                  &amp; Global Sourcing
                </div>
              </div>
              <div className="bg-gradient-to-b from-white/95 to-slate-50/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-3.5 text-left shadow-2xs hover:shadow-md hover:border-blue-300/80 transition-all duration-200">
                <div className="text-base sm:text-xl lg:text-2xl font-bold text-blue-600 tracking-tight font-heading">100%</div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5 sm:mt-1">
                  Direct Sourcing
                </div>
              </div>
            </div>

          </div>

          {/* Column 2: Desktop Right (1.5x Logo with Subtle Ambient Luminous Halo) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center lg:justify-end">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-[460px] lg:h-[460px] xl:w-[500px] xl:h-[500px] 2xl:w-[540px] 2xl:h-[540px] aspect-square flex items-center justify-center shrink-0">
              
              {/* Subtle Ambient Halo behind Logo */}
              <div className="absolute inset-4 sm:inset-8 bg-radial from-blue-500/15 via-indigo-400/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/images/rise_up_consultancy_pune_logo.png"
                  alt="Rise Up Consultancy Official Logo"
                  fill
                  priority
                  className="object-contain select-none"
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 208px, (max-width: 1280px) 500px, 540px"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
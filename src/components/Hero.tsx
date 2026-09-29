"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, Briefcase } from "lucide-react";

interface HeroProps {
  onHireClick?: () => void;
  onJobsClick?: () => void;
}

const TICKER_ITEMS = [
  { stat: "Jan 2025", label: "Est. in Pune HQ" },
  { stat: "Pan-India & Global", label: "Cross-Border Sourcing" },
  { stat: "100% Free Placement", label: "Zero Candidate Fees" },
  { stat: "Direct Payroll", label: "24–48h Sourcing SLA" },
];

export default function Hero({ onHireClick, onJobsClick }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-[calc(100vh-4rem)] lg:min-h-[92vh] flex items-center pt-20 pb-14 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 bg-gradient-to-b from-slate-50 via-blue-50/25 to-white border-b border-slate-200/80 overflow-hidden"
    >
      {/* Decorative Atmospheric Ambient Glow Orbs with Slow Breathing Animation */}
      <div
        className="absolute -top-32 -right-24 w-96 sm:w-[540px] h-96 sm:h-[540px] bg-gradient-to-br from-blue-400/15 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none animate-ambient-float"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 -left-20 w-80 sm:w-[480px] h-80 sm:h-[480px] bg-gradient-to-tr from-sky-400/10 via-blue-200/10 to-transparent rounded-full blur-3xl pointer-events-none animate-ambient-float-reverse"
        aria-hidden="true"
      />

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.08), transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Precision Micro Grid Overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-2 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Column 1: Desktop Left (Text & Services & Actions & Marquee) | Mobile Order 2 */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center items-center text-center lg:items-start lg:text-left z-10">
            
            {/* Hero Text Headlines with Entrance Animation */}
            <div className="animate-hero-fade-up-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-[5rem] font-black text-slate-900 tracking-tight uppercase font-heading leading-[1.04] sm:leading-[1.02]">
                RISE UP{" "}
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent block sm:inline">
                  CONSULTANCY
                </span>
              </h1>
              <span className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-base font-extrabold uppercase tracking-widest text-blue-600 block">
                Staffing &amp; Recruiting Services
              </span>
            </div>

            {/* Dual Audience Service Value Points (> Bullet Lines) with Entrance Animation */}
            <div className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-left w-full max-w-2xl animate-hero-fade-up-2">
              {/* Line 1: Corporate Clients */}
              <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm lg:text-[15px] text-slate-700 leading-relaxed group">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-black text-xs shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  &gt;
                </span>
                <span>
                  <strong className="text-slate-900 font-bold font-heading">For Corporate Clients:</strong> Direct company payroll staffing, executive search, and volume hiring with guaranteed <span className="font-semibold text-blue-700">24–48h sourcing SLA</span>.
                </span>
              </div>

              {/* Line 2: Job Seekers */}
              <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm lg:text-[15px] text-slate-700 leading-relaxed group">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-black text-xs shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  &gt;
                </span>
                <span>
                  <strong className="text-slate-900 font-bold font-heading">For Job Seekers:</strong> <span className="font-semibold text-blue-700">100% free placement support</span>, authentic MNC walk-in interviews, direct client payroll offers, and zero sub-broker policy.
                </span>
              </div>

              {/* Line 3: Geographic & International Reach */}
              <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm lg:text-[15px] text-slate-700 leading-relaxed group">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-black text-xs shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  &gt;
                </span>
                <span>
                  <strong className="text-slate-900 font-bold font-heading">Pune HQ &amp; Global Corridors:</strong> Verified talent pipelines across Pune tech corridors, Pan-India metros, and cross-border international markets.
                </span>
              </div>
            </div>

            {/* Two Action Buttons with Natural Rounded Corners & Entrance Animation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mt-7 sm:mt-8 animate-hero-fade-up-3">
              {/* Button 1: Request Talent (Employers) */}
              <button
                onClick={onHireClick}
                type="button"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:px-9 sm:py-4.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-2xl cursor-pointer w-full sm:w-auto shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Briefcase className="w-4 h-4 text-white shrink-0" />
                <span>Request Talent</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* Button 2: Apply to Jobs (Job Seekers) */}
              <button
                onClick={onJobsClick}
                type="button"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:px-9 sm:py-4.5 bg-white/90 backdrop-blur-xs border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-2xl cursor-pointer w-full sm:w-auto shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>Browse Vacancies</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>
            </div>

            {/* Seamless Borderless Flowing Marquee Ticker with Entrance Animation */}
            <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-7 border-t border-slate-200/80 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] animate-hero-fade-up-4">
              <div className="animate-marquee-left-fast flex items-center gap-8 sm:gap-10 py-1">
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 shadow-xs shadow-blue-500/50" />
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base lg:text-lg font-black text-slate-900 font-heading tracking-tight">
                        {item.stat}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-slate-300 ml-4 sm:ml-6 text-xs sm:text-sm select-none" aria-hidden="true">•</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Desktop Right (Enlarged Responsive Logo with Halo & Entrance Animation) | Mobile Order 1 */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center lg:justify-end animate-hero-scale-fade my-2 sm:my-3 lg:my-0">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-[460px] lg:h-[460px] xl:w-[500px] xl:h-[500px] 2xl:w-[540px] 2xl:h-[540px] aspect-square flex items-center justify-center shrink-0">
              
              {/* Subtle Ambient Halo behind Logo */}
              <div className="absolute inset-4 sm:inset-8 bg-radial from-blue-500/15 via-indigo-400/5 to-transparent rounded-full blur-2xl pointer-events-none animate-ambient-float" />

              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/images/rise_up_consultancy_pune_logo.png"
                  alt="Rise Up Consultancy Official Logo"
                  fill
                  priority
                  className="object-contain select-none"
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, (max-width: 1024px) 240px, (max-width: 1280px) 500px, 540px"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
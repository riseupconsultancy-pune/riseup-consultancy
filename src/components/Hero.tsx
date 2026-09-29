"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, Briefcase, ChevronRight } from "lucide-react";

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

const TYPEWRITER_PHRASES = [
  "Staffing & Recruiting Services",
  "Direct Company Payroll Staffing",
  "Verified 24–48h Sourcing SLA",
  "100% Free Placement Assistance",
  "Pan-India & Global Recruitment",
];

export default function Hero({ onHireClick, onJobsClick }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Typewriter typing animation state
  const [typewriterText, setTypewriterText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && typewriterText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && typewriterText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
    } else {
      const speed = isDeleting ? 25 : 60;
      timer = setTimeout(() => {
        setTypewriterText((prev) =>
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, phraseIndex]);

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
      className="relative min-h-[calc(100vh-3.5rem)] lg:min-h-[92vh] flex items-center pt-16 pb-4 sm:pt-20 sm:pb-6 md:pt-24 md:pb-14 lg:pt-32 lg:pb-20 bg-gradient-to-b from-slate-50 via-blue-50/25 to-white border-b border-slate-200/80 overflow-hidden"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-1 sm:py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* Column 1: Desktop Left (Text & Services & Actions & Marquee) | Mobile Order 2 */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center items-center text-center lg:items-start lg:text-left z-10">
            
            {/* Hero Text Headlines with Entrance Animation */}
            <div className="animate-hero-fade-up-1">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-[5rem] font-black text-slate-900 tracking-tight uppercase font-heading leading-[1.04] sm:leading-[1.02]">
                RISE UP{" "}
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent block sm:inline">
                  CONSULTANCY
                </span>
              </h1>
              
              {/* Dynamic Typewriter Animation with Cursor */}
              <div className="mt-1 sm:mt-2 min-h-[22px] sm:min-h-[28px] flex items-center justify-center lg:justify-start">
                <span className="text-[11px] sm:text-xs md:text-sm lg:text-base font-extrabold uppercase tracking-widest text-blue-600">
                  {typewriterText}
                </span>
                <span className="inline-block w-[2px] h-3.5 sm:h-4.5 bg-blue-600 ml-1 animate-pulse" />
              </div>
            </div>

            {/* Single-Line Concise Service Bullet Points (Background-Free Premium Chevron Icons) */}
            <div className="mt-3.5 sm:mt-5 space-y-1.5 sm:space-y-2 text-left w-full max-w-xl">
              {/* Line 1: Corporate Clients */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis animate-reveal-left-1">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0 stroke-[2.5]" />
                <span className="truncate">
                  <strong className="font-bold text-slate-900 font-heading">Corporate Clients:</strong> Direct Company Payroll &amp; 24–48h SLA
                </span>
              </div>

              {/* Line 2: Job Seekers */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis animate-reveal-left-2">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0 stroke-[2.5]" />
                <span className="truncate">
                  <strong className="font-bold text-slate-900 font-heading">Job Seekers:</strong> 100% Free Placement &amp; MNC Walk-Ins
                </span>
              </div>

              {/* Line 3: Active Network */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis animate-reveal-left-3">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0 stroke-[2.5]" />
                <span className="truncate">
                  <strong className="font-bold text-slate-900 font-heading">Active Network:</strong> Pune HQ, Pan-India &amp; Cross-Border Corridors
                </span>
              </div>
            </div>

            {/* Two Action Buttons with Natural Rounded Corners (Side-by-side on Mobile to save vertical space) */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 w-full sm:w-auto mt-4 sm:mt-6 animate-hero-fade-up-3">
              {/* Button 1: Request Talent (Employers) */}
              <button
                onClick={onHireClick}
                type="button"
                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-7 sm:py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-xl sm:rounded-2xl cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>Request Talent</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* Button 2: Apply to Jobs (Job Seekers) */}
              <button
                onClick={onJobsClick}
                type="button"
                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-7 sm:py-3.5 bg-white/90 backdrop-blur-xs border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-xl sm:rounded-2xl cursor-pointer shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Browse Jobs</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>
            </div>

            {/* Seamless Borderless Flowing Marquee Ticker with Entrance Animation */}
            <div className="mt-4 sm:mt-7 lg:mt-9 pt-3 sm:pt-5 border-t border-slate-200/80 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] animate-hero-fade-up-4">
              <div className="animate-marquee-left-fast flex items-center gap-6 sm:gap-10 py-0.5">
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 shrink-0 shadow-xs shadow-blue-500/50" />
                    <div className="flex items-baseline gap-1 sm:gap-1.5">
                      <span className="text-xs sm:text-sm lg:text-base font-black text-slate-900 font-heading tracking-tight">
                        {item.stat}
                      </span>
                      <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-slate-300 ml-3 sm:ml-5 text-xs select-none" aria-hidden="true">•</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Desktop Right (Enlarged Responsive Logo with Halo) | Mobile Order 1 (Compact on mobile) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center lg:justify-end animate-hero-scale-fade my-1 sm:my-2 lg:my-0">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-44 md:h-44 lg:w-[440px] lg:h-[440px] xl:w-[480px] xl:h-[480px] 2xl:w-[520px] 2xl:h-[520px] aspect-square flex items-center justify-center shrink-0">
              
              {/* Subtle Ambient Halo behind Logo */}
              <div className="absolute inset-2 sm:inset-4 lg:inset-8 bg-radial from-blue-500/15 via-indigo-400/5 to-transparent rounded-full blur-xl sm:blur-2xl pointer-events-none animate-ambient-float" />

              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/images/rise_up_consultancy_pune_logo.png"
                  alt="Rise Up Consultancy Official Logo"
                  fill
                  priority
                  className="object-contain select-none"
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 176px, (max-width: 1024px) 220px, (max-width: 1280px) 480px, 520px"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
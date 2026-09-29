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
  "Staffing & Executive Recruiting",
  "Direct Company Payroll Staffing",
  "Verified 24–48h Talent SLA",
  "100% Free Placement Assistance",
  "Pan-India & International Corridors",
];

export default function Hero({ onHireClick, onJobsClick }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Typewriter typing animation state
  const [typewriterText, setTypewriterText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Video ref and smooth continuous loop without end glitch / black screen
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animId: number;

    const handleLoop = () => {
      if (video && video.duration && !video.paused) {
        // Frame 173 at (duration - 1.0s) is the optimal match to Frame 0, skipping the end black screen glitch
        const loopThreshold = Math.max(0, video.duration - 1.0);
        if (video.currentTime >= loopThreshold) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }
      animId = requestAnimationFrame(handleLoop);
    };

    animId = requestAnimationFrame(handleLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    if (video.currentTime >= Math.max(0, video.duration - 1.0)) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

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
      className="relative min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-between pt-16 sm:pt-20 md:pt-20 lg:pt-22 bg-gradient-to-b from-slate-50 via-blue-50/25 to-white border-b border-slate-200/80 overflow-hidden"
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

      {/* Center Body: Vertically Centered Grid Layout */}
      <div className="flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full py-1 sm:py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 xl:gap-12 items-center w-full">
          
          {/* Column 1: Desktop Left (Text & Services & Actions) | Mobile Order 2 */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
            
            {/* Hero Text Headlines with Entrance Animation */}
            <div className="animate-hero-fade-up-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-slate-900 tracking-tight uppercase font-heading leading-[1.05] sm:leading-[1.02]">
                RISE UP{" "}
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent block sm:inline">
                  CONSULTANCY
                </span>
              </h1>
              
              {/* Dynamic Typewriter Animation with Cursor */}
              <div className="mt-1 sm:mt-1.5 min-h-[22px] sm:min-h-[26px] flex items-center justify-center lg:justify-start">
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black uppercase tracking-wider text-blue-600">
                  {typewriterText}
                </span>
                <span className="inline-block w-[2px] h-3.5 sm:h-4.5 bg-blue-600 ml-1.5 animate-pulse" />
              </div>
            </div>

            {/* Concise Single-Line Service Points with Proper Proportional Sizing */}
            <div className="mt-3.5 sm:mt-4.5 space-y-2 sm:space-y-2.5 lg:space-y-3 text-left w-full max-w-2xl">
              {/* Line 1: Corporate Clients */}
              <div className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-[15px] md:text-base lg:text-lg xl:text-[19px] text-slate-800 font-medium leading-normal animate-reveal-left-1">
                <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 text-blue-600 shrink-0 stroke-[2.5]" />
                <span>
                  <strong className="font-bold text-slate-900 font-heading">Corporate Clients:</strong> Direct Payroll &amp; 24–48h SLA
                </span>
              </div>

              {/* Line 2: Job Seekers */}
              <div className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-[15px] md:text-base lg:text-lg xl:text-[19px] text-slate-800 font-medium leading-normal animate-reveal-left-2">
                <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 text-blue-600 shrink-0 stroke-[2.5]" />
                <span>
                  <strong className="font-bold text-slate-900 font-heading">Job Seekers:</strong> 100% Free Placement &amp; MNC Drives
                </span>
              </div>

              {/* Line 3: Active Network */}
              <div className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-[15px] md:text-base lg:text-lg xl:text-[19px] text-slate-800 font-medium leading-normal animate-reveal-left-3">
                <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 text-blue-600 shrink-0 stroke-[2.5]" />
                <span>
                  <strong className="font-bold text-slate-900 font-heading">Active Network:</strong> Pune HQ, Pan-India &amp; Global
                </span>
              </div>
            </div>

            {/* Two Action Buttons with Equal Proportional Widths and Screen Margin Safety */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:mx-0 mt-4 sm:mt-5 animate-hero-fade-up-3">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                {/* Button 1: Request Talent (Employers) */}
                <button
                  onClick={onHireClick}
                  type="button"
                  className="group w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 sm:px-6 sm:py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm md:text-base tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-xl sm:rounded-2xl cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                  <span className="truncate">Request Talent</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 hidden min-[400px]:inline" />
                </button>

                {/* Button 2: Apply to Jobs (Job Seekers) */}
                <button
                  onClick={onJobsClick}
                  type="button"
                  className="group w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 sm:px-6 sm:py-3.5 bg-white/95 backdrop-blur-xs border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs sm:text-sm md:text-base tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-xl sm:rounded-2xl cursor-pointer shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">Browse Jobs</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 hidden min-[400px]:inline" />
                </button>
              </div>
            </div>

          </div>

          {/* Column 2: Desktop Right (Animated Video Logo with Ambient Halo) | Mobile Order 1 */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center lg:justify-end my-1 sm:my-2 lg:my-0">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-[420px] lg:h-[420px] xl:w-[460px] xl:h-[460px] 2xl:w-[500px] 2xl:h-[500px] aspect-square flex items-center justify-center shrink-0">
              
              {/* Subtle Ambient Halo behind Video Logo */}
              <div className="absolute inset-2 sm:inset-4 lg:inset-8 bg-radial from-blue-500/15 via-indigo-400/5 to-transparent rounded-full blur-xl sm:blur-2xl pointer-events-none animate-ambient-float" />

              {/* Seamless Looped Animated Video Logo Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Seamless Programmatically Looped Animated Video Logo (1s glitch trimmed) */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  poster="/images/rise_up_consultancy_pune_logo.png"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  className="w-full h-full object-contain mix-blend-multiply select-none pointer-events-none"
                >
                  <source src="/images/hero_video.mov" type="video/quicktime" />
                  <source src="/images/hero video.MOV" type="video/quicktime" />
                  <source src="/images/hero_video.mov" type="video/mp4" />
                  <source src="/images/hero video.MOV" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Seamless Borderless Flowing Marquee Ticker: Positioned safely above the fixed bottom navigation dock without top line */}
      <div className="w-full relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-auto pt-1 pb-28 sm:pb-32 lg:pb-32 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] animate-hero-fade-up-4">
        <div className="animate-marquee-left-fast flex items-center gap-6 sm:gap-10 py-1">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 shrink-0 shadow-xs shadow-blue-500/50" />
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm md:text-base font-black text-slate-900 font-heading tracking-tight">
                  {item.stat}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  {item.label}
                </span>
              </div>
              <span className="text-slate-300 ml-3 sm:ml-5 text-xs select-none" aria-hidden="true">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
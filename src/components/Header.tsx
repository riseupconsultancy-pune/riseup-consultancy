import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-slate-200/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo & Name */}
        <Link href="/" className="group flex items-center gap-3.5 focus:outline-none">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            {/* Minimalist RiseUp SVG Logo (Rising Chevron / Wing) */}
            <svg
              className="w-6 h-6 text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
              <line x1="12" y1="9" x2="12" y2="21" />
            </svg>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center tracking-tight">
              <span className="text-xl font-bold text-slate-900">Rise</span>
              <span className="text-xl font-extrabold text-blue-600">Up</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1.5 pl-1.5 border-l border-slate-300 hidden sm:inline-block">
                Consultancy
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-normal">
              Your Career. Our Commitment.
            </span>
          </div>
        </Link>

        {/* Right: Dual Country Flags & Locations */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* India (Pune) Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:bg-blue-50/40 transition-colors">
            {/* Square India Flag */}
            <div className="w-5 h-5 rounded-sm overflow-hidden flex flex-col shadow-2xs border border-slate-200 shrink-0">
              <div className="h-1/3 bg-[#FF9933]" />
              <div className="h-1/3 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full border-[0.6px] border-[#000080]" />
              </div>
              <div className="h-1/3 bg-[#138808]" />
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Pune</span>
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline">, IN</span>
            </div>
          </div>

          {/* UAE (Dubai) Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:bg-blue-50/40 transition-colors">
            {/* Square UAE Flag */}
            <div className="w-5 h-5 rounded-sm overflow-hidden flex shadow-2xs border border-slate-200 shrink-0">
              <div className="w-1/3 bg-[#FF0000]" />
              <div className="w-2/3 flex flex-col">
                <div className="h-1/3 bg-[#00732f]" />
                <div className="h-1/3 bg-white" />
                <div className="h-1/3 bg-black" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Dubai</span>
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline">, AE</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

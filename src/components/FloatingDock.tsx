"use client";

import React, { useState } from "react";
import { Home, Briefcase, Sparkles, Building2, PhoneCall } from "lucide-react";

interface FloatingDockProps {
  activeTab?: string;
  onTabSelect?: (tab: string) => void;
}

export default function FloatingDock({ activeTab = "home", onTabSelect }: FloatingDockProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleSelect = (tabId: string) => {
    if (onTabSelect) {
      onTabSelect(tabId);
    }
  };

  const getItemClass = (tab: string) => {
    const isSelected = activeTab === tab;
    return (
      "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 " +
      (isSelected
        ? "text-blue-600 bg-blue-50/80 shadow-xs"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-100/70")
    );
  };

  return (
    <nav
      aria-label="Floating Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto"
    >
      <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full glass-dock shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-white/80 bg-white/75 backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)]">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleSelect("home")}
          onMouseEnter={() => setHoveredTab("home")}
          onMouseLeave={() => setHoveredTab(null)}
          className={getItemClass("home")}
        >
          <Home className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">Home</span>
          {hoveredTab === "home" && (
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-medium shadow-sm pointer-events-none animate-fadeIn">
              Home
            </span>
          )}
        </button>

        {/* 2. Services */}
        <button
          type="button"
          onClick={() => handleSelect("services")}
          onMouseEnter={() => setHoveredTab("services")}
          onMouseLeave={() => setHoveredTab(null)}
          className={getItemClass("services")}
        >
          <Sparkles className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">Services</span>
          {hoveredTab === "services" && (
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-medium shadow-sm pointer-events-none animate-fadeIn">
              Services
            </span>
          )}
        </button>

        {/* 3. Jobs (CENTER POSITION - THE HERO ICON) */}
        <div className="relative px-1">
          <button
            type="button"
            onClick={() => handleSelect("jobs")}
            onMouseEnter={() => setHoveredTab("jobs")}
            onMouseLeave={() => setHoveredTab(null)}
            className="group relative flex flex-col items-center justify-center w-14 h-14 -my-2 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/35 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white"
          >
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping pointer-events-none" />
            
            <Briefcase className="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-bold tracking-tight text-white/95">Jobs</span>

            {hoveredTab === "jobs" && (
              <span className="absolute -top-9 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-semibold tracking-wide shadow-md pointer-events-none">
                Explore Jobs
              </span>
            )}
          </button>
        </div>

        {/* 4. For Employers / Hire */}
        <button
          type="button"
          onClick={() => handleSelect("hire")}
          onMouseEnter={() => setHoveredTab("hire")}
          onMouseLeave={() => setHoveredTab(null)}
          className={getItemClass("hire")}
        >
          <Building2 className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">Employers</span>
          {hoveredTab === "hire" && (
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-medium shadow-sm pointer-events-none animate-fadeIn">
              For Employers
            </span>
          )}
        </button>

        {/* 5. Contact */}
        <button
          type="button"
          onClick={() => handleSelect("contact")}
          onMouseEnter={() => setHoveredTab("contact")}
          onMouseLeave={() => setHoveredTab(null)}
          className={getItemClass("contact")}
        >
          <PhoneCall className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
          <span className="text-[10px] font-medium mt-0.5 tracking-tight">Contact</span>
          {hoveredTab === "contact" && (
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-medium shadow-sm pointer-events-none animate-fadeIn">
              Contact Us
            </span>
          )}
        </button>

      </div>
    </nav>
  );
}
"use client";

import React, { useState } from "react";
import { Home, Briefcase, Settings2, UserPlus, Mail } from "lucide-react";

interface FloatingDockProps {
  activeTab?: string;
  onTabSelect?: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "services", label: "Services", icon: Settings2 },
  { id: "hire", label: "For Employers", icon: UserPlus },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function FloatingDock({ activeTab = "home", onTabSelect }: FloatingDockProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleClick = (id: string) => {
    setCurrentTab(id);
    onTabSelect?.(id);
  };

  return (
    <nav
      aria-label="Bottom Quick Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      {/* Square-Edged High-End Architectural Frosted Glass Dock */}
      <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.15)] transition-all duration-300">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={`relative flex flex-col items-center justify-center transition-all duration-200 focus:outline-none ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs px-4 sm:px-6 py-2.5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-3 sm:px-5 py-2.5"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                  isActive ? "stroke-[2.2] scale-105 text-white" : "stroke-[1.75]"
                }`}
              />
              <span
                className={`text-[11px] uppercase tracking-wider whitespace-nowrap ${
                  isActive ? "font-bold text-white" : "font-medium text-slate-600"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
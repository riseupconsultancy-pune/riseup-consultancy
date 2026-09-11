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
      {/* Floating Apple-Style Frosted Capsule Dock */}
      <div className="flex items-center gap-2 sm:gap-6 px-3 sm:px-6 py-2 rounded-full bg-white/80 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.12),0_0_0_1px_rgba(226,232,240,0.7)] transition-all duration-300">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={`relative flex flex-col items-center justify-center transition-all duration-300 focus:outline-none ${
                isActive
                  ? "px-4 sm:px-5 py-2 rounded-full bg-white text-blue-600 shadow-md shadow-blue-900/5 -my-0.5"
                  : "px-3 sm:px-4 py-1.5 text-slate-700 hover:text-blue-600 hover:scale-105"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? "stroke-[2.5] scale-105" : "stroke-[1.75]"
                }`}
              />
              <span
                className={`text-[11px] mt-1 font-medium tracking-tight whitespace-nowrap ${
                  isActive ? "font-bold text-blue-600" : "text-slate-600"
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
"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Briefcase, Settings2, UserPlus, Mail } from "lucide-react";

interface FloatingDockProps {
  onHireClick?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "jobs", label: "Jobs", href: "/jobs", icon: Briefcase },
  { id: "services", label: "Services", href: "/#services", icon: Settings2 },
  { id: "hire", label: "For Employers", isAction: true, icon: UserPlus },
  { id: "contact", label: "Contact", href: "/#contact", icon: Mail },
];

export default function FloatingDock({ onHireClick }: FloatingDockProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === "/jobs") return "jobs";
    return "home";
  };

  const activeTab = getActiveTab();

  const handleNav = (item: NavItem) => {
    if (item.isAction) {
      onHireClick?.();
      return;
    }
    if (item.href) {
      if (item.href.startsWith("/#") && pathname === "/") {
        const id = item.href.replace("/#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(item.href);
      }
    }
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-3 sm:bottom-6 inset-x-0 mx-auto z-50 flex justify-center px-3.5 sm:px-6 pointer-events-none"
    >
      {/* Perfect Square Solid White Dock - Centered with Symmetric Margins on Mobile */}
      <div className="pointer-events-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 bg-white border border-slate-300 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.22)] rounded-none w-full max-w-[420px] sm:w-auto transition-all duration-300">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item)}
              className={`relative flex flex-col items-center justify-center transition-all duration-200 focus:outline-none flex-1 sm:flex-initial rounded-none ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs px-2 sm:px-5 py-2"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-1.5 sm:px-4 py-2"
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 transition-transform duration-200 ${
                  isActive ? "stroke-[2.2] scale-105 text-white" : "stroke-[1.75]"
                }`}
              />
              <span
                className={`text-[9px] sm:text-[11px] uppercase tracking-wider whitespace-nowrap ${
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
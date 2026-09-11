"use client";

import React from "react";
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
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[96vw] sm:max-w-none"
    >
      {/* Solid Clean White Dock with Soft Rounded Edges */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.18)] rounded-2xl transition-all duration-300">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item)}
              className={`relative flex flex-col items-center justify-center transition-all duration-200 focus:outline-none shrink-0 ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs px-3 sm:px-5 py-2 rounded-xl"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-2.5 sm:px-4 py-2 rounded-xl"
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
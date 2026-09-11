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
      className="fixed bottom-3 sm:bottom-6 inset-x-0 mx-auto z-50 flex justify-center px-3 sm:px-4 pointer-events-none"
    >
      {/* Perfect Square Solid White Dock - Strict Border Containment & Proportional Width */}
      <div className="pointer-events-auto inline-flex items-stretch bg-white border border-slate-300 shadow-[0_16px_36px_-8px_rgba(15,23,42,0.22)] rounded-none overflow-hidden w-full max-w-[360px] sm:w-auto transition-all">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item)}
              className={`flex flex-col items-center justify-center flex-1 sm:flex-initial transition-colors focus:outline-none rounded-none py-2 sm:py-2.5 px-2 sm:px-5 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 sm:mb-1 shrink-0 ${
                  isActive ? "stroke-[2.2] text-white" : "stroke-[1.75]"
                }`}
              />
              <span
                className={`text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap leading-none ${
                  isActive ? "text-white" : "text-slate-600"
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
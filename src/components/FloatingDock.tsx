"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, SearchCheck, Workflow, Users, PhoneCall } from "lucide-react";

interface FloatingDockProps {
  onHireClick?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  mobileLabel?: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", mobileLabel: "Home", href: "/", icon: Home },
  { id: "services", label: "Services", mobileLabel: "Services", href: "/services", icon: Workflow },
  { id: "jobs", label: "Jobs", mobileLabel: "Jobs", href: "/jobs", icon: SearchCheck },
  { id: "about", label: "About", mobileLabel: "About", href: "/about", icon: Users },
  { id: "contact", label: "Contact", mobileLabel: "Contact", href: "/contact", icon: PhoneCall },
];

export default function FloatingDock({ onHireClick }: FloatingDockProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.startsWith("/services")) return "services";
    if (pathname.startsWith("/jobs")) return "jobs";
    if (pathname.startsWith("/about")) return "about";
    if (pathname.startsWith("/contact")) return "contact";
    return "home";
  };

  const activeTab = getActiveTab();

  const handleNav = (item: NavItem) => {
    if (item.isAction) {
      onHireClick?.();
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <nav
      aria-label="Bottom Quick Navigation"
      className="fixed bottom-4 sm:bottom-6 inset-x-0 mx-auto z-50 flex justify-center px-3 sm:px-4 pointer-events-none"
    >
      {/* Symmetrical 5-Column Liquid Glass Floating Dock with Equal Slot Widths */}
      <div className="pointer-events-auto grid grid-cols-5 gap-1 sm:gap-1.5 w-full max-w-[460px] sm:max-w-[540px] p-1.5 liquid-glass rounded-none">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-0.5 sm:px-1 rounded-none transition-all duration-200 focus:outline-none w-full min-w-0 ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-blue-600 hover:bg-white/60 active:bg-blue-50/70"
              }`}
            >
              <Icon
                className={`w-5 h-5 sm:w-5 sm:h-5 mb-1 shrink-0 ${
                  isActive ? "stroke-[2.2] text-white" : "stroke-[1.9] text-slate-700"
                }`}
              />
              <span
                className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center truncate max-w-full px-0.5 ${
                  isActive ? "text-white" : "text-slate-700"
                }`}
              >
                {item.mobileLabel && item.mobileLabel !== item.label ? (
                  <>
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.mobileLabel}</span>
                  </>
                ) : (
                  item.label
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
"use client";

import React, { useState, useRef } from "react";
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

  const dockRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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
      {/* Symmetrical 5-Column Liquid Glass Floating Dock with Light Gradient & Interactive Cursor Glow */}
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative pointer-events-auto grid grid-cols-5 gap-1 sm:gap-1.5 w-full max-w-[460px] sm:max-w-[540px] p-1.5 liquid-glass bg-gradient-to-r from-white/95 via-blue-50/50 to-white/95 border border-white/90 ring-1 ring-slate-200/80 rounded-full shadow-lg overflow-hidden backdrop-blur-md"
      >
        {/* Glossy Top Sheen Reflection */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none rounded-t-full"
          aria-hidden="true"
        />

        {/* Interactive Cursor Spotlight Glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full overflow-hidden transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.16), transparent 75%)`,
          }}
          aria-hidden="true"
        />

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item)}
              aria-label={item.label}
              className={`relative z-10 flex flex-col items-center justify-center py-2 sm:py-2.5 px-0.5 sm:px-1 rounded-full transition-all duration-200 focus:outline-none w-full min-w-0 ${
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
                className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-tight sm:tracking-wider text-center truncate max-w-full px-0.5 ${
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
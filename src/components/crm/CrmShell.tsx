"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Shield,
  Building2,
  Users,
  ExternalLink,
  LayoutDashboard,
  Briefcase,
  FileText,
  UserCheck,
  PlusCircle,
  FileCheck,
  MessageSquareShare
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth-actions";
import { SessionUser } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface CrmShellProps {
  user: SessionUser;
  children: React.ReactNode;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Master Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Client Management", icon: Building2 },
  { href: "/admin/recruiters", label: "HR Management", icon: Users },
  { href: "/admin/vacancies", label: "Vacancies & Broadcast", icon: Briefcase },
  { href: "/admin/agreements", label: "Client Agreements", icon: FileText },
  { href: "/admin/candidates", label: "Website Candidate Pool", icon: UserCheck },
];

const CLIENT_NAV_ITEMS: NavItem[] = [
  { href: "/client/dashboard", label: "Drive Overview", icon: LayoutDashboard },
  { href: "/client/vacancies/new", label: "Request Candidate", icon: PlusCircle },
  { href: "/client/vacancies", label: "Posted Vacancies", icon: Briefcase },
  { href: "/client/candidates", label: "Interview Candidates", icon: Users },
  { href: "/client/agreements", label: "Client Agreements", icon: FileCheck },
];

const HR_NAV_ITEMS: NavItem[] = [
  { href: "/hr/dashboard", label: "Recruiter Hub", icon: LayoutDashboard },
  { href: "/hr/vacancies", label: "Openings & Links", icon: Briefcase },
  { href: "/hr/candidates", label: "Candidate ATS Pipeline", icon: Users },
  { href: "/hr/settings", label: "WhatsApp Template", icon: MessageSquareShare },
];

export default function CrmShell({ user, children }: CrmShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPortalConfig = () => {
    switch (user.role) {
      case "SUPER_ADMIN":
        return {
          portalTitle: "Executive Administration",
          badgeLabel: "Master Admin",
          badgeBg: "bg-slate-900 text-white",
          BadgeIcon: Shield,
          navItems: ADMIN_NAV_ITEMS,
        };
      case "CLIENT":
        return {
          portalTitle: "Corporate Client Workspace",
          badgeLabel: "Corporate Client",
          badgeBg: "bg-blue-700 text-white",
          BadgeIcon: Building2,
          navItems: CLIENT_NAV_ITEMS,
        };
      case "HR_RECRUITER":
        return {
          portalTitle: "Recruiter Operations",
          badgeLabel: "HR Recruiter",
          badgeBg: "bg-emerald-700 text-white",
          BadgeIcon: Users,
          navItems: HR_NAV_ITEMS,
        };
    }
  };

  const { portalTitle, badgeLabel, badgeBg, BadgeIcon, navItems } = getPortalConfig();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* Mobile Top App Bar */}
      <header className="lg:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-white">
            <Image
              src="/images/rise_up_consultancy_pune_logo.jpg"
              alt="RiseUp Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white tracking-tight truncate">RiseUp CRM</span>
            <span className="text-[10px] text-slate-400 truncate">{portalTitle}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-none focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation Backdrop & Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 text-white p-5 z-50 border-r border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BadgeIcon className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {portalTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="mt-5 space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-none transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Profile & Logout */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-none">
                <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
                <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600/20 border border-red-500/30 transition-colors rounded-none cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Fixed Left Pillar with Sharp Square Styling) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 text-white border-r border-slate-800 shrink-0 min-h-screen sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <Link href="/" target="_blank" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-700 bg-white shrink-0">
              <Image
                src="/images/rise_up_consultancy_pune_logo.jpg"
                alt="RiseUp Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight font-heading">
                  RiseUp
                </span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  CRM
                </span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                {portalTitle}
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 ml-auto" />
          </Link>
        </div>

        {/* Current User Role Pill */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${badgeBg}`}>
              <BadgeIcon className="w-3 h-3" />
              <span>{badgeLabel}</span>
            </span>
          </div>
          <div className="mt-1.5 text-xs font-bold text-slate-200 truncate">
            {user.fullName}
          </div>
          <div className="text-[10.5px] text-slate-400 truncate">
            {user.email}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-1.5">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-none transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded-none">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 ${isActive ? "opacity-100 text-white" : ""}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors rounded-none"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600 transition-colors rounded-none border border-red-500/30 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
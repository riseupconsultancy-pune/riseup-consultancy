"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Building2, Users, ArrowRight, AlertCircle, Eye, EyeOff, Lock, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/actions/auth-actions";

type RoleType = "SUPER_ADMIN" | "CLIENT" | "HR_RECRUITER";

interface RoleOption {
  id: RoleType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  pill: string;
}

const ROLES: RoleOption[] = [
  { 
    id: "SUPER_ADMIN", 
    label: "Super Admin", 
    icon: Shield, 
    desc: "Platform Control & Governance",
    pill: "Executive Control",
  },
  { 
    id: "CLIENT", 
    label: "Corporate Client", 
    icon: Building2, 
    desc: "Hiring Drives & Candidate Review",
    pill: "Employer Portal",
  },
  { 
    id: "HR_RECRUITER", 
    label: "HR Recruiter", 
    icon: Users, 
    desc: "Mandate Sourcing & Candidate ATS",
    pill: "ATS Pipeline",
  },
];

export default function LoginForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType>("SUPER_ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Switch role without filling any credentials
  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("expectedRole", selectedRole);

      const res = await loginAction(formData);

      if (!res.success) {
        setError(res.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      if (res.redirectTo) {
        router.push(res.redirectTo);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const activeRoleConfig = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="text-center mb-6 sm:mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-3 group focus:outline-none mb-4 p-1.5 rounded-2xl hover:bg-white/60 transition-colors"
        >
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white p-1">
            <Image
              src="/images/rise_up_consultancy_pune_logo.png"
              alt="Rise Up Consultancy Official Logo"
              fill
              sizes="44px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
                RiseUp
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                CRM
              </span>
            </div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Staffing &amp; Recruitment Operations
            </span>
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          Portal Authentication
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
          Select your assigned access portal and sign in with your authorized credentials.
        </p>
      </div>

      {/* Main Premium Card with Rounded Edges & Glassmorphism */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all">
        
        {/* Role Selector Tabs (3 Equal Responsive Columns with Rounded Corners) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Select Access Role
            </label>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {activeRoleConfig.pill}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl transition-all duration-200 focus:outline-none min-h-[58px] ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 shrink-0 ${isSelected ? "text-white" : "text-slate-500"}`} />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-tight text-center truncate max-w-full">
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
            <span className="truncate">{activeRoleConfig.desc}</span>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-2.5 text-left animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@riseupconsultancy.in"
                autoComplete="email"
                className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-slate-900 placeholder:text-slate-400 rounded-xl transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-slate-900 placeholder:text-slate-400 rounded-xl transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold text-sm tracking-wide rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to {selectedRole.replace("_", " ")}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Reassurance Footnote */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>256-Bit SSL Encrypted Enterprise Session</span>
        </div>
      </div>

      {/* Return to Home Link */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-2 px-3 rounded-xl hover:bg-white/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to RiseUp Consultancy Home</span>
        </Link>
      </div>
    </div>
  );
}
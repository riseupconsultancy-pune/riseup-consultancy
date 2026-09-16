"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Building2, Users, ArrowRight, AlertCircle, Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { loginAction } from "@/app/actions/auth-actions";

type RoleType = "SUPER_ADMIN" | "CLIENT" | "HR_RECRUITER";

const ROLES: { id: RoleType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { id: "SUPER_ADMIN", label: "Super Admin", icon: Shield, desc: "Platform Control & Governance" },
  { id: "CLIENT", label: "Corporate Client", icon: Building2, desc: "Hiring Drives & Candidate Review" },
  { id: "HR_RECRUITER", label: "HR Recruiter", icon: Users, desc: "Mandate Sourcing & Candidate ATS" },
];

export default function LoginForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType>("SUPER_ADMIN");
  const [email, setEmail] = useState("admin@riseupconsultancy.in");
  const [password, setPassword] = useState("AdminRiseUp@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill helper for easy testing
  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setError(null);
    if (role === "SUPER_ADMIN") {
      setEmail("admin@riseupconsultancy.in");
      setPassword("AdminRiseUp@2026");
    } else if (role === "CLIENT") {
      setEmail("client@apexglobal.com");
      setPassword("ClientApex@2026");
    } else if (role === "HR_RECRUITER") {
      setEmail("hr.priya@riseupconsultancy.in");
      setPassword("HRPriya@2026");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("expectedRole", selectedRole);

      const res = await loginAction(formData);

      if (!res.success) {
        setError(res.error || "Authentication failed. Please check your credentials.");
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

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-xs bg-white">
            <Image
              src="/images/rise_up_consultancy_pune_logo.jpg"
              alt="RiseUp Consultancy Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
              RiseUp <span className="text-blue-600 text-xs font-bold uppercase tracking-widest ml-1 border-l border-slate-300 pl-2">CRM</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Staffing & Recruitment Operations
            </span>
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
          Portal Authentication
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Select your assigned role and log in with your authorized credentials.
        </p>
      </div>

      {/* Main Square Container */}
      <div className="bg-white border border-slate-200 shadow-xl rounded-none p-6 sm:p-8">
        
        {/* Role Selector Tabs (3 Equal Columns with Strict Square Corners) */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Portal Access
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-none border border-slate-200">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-none transition-all duration-150 focus:outline-none ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? "text-white" : "text-slate-500"}`} />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-center truncate max-w-full">
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
            <span>{ROLES.find((r) => r.id === selectedRole)?.desc}</span>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-600 flex items-start gap-3 rounded-none animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email
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
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-3 text-sm bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400 rounded-none transition-colors outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
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
                className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400 rounded-none transition-colors outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm tracking-wider uppercase transition-colors rounded-none shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
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

        {/* Quick Testing Footnote */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Preset Test Credentials (Active):
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 border border-slate-200 rounded-none font-mono">
            <div><strong className="text-slate-800">Admin:</strong> admin@riseupconsultancy.in / AdminRiseUp@2026</div>
            <div><strong className="text-slate-800">Client:</strong> client@apexglobal.com / ClientApex@2026</div>
            <div><strong className="text-slate-800">HR:</strong> hr.priya@riseupconsultancy.in / HRPriya@2026</div>
          </div>
        </div>
      </div>

      {/* Back to Public Site */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to RiseUp Consultancy Home</span>
        </Link>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  KeyRound, 
  Check, 
  X, 
  UserCheck, 
  Link2, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Radio
} from "lucide-react";
import { createHrAction, resetPasswordAction, toggleUserStatusAction } from "@/app/actions/admin-actions";

interface HrRecord {
  id: string;
  userId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string | null;
  commissionRate: number | null;
  status: string;
  isOnline: boolean;
  hasLoggedInToday: boolean;
  sourcedCount: number;
  placedCount: number;
  activeLinksCount: number;
  createdAt: string;
}

export default function HrManager({ initialRecruiters }: { initialRecruiters: HrRecord[] }) {
  const [recruiters, setRecruiters] = useState<HrRecord[]>(initialRecruiters);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resetModalUserId, setResetModalUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRecruiters = recruiters.filter(
    (hr) =>
      hr.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hr.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hr.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await createHrAction(formData);
      if (!res.success) {
        setActionError(res.error || "Failed to create HR account.");
        setIsSubmitting(false);
        return;
      }

      setActionSuccess("HR Recruiter account created successfully!");
      setIsCreateOpen(false);
      window.location.reload();
    } catch {
      setActionError("Unexpected error occurred while creating HR account.");
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUserId || newPassword.length < 6) return;
    setIsSubmitting(true);
    setActionError(null);

    const res = await resetPasswordAction(resetModalUserId, newPassword);
    if (!res.success) {
      setActionError(res.error || "Failed to reset password.");
      setIsSubmitting(false);
      return;
    }

    setActionSuccess("Password updated successfully!");
    setResetModalUserId(null);
    setNewPassword("");
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (userId: string) => {
    const res = await toggleUserStatusAction(userId);
    if (res.success && res.newStatus) {
      setRecruiters((prev) =>
        prev.map((hr) => (hr.userId === userId ? { ...hr, status: res.newStatus } : hr))
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Staffing Workforce
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            HR Recruiter Team Management
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setActionError(null);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add HR Recruiter</span>
        </button>
      </div>

      {/* Alert Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 text-xs text-emerald-800 font-semibold rounded-none">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 font-semibold rounded-none flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by recruiter name, employee code, or email..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 rounded-none outline-none"
        />
      </div>

      {/* Recruiters Data Grid */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs overflow-hidden">
        {filteredRecruiters.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-medium">
            No HR recruiter accounts match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-bold">Code & Recruiter</th>
                  <th className="py-3 px-4 font-bold">Contact Email & Phone</th>
                  <th className="py-3 px-4 font-bold text-center">Commission</th>
                  <th className="py-3 px-4 font-bold text-center">Sourced Leads</th>
                  <th className="py-3 px-4 font-bold text-center">Placed</th>
                  <th className="py-3 px-4 font-bold text-center">Attendance</th>
                  <th className="py-3 px-4 font-bold text-center">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecruiters.map((hr) => (
                  <tr key={hr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-blue-600">{hr.employeeCode}</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{hr.fullName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{hr.email}</div>
                      <div className="text-[11px] text-slate-500">{hr.phone || "—"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                      {hr.commissionRate ? `${hr.commissionRate}%` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-none">
                        <Users className="w-3 h-3 text-slate-500" />
                        {hr.sourcedCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-200">
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        {hr.placedCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {hr.isOnline ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                          Online
                        </span>
                      ) : hr.hasLoggedInToday ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-100 text-blue-800 rounded-none">
                          Present
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-200 text-slate-600 rounded-none">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(hr.userId)}
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer ${
                          hr.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {hr.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setResetModalUserId(hr.userId);
                          setNewPassword("");
                          setActionError(null);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-semibold transition-colors rounded-none cursor-pointer"
                        title="Reset Password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Reset Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Create New HR Recruiter */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 shadow-2xl w-full max-w-md p-6 rounded-none animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-heading">
                  Add HR Recruiter Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Generates employee code and sets login credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Recruiter Full Name *
                </label>
                <input
                  name="fullName"
                  required
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="priya@riseupconsultancy.in"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    name="phone"
                    required
                    placeholder="+91 97654 32109"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    name="commissionRate"
                    defaultValue="5.0"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Initial Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    defaultValue="HRPriya@2026"
                    className="w-full px-3 pr-10 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs cursor-pointer"
                >
                  {isSubmitting ? "Creating..." : "Create Recruiter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reset Password */}
      {resetModalUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 shadow-2xl w-full max-w-sm p-6 rounded-none animate-fadeIn">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">
              Reset Recruiter Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter a new secure password for this recruiter account.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 chars)"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUserId(null)}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || newPassword.length < 6}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
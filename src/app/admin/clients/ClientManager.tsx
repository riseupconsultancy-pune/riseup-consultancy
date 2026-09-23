"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  KeyRound, 
  Check, 
  X, 
  ShieldAlert, 
  Briefcase, 
  UserCheck, 
  Eye, 
  EyeOff,
  AlertCircle
} from "lucide-react";
import { createClientAction, resetPasswordAction, toggleUserStatusAction } from "@/app/actions/admin-actions";

interface ClientRecord {
  id: string;
  userId: string;
  companyName: string;
  country: string;
  city: string;
  industry: string | null;
  contactPerson: string | null;
  phone: string | null;
  email: string;
  status: string;
  vacanciesCount: number;
  placedCount: number;
  createdAt: string;
}

const SERVING_CITIES: Record<string, string[]> = {
  India: ["Pune", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Chennai", "Kolkata", "Coimbatore"],
  Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
};

export default function ClientManager({ initialClients }: { initialClients: ClientRecord[] }) {
  const [clients, setClients] = useState<ClientRecord[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resetModalUserId, setResetModalUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for New Client
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState(SERVING_CITIES["India"][0]);
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCity, setCustomCity] = useState("");

  const filteredClients = clients.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setCity(SERVING_CITIES[newCountry]?.[0] || "");
    setIsCustomCity(false);
    setCustomCity("");
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    setIsSubmitting(true);

    const finalCity = isCustomCity ? customCity.trim() : city.trim();
    if (!finalCity) {
      setActionError("Please provide or select an operating city.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("country", country);
      formData.set("city", finalCity);

      const res = await createClientAction(formData);
      if (!res.success) {
        setActionError(res.error || "Failed to create client.");
        setIsSubmitting(false);
        return;
      }

      setActionSuccess("Corporate client account created successfully!");
      setIsCreateOpen(false);
      window.location.reload();
    } catch {
      setActionError("Unexpected error occurred while creating client.");
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
      setClients((prev) =>
        prev.map((c) => (c.userId === userId ? { ...c, status: res.newStatus } : c))
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Enterprise Partnerships
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Corporate Client Accounts
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
          <span>Add Corporate Client</span>
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
          placeholder="Search by company name, city, contact person, or email..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 rounded-none outline-none"
        />
      </div>

      {/* Clients Data Grid / Table */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-medium">
            No corporate client accounts match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-bold">Company & City</th>
                  <th className="py-3 px-4 font-bold">Contact Person</th>
                  <th className="py-3 px-4 font-bold">Official Email & Phone</th>
                  <th className="py-3 px-4 font-bold text-center">Mandates</th>
                  <th className="py-3 px-4 font-bold text-center">Placed</th>
                  <th className="py-3 px-4 font-bold text-center">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{client.companyName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {client.city}, {client.country} &bull; {client.industry}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {client.contactPerson || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{client.email}</div>
                      <div className="text-[11px] text-slate-500">{client.phone || "—"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-none">
                        <Briefcase className="w-3 h-3 text-slate-500" />
                        {client.vacanciesCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-200">
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        {client.placedCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(client.userId)}
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer ${
                          client.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {client.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setResetModalUserId(client.userId);
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

      {/* MODAL: Create New Corporate Client */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 shadow-2xl w-full max-w-lg p-6 rounded-none animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-heading">
                  Create Corporate Client Account
                </h3>
                <p className="text-xs text-slate-500">
                  Generate login credentials for authorized employer access.
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
                  Company Name *
                </label>
                <input
                  name="companyName"
                  required
                  placeholder="e.g. Apex Global Solutions Pvt Ltd"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                  >
                    <option value="India">India</option>
                    <option value="Nigeria">Nigeria</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Operating City *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCity(!isCustomCity);
                        if (!isCustomCity) setCustomCity("");
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider cursor-pointer"
                    >
                      {isCustomCity ? "Choose from list" : "+ Add New City"}
                    </button>
                  </div>

                  {isCustomCity ? (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nagpur, Nashik, Ibadan..."
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none font-medium"
                    />
                  ) : (
                    <select
                      value={city}
                      onChange={(e) => {
                        if (e.target.value === "__CUSTOM__") {
                          setIsCustomCity(true);
                          setCustomCity("");
                        } else {
                          setCity(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                    >
                      {SERVING_CITIES[country]?.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__CUSTOM__">+ Enter New City Manually...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    name="contactPerson"
                    required
                    placeholder="e.g. Rajesh Kulkarni"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Industry Domain
                  </label>
                  <input
                    name="industry"
                    defaultValue="BPO / BPM / Back Office"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Official Login Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="hr@apexglobal.com"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone *
                  </label>
                  <input
                    name="phone"
                    required
                    placeholder="+91 98220 11223"
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
                    defaultValue="ClientPass@2026"
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
                <span className="text-[10.5px] text-slate-400 mt-1 block">
                  You can safely share this password with the client.
                </span>
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
                  {isSubmitting ? "Creating..." : "Create Client"}
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
              Reset Client Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter a new secure password for this client account.
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
"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  Radio, 
  Globe, 
  Search, 
  Check, 
  X, 
  Building2, 
  Users, 
  MapPin, 
  Clock, 
  IndianRupee,
  Share2,
  AlertCircle
} from "lucide-react";
import { 
  broadcastVacancyToHRsAction, 
  publishVacancyToWebsiteAction, 
  unpublishVacancyFromWebsiteAction,
  toggleVacancyStatusAction,
  updateVacancyVenueAction
} from "@/app/actions/admin-actions";

interface VacancyRecord {
  id: string;
  jobId: string;
  title: string;
  category: string;
  companyName: string;
  country: string;
  city: string;
  expMin: number;
  expMax: number;
  workMode: string;
  shift: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  headcount: number;
  availabilityRequired: string;
  interviewVenue?: string | null;
  interviewLocationUrl?: string | null;
  interviewContactPerson?: string | null;
  interviewContactPhone?: string | null;
  interviewInstructions?: string | null;
  status: string;
  isBroadcastedToHR: boolean;
  isPostedOnWebsite: boolean;
  broadcastedAt: string | null;
  candidatesCount: number;
  selectedCount: number;
  createdAt: string;
}

export default function VacancyBroadcastHub({ initialVacancies }: { initialVacancies: VacancyRecord[] }) {
  const [vacancies, setVacancies] = useState<VacancyRecord[]>(initialVacancies);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "BROADCASTED" | "WEBSITE" | "PENDING">("ALL");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Venue Edit Modal State
  const [editingVenueVacancy, setEditingVenueVacancy] = useState<VacancyRecord | null>(null);
  const [venueForm, setVenueForm] = useState({
    interviewVenue: "",
    interviewLocationUrl: "",
    interviewContactPerson: "",
    interviewContactPhone: "",
    interviewInstructions: "",
  });
  const [isSavingVenue, setIsSavingVenue] = useState(false);

  const handleOpenVenueModal = (v: VacancyRecord) => {
    setEditingVenueVacancy(v);
    setVenueForm({
      interviewVenue: v.interviewVenue || "",
      interviewLocationUrl: v.interviewLocationUrl || "",
      interviewContactPerson: v.interviewContactPerson || "",
      interviewContactPhone: v.interviewContactPhone || "",
      interviewInstructions: v.interviewInstructions || "",
    });
  };

  const handleSaveVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenueVacancy) return;
    setIsSavingVenue(true);
    setActionError(null);

    const res = await updateVacancyVenueAction({
      vacancyId: editingVenueVacancy.id,
      interviewVenue: venueForm.interviewVenue,
      interviewLocationUrl: venueForm.interviewLocationUrl || null,
      interviewContactPerson: venueForm.interviewContactPerson || null,
      interviewContactPhone: venueForm.interviewContactPhone || null,
      interviewInstructions: venueForm.interviewInstructions || null,
    });

    setIsSavingVenue(false);
    if (res.success && res.vacancy) {
      setVacancies((prev) =>
        prev.map((v) =>
          v.id === editingVenueVacancy.id
            ? {
                ...v,
                interviewVenue: res.vacancy.interviewVenue,
                interviewLocationUrl: res.vacancy.interviewLocationUrl,
                interviewContactPerson: res.vacancy.interviewContactPerson,
                interviewContactPhone: res.vacancy.interviewContactPhone,
                interviewInstructions: res.vacancy.interviewInstructions,
              }
            : v
        )
      );
      setEditingVenueVacancy(null);
      setActionSuccess("Interview venue & GPS navigation details updated successfully!");
    } else {
      setActionError(res.error || "Failed to update interview venue.");
    }
  };

  const filtered = vacancies.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === "BROADCASTED") return v.isBroadcastedToHR;
    if (activeFilter === "WEBSITE") return v.isPostedOnWebsite;
    if (activeFilter === "PENDING") return !v.isBroadcastedToHR && !v.isPostedOnWebsite;
    return true;
  });

  const handleBroadcast = async (vacancyId: string) => {
    setLoadingId(vacancyId);
    setActionError(null);
    setActionSuccess(null);

    const res = await broadcastVacancyToHRsAction(vacancyId);
    if (!res.success) {
      setActionError(res.error || "Failed to broadcast vacancy.");
    } else {
      setActionSuccess("Vacancy broadcasted to all HR recruiter portals!");
      setVacancies((prev) =>
        prev.map((v) => (v.id === vacancyId ? { ...v, isBroadcastedToHR: true, status: "ACTIVE" } : v))
      );
    }
    setLoadingId(null);
  };

  const handleToggleWebsite = async (vacancyId: string, isCurrentlyPosted: boolean) => {
    setLoadingId(vacancyId);
    setActionError(null);
    setActionSuccess(null);

    if (isCurrentlyPosted) {
      const res = await unpublishVacancyFromWebsiteAction(vacancyId);
      if (!res.success) {
        setActionError(res.error || "Failed to remove vacancy from website.");
      } else {
        setActionSuccess("Vacancy removed from website /jobs section.");
        setVacancies((prev) =>
          prev.map((v) => (v.id === vacancyId ? { ...v, isPostedOnWebsite: false } : v))
        );
      }
    } else {
      const res = await publishVacancyToWebsiteAction(vacancyId);
      if (!res.success) {
        setActionError(res.error || "Failed to publish vacancy on website.");
      } else {
        const freshDate = new Date().toISOString();
        setActionSuccess("Vacancy published live to /jobs with today's date timestamp!");
        setVacancies((prev) =>
          prev.map((v) =>
            v.id === vacancyId
              ? { ...v, isPostedOnWebsite: true, status: "ACTIVE", createdAt: freshDate }
              : v
          )
        );
      }
    }
    setLoadingId(null);
  };

  const handleToggleStatus = async (vacancyId: string, currentStatus: string) => {
    setLoadingId(vacancyId);
    setActionError(null);
    setActionSuccess(null);
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const res = await toggleVacancyStatusAction(vacancyId, newStatus);
    if (res.success) {
      const freshDate = new Date().toISOString();
      setVacancies((prev) =>
        prev.map((v) =>
          v.id === vacancyId
            ? {
                ...v,
                status: newStatus,
                ...(newStatus === "ACTIVE" ? { createdAt: freshDate } : {}),
              }
            : v
        )
      );
      if (newStatus === "ACTIVE") {
        setActionSuccess("Vacancy re-enabled! Job posted date refreshed to today for candidates and HRs.");
      } else {
        setActionSuccess("Vacancy disabled! Hidden from HR recruiter portals and public /jobs section.");
      }
    } else {
      setActionError(res.error || "Failed to update vacancy status.");
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-700 font-semibold tracking-wider text-[10px] uppercase mb-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Mandate Distribution Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Vacancy Broadcast &amp; Sourcing Hub
          </h1>
        </div>
      </div>

      {/* Alert Notifications */}
      {actionSuccess && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 font-semibold rounded-2xl shadow-xs">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="p-3.5 bg-gradient-to-r from-rose-50 via-pink-50/40 to-rose-50 border border-rose-200/80 text-xs text-rose-900 font-semibold rounded-2xl shadow-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center p-1.5 bg-slate-100/70 border border-slate-200/70 rounded-2xl gap-1 overflow-x-auto shadow-2xs">
          {[
            { id: "ALL", label: "All Mandates" },
            { id: "BROADCASTED", label: "HR Broadcasted" },
            { id: "WEBSITE", label: "On Website" },
            { id: "PENDING", label: "Pending Broadcast" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, Job ID, or client..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200/80 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 text-slate-900 rounded-xl outline-none shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Vacancy Cards / Roster */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-12 text-center text-xs text-slate-400 font-medium rounded-3xl shadow-sm">
            No vacancies match your filter criteria.
          </div>
        ) : (
          filtered.map((v) => {
            const isLoading = loadingId === v.id;

            return (
              <div
                key={v.id}
                className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 relative overflow-hidden group"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-slate-200 group-hover:via-blue-500/40 to-transparent transition-all" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Role Details */}
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50/80 px-2.5 py-0.5 border border-blue-200/70 rounded-full">
                        {v.jobId}
                      </span>
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200/60">
                        {v.category}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs ${
                        v.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        {v.status}
                      </span>
                      {v.createdAt && (
                        <span className="text-[10px] text-slate-500 font-medium inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full">
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          <span>Posted: {new Date(v.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                      {v.title}
                    </h2>

                    <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {v.companyName}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {v.city}, {v.country} ({v.workMode})
                      </span>
                      <span className="text-slate-500">
                        <strong>Exp:</strong> {v.expMin}–{v.expMax} Yrs
                      </span>
                      <span className="text-slate-500">
                        <strong>Headcount:</strong> {v.headcount} Openings
                      </span>
                      <span className="text-slate-500">
                        <strong>Availability:</strong> {v.availabilityRequired}
                      </span>
                    </div>

                    {/* Interview Venue & Location Pill */}
                    {v.interviewVenue ? (
                      <div className="flex items-center gap-2 text-xs pt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 bg-slate-50/80 px-3 py-1 border border-slate-200/70 rounded-full shadow-2xs">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <strong className="text-[10px] text-slate-500 uppercase tracking-wider">Venue:</strong>
                          <span className="line-clamp-1">{v.interviewVenue}</span>
                        </span>
                        {v.interviewLocationUrl && (
                          <a
                            href={v.interviewLocationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shadow-2xs transition-colors"
                          >
                            <span>Google Maps ↗</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenVenueModal(v)}
                          className="text-[11px] font-bold text-slate-600 hover:text-blue-600 px-2 py-0.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          Edit Venue
                        </button>
                      </div>
                    ) : (
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenVenueModal(v)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors shadow-2xs"
                        >
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>+ Add Interview Venue &amp; GPS Link</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Sourcing Stats & Distribution Controls */}
                  <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    {/* Pipeline Pill */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60 shadow-2xs">
                        Leads: {v.candidatesCount}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200/80 rounded-full shadow-2xs">
                        Placed: {v.selectedCount}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Button 1: Broadcast to HR */}
                      <button
                        type="button"
                        disabled={isLoading || v.isBroadcastedToHR}
                        onClick={() => handleBroadcast(v.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                          v.isBroadcastedToHR
                            ? "bg-emerald-50 border border-emerald-300 text-emerald-800 opacity-90 cursor-default shadow-2xs"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20"
                        }`}
                      >
                        {v.isBroadcastedToHR ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Radio className="w-3.5 h-3.5" />}
                        <span>{v.isBroadcastedToHR ? "Dispatched to HRs" : "Broadcast to all HRs"}</span>
                      </button>

                      {/* Button 2: Post to Website / Unpublish */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleToggleWebsite(v.id, v.isPostedOnWebsite)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                          v.isPostedOnWebsite
                            ? "bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs"
                            : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                        }`}
                        title={v.isPostedOnWebsite ? "Click to remove from public /jobs" : "Publish live to /jobs directory"}
                      >
                        {v.isPostedOnWebsite ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Globe className="w-3.5 h-3.5" />}
                        <span>{v.isPostedOnWebsite ? "Live on /jobs (Click to hide)" : "Post on Website"}</span>
                      </button>

                      {/* Button 3: Toggle Active / Disabled */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleToggleStatus(v.id, v.status)}
                        className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border rounded-xl cursor-pointer shadow-2xs transition-colors ${
                          v.status === "ACTIVE"
                            ? "border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        }`}
                        title={v.status === "ACTIVE" ? "Disable vacancy from HR portals and /jobs" : "Re-enable vacancy and refresh posting timestamp to today"}
                      >
                        {v.status === "ACTIVE" ? "Disable" : "Enable (Refresh Date)"}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Edit Interview Venue & GPS Link */}
      {editingVenueVacancy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-5 sm:p-7 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Edit Interview Venue &amp; GPS Location
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingVenueVacancy.jobId}: {editingVenueVacancy.title} &bull; {editingVenueVacancy.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingVenueVacancy(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVenue} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Physical Interview Venue Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={venueForm.interviewVenue}
                  onChange={(e) => setVenueForm({ ...venueForm, interviewVenue: e.target.value })}
                  placeholder="e.g. Digitide Business Solutions, 4th Floor, Cerebrum IT Park, Kalyani Nagar, Pune - 411014"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 text-slate-900 outline-none shadow-2xs transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Google Maps Location URL (GPS Link)
                </label>
                <input
                  type="url"
                  value={venueForm.interviewLocationUrl}
                  onChange={(e) => setVenueForm({ ...venueForm, interviewLocationUrl: e.target.value })}
                  placeholder="e.g. https://maps.app.goo.gl/abcdef123"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-2xs transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                    Reception / SPOC Person
                  </label>
                  <input
                    type="text"
                    value={venueForm.interviewContactPerson}
                    onChange={(e) => setVenueForm({ ...venueForm, interviewContactPerson: e.target.value })}
                    placeholder="e.g. Ms. Pooja Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-2xs transition-all"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                    Arrival Contact Phone
                  </label>
                  <input
                    type="text"
                    value={venueForm.interviewContactPhone}
                    onChange={(e) => setVenueForm({ ...venueForm, interviewContactPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-2xs transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Candidate Instructions / Gate Notes
                </label>
                <input
                  type="text"
                  value={venueForm.interviewInstructions}
                  onChange={(e) => setVenueForm({ ...venueForm, interviewInstructions: e.target.value })}
                  placeholder="e.g. Carry 2 CV hard copies, mention RiseUp Consultancy at the security gate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-2xs transition-all"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVenueVacancy(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingVenue}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {isSavingVenue ? "Saving..." : "Save Venue & GPS Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
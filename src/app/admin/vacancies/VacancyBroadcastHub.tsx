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

  const handlePublishWebsite = async (vacancyId: string) => {
    setLoadingId(vacancyId);
    setActionError(null);
    setActionSuccess(null);

    const res = await publishVacancyToWebsiteAction(vacancyId);
    if (!res.success) {
      setActionError(res.error || "Failed to publish vacancy on website.");
    } else {
      setActionSuccess("Vacancy published live to the public website /jobs section!");
      setVacancies((prev) =>
        prev.map((v) => (v.id === vacancyId ? { ...v, isPostedOnWebsite: true, status: "ACTIVE" } : v))
      );
    }
    setLoadingId(null);
  };

  const handleToggleStatus = async (vacancyId: string, currentStatus: string) => {
    setLoadingId(vacancyId);
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const res = await toggleVacancyStatusAction(vacancyId, newStatus);
    if (res.success) {
      setVacancies((prev) =>
        prev.map((v) => (v.id === vacancyId ? { ...v, status: newStatus } : v))
      );
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Mandate Distribution
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Vacancy Broadcast & Sourcing Hub
          </h1>
        </div>
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

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-white border border-slate-300 rounded-none shadow-2xs">
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
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 rounded-none outline-none"
          />
        </div>
      </div>

      {/* Vacancy Cards / Roster */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 text-center text-xs text-slate-400 font-medium rounded-none">
            No vacancies match your filter criteria.
          </div>
        ) : (
          filtered.map((v) => {
            const isLoading = loadingId === v.id;

            return (
              <div
                key={v.id}
                className="bg-white border border-slate-200 p-5 rounded-none shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Role Details */}
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200 rounded-none">
                        {v.jobId}
                      </span>
                      <span className="text-xs font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-none">
                        {v.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${
                        v.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                      {v.title}
                    </h2>

                    <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {v.companyName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
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
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800 bg-slate-50 px-2.5 py-1 border border-slate-200 rounded-none">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <strong className="text-[11px] text-slate-600 uppercase">Venue:</strong>
                          <span className="line-clamp-1">{v.interviewVenue}</span>
                        </span>
                        {v.interviewLocationUrl && (
                          <a
                            href={v.interviewLocationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-2 py-1 rounded-none"
                          >
                            <span>Google Maps ↗</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenVenueModal(v)}
                          className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
                        >
                          Edit Venue
                        </button>
                      </div>
                    ) : (
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenVenueModal(v)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-none hover:bg-amber-100"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>+ Add Interview Venue & GPS Link</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Sourcing Stats & Distribution Controls */}
                  <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    {/* Pipeline Pill */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-none">
                        Leads: {v.candidatesCount}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded-none">
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
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer ${
                          v.isBroadcastedToHR
                            ? "bg-emerald-50 border border-emerald-300 text-emerald-800 opacity-80 cursor-default"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                        }`}
                      >
                        {v.isBroadcastedToHR ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Radio className="w-3.5 h-3.5" />}
                        <span>{v.isBroadcastedToHR ? "Dispatched to HRs" : "Broadcast to all HRs"}</span>
                      </button>

                      {/* Button 2: Post to Website */}
                      <button
                        type="button"
                        disabled={isLoading || v.isPostedOnWebsite}
                        onClick={() => handlePublishWebsite(v.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer ${
                          v.isPostedOnWebsite
                            ? "bg-emerald-50 border border-emerald-300 text-emerald-800 opacity-80 cursor-default"
                            : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                        }`}
                      >
                        {v.isPostedOnWebsite ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Globe className="w-3.5 h-3.5" />}
                        <span>{v.isPostedOnWebsite ? "Live on /jobs" : "Post on Website"}</span>
                      </button>

                      {/* Button 3: Toggle Active / Disabled */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleToggleStatus(v.id, v.status)}
                        className="px-2.5 py-2 text-xs font-bold uppercase tracking-wider border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-none cursor-pointer"
                        title="Toggle Status"
                      >
                        {v.status === "ACTIVE" ? "Disable" : "Enable"}
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-none shadow-2xl border border-slate-300 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Edit Interview Venue & GPS Location
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingVenueVacancy.jobId}: {editingVenueVacancy.title} &bull; {editingVenueVacancy.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingVenueVacancy(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVenue} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Physical Interview Venue Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={venueForm.interviewVenue}
                  onChange={(e) => setVenueForm({ ...venueForm, interviewVenue: e.target.value })}
                  placeholder="e.g. Digitide Business Solutions, 4th Floor, Cerebrum IT Park, Kalyani Nagar, Pune - 411014"
                  className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Google Maps Location URL (GPS Link)
                </label>
                <input
                  type="url"
                  value={venueForm.interviewLocationUrl}
                  onChange={(e) => setVenueForm({ ...venueForm, interviewLocationUrl: e.target.value })}
                  placeholder="e.g. https://maps.app.goo.gl/abcdef123"
                  className="w-full px-3 py-2 rounded-none border border-slate-300 font-mono text-slate-900 outline-none min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Reception / SPOC Person
                  </label>
                  <input
                    type="text"
                    value={venueForm.interviewContactPerson}
                    onChange={(e) => setVenueForm({ ...venueForm, interviewContactPerson: e.target.value })}
                    placeholder="e.g. Ms. Pooja Sharma"
                    className="w-full px-3 py-2 rounded-none border border-slate-300 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Arrival Contact Phone
                  </label>
                  <input
                    type="text"
                    value={venueForm.interviewContactPhone}
                    onChange={(e) => setVenueForm({ ...venueForm, interviewContactPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-none border border-slate-300 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Candidate Instructions / Gate Notes
                </label>
                <input
                  type="text"
                  value={venueForm.interviewInstructions}
                  onChange={(e) => setVenueForm({ ...venueForm, interviewInstructions: e.target.value })}
                  placeholder="e.g. Carry 2 CV hard copies, mention RiseUp Consultancy at the security gate"
                  className="w-full px-3 py-2 rounded-none border border-slate-300 text-slate-900 outline-none min-h-[44px]"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVenueVacancy(null)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingVenue}
                  className="px-5 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-2xs transition-colors min-h-[44px]"
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
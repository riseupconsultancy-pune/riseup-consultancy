"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Download, 
  X, 
  MessageSquare, 
  UserCheck, 
  Building2, 
  MapPin, 
  Briefcase,
  Share2,
  Trash2,
  UserX,
  Check,
  Phone,
  Mail,
  GraduationCap,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter
} from "lucide-react";
import { assignCandidateToHrAction, bulkAssignCandidatesToHrAction } from "@/app/actions/public-actions";
import { deleteCandidateAction, setCandidatePlacedOutsideAction } from "@/app/actions/hr-actions";

export interface AdminCandidateItem {
  id: string;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  qualification: string;
  totalExperience: string;
  availability: string;
  interestedRoles: string[];
  resumeUrl: string;
  resumeFileName: string;
  resumeFileSize: number;
  source: string;
  status: string;
  referralTag: string | null;
  hrId: string | null;
  hrName: string | null;
  hrCode: string | null;
  vacancyId: string;
  vacancyJobId: string;
  vacancyTitle: string;
  vacancyCategory: string;
  clientCompanyName: string;
  createdAt: string;
  statusHistory?: {
    id: string;
    newStatus: string;
    changedByRole: string;
    note: string | null;
    createdAt: string;
  }[];
}

export interface RecruiterOption {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string | null;
}

interface AdminCandidatePoolProps {
  initialCandidates: AdminCandidateItem[];
  recruiters: RecruiterOption[];
}

export default function AdminCandidatePool({
  initialCandidates,
  recruiters,
}: AdminCandidatePoolProps) {
  const [candidates, setCandidates] = useState<AdminCandidateItem[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [experienceFilter, setExperienceFilter] = useState<string>("ALL");
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

  // Feedback Messages
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resume Preview Modal State
  const [resumeModalData, setResumeModalData] = useState<{
    candidateName: string;
    resumeUrl: string;
    resumeFileName: string;
  } | null>(null);

  // Single Assignment Modal State
  const [assignModalCandidate, setAssignModalCandidate] = useState<AdminCandidateItem | null>(null);
  const [selectedHrId, setSelectedHrId] = useState<string>(recruiters[0]?.id || "");
  const [isAssigning, setIsAssigning] = useState(false);

  // Bulk Assignment State
  const [bulkHrId, setBulkHrId] = useState<string>(recruiters[0]?.id || "");
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  // Delete State
  const [deletingCandidate, setDeletingCandidate] = useState<AdminCandidateItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic Pipeline Counters
  const counts = useMemo(() => {
    return {
      all: candidates.length,
      unassigned: candidates.filter((c) => !c.hrId).length,
      assigned: candidates.filter((c) => !!c.hrId).length,
      interview: candidates.filter((c) => c.status === "GOING_FOR_INTERVIEW").length,
      interviewed: candidates.filter((c) => c.status === "INTERVIEWED").length,
      selected: candidates.filter((c) => c.status === "SELECTED").length,
      rejected: candidates.filter((c) => c.status === "REJECTED" || c.status === "ABSENT").length,
      placedOutside: candidates.filter((c) => c.status === "PLACED_OUTSIDE").length,
    };
  }, [candidates]);

  // Tab Filtering & Search Logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        c.fullName.toLowerCase().includes(q) ||
        c.candidateId.toLowerCase().includes(q) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.vacancyTitle.toLowerCase().includes(q) ||
        c.clientCompanyName.toLowerCase().includes(q) ||
        (c.hrName && c.hrName.toLowerCase().includes(q));

      // Tab filter
      let matchesTab = true;
      if (activeTab === "UNASSIGNED") {
        matchesTab = !c.hrId;
      } else if (activeTab === "ASSIGNED") {
        matchesTab = !!c.hrId;
      } else if (activeTab === "GOING_FOR_INTERVIEW") {
        matchesTab = c.status === "GOING_FOR_INTERVIEW";
      } else if (activeTab === "INTERVIEWED") {
        matchesTab = c.status === "INTERVIEWED";
      } else if (activeTab === "SELECTED") {
        matchesTab = c.status === "SELECTED";
      } else if (activeTab === "REJECTED") {
        matchesTab = c.status === "REJECTED" || c.status === "ABSENT";
      } else if (activeTab === "PLACED_OUTSIDE") {
        matchesTab = c.status === "PLACED_OUTSIDE";
      }

      // Experience filter
      const matchesExp =
        experienceFilter === "ALL"
          ? true
          : experienceFilter === "Fresher"
          ? c.totalExperience.toLowerCase().includes("fresher") || c.totalExperience.includes("0")
          : c.totalExperience.includes(experienceFilter);

      return matchesSearch && matchesTab && matchesExp;
    });
  }, [candidates, searchQuery, activeTab, experienceFilter]);

  // Bulk Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(filteredCandidates.map((c) => c.id));
    }
  };

  // Open Single Assign Modal
  const handleOpenAssign = (candidate: AdminCandidateItem) => {
    setAssignModalCandidate(candidate);
    setSelectedHrId(candidate.hrId || recruiters[0]?.id || "");
    setErrorMessage(null);
  };

  // Confirm Single Assignment
  const handleConfirmAssignment = async () => {
    if (!assignModalCandidate || !selectedHrId) return;
    setIsAssigning(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await assignCandidateToHrAction(assignModalCandidate.id, selectedHrId);
      if (res.success) {
        const assignedRecruiter = recruiters.find((r) => r.id === selectedHrId);
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === assignModalCandidate.id
              ? {
                  ...c,
                  hrId: selectedHrId,
                  hrName: assignedRecruiter ? assignedRecruiter.fullName : "Assigned Recruiter",
                  hrCode: assignedRecruiter ? assignedRecruiter.employeeCode : null,
                  referralTag: assignedRecruiter
                    ? `Referral: ${assignedRecruiter.fullName} | RiseUp Consultancy`
                    : c.referralTag,
                }
              : c
          )
        );
        setActionMessage(
          `Candidate ${assignModalCandidate.fullName} assigned to ${assignedRecruiter?.fullName} (${assignedRecruiter?.employeeCode}).`
        );
        setAssignModalCandidate(null);
      } else {
        setErrorMessage(res.error || "Failed to assign candidate.");
      }
    } catch {
      setErrorMessage("Network error during candidate assignment.");
    } finally {
      setIsAssigning(false);
    }
  };

  // Confirm Bulk Assignment
  const handleConfirmBulkAssign = async () => {
    if (selectedCandidateIds.length === 0 || !bulkHrId) return;
    setIsBulkAssigning(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await bulkAssignCandidatesToHrAction(selectedCandidateIds, bulkHrId);
      if (res.success) {
        const assignedRecruiter = recruiters.find((r) => r.id === bulkHrId);
        setCandidates((prev) =>
          prev.map((c) =>
            selectedCandidateIds.includes(c.id)
              ? {
                  ...c,
                  hrId: bulkHrId,
                  hrName: assignedRecruiter ? assignedRecruiter.fullName : "Assigned Recruiter",
                  hrCode: assignedRecruiter ? assignedRecruiter.employeeCode : null,
                  referralTag: assignedRecruiter
                    ? `Referral: ${assignedRecruiter.fullName} | RiseUp Consultancy`
                    : c.referralTag,
                }
              : c
          )
        );
        setActionMessage(
          `Successfully assigned ${selectedCandidateIds.length} candidate(s) to ${assignedRecruiter?.fullName} (${assignedRecruiter?.employeeCode}).`
        );
        setSelectedCandidateIds([]);
      } else {
        setErrorMessage(res.error || "Failed to bulk assign candidates.");
      }
    } catch {
      setErrorMessage("Network error during bulk candidate assignment.");
    } finally {
      setIsBulkAssigning(false);
    }
  };

  // Mark Placed Outside
  const handleMarkPlacedOutside = async (candidateId: string) => {
    setActionMessage(null);
    setErrorMessage(null);
    try {
      const res = await setCandidatePlacedOutsideAction(candidateId);
      if (res.success) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? { ...c, status: "PLACED_OUTSIDE" } : c))
        );
        setActionMessage(res.message || "Candidate marked as placed outside.");
      } else {
        setErrorMessage(res.error || "Failed to update candidate status.");
      }
    } catch {
      setErrorMessage("Network error updating status.");
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCandidate) return;
    setIsDeleting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await deleteCandidateAction(deletingCandidate.id);
      if (res.success) {
        setCandidates((prev) => prev.filter((c) => c.id !== deletingCandidate.id));
        setSelectedCandidateIds((prev) => prev.filter((id) => id !== deletingCandidate.id));
        setActionMessage(res.message || "Candidate record permanently deleted.");
        setDeletingCandidate(null);
      } else {
        setErrorMessage(res.error || "Failed to delete candidate.");
      }
    } catch {
      setErrorMessage("Network error during candidate deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  // WhatsApp Outreach Direct
  const handleWhatsAppDirect = (candidate: AdminCandidateItem) => {
    const cleanPhone = candidate.phone.replace(/[^0-9]/g, "");
    const message = `Hello ${candidate.fullName}, this is RiseUp Consultancy Super Admin Desk regarding your application for ${candidate.vacancyTitle} in ${candidate.city}. We are reviewing your profile for interview dispatch.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Executive ATS Pipeline &bull; Central Candidate Pool
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
            Candidate Pipeline &amp; HR Recruiter Assignment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor intake across website job portals &amp; HR sourcing links. Instantly assign fresh candidates to internal recruiters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {counts.unassigned > 0 && (
            <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <span>{counts.unassigned} Unassigned Leads</span>
            </div>
          )}
          <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700">
            Total Pipeline: <span className="text-blue-600 font-extrabold">{candidates.length}</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold uppercase text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-900 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold uppercase text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar (Matching HrCandidatePipeline Architecture) */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          {/* Keyword Search */}
          <div className="sm:col-span-2 lg:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name, ID, phone, city, job title, or recruiter name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Experience Filter */}
          <div className="lg:col-span-4">
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Experience Levels</option>
              <option value="Fresher">Fresher (0-1 Year)</option>
              <option value="1">1+ Years</option>
              <option value="2">2+ Years</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years Executive</option>
            </select>
          </div>
        </div>

        {/* Stage Filter Tabs with Dynamic Counters */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full">
            {[
              { key: "ALL", label: `All (${counts.all})` },
              { 
                key: "UNASSIGNED", 
                label: `New / Unassigned (${counts.unassigned})`,
                isAlert: counts.unassigned > 0
              },
              { key: "ASSIGNED", label: `Assigned to HR (${counts.assigned})` },
              { key: "GOING_FOR_INTERVIEW", label: `Interview Scheduled (${counts.interview})` },
              { key: "INTERVIEWED", label: `Interviewed (${counts.interviewed})` },
              { key: "SELECTED", label: `Selected (${counts.selected})` },
              { key: "REJECTED", label: `Rejected (${counts.rejected})` },
              { key: "PLACED_OUTSIDE", label: `Placed Outside (${counts.placedOutside})` },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : tab.isAlert
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.isAlert && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Multi-Selection Counter & Select All */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer"
            >
              {selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>
            <span className="text-[11px] text-slate-500 font-semibold">
              {filteredCandidates.length} candidate(s)
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bulk Action Bar */}
      {selectedCandidateIds.length > 0 && (
        <div className="sticky top-16 z-30 bg-slate-900 text-white p-3 border border-slate-800 rounded-none shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-blue-600 font-bold flex items-center justify-center text-xs">
              {selectedCandidateIds.length}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {selectedCandidateIds.length} Candidate(s) Selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={bulkHrId}
              onChange={(e) => setBulkHrId(e.target.value)}
              className="bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white rounded-none focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {recruiters.map((r) => (
                <option key={r.id} value={r.id}>
                  Assign to: {r.fullName} ({r.employeeCode})
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={isBulkAssigning}
              onClick={handleConfirmBulkAssign}
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-none transition-colors cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isBulkAssigning ? "Assigning..." : "Bulk Assign Recruiter"}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCandidateIds([])}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Cancel Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Candidates List / Minimalist Cards Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No candidates found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no candidates matching your active filters or keyword search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("ALL");
              setExperienceFilter("ALL");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCandidates.map((candidate) => {
            const isSelected = selectedCandidateIds.includes(candidate.id);
            const isUnassigned = !candidate.hrId;

            return (
              <div
                key={candidate.id}
                className={`bg-white border transition-all rounded-none p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3.5 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/20"
                    : isUnassigned
                    ? "border-rose-300 hover:border-rose-500"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                {/* Header Row: Checkbox, Name, Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(candidate.id)}
                      className="w-4 h-4 rounded-none border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                    />

                    <span className="text-sm sm:text-base font-black text-slate-900 font-heading">
                      {candidate.fullName}
                    </span>

                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200">
                      {candidate.candidateId}
                    </span>

                    {/* SOURCE BADGE */}
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-600 px-2 py-0.5 border border-slate-200">
                      {candidate.source === "WEBSITE_CARD" ? "Website Portal" : "HR Recruiter Link"}
                    </span>

                    {/* PROMINENT NEW / UNASSIGNED BADGE vs ASSIGNED TAG */}
                    {isUnassigned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-none shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>NEW &bull; UNASSIGNED TO HR</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold uppercase tracking-wider rounded-none">
                        <UserCheck className="w-3 h-3 text-blue-600" />
                        <span>ASSIGNED: {candidate.hrName} ({candidate.hrCode || "HR"})</span>
                      </span>
                    )}

                    {/* ATS STATUS BADGE */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none border ${
                        candidate.status === "SELECTED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : candidate.status === "GOING_FOR_INTERVIEW"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : candidate.status === "INTERVIEWED"
                          ? "bg-purple-50 text-purple-800 border-purple-300"
                          : candidate.status === "REJECTED" || candidate.status === "ABSENT"
                          ? "bg-rose-50 text-rose-800 border-rose-300"
                          : candidate.status === "PLACED_OUTSIDE"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {candidate.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Submission Timestamp */}
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    Received: {new Date(candidate.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Role & Company Strip */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 bg-slate-50 p-2.5 border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Applied Opening: {candidate.vacancyTitle}</span>
                    <span className="text-[11px] font-mono text-slate-500 font-normal">
                      ({candidate.vacancyJobId})
                    </span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Client: {candidate.clientCompanyName}</span>
                  </div>
                </div>

                {/* Candidate Minimalist Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{candidate.phone}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{candidate.city}, {candidate.country}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{candidate.qualification}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{candidate.totalExperience}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400 font-bold text-[10px]">NOTICE:</span>
                    <span className="truncate font-semibold text-slate-800">{candidate.availability}</span>
                  </div>
                </div>

                {/* Cross Domain Interested Roles */}
                {candidate.interestedRoles && candidate.interestedRoles.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Cross Domains:
                    </span>
                    {candidate.interestedRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200 rounded-none font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Action Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  {/* Left: Resume & WhatsApp */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        setResumeModalData({
                          candidateName: candidate.fullName,
                          resumeUrl: candidate.resumeUrl,
                          resumeFileName: candidate.resumeFileName,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-none border border-slate-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Resume</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppDirect(candidate)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Candidate</span>
                    </button>
                  </div>

                  {/* Right: 1-Click Assign Recruiter & Status Modifiers */}
                  <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                    {/* SINGLE CLICK RECRUITER ASSIGNMENT */}
                    <button
                      type="button"
                      onClick={() => handleOpenAssign(candidate)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-xs cursor-pointer ${
                        isUnassigned
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isUnassigned ? "Assign HR Recruiter" : "Reassign HR"}</span>
                    </button>

                    {candidate.status !== "PLACED_OUTSIDE" && (
                      <button
                        type="button"
                        onClick={() => handleMarkPlacedOutside(candidate.id)}
                        className="px-2.5 py-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 text-xs font-bold uppercase tracking-wider rounded-none border border-slate-200 cursor-pointer"
                        title="Mark as Placed Outside"
                      >
                        Placed Outside
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeletingCandidate(candidate)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete Candidate Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SINGLE RECRUITER ASSIGNMENT MODAL */}
      {assignModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-300 w-full max-w-md p-6 rounded-none shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-heading">
                  Assign Candidate to HR Recruiter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalCandidate(null)}
                className="text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-200 space-y-1 text-xs">
              <div className="font-bold text-slate-900">{assignModalCandidate.fullName}</div>
              <div className="text-slate-600">Applied for: {assignModalCandidate.vacancyTitle}</div>
              <div className="text-slate-500 font-mono text-[11px]">ID: {assignModalCandidate.candidateId} &bull; {assignModalCandidate.city}</div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Select HR Recruiter
              </label>
              <select
                value={selectedHrId}
                onChange={(e) => setSelectedHrId(e.target.value)}
                className="w-full bg-white border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 rounded-none focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {recruiters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fullName} ({r.employeeCode}) &bull; {r.email}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                The candidate will instantly appear in the assigned recruiter&apos;s ATS screening desk.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignModalCandidate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAssigning}
                onClick={handleConfirmAssignment}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESUME VIEWER MODAL */}
      {resumeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[88vh] bg-white border border-slate-300 shadow-2xl flex flex-col rounded-none">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
                  Verified Resume: {resumeModalData.candidateName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={resumeModalData.resumeUrl}
                  download={resumeModalData.resumeFileName}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 hover:border-slate-900 text-xs font-bold text-slate-700 uppercase tracking-wider rounded-none transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setResumeModalData(null)}
                  className="w-7 h-7 bg-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-colors rounded-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden">
              <iframe
                src={`${resumeModalData.resumeUrl}#toolbar=0`}
                className="w-full h-full border border-slate-300 bg-white shadow-inner"
                title={`${resumeModalData.candidateName} Resume`}
              />
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-300 w-full max-w-md p-6 rounded-none shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-heading">
                  Delete Candidate Profile
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to permanently remove {deletingCandidate.fullName}?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 border border-slate-200">
              This action will permanently delete the candidate record, application history, and associated resume file.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingCandidate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

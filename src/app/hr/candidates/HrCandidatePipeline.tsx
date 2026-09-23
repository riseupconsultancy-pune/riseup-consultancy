"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  Download, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Send,
  MessageSquare,
  Building2,
  ExternalLink,
  Check,
  Briefcase,
  AlertTriangle,
  UserX,
  RotateCcw,
  Trash2,
  Layers,
  Filter
} from "lucide-react";
import { 
  updateCandidateStatusByHrAction,
  dispatchCandidateToInterviewAction,
  bulkDispatchCandidatesToInterviewAction,
  setCandidatePlacedOutsideAction,
  reactivateCandidateAction,
  deleteCandidateAction
} from "@/app/actions/hr-actions";

export interface CandidateItem {
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
  referralTag: string;
  status: string;
  clientFeedback: string | null;
  interviewDate: string | null;
  selectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  vacancyId: string;
  vacancyJobId: string;
  vacancyTitle: string;
  vacancyCategory: string;
  vacancyCity: string;
  vacancyStatus: string;
  clientCompanyName: string;
  isMyLead: boolean;
  recentHistory: {
    id: string;
    newStatus: string;
    changedByRole: string;
    note: string | null;
    createdAt: string;
  }[];
}

export interface ActiveVacancyOption {
  id: string;
  jobId: string;
  title: string;
  category: string;
  city: string;
  workMode: string;
  expMin: number;
  expMax: number;
  availabilityRequired: string;
  clientCompanyName: string;
}

export interface AppliedVacancyOption {
  id: string;
  jobId: string;
  title: string;
  status: string;
}

interface HrCandidatePipelineProps {
  initialCandidates: CandidateItem[];
  activeVacancies: ActiveVacancyOption[];
  appliedVacancies: AppliedVacancyOption[];
  recruiterName: string;
  employeeCode: string;
  whatsappTemplate?: string | null;
}

const DEFAULT_WHATSAPP_TEMPLATE = `Hello {candidate_name}, this is {recruiter_name} from RiseUp Consultancy regarding your application for {job_title} ({work_city}).

We have reviewed your profile and would like to schedule you for an interview. 

*Mandatory Referral Code at Interview:*
{referral_tag}

Please reply to confirm your availability.`;

export default function HrCandidatePipeline({
  initialCandidates,
  activeVacancies,
  appliedVacancies,
  recruiterName,
  employeeCode,
  whatsappTemplate,
}: HrCandidatePipelineProps) {
  const [candidates, setCandidates] = useState<CandidateItem[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppliedVacancyId, setSelectedAppliedVacancyId] = useState("ALL");
  const [targetVacancyId, setTargetVacancyId] = useState<string>(activeVacancies[0]?.id || "");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [experienceFilter, setExperienceFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-Selection State for Bulk Operations
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

  // Resume Modal State
  const [resumeModalData, setResumeModalData] = useState<{
    candidateName: string;
    resumeUrl: string;
    resumeFileName: string;
  } | null>(null);

  // Single Candidate Dispatch Modal
  const [dispatchModalCandidate, setDispatchModalCandidate] = useState<CandidateItem | null>(null);
  const [modalTargetVacancyId, setModalTargetVacancyId] = useState<string>("");
  const [interviewDate, setInterviewDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [interviewNote, setInterviewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk Dispatch Modal
  const [showBulkDispatchModal, setShowBulkDispatchModal] = useState(false);
  const [bulkInterviewDate, setBulkInterviewDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [bulkInterviewNote, setBulkInterviewNote] = useState("");

  // Delete Confirmation Modal
  const [deletingCandidate, setDeletingCandidate] = useState<CandidateItem | null>(null);

  // Current Target Vacancy Object
  const currentTargetVacancy = activeVacancies.find((v) => v.id === targetVacancyId);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.fullName.toLowerCase().includes(q) ||
      c.candidateId.toLowerCase().includes(q) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.vacancyTitle.toLowerCase().includes(q);

    const matchesAppliedVacancy =
      selectedAppliedVacancyId === "ALL" || c.vacancyId === selectedAppliedVacancyId;

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE_POOL"
        ? c.status === "APPLIED" || c.status === "CONNECTED"
        : c.status === statusFilter;

    const matchesExperience =
      experienceFilter === "ALL"
        ? true
        : experienceFilter === "Fresher"
        ? c.totalExperience.toLowerCase().includes("fresher")
        : c.totalExperience.toLowerCase().includes(experienceFilter.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "ALL"
        ? true
        : c.availability === availabilityFilter;

    return (
      matchesSearch &&
      matchesAppliedVacancy &&
      matchesStatus &&
      matchesExperience &&
      matchesAvailability
    );
  });

  // Toggle Single Selection
  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select / Deselect All
  const handleSelectAll = () => {
    if (selectedCandidateIds.length === filteredCandidates.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(filteredCandidates.map((c) => c.id));
    }
  };

  // 1-Tap WhatsApp Handler
  const handleWhatsAppConnect = async (candidate: CandidateItem) => {
    const template = whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE;
    const cleanPhone = candidate.phone.replace(/[^0-9]/g, "");

    const formattedMessage = template
      .replace(/{candidate_name}/g, candidate.fullName)
      .replace(/{recruiter_name}/g, recruiterName)
      .replace(/{job_title}/g, candidate.vacancyTitle)
      .replace(/{work_city}/g, candidate.vacancyCity)
      .replace(/{company_name}/g, candidate.clientCompanyName)
      .replace(/{referral_tag}/g, candidate.referralTag);

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, "_blank");

    if (candidate.status === "APPLIED") {
      try {
        const res = await updateCandidateStatusByHrAction(
          candidate.id,
          "CONNECTED",
          null,
          "Recruiter initiated WhatsApp outreach"
        );
        if (res.success) {
          setCandidates((prev) =>
            prev.map((c) => (c.id === candidate.id ? { ...c, status: "CONNECTED" } : c))
          );
        }
      } catch {
        // non-blocking
      }
    }
  };

  // Open Single Dispatch Modal
  const openDispatchModal = (candidate: CandidateItem) => {
    setDispatchModalCandidate(candidate);
    // If target vacancy is chosen in toolbar and active, use it; otherwise fallback to candidate's vacancy if active
    const defaultTarget =
      targetVacancyId ||
      (activeVacancies.some((v) => v.id === candidate.vacancyId)
        ? candidate.vacancyId
        : activeVacancies[0]?.id || "");
    setModalTargetVacancyId(defaultTarget);
    setInterviewNote("");
  };

  // Confirm Single Dispatch
  const handleConfirmSingleDispatch = async () => {
    if (!dispatchModalCandidate || !modalTargetVacancyId) {
      setErrorMessage("Please select an active target opening.");
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await dispatchCandidateToInterviewAction({
        candidateId: dispatchModalCandidate.id,
        targetVacancyId: modalTargetVacancyId,
        interviewDate,
        note: interviewNote || `Dispatched for interview on ${interviewDate}`,
      });

      if (res.success) {
        const targetVac = activeVacancies.find((v) => v.id === modalTargetVacancyId);
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === dispatchModalCandidate.id
              ? {
                  ...c,
                  status: "GOING_FOR_INTERVIEW",
                  interviewDate: new Date(interviewDate).toISOString(),
                  vacancyId: modalTargetVacancyId,
                  vacancyJobId: targetVac?.jobId || c.vacancyJobId,
                  vacancyTitle: targetVac?.title || c.vacancyTitle,
                  vacancyCity: targetVac?.city || c.vacancyCity,
                  clientCompanyName: targetVac?.clientCompanyName || c.clientCompanyName,
                  vacancyStatus: "ACTIVE",
                }
              : c
          )
        );
        setActionMessage(res.message || "Candidate successfully dispatched for interview.");
        setDispatchModalCandidate(null);
      } else {
        setErrorMessage(res.error || "Failed to dispatch candidate.");
      }
    } catch {
      setErrorMessage("Network error during candidate dispatch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Bulk Dispatch
  const handleConfirmBulkDispatch = async () => {
    if (!targetVacancyId || selectedCandidateIds.length === 0) {
      setErrorMessage("Please select an active target vacancy and at least one candidate.");
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await bulkDispatchCandidatesToInterviewAction({
        candidateIds: selectedCandidateIds,
        targetVacancyId,
        interviewDate: bulkInterviewDate,
        note: bulkInterviewNote || `Bulk dispatched on ${bulkInterviewDate}`,
      });

      if (res.success) {
        const targetVac = activeVacancies.find((v) => v.id === targetVacancyId);
        setCandidates((prev) =>
          prev.map((c) =>
            selectedCandidateIds.includes(c.id)
              ? {
                  ...c,
                  status: "GOING_FOR_INTERVIEW",
                  interviewDate: new Date(bulkInterviewDate).toISOString(),
                  vacancyId: targetVacancyId,
                  vacancyJobId: targetVac?.jobId || c.vacancyJobId,
                  vacancyTitle: targetVac?.title || c.vacancyTitle,
                  vacancyCity: targetVac?.city || c.vacancyCity,
                  clientCompanyName: targetVac?.clientCompanyName || c.clientCompanyName,
                  vacancyStatus: "ACTIVE",
                }
              : c
          )
        );
        setActionMessage(res.message || "Bulk dispatch completed successfully.");
        setShowBulkDispatchModal(false);
        setSelectedCandidateIds([]);
      } else {
        setErrorMessage(res.error || "Bulk dispatch failed.");
      }
    } catch {
      setErrorMessage("Network error during bulk dispatch.");
    } finally {
      setIsSubmitting(false);
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
        setErrorMessage(res.error || "Failed to update status.");
      }
    } catch {
      setErrorMessage("Network error updating status.");
    }
  };

  // Reactivate Profile
  const handleReactivateCandidate = async (candidateId: string) => {
    setActionMessage(null);
    setErrorMessage(null);
    try {
      const res = await reactivateCandidateAction(candidateId);
      if (res.success) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? { ...c, status: "APPLIED" } : c))
        );
        setActionMessage(res.message || "Candidate profile reactivated into candidate pool.");
      } else {
        setErrorMessage(res.error || "Failed to reactivate candidate.");
      }
    } catch {
      setErrorMessage("Network error reactivating candidate.");
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCandidate) return;
    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await deleteCandidateAction(deletingCandidate.id);
      if (res.success) {
        setCandidates((prev) => prev.filter((c) => c.id !== deletingCandidate.id));
        setSelectedCandidateIds((prev) => prev.filter((id) => id !== deletingCandidate.id));
        setActionMessage(res.message || "Candidate profile permanently deleted.");
        setDeletingCandidate(null);
      } else {
        setErrorMessage(res.error || "Failed to delete candidate.");
      }
    } catch {
      setErrorMessage("Network error deleting candidate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Recruiter ATS Pipeline &bull; {employeeCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Candidate Pipeline & Screening Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Screen candidates across the database, reassign talent to active mandates for bulk fulfillment, and push verified referrals to client interview desks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hr/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-none transition-colors border border-slate-300"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>WhatsApp Template</span>
          </Link>
          <Link
            href="/hr/vacancies"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-xs"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Mandates</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn">
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
        <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-900 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn">
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

      {/* SECTION 1: TARGET VACANCY FULFILLMENT SELECTOR */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 border border-slate-800 rounded-none shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600 text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Target Active Mandate for Interview Dispatch
              </h2>
              <p className="text-[11px] text-slate-400">
                Select an approved job opening to dispatch candidates to. Candidates from any role will be reassigned here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              {activeVacancies.length} Active Mandates Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Destination Vacancy (Active & Broadcasted)
            </label>
            <select
              value={targetVacancyId}
              onChange={(e) => setTargetVacancyId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-white rounded-none focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {activeVacancies.length === 0 ? (
                <option value="">No active broadcasted mandates available</option>
              ) : (
                activeVacancies.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.jobId}: {v.title} &bull; {v.clientCompanyName} ({v.city}) &bull; {v.category}
                  </option>
                ))
              )}
            </select>
          </div>

          {currentTargetVacancy && (
            <div className="md:col-span-4 bg-slate-800/80 p-2.5 border border-slate-700/80 text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9.5px]">Client:</span>
                <span className="text-white font-semibold truncate">{currentTargetVacancy.clientCompanyName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9.5px]">Requirement:</span>
                <span className="text-blue-300 font-medium">
                  {currentTargetVacancy.expMin}-{currentTargetVacancy.expMax} Yrs &bull; {currentTargetVacancy.availabilityRequired}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: CANDIDATE DATABASE FILTER & SEARCH TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Query (5 Cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID (e.g. RUP-CAN-1001), phone, city, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Applied Vacancy Origin Filter (3 Cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedAppliedVacancyId}
              onChange={(e) => setSelectedAppliedVacancyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Applied Origins</option>
              {appliedVacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.jobId}: {v.title} {v.status !== "ACTIVE" ? `(${v.status})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter (2 Cols) */}
          <div className="md:col-span-2">
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1">1+ Years</option>
              <option value="2">2+ Years</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years</option>
            </select>
          </div>

          {/* Notice Period Filter (2 Cols) */}
          <div className="md:col-span-2">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Notice Periods</option>
              <option value="Immediate Joiner">Immediate Joiner</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
            </select>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {[
              { key: "ALL", label: `All (${candidates.length})` },
              { key: "ACTIVE_POOL", label: "Active Pool (Sourcing)" },
              { key: "GOING_FOR_INTERVIEW", label: "Interview Scheduled" },
              { key: "INTERVIEWED", label: "Interviewed / Evaluated" },
              { key: "SELECTED", label: "Selected" },
              { key: "REJECTED", label: "Rejected" },
              { key: "ABSENT", label: "Absent" },
              { key: "PLACED_OUTSIDE", label: "Placed Outside / Inactive" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Selection Counter & Select All */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
            >
              {selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>
            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredCandidates.length} candidate(s)
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: STICKY BULK DISPATCH ACTION BAR */}
      {selectedCandidateIds.length > 0 && (
        <div className="sticky top-16 z-30 bg-blue-900 text-white p-3.5 border border-blue-700 rounded-none shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-blue-600 font-bold flex items-center justify-center text-xs">
              {selectedCandidateIds.length}
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {selectedCandidateIds.length} Candidate(s) Selected for Bulk Action
              </span>
              <span className="text-[11px] text-blue-200">
                Target opening: {currentTargetVacancy ? `${currentTargetVacancy.jobId} - ${currentTargetVacancy.title}` : "Select target opening above"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCandidateIds([])}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-blue-100 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              type="button"
              disabled={!targetVacancyId}
              onClick={() => setShowBulkDispatchModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Bulk Send for Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: CANDIDATE PIPELINE CARDS */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No candidates match your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, experience filter, or stage tabs to locate eligible candidates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => {
            const isSelectedCard = selectedCandidateIds.includes(candidate.id);
            const isApplied = candidate.status === "APPLIED";
            const isConnected = candidate.status === "CONNECTED";
            const isInterview = candidate.status === "GOING_FOR_INTERVIEW";
            const isInterviewed = candidate.status === "INTERVIEWED";
            const isSelected = candidate.status === "SELECTED";
            const isRejected = candidate.status === "REJECTED";
            const isAbsent = candidate.status === "ABSENT";
            const isPlacedOutside = candidate.status === "PLACED_OUTSIDE";
            const isVacancyClosed = candidate.vacancyStatus !== "ACTIVE";

            return (
              <div
                key={candidate.id}
                className={`bg-white border rounded-none shadow-xs p-5 sm:p-6 transition-all ${
                  isSelectedCard
                    ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left: Checkbox + Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="pt-1 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelectedCard}
                        onChange={() => toggleSelectCandidate(candidate.id)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded-none focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 border border-slate-200">
                          {candidate.candidateId}
                        </span>

                        {/* Status Badges */}
                        {isApplied && (
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5">
                            New Lead
                          </span>
                        )}
                        {isConnected && (
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5">
                            Connected via WhatsApp
                          </span>
                        )}
                        {isInterview && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5">
                            <Clock className="w-3 h-3" />
                            Interview Scheduled
                          </span>
                        )}
                        {isInterviewed && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5">
                            <Eye className="w-3 h-3" />
                            Interview Completed / Evaluated
                          </span>
                        )}
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Selected by Employer
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                        {isAbsent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5">
                            <AlertCircle className="w-3 h-3" />
                            Absent / No-Show
                          </span>
                        )}
                        {isPlacedOutside && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-300 px-2.5 py-0.5">
                            <UserX className="w-3 h-3" />
                            Placed Outside / Inactive
                          </span>
                        )}

                        {/* Vacancy Closed Warning Chip */}
                        {isVacancyClosed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Original Vacancy Closed / Disabled
                          </span>
                        )}

                        <span className="text-xs text-slate-400">
                          Applied: {new Date(candidate.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Name & Originating Job Info */}
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                          {candidate.fullName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                          <span className="font-semibold text-slate-800">
                            Current Role: {candidate.vacancyJobId}: {candidate.vacancyTitle}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {candidate.clientCompanyName} ({candidate.vacancyCity})
                          </span>
                        </div>
                      </div>

                      {/* Attributes Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 border border-slate-200 text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone</span>
                          <span className="font-semibold text-slate-900 font-mono">{candidate.phone}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Qualification</span>
                          <span className="font-semibold text-slate-900">{candidate.qualification}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Experience</span>
                          <span className="font-semibold text-slate-900">{candidate.totalExperience}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Notice Period</span>
                          <span className="font-semibold text-slate-900">{candidate.availability}</span>
                        </div>
                      </div>

                      {/* Interested Roles */}
                      {candidate.interestedRoles.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                            Preferred Domains:
                          </span>
                          {candidate.interestedRoles.map((role, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 border border-slate-200"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Client Evaluation Remarks & Feedback */}
                      {candidate.clientFeedback && (
                        <div className="p-3 bg-blue-50/60 border-l-3 border-blue-600 text-xs text-slate-800 space-y-0.5">
                          <span className="font-bold text-blue-900 uppercase text-[10px] block">
                            Client Evaluation Feedback ({candidate.clientCompanyName})
                          </span>
                          <p>{candidate.clientFeedback}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-56">
                    {/* View Resume PDF */}
                    <button
                      type="button"
                      onClick={() =>
                        setResumeModalData({
                          candidateName: candidate.fullName,
                          resumeUrl: candidate.resumeUrl,
                          resumeFileName: candidate.resumeFileName,
                        })
                      }
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Resume PDF</span>
                    </button>

                    {/* 1-Tap WhatsApp */}
                    {!isPlacedOutside && (
                      <button
                        type="button"
                        onClick={() => handleWhatsAppConnect(candidate)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>1-Tap WhatsApp</span>
                      </button>
                    )}

                    {/* Send / Reassign for Interview */}
                    {!isSelected && !isPlacedOutside && (
                      <button
                        type="button"
                        onClick={() => openDispatchModal(candidate)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {isInterview ? "Reschedule Interview" : "Send for Interview"}
                        </span>
                      </button>
                    )}

                    {/* Placed Outside Actions */}
                    {isPlacedOutside ? (
                      <button
                        type="button"
                        onClick={() => handleReactivateCandidate(candidate.id)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-none text-center cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                        <span>Reactivate Lead</span>
                      </button>
                    ) : (
                      !isSelected && (
                        <button
                          type="button"
                          onClick={() => handleMarkPlacedOutside(candidate.id)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold uppercase tracking-wider rounded-none text-center cursor-pointer"
                        >
                          <UserX className="w-3 h-3" />
                          <span>Mark Placed Outside</span>
                        </button>
                      )
                    )}

                    {/* Delete Option */}
                    <button
                      type="button"
                      onClick={() => setDeletingCandidate(candidate)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-[10.5px] font-bold uppercase tracking-wider rounded-none text-center cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: RESUME DOCUMENT VIEWER */}
      {resumeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                    {resumeModalData.candidateName} &bull; Resume Document
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {resumeModalData.resumeFileName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={resumeModalData.resumeUrl}
                  download={resumeModalData.resumeFileName}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setResumeModalData(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-none transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={`${resumeModalData.resumeUrl}#toolbar=0`}
                className="w-full h-full border border-slate-300 bg-white"
                title="Resume Document Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SEND / REASSIGN CANDIDATE FOR INTERVIEW */}
      {dispatchModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Send Candidate for Interview
              </h3>
              <button
                type="button"
                onClick={() => setDispatchModalCandidate(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 border border-slate-200">
              <p>
                Candidate: <strong className="text-slate-900">{dispatchModalCandidate.fullName}</strong> ({dispatchModalCandidate.candidateId})
              </p>
              <p>
                Originally Applied: <span className="font-semibold text-slate-700">{dispatchModalCandidate.vacancyJobId}: {dispatchModalCandidate.vacancyTitle}</span>
              </p>
              {dispatchModalCandidate.vacancyStatus !== "ACTIVE" && (
                <div className="mt-2 p-2 bg-amber-50 border-l-2 border-amber-500 text-amber-900 text-[11px]">
                  ⚠️ Note: Original vacancy is currently closed/disabled. Reassigning this candidate to an active opening will dispatch them to that employer.
                </div>
              )}
            </div>

            {/* Target Vacancy Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Target Interview Mandate (Active Vacancy)
              </label>
              <select
                value={modalTargetVacancyId}
                onChange={(e) => setModalTargetVacancyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {activeVacancies.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.jobId}: {v.title} &bull; {v.clientCompanyName} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Scheduled Interview Date
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Screening Remarks */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Recruiter Screening Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={interviewNote}
                onChange={(e) => setInterviewNote(e.target.value)}
                placeholder="e.g. Profile screened, comfortable with location and rotational shift..."
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDispatchModalCandidate(null)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDispatch}
                disabled={isSubmitting || !modalTargetVacancyId}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Dispatching..." : "Confirm & Send to Client Desk"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BULK DISPATCH MODAL */}
      {showBulkDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Bulk Dispatch Candidates ({selectedCandidateIds.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowBulkDispatchModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border-l-4 border-blue-600 text-blue-900 text-xs space-y-1">
              <p className="font-bold">
                Bulk Dispatching {selectedCandidateIds.length} candidate(s) to:
              </p>
              <p className="text-xs font-semibold text-blue-800">
                {currentTargetVacancy?.jobId}: {currentTargetVacancy?.title} &bull; {currentTargetVacancy?.clientCompanyName} ({currentTargetVacancy?.city})
              </p>
              <p className="text-[11px] text-blue-700 pt-1">
                All selected candidates will have their active vacancy updated to this mandate and immediately land on the employer&apos;s evaluation portal!
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Drive / Interview Date
              </label>
              <input
                type="date"
                value={bulkInterviewDate}
                onChange={(e) => setBulkInterviewDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Batch Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={bulkInterviewNote}
                onChange={(e) => setBulkInterviewNote(e.target.value)}
                placeholder="e.g. Batch screened for immediate bulk drive..."
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBulkDispatchModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDispatch}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Dispatching Batch..." : `Confirm & Dispatch ${selectedCandidateIds.length} Candidates`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deletingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Permanently Delete Candidate?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deletingCandidate.fullName}</strong> ({deletingCandidate.candidateId})? This will erase their profile and delete their resume document from storage.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingCandidate(null)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  Calendar, 
  Send,
  MessageSquare,
  Building2,
  Briefcase,
  AlertTriangle,
  UserX,
  RotateCcw,
  Trash2,
  ExternalLink,
  Copy,
  Check
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
  vacancyInterviewVenue?: string | null;
  vacancyInterviewLocationUrl?: string | null;
  vacancyInterviewContactPerson?: string | null;
  vacancyInterviewContactPhone?: string | null;
  vacancyInterviewInstructions?: string | null;
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
  interviewVenue?: string | null;
  interviewLocationUrl?: string | null;
  interviewContactPerson?: string | null;
  interviewContactPhone?: string | null;
  interviewInstructions?: string | null;
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
  recruiterPhone?: string | null;
  employeeCode: string;
  whatsappTemplate?: string | null;
}

export const DEFAULT_WHATSAPP_TEMPLATE = `Dear {candidate_name},

Congratulations! You have been shortlisted for an interview with {company_name} for the position of *{job_title}* (Job ID: *{job_id}*).

📅 *Interview Date & Time:*
{interview_date}

📍 *Interview Venue:*
{interview_venue}

🗺️ *Google Maps GPS Location:*
{venue_location_url}

👤 *Contact Person / SPOC:* {contact_person}
📞 *Contact Phone:* {contact_phone}

⚠️ *Important Instructions:*
1. Kindly call {contact_phone} once you reach the venue.
2. At the company reception desk, please don't forget to mention *RiseUp Consultancy* as your consultancy referral.
3. Carry 2 printed hard copies of your updated resume and a valid Government Photo ID.
{interview_instructions}

Best of luck!
— {recruiter_name} | RiseUp Consultancy
📞 {recruiter_phone}`;

function formatInterviewDateTime(dateStr?: string | null): string {
  if (!dateStr) return "To be confirmed by recruiter";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

function buildInterviewWhatsAppMessage({
  template,
  candidate,
  targetVacancy,
  interviewDateStr,
  recruiterName,
  recruiterPhone,
}: {
  template: string;
  candidate: CandidateItem;
  targetVacancy?: ActiveVacancyOption | null;
  interviewDateStr?: string | null;
  recruiterName: string;
  recruiterPhone?: string | null;
}): string {
  const company = targetVacancy?.clientCompanyName || candidate.clientCompanyName || "Company Office";
  const title = targetVacancy?.title || candidate.vacancyTitle;
  const jobId = targetVacancy?.jobId || candidate.vacancyJobId;
  const city = targetVacancy?.city || candidate.vacancyCity;

  const venue = targetVacancy?.interviewVenue || candidate.vacancyInterviewVenue || "Company Office (Reach SPOC on arrival)";
  const mapsUrl = targetVacancy?.interviewLocationUrl || candidate.vacancyInterviewLocationUrl || "Location link will be shared";
  const contactPerson = targetVacancy?.interviewContactPerson || candidate.vacancyInterviewContactPerson || "Reception / HR Desk";
  const contactPhone = targetVacancy?.interviewContactPhone || candidate.vacancyInterviewContactPhone || recruiterPhone || "Reception Desk";
  const instructions = (targetVacancy?.interviewInstructions || candidate.vacancyInterviewInstructions)
    ? `\n📌 *Special Note:* ${targetVacancy?.interviewInstructions || candidate.vacancyInterviewInstructions}`
    : "";

  const formattedDate = formatInterviewDateTime(interviewDateStr);

  return template
    .replace(/{candidate_name}/g, candidate.fullName)
    .replace(/{company_name}/g, company)
    .replace(/{job_title}/g, title)
    .replace(/{job_id}/g, jobId)
    .replace(/{work_city}/g, city)
    .replace(/{interview_date}/g, formattedDate)
    .replace(/{interview_venue}/g, venue)
    .replace(/{venue_location_url}/g, mapsUrl)
    .replace(/{contact_person}/g, contactPerson)
    .replace(/{contact_phone}/g, contactPhone)
    .replace(/{interview_instructions}/g, instructions)
    .replace(/{recruiter_name}/g, recruiterName)
    .replace(/{recruiter_phone}/g, recruiterPhone || "RiseUp Helpdesk")
    .replace(/{referral_tag}/g, candidate.referralTag);
}

function buildScreeningWhatsAppMessage({
  candidate,
  recruiterName,
  recruiterPhone,
}: {
  candidate: CandidateItem;
  recruiterName: string;
  recruiterPhone?: string | null;
}): string {
  return `Hello ${candidate.fullName}, this is ${recruiterName} from RiseUp Consultancy regarding your application for ${candidate.vacancyTitle} at ${candidate.clientCompanyName}.

We have reviewed your profile and would like to connect for a quick screening round before scheduling your client interview.

*Mandatory Referral Code at Interview:*
${candidate.referralTag}

Please reply to confirm your availability.
— ${recruiterName} | RiseUp Consultancy (${recruiterPhone || "Pune HQ"})`;
}

export default function HrCandidatePipeline({
  initialCandidates,
  activeVacancies,
  appliedVacancies,
  recruiterName,
  recruiterPhone,
  employeeCode,
  whatsappTemplate,
}: HrCandidatePipelineProps) {
  const [candidates, setCandidates] = useState<CandidateItem[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppliedVacancyId, setSelectedAppliedVacancyId] = useState("ALL");
  const [bulkTargetVacancyId, setBulkTargetVacancyId] = useState<string>(activeVacancies[0]?.id || "");
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
  const [interviewTime, setInterviewTime] = useState("10:30 AM");
  const [interviewNote, setInterviewNote] = useState("");
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk Dispatch Modal
  const [showBulkDispatchModal, setShowBulkDispatchModal] = useState(false);
  const [bulkInterviewDate, setBulkInterviewDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [bulkInterviewNote, setBulkInterviewNote] = useState("");

  // Delete Confirmation Modal
  const [deletingCandidate, setDeletingCandidate] = useState<CandidateItem | null>(null);

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
    const cleanPhone = candidate.phone.replace(/[^0-9]/g, "");

    // If candidate is already scheduled for interview, open interview call letter with full venue details
    if (candidate.status === "GOING_FOR_INTERVIEW") {
      const targetVac = activeVacancies.find((v) => v.id === candidate.vacancyId);
      const formattedMessage = buildInterviewWhatsAppMessage({
        template: whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
        candidate,
        targetVacancy: targetVac,
        interviewDateStr: candidate.interviewDate,
        recruiterName,
        recruiterPhone,
      });
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedMessage)}`;
      window.open(waUrl, "_blank");
      return;
    }

    // Default outreach message for new or connected leads
    const formattedMessage = buildScreeningWhatsAppMessage({
      candidate,
      recruiterName,
      recruiterPhone,
    });

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
    const isCurrentActive = activeVacancies.some((v) => v.id === candidate.vacancyId);
    setModalTargetVacancyId(isCurrentActive ? candidate.vacancyId : (activeVacancies[0]?.id || ""));
    setInterviewDate(
      candidate.interviewDate 
        ? new Date(candidate.interviewDate).toISOString().split("T")[0] 
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    setInterviewTime("10:30 AM");
    setInterviewNote("");
    setCopiedNotice(false);
  };

  // Confirm Single Dispatch
  const handleConfirmSingleDispatch = async (openWhatsApp = false) => {
    if (!dispatchModalCandidate || !modalTargetVacancyId) {
      setErrorMessage("Please select an active target opening.");
      return;
    }

    const targetVac = activeVacancies.find((v) => v.id === modalTargetVacancyId);
    const combinedDateStr = `${interviewDate} ${interviewTime}`.trim();

    let dateToStore = interviewDate;
    try {
      const dt = new Date(`${interviewDate} ${interviewTime}`);
      if (!isNaN(dt.getTime())) {
        dateToStore = dt.toISOString();
      } else {
        dateToStore = new Date(interviewDate).toISOString();
      }
    } catch {
      dateToStore = new Date(interviewDate).toISOString();
    }

    if (openWhatsApp) {
      const callLetter = buildInterviewWhatsAppMessage({
        template: whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
        candidate: dispatchModalCandidate,
        targetVacancy: targetVac,
        interviewDateStr: combinedDateStr,
        recruiterName,
        recruiterPhone,
      });
      const cleanPhone = dispatchModalCandidate.phone.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(callLetter)}`;
      window.open(waUrl, "_blank");
    }

    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await dispatchCandidateToInterviewAction({
        candidateId: dispatchModalCandidate.id,
        targetVacancyId: modalTargetVacancyId,
        interviewDate: dateToStore,
        note: interviewNote || `Dispatched for interview on ${combinedDateStr}`,
      });

      if (res.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === dispatchModalCandidate.id
              ? {
                  ...c,
                  status: "GOING_FOR_INTERVIEW",
                  interviewDate: dateToStore,
                  vacancyId: modalTargetVacancyId,
                  vacancyJobId: targetVac?.jobId || c.vacancyJobId,
                  vacancyTitle: targetVac?.title || c.vacancyTitle,
                  vacancyCity: targetVac?.city || c.vacancyCity,
                  clientCompanyName: targetVac?.clientCompanyName || c.clientCompanyName,
                  vacancyInterviewVenue: targetVac?.interviewVenue || null,
                  vacancyInterviewLocationUrl: targetVac?.interviewLocationUrl || null,
                  vacancyInterviewContactPerson: targetVac?.interviewContactPerson || null,
                  vacancyInterviewContactPhone: targetVac?.interviewContactPhone || null,
                  vacancyInterviewInstructions: targetVac?.interviewInstructions || null,
                  vacancyStatus: "ACTIVE",
                }
              : c
          )
        );
        setActionMessage(
          openWhatsApp
            ? "Candidate dispatched & WhatsApp Call Letter launched!"
            : (res.message || "Candidate successfully dispatched for interview.")
        );
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
    if (!bulkTargetVacancyId || selectedCandidateIds.length === 0) {
      setErrorMessage("Please select an active target vacancy and at least one candidate.");
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await bulkDispatchCandidatesToInterviewAction({
        candidateIds: selectedCandidateIds,
        targetVacancyId: bulkTargetVacancyId,
        interviewDate: bulkInterviewDate,
        note: bulkInterviewNote || `Bulk dispatched on ${bulkInterviewDate}`,
      });

      if (res.success) {
        const targetVac = activeVacancies.find((v) => v.id === bulkTargetVacancyId);
        setCandidates((prev) =>
          prev.map((c) =>
            selectedCandidateIds.includes(c.id)
              ? {
                  ...c,
                  status: "GOING_FOR_INTERVIEW",
                  interviewDate: new Date(bulkInterviewDate).toISOString(),
                  vacancyId: bulkTargetVacancyId,
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

  const selectedTargetVac = activeVacancies.find((v) => v.id === modalTargetVacancyId);
  const combinedDateStr = `${interviewDate} ${interviewTime}`.trim();
  const currentCallLetter = dispatchModalCandidate
    ? buildInterviewWhatsAppMessage({
        template: whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
        candidate: dispatchModalCandidate,
        targetVacancy: selectedTargetVac,
        interviewDateStr: combinedDateStr,
        recruiterName,
        recruiterPhone,
      })
    : "";

  const selectedBulkVac = activeVacancies.find((v) => v.id === bulkTargetVacancyId);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-blue-600 inline-block"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Recruiter ATS Pipeline &bull; {employeeCode}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
            Candidate Screening & Interview Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter candidate talent pool, schedule client interviews, and dispatch verified referrals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hr/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none transition-colors border border-slate-300"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>WhatsApp Template</span>
          </Link>
          <Link
            href="/hr/vacancies"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-xs"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Mandates</span>
          </Link>
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

      {/* SECTION: COMPACT SEARCH & FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          {/* Search Query */}
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name, ID, phone, city, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Applied Opening Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedAppliedVacancyId}
              onChange={(e) => setSelectedAppliedVacancyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Job Vacancies</option>
              {appliedVacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.jobId}: {v.title} {v.status !== "ACTIVE" ? `(${v.status})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="lg:col-span-2">
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1">1+ Years</option>
              <option value="2">2+ Years</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="lg:col-span-2">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Availability</option>
              <option value="Immediate Joiner">Immediate Joiner</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
            </select>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full">
            {[
              { key: "ALL", label: `All (${candidates.length})` },
              { key: "ACTIVE_POOL", label: "Active Pool" },
              { key: "GOING_FOR_INTERVIEW", label: "Interview Scheduled" },
              { key: "INTERVIEWED", label: "Interviewed" },
              { key: "SELECTED", label: "Selected" },
              { key: "REJECTED", label: "Rejected" },
              { key: "ABSENT", label: "Absent" },
              { key: "PLACED_OUTSIDE", label: "Placed Outside" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
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

      {/* STICKY BULK DISPATCH ACTION BAR */}
      {selectedCandidateIds.length > 0 && (
        <div className="sticky top-14 z-30 bg-slate-900 text-white p-3 border border-slate-800 rounded-none shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 bg-blue-600 font-bold flex items-center justify-center text-xs">
              {selectedCandidateIds.length}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {selectedCandidateIds.length} Candidate(s) Selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={bulkTargetVacancyId}
              onChange={(e) => setBulkTargetVacancyId(e.target.value)}
              className="bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-white rounded-none focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {activeVacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.jobId}: {v.title} ({v.clientCompanyName})
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!bulkTargetVacancyId}
              onClick={() => setShowBulkDispatchModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Bulk Send for Interview</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCandidateIds([])}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* CANDIDATE PIPELINE CARDS: STREAMLINED & MINIMALIST */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-10 text-center space-y-2">
          <div className="w-10 h-10 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            No candidates found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, applied vacancy, or stage filter tabs.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
                className={`bg-white border rounded-none p-3.5 sm:p-4 transition-all duration-150 ${
                  isSelectedCard
                    ? "border-blue-600 bg-blue-50/15 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Header Row: Checkbox, Name, ID, Badges, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <input
                      type="checkbox"
                      checked={isSelectedCard}
                      onChange={() => toggleSelectCandidate(candidate.id)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded-none focus:ring-blue-500 cursor-pointer"
                    />

                    <h2 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                      {candidate.fullName}
                    </h2>

                    <span className="font-mono text-[10.5px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 border border-slate-200">
                      {candidate.candidateId}
                    </span>

                    {/* Status Badges */}
                    {isApplied && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2">
                        New Lead
                      </span>
                    )}
                    {isConnected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2">
                        Connected
                      </span>
                    )}
                    {isInterview && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.2">
                        <Clock className="w-3 h-3" />
                        Interview Scheduled
                      </span>
                    )}
                    {isInterviewed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.2">
                        <Eye className="w-3 h-3" />
                        Interviewed
                      </span>
                    )}
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.2">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                    {isAbsent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.2">
                        <AlertCircle className="w-3 h-3" />
                        Absent
                      </span>
                    )}
                    {isPlacedOutside && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.2">
                        <UserX className="w-3 h-3" />
                        Placed Outside
                      </span>
                    )}

                    {/* Vacancy Closed Warning */}
                    {isVacancyClosed && (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.2">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Opening Closed
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    Applied: {new Date(candidate.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Details Row: Compact Metadata */}
                <div className="py-2.5 space-y-1.5 text-xs">
                  {/* Job and Client Info */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {candidate.vacancyJobId}: {candidate.vacancyTitle}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {candidate.clientCompanyName} ({candidate.vacancyCity})
                    </span>
                  </div>

                  {/* Candidate Attributes Inline Strip */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-600 pt-0.5">
                    <span>
                      <strong className="text-slate-500 font-medium uppercase text-[10px]">Phone:</strong>{" "}
                      <span className="font-mono text-slate-900 font-semibold">{candidate.phone}</span>
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span>
                      <strong className="text-slate-500 font-medium uppercase text-[10px]">Exp:</strong>{" "}
                      <span className="text-slate-900 font-semibold">{candidate.totalExperience}</span>
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span>
                      <strong className="text-slate-500 font-medium uppercase text-[10px]">Notice:</strong>{" "}
                      <span className="text-slate-900 font-semibold">{candidate.availability}</span>
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span>
                      <strong className="text-slate-500 font-medium uppercase text-[10px]">Qual:</strong>{" "}
                      <span className="text-slate-800">{candidate.qualification}</span>
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span>
                      <strong className="text-slate-500 font-medium uppercase text-[10px]">City:</strong>{" "}
                      <span className="text-slate-800">{candidate.city}</span>
                    </span>
                  </div>

                  {/* Client Feedback Strip (if present) */}
                  {candidate.clientFeedback && (
                    <div className="p-2 bg-blue-50/70 border-l-2 border-blue-600 text-[11px] text-slate-800">
                      <strong className="font-bold text-blue-900 uppercase text-[9.5px] block">
                        Employer Feedback ({candidate.clientCompanyName}):
                      </strong>
                      <p className="mt-0.5">{candidate.clientFeedback}</p>
                    </div>
                  )}

                  {/* Scheduled Interview Details & Venue Strip */}
                  {isInterview && candidate.interviewDate && (
                    <div className="p-2.5 bg-purple-50/75 border-l-2 border-purple-600 text-xs text-slate-800 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-purple-900 text-[11.5px]">
                          <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>
                            Interview: {formatInterviewDateTime(candidate.interviewDate)}
                          </span>
                        </div>
                        {candidate.vacancyInterviewLocationUrl && (
                          <a
                            href={candidate.vacancyInterviewLocationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-700 hover:text-blue-900 underline"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>GPS Location</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {candidate.vacancyInterviewVenue && (
                        <p className="text-[11px] text-slate-700">
                          <strong className="text-slate-900">Venue:</strong> {candidate.vacancyInterviewVenue}
                        </p>
                      )}
                      {(candidate.vacancyInterviewContactPerson || candidate.vacancyInterviewContactPhone) && (
                        <p className="text-[11px] text-slate-700">
                          <strong className="text-slate-900">On-site SPOC:</strong>{" "}
                          {candidate.vacancyInterviewContactPerson || "Reception Desk"}{" "}
                          {candidate.vacancyInterviewContactPhone ? `(Tel: ${candidate.vacancyInterviewContactPhone})` : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons Bar: Neat, Minimalist, Consistent Borders */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
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
                      className="h-7.5 inline-flex items-center gap-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10.5px] font-bold uppercase tracking-wider rounded-none border border-slate-900 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Resume PDF</span>
                    </button>

                    {/* 1-Tap WhatsApp */}
                    {!isPlacedOutside && (
                      <button
                        type="button"
                        onClick={() => handleWhatsAppConnect(candidate)}
                        className={`h-7.5 inline-flex items-center gap-1 px-2.5 text-white text-[10.5px] font-bold uppercase tracking-wider rounded-none border transition-colors cursor-pointer ${
                          isInterview
                            ? "bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
                            : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                        }`}
                        title={isInterview ? "Open WhatsApp with auto-filled Interview Call Letter" : "Initiate screening WhatsApp"}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{isInterview ? "WhatsApp Call Letter" : "WhatsApp"}</span>
                      </button>
                    )}

                    {/* Send for Interview */}
                    {!isSelected && !isPlacedOutside && (
                      <button
                        type="button"
                        onClick={() => openDispatchModal(candidate)}
                        className="h-7.5 inline-flex items-center gap-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold uppercase tracking-wider rounded-none border border-blue-600 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{isInterview ? "Reschedule" : "Send for Interview"}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Placed Outside / Reactivate */}
                    {isPlacedOutside ? (
                      <button
                        type="button"
                        onClick={() => handleReactivateCandidate(candidate.id)}
                        className="h-7.5 inline-flex items-center gap-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10.5px] font-bold uppercase tracking-wider rounded-none border border-slate-300 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-blue-600" />
                        <span>Reactivate Lead</span>
                      </button>
                    ) : (
                      !isSelected && (
                        <button
                          type="button"
                          onClick={() => handleMarkPlacedOutside(candidate.id)}
                          className="h-7.5 inline-flex items-center gap-1 px-2.5 bg-white hover:bg-slate-100 text-slate-600 text-[10.5px] font-bold uppercase tracking-wider rounded-none border border-slate-300 transition-colors cursor-pointer"
                        >
                          <UserX className="w-3 h-3 text-slate-500" />
                          <span>Placed Outside</span>
                        </button>
                      )
                    )}

                    {/* Delete Profile (With proper matching border) */}
                    <button
                      type="button"
                      onClick={() => setDeletingCandidate(candidate)}
                      className="h-7.5 inline-flex items-center gap-1 px-2.5 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-[10.5px] font-bold uppercase tracking-wider rounded-none border border-red-300 hover:border-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: RESUME VIEWER */}
      {resumeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                  {resumeModalData.candidateName} &bull; Resume Preview
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={resumeModalData.resumeUrl}
                  download={resumeModalData.resumeFileName}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setResumeModalData(null)}
                  className="p-1 text-slate-500 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-none cursor-pointer"
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

      {/* MODAL 2: SEND FOR INTERVIEW (CHOOSE TARGET OPENING & WHATSAPP DISPATCH) */}
      {dispatchModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-xl p-5 sm:p-6 space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Schedule Interview & WhatsApp Dispatch
              </h3>
              <button
                type="button"
                onClick={() => setDispatchModalCandidate(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Candidate & Origin Lead Summary */}
            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p>
                  Candidate: <strong className="text-slate-900">{dispatchModalCandidate.fullName}</strong> ({dispatchModalCandidate.candidateId})
                </p>
                <span className="font-mono font-semibold text-slate-800">{dispatchModalCandidate.phone}</span>
              </div>
              <p>
                Original Applied Role: <span className="font-semibold text-slate-700">{dispatchModalCandidate.vacancyJobId}: {dispatchModalCandidate.vacancyTitle}</span> ({dispatchModalCandidate.clientCompanyName})
              </p>
              {dispatchModalCandidate.vacancyStatus !== "ACTIVE" && (
                <div className="mt-1.5 p-2 bg-amber-50 border-l-2 border-amber-500 text-amber-900 text-[11px]">
                  ⚠️ Original opening is closed or filled. Choose any active vacancy below to dispatch this candidate.
                </div>
              )}
            </div>

            {/* Choose Target Vacancy Dropdown */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Select Interview Opening (Target Vacancy)
              </label>
              <select
                value={modalTargetVacancyId}
                onChange={(e) => setModalTargetVacancyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {activeVacancies.length === 0 ? (
                  <option value="">No active broadcasted openings available</option>
                ) : (
                  activeVacancies.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.jobId}: {v.title} &bull; {v.clientCompanyName} ({v.city})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Selected Vacancy Venue & SPOC Details Card */}
            {selectedTargetVac && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-bold text-blue-900 uppercase text-[10.5px]">
                    {selectedTargetVac.jobId}: {selectedTargetVac.title} ({selectedTargetVac.clientCompanyName})
                  </span>
                  {selectedTargetVac.interviewLocationUrl && (
                    <a
                      href={selectedTargetVac.interviewLocationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-700 hover:text-blue-900 underline"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Test Maps GPS</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {selectedTargetVac.interviewVenue ? (
                  <p className="text-slate-700 text-[11px]">
                    <strong className="text-slate-900">Physical Venue:</strong> {selectedTargetVac.interviewVenue}
                  </p>
                ) : (
                  <p className="text-amber-800 text-[10.5px]">
                    ⚠️ Exact venue not added by client yet. (Candidate will be instructed to call SPOC on arrival).
                  </p>
                )}

                {(selectedTargetVac.interviewContactPerson || selectedTargetVac.interviewContactPhone) && (
                  <p className="text-slate-700 text-[11px]">
                    <strong className="text-slate-900">On-site SPOC:</strong> {selectedTargetVac.interviewContactPerson || "Reception"} {selectedTargetVac.interviewContactPhone ? `(Tel: ${selectedTargetVac.interviewContactPhone})` : ""}
                  </p>
                )}

                {selectedTargetVac.interviewInstructions && (
                  <p className="text-slate-600 text-[10.5px] italic">
                    Note: {selectedTargetVac.interviewInstructions}
                  </p>
                )}
              </div>
            )}

            {/* Date & Time Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Scheduled Interview Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:30 AM"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Screening Remarks */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Recruiter Screening Remarks (Optional)
              </label>
              <textarea
                rows={1}
                value={interviewNote}
                onChange={(e) => setInterviewNote(e.target.value)}
                placeholder="e.g. Screened profile, cleared basic English communication..."
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Live Auto-Generated WhatsApp Call Letter Preview */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Auto-Generated WhatsApp Call Letter</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentCallLetter) return;
                    navigator.clipboard.writeText(currentCallLetter);
                    setCopiedNotice(true);
                    setTimeout(() => setCopiedNotice(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {copiedNotice ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-300 text-[11px] text-slate-800 leading-relaxed font-sans max-h-36 overflow-y-auto whitespace-pre-wrap">
                {currentCallLetter}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDispatchModalCandidate(null)}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmSingleDispatch(false)}
                  disabled={isSubmitting || !modalTargetVacancyId}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Dispatching..." : "Confirm Dispatch Only"}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSingleDispatch(true)}
                  disabled={isSubmitting || !modalTargetVacancyId}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Confirm & Open WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BULK INTERVIEW DISPATCH */}
      {showBulkDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-lg p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Bulk Dispatch ({selectedCandidateIds.length} Candidates)
              </h3>
              <button
                type="button"
                onClick={() => setShowBulkDispatchModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Destination Opening (Active Mandate)
              </label>
              <select
                value={bulkTargetVacancyId}
                onChange={(e) => setBulkTargetVacancyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {activeVacancies.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.jobId}: {v.title} &bull; {v.clientCompanyName} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Destination Venue Details */}
            {selectedBulkVac && (
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 uppercase text-[10px]">
                    Drive Destination: {selectedBulkVac.title}
                  </span>
                  {selectedBulkVac.interviewLocationUrl && (
                    <a
                      href={selectedBulkVac.interviewLocationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-700 hover:text-blue-900 underline"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>GPS Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {selectedBulkVac.interviewVenue && (
                  <p className="text-slate-700 text-[11px]">
                    <strong className="text-slate-900">Venue:</strong> {selectedBulkVac.interviewVenue}
                  </p>
                )}
                {(selectedBulkVac.interviewContactPerson || selectedBulkVac.interviewContactPhone) && (
                  <p className="text-slate-700 text-[11px]">
                    <strong className="text-slate-900">On-site SPOC:</strong> {selectedBulkVac.interviewContactPerson || "Reception"} {selectedBulkVac.interviewContactPhone ? `(Tel: ${selectedBulkVac.interviewContactPhone})` : ""}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Interview / Drive Date
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
                placeholder="e.g. Batch screened for bulk drive..."
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBulkDispatchModal(false)}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDispatch}
                disabled={isSubmitting}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Dispatching..." : `Dispatch ${selectedCandidateIds.length} Candidates`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deletingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-md p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Permanently Delete Candidate?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deletingCandidate.fullName}</strong> ({deletingCandidate.candidateId})? This will delete their profile and remove their resume document from storage.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingCandidate(null)}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
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

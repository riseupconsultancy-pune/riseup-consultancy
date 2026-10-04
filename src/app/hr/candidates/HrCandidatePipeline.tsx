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
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { 
  updateCandidateStatusByHrAction,
  dispatchCandidateToInterviewAction,
  bulkDispatchCandidatesToInterviewAction,
  setCandidatePlacedOutsideAction,
  reactivateCandidateAction
} from "@/app/actions/hr-actions";
import { formatWhatsAppPhone } from "@/lib/utils";
import WhatsAppIcon from "@/components/WhatsAppIcon";

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

Your interview has been scheduled. Please visit the given location for your interview:

📅 *Interview Date & Time:*
{interview_date}

📍 *Interview Venue / Location:*
{interview_venue}

🗺️ *Google Maps GPS Location:*
{google_map_url}

👤 *Contact Person / SPOC:* {contact_person}
📞 *Contact Phone:* {contact_phone}

⚠️ *Important Instructions:*
1. Kindly visit the above interview location on your scheduled date & time.
2. At the company reception desk, please don't forget to mention *RiseUp Consultancy* as your consultancy referral.
3. Carry 2 printed hard copies of your updated resume and a valid Government Photo ID.
{interview_instructions}

Best of luck!
— {recruiter_name} | RiseUp Consultancy
📞 {recruiter_phone}`;

function formatInterviewDateTime(dateStr?: string | null): string {
  if (!dateStr) return "Today / Tomorrow (Reporting Window: 10:30 AM to 4:00 PM)";
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
  // If the template is empty or the obsolete single-sentence draft, upgrade to comprehensive template
  const isLegacyTemplate =
    !template ||
    template.trim().length === 0 ||
    template.includes("brief discussion regarding the interview schedule") ||
    template.includes("regarding your application for {Job_Title}") ||
    template.includes("regarding your application for {job_title}");

  const effectiveTemplate = isLegacyTemplate ? DEFAULT_WHATSAPP_TEMPLATE : template;

  const company = targetVacancy?.clientCompanyName || candidate.clientCompanyName || "Company Corporate Office";
  const title = targetVacancy?.title || candidate.vacancyTitle || "Job Position";
  const jobId = targetVacancy?.jobId || candidate.vacancyJobId || "RUP-JOB";
  const city = targetVacancy?.city || candidate.vacancyCity || "Pune";

  const venue =
    targetVacancy?.interviewVenue ||
    candidate.vacancyInterviewVenue ||
    "Company Office (Report to SPOC / Reception on arrival)";

  const rawMapsUrl = targetVacancy?.interviewLocationUrl || candidate.vacancyInterviewLocationUrl || "";
  const displayMapsUrl = rawMapsUrl && rawMapsUrl.trim().length > 0 ? rawMapsUrl.trim() : "https://maps.google.com";

  const contactPerson =
    targetVacancy?.interviewContactPerson ||
    candidate.vacancyInterviewContactPerson ||
    "Reception / HR SPOC";

  const contactPhone =
    targetVacancy?.interviewContactPhone ||
    candidate.vacancyInterviewContactPhone ||
    recruiterPhone ||
    "+91 93598 92819";

  const rawInstructions =
    targetVacancy?.interviewInstructions ||
    candidate.vacancyInterviewInstructions ||
    "";
  const instructions =
    rawInstructions && rawInstructions.trim().length > 0
      ? `\n📌 *Special Note:* ${rawInstructions.trim()}`
      : "";

  const formattedDate = formatInterviewDateTime(interviewDateStr);

  let message = effectiveTemplate
    // Candidate Name
    .replace(/{candidate_name}/gi, candidate.fullName)
    .replace(/{candidateName}/gi, candidate.fullName)
    .replace(/{name}/gi, candidate.fullName)
    // Company Name
    .replace(/{company_name}/gi, company)
    .replace(/{companyName}/gi, company)
    .replace(/{company}/gi, company)
    .replace(/{client_name}/gi, company)
    // Job Title & Role
    .replace(/{job_title}/gi, title)
    .replace(/{jobTitle}/gi, title)
    .replace(/{job_role}/gi, title)
    .replace(/{vacancy_title}/gi, title)
    .replace(/{vacancy_name}/gi, title)
    .replace(/{role}/gi, title)
    // Job ID
    .replace(/{job_id}/gi, jobId)
    .replace(/{jobId}/gi, jobId)
    // City
    .replace(/{work_city}/gi, city)
    .replace(/{city}/gi, city)
    // Interview Date & Time
    .replace(/{interview_date}/gi, formattedDate)
    .replace(/{interviewDate}/gi, formattedDate)
    .replace(/{date}/gi, formattedDate)
    // Interview Venue
    .replace(/{interview_venue}/gi, venue)
    .replace(/{interviewVenue}/gi, venue)
    .replace(/{venue}/gi, venue)
    .replace(/{interview_location}/gi, venue)
    .replace(/{location}/gi, venue)
    // Google Maps URL
    .replace(/{google_map_url}/gi, displayMapsUrl)
    .replace(/{google_maps_url}/gi, displayMapsUrl)
    .replace(/{venue_location_url}/gi, displayMapsUrl)
    .replace(/{map_url}/gi, displayMapsUrl)
    .replace(/{maps_url}/gi, displayMapsUrl)
    .replace(/{interview_location_url}/gi, displayMapsUrl)
    .replace(/{interview_map_url}/gi, displayMapsUrl)
    .replace(/{location_url}/gi, displayMapsUrl)
    // Contact Person & Phone
    .replace(/{contact_person}/gi, contactPerson)
    .replace(/{contactPerson}/gi, contactPerson)
    .replace(/{spoc}/gi, contactPerson)
    .replace(/{contact_phone}/gi, contactPhone)
    .replace(/{contactPhone}/gi, contactPhone)
    // Recruiter info
    .replace(/{recruiter_name}/gi, recruiterName)
    .replace(/{recruiterName}/gi, recruiterName)
    .replace(/{hr_name}/gi, recruiterName)
    .replace(/{hrName}/gi, recruiterName)
    .replace(/{recruiter_phone}/gi, recruiterPhone || "+91 93598 92819")
    .replace(/{recruiterPhone}/gi, recruiterPhone || "+91 93598 92819")
    .replace(/{hr_phone}/gi, recruiterPhone || "+91 93598 92819")
    // Referral Tag & Instructions
    .replace(/{referral_tag}/gi, candidate.referralTag)
    .replace(/{referralTag}/gi, candidate.referralTag)
    .replace(/{interview_instructions}/gi, instructions);

  // If a valid Google Map URL exists from the selected Job ID and it's not already embedded in the message, attach it with Interview Venue tag
  if (rawMapsUrl && !message.includes(rawMapsUrl)) {
    message += `\n\n📍 *Interview Venue:* ${venue}\n🗺️ *Google Maps GPS Location:*\n${rawMapsUrl}`;
  }

  return message;
}

function buildScreeningWhatsAppMessage({
  candidate,
  targetVacancy,
  recruiterName,
  recruiterPhone,
}: {
  candidate: CandidateItem;
  targetVacancy?: ActiveVacancyOption | null;
  recruiterName: string;
  recruiterPhone?: string | null;
}): string {
  const company = targetVacancy?.clientCompanyName || candidate.clientCompanyName || "Company Office";
  const title = targetVacancy?.title || candidate.vacancyTitle;
  const jobId = targetVacancy?.jobId || candidate.vacancyJobId;
  const venue = targetVacancy?.interviewVenue || candidate.vacancyInterviewVenue || "Company Office (Reach SPOC on arrival)";
  const mapsUrl = targetVacancy?.interviewLocationUrl || candidate.vacancyInterviewLocationUrl || "";

  let msg = `Hello ${candidate.fullName}, this is ${recruiterName} from RiseUp Consultancy regarding your application for *${title}* (Job ID: *${jobId}*) at ${company}.

We have reviewed your profile and would like to connect for a quick screening round before scheduling your client interview.

📍 *Interview Venue:*
${venue}`;

  if (mapsUrl) {
    msg += `\n\n🗺️ *Google Maps GPS Location:*\n${mapsUrl}`;
  }

  msg += `\n\n*Mandatory Referral Code at Interview:*\n${candidate.referralTag}\n\nPlease reply to confirm your availability.\n— ${recruiterName} | RiseUp Consultancy (${recruiterPhone || "Pune HQ"})`;

  return msg;
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
  const [modalWhatsAppSent, setModalWhatsAppSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk Dispatch Modal
  const [showBulkDispatchModal, setShowBulkDispatchModal] = useState(false);
  const [bulkInterviewDate, setBulkInterviewDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [bulkInterviewNote, setBulkInterviewNote] = useState("");

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
    setModalWhatsAppSent(false);
  };

  // Quick Outreach via WhatsApp to connect and convince candidate before scheduling interview
  const handleQuickWhatsAppConnect = async (candidate: CandidateItem) => {
    const rawDigits = candidate.phone ? candidate.phone.replace(/\D/g, "") : "";
    const clean10 = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
    const outreachMessage = `Hello ${candidate.fullName}, we received your job application for post of ${candidate.vacancyTitle}. You are shortlisted for interview, are you available for interview today? Reply fast.`;
    const waUrl = `https://wa.me/91${clean10}?text=${encodeURIComponent(outreachMessage)}`;
    window.open(waUrl, "_blank");

    // If candidate status is currently APPLIED (New Lead), automatically progress to CONNECTED
    if (candidate.status === "APPLIED") {
      try {
        const res = await updateCandidateStatusByHrAction(
          candidate.id,
          "CONNECTED",
          null,
          `Recruiter sent initial WhatsApp screening message for ${candidate.vacancyTitle}. Awaiting availability response.`
        );
        if (res.success) {
          setCandidates((prev) =>
            prev.map((c) =>
              c.id === candidate.id ? { ...c, status: "CONNECTED" } : c
            )
          );
          setActionMessage(`Connected with ${candidate.fullName}. Interview can be scheduled once candidate confirms.`);
          setTimeout(() => setActionMessage(null), 4000);
        }
      } catch {
        // non-blocking
      }
    }
  };

  // Launch WhatsApp Message from Interview Modal without confirming interview schedule
  const handleSendModalWhatsAppOnly = async () => {
    if (!dispatchModalCandidate || !modalTargetVacancyId) {
      setErrorMessage("Please select an active target opening.");
      return;
    }

    const targetVac = activeVacancies.find((v) => v.id === modalTargetVacancyId);
    const combinedDateStr = `${interviewDate} ${interviewTime}`.trim();

    const callLetter = buildInterviewWhatsAppMessage({
      template: whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
      candidate: dispatchModalCandidate,
      targetVacancy: targetVac,
      interviewDateStr: combinedDateStr,
      recruiterName,
      recruiterPhone,
    });

    const cleanPhone = formatWhatsAppPhone(dispatchModalCandidate.phone, dispatchModalCandidate.country);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(callLetter)}`;
    window.open(waUrl, "_blank");

    setModalWhatsAppSent(true);

    // Update status to CONNECTED if currently APPLIED, indicating outreach initiated without dispatching
    if (dispatchModalCandidate.status === "APPLIED") {
      try {
        const res = await updateCandidateStatusByHrAction(
          dispatchModalCandidate.id,
          "CONNECTED",
          null,
          `Recruiter sent WhatsApp interview invite for ${targetVac?.title || "role"}. Awaiting candidate confirmation.`
        );
        if (res.success) {
          setCandidates((prev) =>
            prev.map((c) =>
              c.id === dispatchModalCandidate.id ? { ...c, status: "CONNECTED" } : c
            )
          );
        }
      } catch {
        // non-blocking
      }
    }
  };

  // Confirm Single Dispatch (Triggered ONLY when candidate confirms they will attend)
  const handleConfirmSingleDispatch = async () => {
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

    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await dispatchCandidateToInterviewAction({
        candidateId: dispatchModalCandidate.id,
        targetVacancyId: modalTargetVacancyId,
        interviewDate: dateToStore,
        note: interviewNote || `Dispatched for interview on ${combinedDateStr} (Candidate confirmed attendance)`,
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
        setActionMessage(res.message || "Candidate successfully confirmed & dispatched for interview.");
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
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Recruiter ATS Pipeline &bull; {employeeCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Candidate Screening & Interview Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Filter candidate talent pool, schedule client interviews, and dispatch verified referrals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/hr/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-200 shadow-2xs min-h-[40px]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>WhatsApp Template</span>
          </Link>
          <Link
            href="/hr/vacancies"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 min-h-[40px]"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Mandates</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 text-xs font-medium flex items-center justify-between rounded-2xl shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{actionMessage}</span>
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
        <div className="p-4 bg-rose-50/90 border border-rose-200/80 text-rose-900 text-xs font-medium flex items-center justify-between rounded-2xl shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
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
      <div className="relative bg-white border border-slate-200/80 rounded-3xl shadow-sm p-4 sm:p-5 space-y-4 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Query */}
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by candidate name, ID, phone, city, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/60 border border-slate-200/80 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none min-h-[44px] transition-all"
            />
          </div>

          {/* Applied Opening Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedAppliedVacancyId}
              onChange={(e) => setSelectedAppliedVacancyId(e.target.value)}
              className="w-full bg-slate-50/60 border border-slate-200/80 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none cursor-pointer min-h-[44px] transition-all"
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
              className="w-full bg-slate-50/60 border border-slate-200/80 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none cursor-pointer min-h-[44px] transition-all"
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
              className="w-full bg-slate-50/60 border border-slate-200/80 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none cursor-pointer min-h-[44px] transition-all"
            >
              <option value="ALL">All Availability</option>
              <option value="Immediate Joiner">Immediate Joiner</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
            </select>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
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
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Multi-Selection Counter & Select All */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-2xs"
            >
              {selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>
            <span className="text-[11px] text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              {filteredCandidates.length} candidate(s)
            </span>
          </div>
        </div>
      </div>

      {/* STICKY BULK DISPATCH ACTION BAR */}
      {selectedCandidateIds.length > 0 && (
        <div className="sticky top-14 z-30 bg-slate-900/95 backdrop-blur-md text-white p-3.5 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-blue-600 font-bold flex items-center justify-center text-xs shadow-2xs">
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
              className="bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer min-h-[38px]"
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
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer min-h-[38px] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Bulk Send for Interview</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCandidateIds([])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer min-h-[38px] transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* CANDIDATE PIPELINE CARDS: STREAMLINED & ULTRA-PREMIUM */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            No candidates found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, applied vacancy, or stage filter tabs.
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
            const rawPhoneDigits = candidate.phone ? candidate.phone.replace(/\D/g, "") : "";
            const clean10Phone = rawPhoneDigits.length >= 10 ? rawPhoneDigits.slice(-10) : rawPhoneDigits;

            return (
              <div
                key={candidate.id}
                className={`relative bg-white border rounded-3xl p-5 sm:p-6 transition-all duration-200 overflow-hidden ${
                  isSelectedCard
                    ? "border-blue-500/80 bg-blue-50/20 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20"
                    : "border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md"
                }`}
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />
                {/* Header Row: Checkbox, Name, ID, Badges, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <input
                      type="checkbox"
                      checked={isSelectedCard}
                      onChange={() => toggleSelectCandidate(candidate.id)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 cursor-pointer"
                    />

                    <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                      {candidate.fullName}
                    </h2>

                    <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/80">
                      {candidate.candidateId}
                    </span>

                    {/* Status Badges */}
                    {isApplied && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                        New Lead
                      </span>
                    )}
                    {isConnected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                        Connected
                      </span>
                    )}
                    {isInterview && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <Clock className="w-3 h-3 text-purple-600" />
                        Interview Scheduled
                      </span>
                    )}
                    {isInterviewed && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <Eye className="w-3 h-3 text-sky-600" />
                        Interviewed
                      </span>
                    )}
                    {isSelected && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Selected
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Rejected
                      </span>
                    )}
                    {isAbsent && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Absent
                      </span>
                    )}
                    {isPlacedOutside && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <UserX className="w-3 h-3" />
                        Placed Outside
                      </span>
                    )}

                    {/* Vacancy Closed Warning */}
                    {isVacancyClosed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300/80 px-2.5 py-0.5 rounded-full">
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
                <div className="py-3 space-y-2 text-xs">
                  {/* Job and Client Info */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {candidate.vacancyJobId}: {candidate.vacancyTitle}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {candidate.clientCompanyName} ({candidate.vacancyCity})
                    </span>
                  </div>

                  {/* Candidate Attributes Inline Strip */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-600 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                    <span className="inline-flex items-center gap-1.5">
                      <strong className="text-slate-500 font-medium uppercase text-[10px]">Phone:</strong>{" "}
                      <span className="font-mono text-slate-900 font-semibold">{candidate.phone}</span>
                      <a
                        href={`tel:+91${clean10Phone}`}
                        title={`Call +91 ${clean10Phone}`}
                        className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleQuickWhatsAppConnect(candidate)}
                        title="Send WhatsApp screening message"
                        className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3 h-3 fill-emerald-600" />
                      </button>
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
                    <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-[11px] text-slate-800">
                      <strong className="font-bold text-blue-900 uppercase text-[10px] block">
                        Employer Feedback ({candidate.clientCompanyName}):
                      </strong>
                      <p className="mt-0.5">{candidate.clientFeedback}</p>
                    </div>
                  )}

                  {/* Scheduled Interview Details & Venue Strip */}
                  {isInterview && candidate.interviewDate && (
                    <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-2xl text-xs text-slate-800 space-y-1.5 shadow-2xs">
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

                {/* Bottom Action Buttons Bar: Neat, Minimalist, Rounded-xl */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Call Candidate Button */}
                    <a
                      href={`tel:+91${clean10Phone}`}
                      title={`Call ${candidate.fullName} (+91 ${clean10Phone})`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all shadow-2xs min-h-[36px] cursor-pointer group"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span>Call</span>
                    </a>

                    {/* WhatsApp Quick Connect Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickWhatsAppConnect(candidate)}
                      title="Send WhatsApp shortlist message to connect & check availability"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-md shadow-emerald-500/20 transition-all min-h-[36px] cursor-pointer active:scale-95"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </button>

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
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-2xs min-h-[36px] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Resume PDF</span>
                    </button>

                    {/* Send for Interview */}
                    {!isSelected && !isPlacedOutside && (
                      <button
                        type="button"
                        onClick={() => openDispatchModal(candidate)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer min-h-[36px]"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isInterview ? "Reschedule" : "Send for Interview"}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Placed Outside / Reactivate */}
                    {isPlacedOutside ? (
                      <button
                        type="button"
                        onClick={() => handleReactivateCandidate(candidate.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer min-h-[36px]"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                        <span>Reactivate Lead</span>
                      </button>
                    ) : (
                      !isSelected && (
                        <button
                          type="button"
                          onClick={() => handleMarkPlacedOutside(candidate.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer min-h-[36px]"
                        >
                          <UserX className="w-3.5 h-3.5 text-slate-500" />
                          <span>Placed Outside</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: RESUME VIEWER */}
      {resumeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
          <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                  {resumeModalData.candidateName} &bull; Resume Preview
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={resumeModalData.resumeUrl}
                  download={resumeModalData.resumeFileName}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 transition-all min-h-[38px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setResumeModalData(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden">
              <iframe
                src={`${resumeModalData.resumeUrl}#toolbar=0`}
                className="w-full h-full border border-slate-200 rounded-2xl bg-white shadow-inner"
                title="Resume Document Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SEND FOR INTERVIEW (CHOOSE TARGET OPENING & WHATSAPP DISPATCH) */}
      {dispatchModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 animate-fadeIn overflow-y-auto">
          <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl p-5 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Schedule Interview & WhatsApp Dispatch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Send WhatsApp call letter &bull; Confirm attendance only after candidate agrees
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchModalCandidate(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate & Origin Lead Summary */}
            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p>
                  Candidate: <strong className="text-slate-900 font-bold">{dispatchModalCandidate.fullName}</strong> ({dispatchModalCandidate.candidateId})
                </p>
                <span className="font-mono font-semibold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">{dispatchModalCandidate.phone}</span>
              </div>
              <p>
                Original Applied Role: <span className="font-semibold text-slate-800">{dispatchModalCandidate.vacancyJobId}: {dispatchModalCandidate.vacancyTitle}</span> ({dispatchModalCandidate.clientCompanyName})
              </p>
              {dispatchModalCandidate.vacancyStatus !== "ACTIVE" && (
                <div className="mt-2 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-[11px]">
                  ⚠️ Original opening is closed or filled. Choose any active vacancy below to dispatch this candidate.
                </div>
              )}
            </div>

            {/* Choose Target Vacancy Dropdown */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Select Interview Opening (Target Vacancy)
              </label>
              <select
                value={modalTargetVacancyId}
                onChange={(e) => setModalTargetVacancyId(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 p-2.5 text-xs font-semibold text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none cursor-pointer min-h-[44px] transition-all"
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
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1.5 shadow-2xs">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Scheduled Interview Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200/80 p-2.5 text-xs font-semibold text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none min-h-[44px] transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Scheduled Interview Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:30 AM"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200/80 p-2.5 text-xs font-semibold text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none min-h-[44px] transition-all"
                />
              </div>
            </div>

            {/* Screening Remarks */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Recruiter Screening Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={interviewNote}
                onChange={(e) => setInterviewNote(e.target.value)}
                placeholder="e.g. Screened profile, cleared basic English communication..."
                className="w-full bg-slate-50/60 border border-slate-200/80 p-2.5 text-xs text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
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
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 cursor-pointer"
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
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-[11px] text-slate-800 leading-relaxed font-sans max-h-36 overflow-y-auto whitespace-pre-wrap">
                {currentCallLetter}
              </div>
            </div>

            {/* Notification when WhatsApp launched */}
            {modalWhatsAppSent && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 animate-fadeIn shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-900">WhatsApp Invitation Launched!</p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Message opened in WhatsApp. Candidate is marked as <strong className="font-bold text-emerald-950">CONNECTED</strong>. Please wait for candidate response. Only after they confirm they will attend the interview, click <strong className="font-bold text-emerald-950">&ldquo;Confirm Dispatch Only&rdquo;</strong> below.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDispatchModalCandidate(null)}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer min-h-[44px] transition-all"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendModalWhatsAppOnly}
                  disabled={isSubmitting || !modalTargetVacancyId}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 min-h-[44px] transition-all"
                  title="Send formatted interview letter via WhatsApp (does NOT confirm schedule)"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Message</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSingleDispatch}
                  disabled={isSubmitting || !modalTargetVacancyId}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5 min-h-[44px] transition-all"
                  title="Confirm candidate attendance and officially schedule in ATS pipeline"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isSubmitting ? "Dispatching..." : "Confirm Dispatch Only"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BULK INTERVIEW DISPATCH */}
      {showBulkDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
          <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-5 sm:p-7 space-y-4 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Bulk Dispatch ({selectedCandidateIds.length} Candidates)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Batch assign multiple candidates to a client interview drive
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkDispatchModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Destination Opening (Active Mandate)
              </label>
              <select
                value={bulkTargetVacancyId}
                onChange={(e) => setBulkTargetVacancyId(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 p-2.5 text-xs font-semibold text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none cursor-pointer min-h-[44px] transition-all"
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
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 uppercase text-[10.5px]">
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Interview / Drive Date
              </label>
              <input
                type="date"
                value={bulkInterviewDate}
                onChange={(e) => setBulkInterviewDate(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 p-2.5 text-xs font-semibold text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none min-h-[44px] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Batch Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={bulkInterviewNote}
                onChange={(e) => setBulkInterviewNote(e.target.value)}
                placeholder="e.g. Batch screened for bulk drive..."
                className="w-full bg-slate-50/60 border border-slate-200/80 p-2.5 text-xs text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBulkDispatchModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer min-h-[44px] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDispatch}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer min-h-[44px] transition-all"
              >
                {isSubmitting ? "Dispatching..." : `Dispatch ${selectedCandidateIds.length} Candidates`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

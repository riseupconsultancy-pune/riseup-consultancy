"use client";

import React, { useState } from "react";
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
  MessageSquare, 
  Calendar,
  Briefcase,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  Filter,
  ExternalLink
} from "lucide-react";
import { updateCandidateStatusByClientAction } from "@/app/actions/client-actions";

interface CandidateRecord {
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
  resumeUrl: string;
  resumeFileName: string;
  referralTag: string;
  hrName: string;
  hrPhone: string | null;
  status: string;
  clientFeedback: string | null;
  interviewDate: string | null;
  updatedAt: string;
  vacancyId: string;
  vacancyJobId: string;
  vacancyTitle: string;
  vacancyCity: string;
  vacancyInterviewVenue?: string | null;
  vacancyInterviewLocationUrl?: string | null;
  vacancyInterviewContactPerson?: string | null;
  vacancyInterviewContactPhone?: string | null;
  recentHistory: {
    id: string;
    newStatus: string;
    changedByRole: string;
    note: string | null;
    createdAt: string;
  }[];
}

interface VacancyOption {
  id: string;
  jobId: string;
  title: string;
}

interface ClientCandidateReviewProps {
  initialCandidates: CandidateRecord[];
  vacancies: VacancyOption[];
}

export default function ClientCandidateReview({ initialCandidates, vacancies }: ClientCandidateReviewProps) {
  const [candidates, setCandidates] = useState<CandidateRecord[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Resume Modal State (Strict on-demand streaming to protect Hostinger bandwidth)
  const [resumeModalData, setResumeModalData] = useState<{
    candidateName: string;
    resumeUrl: string;
    resumeFileName: string;
  } | null>(null);

  // Status Update Modals
  const [evaluatingCandidate, setEvaluatingCandidate] = useState<CandidateRecord | null>(null);
  const [targetStatus, setTargetStatus] = useState<"INTERVIEWED" | "SELECTED" | "REJECTED" | "ABSENT">("SELECTED");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.vacancyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.referralTag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVacancy =
      selectedVacancyId === "ALL" || c.vacancyId === selectedVacancyId;

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "GOING_FOR_INTERVIEW"
        ? c.status === "GOING_FOR_INTERVIEW"
        : statusFilter === "INTERVIEWED"
        ? c.status === "INTERVIEWED"
        : statusFilter === "SELECTED"
        ? c.status === "SELECTED"
        : statusFilter === "REJECTED"
        ? c.status === "REJECTED"
        : statusFilter === "ABSENT"
        ? c.status === "ABSENT"
        : true;

    return matchesSearch && matchesVacancy && matchesStatus;
  });

  const handleOpenEvaluation = (
    candidate: CandidateRecord,
    status: "INTERVIEWED" | "SELECTED" | "REJECTED" | "ABSENT"
  ) => {
    setEvaluatingCandidate(candidate);
    setTargetStatus(status);
    setFeedbackNote(
      status === "SELECTED"
        ? "Selected after final interview. Recommended for offer rollout."
        : status === "REJECTED"
        ? ""
        : status === "ABSENT"
        ? "Candidate did not attend scheduled interview drive."
        : "Interview completed. Awaiting internal scoring."
    );
  };

  const handleConfirmEvaluation = async () => {
    if (!evaluatingCandidate) return;
    setIsSubmitting(true);
    setActionMessage(null);

    try {
      const res = await updateCandidateStatusByClientAction(
        evaluatingCandidate.id,
        targetStatus,
        feedbackNote
      );

      if (res.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === evaluatingCandidate.id
              ? {
                  ...c,
                  status: targetStatus,
                  clientFeedback: feedbackNote,
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
        setActionMessage(res.message || `Status updated to ${targetStatus}`);
        setEvaluatingCandidate(null);
      } else {
        setActionMessage(res.error || "Failed to update candidate status");
      }
    } catch {
      setActionMessage("Network error updating candidate status");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic counts for status tabs
  const pool = selectedVacancyId === "ALL" ? candidates : candidates.filter((c) => c.vacancyId === selectedVacancyId);
  const counts = {
    all: pool.length,
    going: pool.filter((c) => c.status === "GOING_FOR_INTERVIEW").length,
    interviewed: pool.filter((c) => c.status === "INTERVIEWED").length,
    selected: pool.filter((c) => c.status === "SELECTED").length,
    rejected: pool.filter((c) => c.status === "REJECTED").length,
    absent: pool.filter((c) => c.status === "ABSENT").length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Corporate Candidate Evaluation Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Interview Review & Candidate Selection
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate candidate profiles forwarded by RiseUp recruiters with official referral tags. Review resumes and update selection decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700">
            Total in Drive: <span className="text-blue-600 font-extrabold">{candidates.length}</span>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold uppercase text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name, ID (e.g. RUP-CAN-1001), phone, or recruiter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Vacancy dropdown */}
          <div>
            <select
              value={selectedVacancyId}
              onChange={(e) => setSelectedVacancyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Vacancy Mandates</option>
              {vacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.jobId}: {v.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs with Counts */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 pb-0.5">
          {[
            { key: "ALL", label: "All Candidates", count: counts.all },
            { key: "GOING_FOR_INTERVIEW", label: "Scheduled for Interview", count: counts.going },
            { key: "INTERVIEWED", label: "Interview Completed", count: counts.interviewed },
            { key: "SELECTED", label: "Selected", count: counts.selected },
            { key: "REJECTED", label: "Rejected", count: counts.rejected },
            { key: "ABSENT", label: "Absent / No-Show", count: counts.absent },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 font-mono font-bold ${
                statusFilter === tab.key
                  ? "bg-slate-700 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Candidates List */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No candidates found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL" || selectedVacancyId !== "ALL"
              ? "No candidate records match your applied filters."
              : "As RiseUp recruiters pre-screen applicants and schedule them for your openings, they will automatically appear here with their official referral codes."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => {
            const isGoingForInterview = candidate.status === "GOING_FOR_INTERVIEW";
            const isInterviewed = candidate.status === "INTERVIEWED";
            const isSelected = candidate.status === "SELECTED";
            const isRejected = candidate.status === "REJECTED";
            const isAbsent = candidate.status === "ABSENT";

            return (
              <div
                key={candidate.id}
                className="bg-white border border-slate-200 rounded-none shadow-xs p-5 sm:p-6 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Candidate & Referral Details */}
                  <div className="space-y-3 flex-1">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 border border-slate-200">
                        {candidate.candidateId}
                      </span>

                      {/* Official Recruiter Referral Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        {candidate.referralTag}
                      </span>

                      {/* Status Badges */}
                      {isGoingForInterview && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5">
                          <Clock className="w-3 h-3" />
                          Scheduled for Interview
                        </span>
                      )}
                      {isInterviewed && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5">
                          <Clock className="w-3 h-3" />
                          Interview Completed
                        </span>
                      )}
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Selected / Offer Confirmed
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                      {isAbsent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5">
                          <AlertCircle className="w-3 h-3" />
                          Absent / No-Show
                        </span>
                      )}
                    </div>

                    {/* Candidate Name & Role */}
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                        {candidate.fullName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          {candidate.vacancyJobId}: {candidate.vacancyTitle}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {candidate.city}, {candidate.country}
                        </span>
                      </div>

                      {/* Candidate Phone & Email Contacts */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-600 pt-1.5">
                        <a 
                          href={`tel:${candidate.phone}`}
                          className="inline-flex items-center gap-1 hover:text-blue-600 font-mono font-semibold text-slate-800"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{candidate.phone}</span>
                        </a>
                        <span>&bull;</span>
                        <a 
                          href={`mailto:${candidate.email}`}
                          className="inline-flex items-center gap-1 hover:text-blue-600 text-slate-600"
                        >
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{candidate.email}</span>
                        </a>
                      </div>
                    </div>

                    {/* Interview Schedule & Venue Strip (for Scheduled or Interviewed Candidates) */}
                    {(isGoingForInterview || isInterviewed) && candidate.interviewDate && (
                      <div className="p-3 bg-blue-50/80 border-l-4 border-blue-600 text-xs text-slate-800 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-blue-900">
                            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>
                              Scheduled Interview:{" "}
                              {new Date(candidate.interviewDate).toLocaleString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                          {candidate.vacancyInterviewLocationUrl && (
                            <a
                              href={candidate.vacancyInterviewLocationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Google Maps GPS</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {candidate.vacancyInterviewVenue && (
                          <p className="text-[11px] text-slate-700">
                            <strong className="text-slate-900">Interview Venue:</strong> {candidate.vacancyInterviewVenue}
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

                    {/* Qualifications & Attributes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 border border-slate-200 text-xs">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Qualification
                        </div>
                        <div className="font-semibold text-slate-800">{candidate.qualification}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Experience
                        </div>
                        <div className="font-semibold text-slate-800">{candidate.totalExperience}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Availability
                        </div>
                        <div className="font-semibold text-slate-800">{candidate.availability}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Assigned Recruiter
                        </div>
                        <div className="font-semibold text-slate-800">
                          {candidate.hrName} {candidate.hrPhone ? `(${candidate.hrPhone})` : ""}
                        </div>
                      </div>
                    </div>

                    {/* Client Feedback Note if present */}
                    {candidate.clientFeedback && (
                      <div className="p-3 bg-slate-50 border-l-2 border-slate-400 text-xs text-slate-700 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 uppercase text-[10px] block">
                            Client Evaluation Feedback
                          </span>
                          <span>{candidate.clientFeedback}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions (Resume Modal + Evaluation Triggers) */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-48">
                    {/* On-Demand Resume Viewer Button */}
                    <button
                      onClick={() =>
                        setResumeModalData({
                          candidateName: candidate.fullName,
                          resumeUrl: candidate.resumeUrl,
                          resumeFileName: candidate.resumeFileName,
                        })
                      }
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs text-center cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Resume PDF</span>
                    </button>

                    {/* Selection Controls */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => handleOpenEvaluation(candidate, "SELECTED")}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs text-center cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Select</span>
                      </button>

                      <button
                        onClick={() => handleOpenEvaluation(candidate, "REJECTED")}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs text-center cursor-pointer"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleOpenEvaluation(candidate, "INTERVIEWED")}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-none border border-slate-300 text-center cursor-pointer"
                      >
                        <span>Interviewed</span>
                      </button>

                      <button
                        onClick={() => handleOpenEvaluation(candidate, "ABSENT")}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-none border border-slate-300 text-center cursor-pointer"
                      >
                        <span>No-Show</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ON-DEMAND RESUME VIEWER MODAL (Zero bandwidth waste until explicitly opened) */}
      {resumeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
            {/* Modal Header */}
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
                  onClick={() => setResumeModalData(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-none transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded Streamed PDF Iframe */}
            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={`${resumeModalData.resumeUrl}#toolbar=0`}
                className="w-full h-full border border-slate-300 bg-white"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* STATUS EVALUATION CONFIRMATION MODAL */}
      {evaluatingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                {targetStatus === "SELECTED" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {targetStatus === "REJECTED" && <XCircle className="w-4 h-4 text-rose-600" />}
                {targetStatus === "ABSENT" && <AlertCircle className="w-4 h-4 text-amber-600" />}
                {targetStatus === "INTERVIEWED" && <Clock className="w-4 h-4 text-blue-600" />}
                Update Status: {targetStatus}
              </h3>
              <button
                onClick={() => setEvaluatingCandidate(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                Candidate: <strong className="text-slate-900">{evaluatingCandidate.fullName}</strong> ({evaluatingCandidate.candidateId})
              </p>
              <p>
                Opening: <strong className="text-slate-900">{evaluatingCandidate.vacancyTitle}</strong>
              </p>
              <p>
                Referral: <strong className="text-indigo-700">{evaluatingCandidate.referralTag}</strong>
              </p>
            </div>

            {targetStatus === "SELECTED" && (
              <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 text-xs">
                Marking this candidate as <strong>Selected</strong> will notify RiseUp HR, record tenure tracking for the 30-day placement invoice, and celebrate this placement.
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Evaluation Feedback / Notes
              </label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Add interview score, feedback reason, or offer rollout remarks..."
                className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEvaluatingCandidate(null)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEvaluation}
                disabled={isSubmitting}
                className={`px-6 py-2 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs ${
                  targetStatus === "SELECTED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : targetStatus === "REJECTED"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Updating..." : `Confirm ${targetStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

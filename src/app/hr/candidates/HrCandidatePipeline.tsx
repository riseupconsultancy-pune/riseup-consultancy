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
  Check
} from "lucide-react";
import { updateCandidateStatusByHrAction } from "@/app/actions/hr-actions";

interface CandidateItem {
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
  clientCompanyName: string;
  recentHistory: {
    id: string;
    newStatus: string;
    changedByRole: string;
    note: string | null;
    createdAt: string;
  }[];
}

interface VacancyFilterOption {
  id: string;
  jobId: string;
  title: string;
}

interface HrCandidatePipelineProps {
  initialCandidates: CandidateItem[];
  vacancies: VacancyFilterOption[];
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
  vacancies,
  recruiterName,
  employeeCode,
  whatsappTemplate,
}: HrCandidatePipelineProps) {
  const [candidates, setCandidates] = useState<CandidateItem[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVacancyId, setSelectedVacancyId] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Resume Modal State (On-Demand Bandwidth Protection)
  const [resumeModalData, setResumeModalData] = useState<{
    candidateName: string;
    resumeUrl: string;
    resumeFileName: string;
  } | null>(null);

  // Schedule Interview Modal State
  const [interviewModalCandidate, setInterviewModalCandidate] = useState<CandidateItem | null>(null);
  const [interviewDate, setInterviewDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [interviewNote, setInterviewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vacancyTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVacancy =
      selectedVacancyId === "ALL" || c.vacancyId === selectedVacancyId;

    const matchesStatus =
      statusFilter === "ALL" ? true : c.status === statusFilter;

    return matchesSearch && matchesVacancy && matchesStatus;
  });

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

    // Automatically advance to CONNECTED if currently APPLIED
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

  // Confirm "Going for Interview"
  const handleConfirmInterview = async () => {
    if (!interviewModalCandidate) return;
    setIsSubmitting(true);
    setActionMessage(null);

    try {
      const res = await updateCandidateStatusByHrAction(
        interviewModalCandidate.id,
        "GOING_FOR_INTERVIEW",
        interviewDate,
        interviewNote || `Scheduled for interview on ${interviewDate}`
      );

      if (res.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === interviewModalCandidate.id
              ? {
                  ...c,
                  status: "GOING_FOR_INTERVIEW",
                  interviewDate: new Date(interviewDate).toISOString(),
                }
              : c
          )
        );
        setActionMessage(
          `Candidate ${interviewModalCandidate.fullName} marked as "Going for Interview". They now appear in the Employer's evaluation portal!`
        );
        setInterviewModalCandidate(null);
      } else {
        setActionMessage(res.error || "Failed to update status");
      }
    } catch {
      setActionMessage("Network error updating candidate status");
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
            Review candidate applications, screen resumes, initiate WhatsApp outreach, and dispatch approved talent to employers with official referral tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hr/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-none transition-colors border border-slate-300"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Customize WhatsApp Template</span>
          </Link>
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
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name, ID (e.g. RUP-CAN-1001), phone, city, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedVacancyId}
              onChange={(e) => setSelectedVacancyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="ALL">All Vacancies</option>
              {vacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.jobId}: {v.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          {[
            { key: "ALL", label: "All Leads" },
            { key: "APPLIED", label: "New Leads" },
            { key: "CONNECTED", label: "Connected" },
            { key: "GOING_FOR_INTERVIEW", label: "Going for Interview" },
            { key: "INTERVIEWED", label: "Interviewed" },
            { key: "SELECTED", label: "Selected" },
            { key: "REJECTED", label: "Rejected" },
            { key: "ABSENT", label: "Absent" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-colors ${
                statusFilter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline Cards */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No candidates in this stage
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL" || selectedVacancyId !== "ALL"
              ? "No candidate leads match your applied search filters."
              : "When candidates apply through your tracked links, their applications will land here."}
          </p>
          <Link
            href="/hr/vacancies"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs"
          >
            <span>Share Openings & Links</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => {
            const isApplied = candidate.status === "APPLIED";
            const isConnected = candidate.status === "CONNECTED";
            const isInterview = candidate.status === "GOING_FOR_INTERVIEW";
            const isSelected = candidate.status === "SELECTED";
            const isRejected = candidate.status === "REJECTED";
            const isAbsent = candidate.status === "ABSENT";

            return (
              <div
                key={candidate.id}
                className="bg-white border border-slate-200 rounded-none shadow-xs p-5 sm:p-6 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left: Details */}
                  <div className="space-y-3 flex-1">
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
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5">
                          <Clock className="w-3 h-3" />
                          Going for Interview
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
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5">
                          <AlertCircle className="w-3 h-3" />
                          Absent / No-Show
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        Applied on {new Date(candidate.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                        {candidate.fullName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                        <span className="font-semibold text-slate-800">
                          {candidate.vacancyJobId}: {candidate.vacancyTitle}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {candidate.clientCompanyName} ({candidate.vacancyCity})
                        </span>
                      </div>
                    </div>

                    {/* Candidate Attributes Grid */}
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

                    {/* Talent Banking Preferences */}
                    {candidate.interestedRoles.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                          Cross-Role Banking:
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

                    {/* Client Evaluation Notes */}
                    {candidate.clientFeedback && (
                      <div className="p-3 bg-slate-50 border-l-2 border-slate-400 text-xs text-slate-700">
                        <span className="font-bold text-slate-800 uppercase text-[10px] block">
                          Client Evaluation Feedback
                        </span>
                        <span>{candidate.clientFeedback}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-56">
                    {/* On-Demand Resume PDF Button */}
                    <button
                      onClick={() =>
                        setResumeModalData({
                          candidateName: candidate.fullName,
                          resumeUrl: candidate.resumeUrl,
                          resumeFileName: candidate.resumeFileName,
                        })
                      }
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Resume PDF</span>
                    </button>

                    {/* 1-Tap WhatsApp Connect */}
                    <button
                      onClick={() => handleWhatsAppConnect(candidate)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>1-Tap WhatsApp</span>
                    </button>

                    {/* Advance to "Going for Interview" */}
                    {!isInterview && !isSelected && (
                      <button
                        onClick={() => setInterviewModalCandidate(candidate)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Send for Interview</span>
                      </button>
                    )}

                    {isInterview && (
                      <div className="text-[11px] text-indigo-700 bg-indigo-50 p-2 text-center border border-indigo-200">
                        Pushed to Client Review Desk
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ON-DEMAND RESUME VIEWER MODAL */}
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
                  onClick={() => setResumeModalData(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-none transition-colors"
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

      {/* SEND FOR INTERVIEW CONFIRMATION MODAL */}
      {interviewModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Send Candidate for Interview
              </h3>
              <button
                onClick={() => setInterviewModalCandidate(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                Candidate: <strong className="text-slate-900">{interviewModalCandidate.fullName}</strong>
              </p>
              <p>
                Role: <strong className="text-slate-900">{interviewModalCandidate.vacancyTitle}</strong>
              </p>
              <p>
                Employer: <strong className="text-slate-900">{interviewModalCandidate.clientCompanyName}</strong>
              </p>
              <p>
                Referral Tag: <strong className="text-indigo-700">{interviewModalCandidate.referralTag}</strong>
              </p>
            </div>

            <div className="p-3 bg-blue-50 border-l-4 border-blue-600 text-blue-900 text-xs">
              When confirmed, this candidate will immediately appear on <strong>{interviewModalCandidate.clientCompanyName}&apos;s</strong> review desk. Ensure the candidate has been briefed to mention their official referral tag.
            </div>

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
                Recruiter Screening Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={interviewNote}
                onChange={(e) => setInterviewNote(e.target.value)}
                placeholder="e.g. Cleared English test, comfortable with rotational shift..."
                className="w-full bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInterviewModalCandidate(null)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmInterview}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Dispatching..." : "Confirm & Send to Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
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
  UserX
} from "lucide-react";
import { assignCandidateToHrAction } from "@/app/actions/public-actions";
import { deleteCandidateAction, setCandidatePlacedOutsideAction } from "@/app/actions/hr-actions";

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
  resumeFileSize: number;
  source: string;
  status: string;
  referralTag: string | null;
  hrId: string | null;
  hrName: string;
  vacancyId: string;
  vacancyJobId: string;
  vacancyTitle: string;
  clientCompanyName: string;
  createdAt: string;
}

interface RecruiterOption {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
}

interface AdminCandidatePoolProps {
  initialCandidates: CandidateRecord[];
  recruiters: RecruiterOption[];
}

export default function AdminCandidatePool({
  initialCandidates,
  recruiters,
}: AdminCandidatePoolProps) {
  const [candidates, setCandidates] = useState<CandidateRecord[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Resume Modal State
  const [resumeModalData, setResumeModalData] = useState<{
    candidateName: string;
    resumeUrl: string;
    resumeFileName: string;
  } | null>(null);

  // Assignment State
  const [assignCandidate, setAssignCandidate] = useState<CandidateRecord | null>(null);
  const [selectedHrId, setSelectedHrId] = useState<string>(recruiters[0]?.id || "");
  const [isAssigning, setIsAssigning] = useState(false);

  // Deletion State
  const [deletingCandidate, setDeletingCandidate] = useState<CandidateRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkPlacedOutside = async (candidateId: string) => {
    setActionMessage(null);
    try {
      const res = await setCandidatePlacedOutsideAction(candidateId);
      if (res.success) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? { ...c, status: "PLACED_OUTSIDE" } : c))
        );
        setActionMessage(res.message || "Candidate marked as placed outside.");
      } else {
        setActionMessage(res.error || "Failed to update candidate status.");
      }
    } catch {
      setActionMessage("Network error updating status.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCandidate) return;
    setIsDeleting(true);
    setActionMessage(null);
    try {
      const res = await deleteCandidateAction(deletingCandidate.id);
      if (res.success) {
        setCandidates((prev) => prev.filter((c) => c.id !== deletingCandidate.id));
        setActionMessage(res.message || "Candidate record permanently deleted.");
        setDeletingCandidate(null);
      } else {
        setActionMessage(res.error || "Failed to delete candidate.");
      }
    } catch {
      setActionMessage("Network error during candidate deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.candidateId.toLowerCase().includes(q) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.vacancyTitle.toLowerCase().includes(q)
    );
  });

  const handleOpenAssign = (candidate: CandidateRecord) => {
    setAssignCandidate(candidate);
    setSelectedHrId(candidate.hrId || recruiters[0]?.id || "");
  };

  const handleConfirmAssignment = async () => {
    if (!assignCandidate || !selectedHrId) return;
    setIsAssigning(true);
    setActionMessage(null);

    try {
      const res = await assignCandidateToHrAction(assignCandidate.id, selectedHrId);
      if (res.success) {
        const assignedRecruiter = recruiters.find((r) => r.id === selectedHrId);
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === assignCandidate.id
              ? {
                  ...c,
                  hrId: selectedHrId,
                  hrName: assignedRecruiter ? assignedRecruiter.fullName : "Assigned Recruiter",
                  referralTag: assignedRecruiter
                    ? `Referral: ${assignedRecruiter.fullName} | RiseUp Consultancy`
                    : c.referralTag,
                }
              : c
          )
        );
        setActionMessage(res.message || "Candidate successfully assigned to recruiter.");
        setAssignCandidate(null);
      } else {
        setActionMessage(res.error || "Failed to assign candidate.");
      }
    } catch {
      setActionMessage("Network error during candidate assignment.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleWhatsAppDirect = (candidate: CandidateRecord) => {
    const cleanPhone = candidate.phone.replace(/[^0-9]/g, "");
    const message = `Hello ${candidate.fullName}, this is RiseUp Consultancy regarding your direct application for ${candidate.vacancyTitle} in ${candidate.city}. We are reviewing your profile for interview shortlisting.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Super Admin Control Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Website Direct Candidate Pool
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and process candidates who applied directly from the public website job cards. Screen resumes, initiate WhatsApp conversations, or assign leads to internal recruiters.
          </p>
        </div>

        <div className="bg-slate-100 border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700">
          Direct Leads: <span className="text-blue-600 font-extrabold">{candidates.length}</span>
        </div>
      </div>

      {/* Global Notification */}
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

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search direct candidates by name, Candidate ID (e.g. RUP-CAN-1001), phone, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Candidate List */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No direct website applicants found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When candidates apply through verified website cards on /jobs, their profiles will automatically flow into this pool.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white border border-slate-200 rounded-none shadow-xs p-5 sm:p-6 transition-all hover:border-slate-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 border border-slate-200">
                      {candidate.candidateId}
                    </span>
                    
                    {/* Status Badges */}
                    {candidate.status === "APPLIED" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5">
                        New Intake
                      </span>
                    )}
                    {candidate.status === "CONNECTED" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5">
                        Connected
                      </span>
                    )}
                    {candidate.status === "GOING_FOR_INTERVIEW" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5">
                        Interview Scheduled
                      </span>
                    )}
                    {candidate.status === "INTERVIEWED" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5">
                        Interview Completed
                      </span>
                    )}
                    {candidate.status === "SELECTED" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
                        Selected by Client
                      </span>
                    )}
                    {candidate.status === "REJECTED" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5">
                        Rejected
                      </span>
                    )}
                    {candidate.status === "ABSENT" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5">
                        Absent
                      </span>
                    )}
                    {candidate.status === "PLACED_OUTSIDE" && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5">
                        Placed Outside
                      </span>
                    )}

                    {/* Assigned Recruiter Tag */}
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5">
                      {candidate.hrName}
                    </span>

                    <span className="text-xs text-slate-400">
                      Applied on {new Date(candidate.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                      {candidate.fullName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        {candidate.vacancyJobId}: {candidate.vacancyTitle}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Target Client: {candidate.clientCompanyName}
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
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Email</span>
                      <span className="font-semibold text-slate-900 truncate block">{candidate.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Location</span>
                      <span className="font-semibold text-slate-900">{candidate.city}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Experience</span>
                      <span className="font-semibold text-slate-900">{candidate.totalExperience}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-52">
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

                  <button
                    type="button"
                    onClick={() => handleOpenAssign(candidate)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign to Recruiter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppDirect(candidate)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs text-center cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>1-Tap WhatsApp</span>
                  </button>

                  {candidate.status !== "PLACED_OUTSIDE" && candidate.status !== "SELECTED" && (
                    <button
                      type="button"
                      onClick={() => handleMarkPlacedOutside(candidate.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold uppercase tracking-wider rounded-none text-center cursor-pointer"
                    >
                      <UserX className="w-3 h-3" />
                      <span>Mark Placed Outside</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeletingCandidate(candidate)}
                    className="inline-flex items-center justify-center gap-1 px-4 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-[10.5px] font-bold uppercase tracking-wider rounded-none text-center cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Candidate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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

      {/* ASSIGN TO RECRUITER MODAL */}
      {assignCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Assign Candidate to Recruiter
              </h3>
              <button
                onClick={() => setAssignCandidate(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>Candidate: <strong className="text-slate-900">{assignCandidate.fullName}</strong> ({assignCandidate.candidateId})</p>
              <p>Applied For: <strong className="text-slate-900">{assignCandidate.vacancyTitle}</strong></p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Select Active HR Recruiter
              </label>
              <select
                value={selectedHrId}
                onChange={(e) => setSelectedHrId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 font-semibold rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                {recruiters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fullName} ({r.employeeCode})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Assigning this candidate will transfer them into the recruiter&apos;s ATS pipeline with an official referral tag.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignCandidate(null)}
                disabled={isAssigning}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                disabled={isAssigning}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50"
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
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
              Are you sure you want to permanently delete <strong className="text-slate-900">{deletingCandidate.fullName}</strong> ({deletingCandidate.candidateId})? This will delete their database profile and remove their resume document from storage.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingCandidate(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50 cursor-pointer"
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

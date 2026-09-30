"use client";

import React from "react";
import Link from "next/link";
import { 
  X, 
  ShieldAlert, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  UserCheck, 
  ExternalLink,
  ArrowRight
} from "lucide-react";

export interface ExistingApplicationDetails {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  appliedDate?: string;
  currentStatus?: string;
  recruiter: {
    name: string;
    phone: string;
    email: string;
    code?: string;
  };
  message?: string;
}

interface AlreadyAppliedModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExistingApplicationDetails | null;
}

export default function AlreadyAppliedModal({
  isOpen,
  onClose,
  data,
}: AlreadyAppliedModalProps) {
  if (!isOpen || !data) return null;

  const {
    candidateId,
    candidateName,
    jobId,
    jobTitle,
    appliedDate,
    currentStatus,
    recruiter,
  } = data;

  // Format date nicely
  const formattedDate = appliedDate
    ? new Date(appliedDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently Submitted";

  // Clean phone number for WhatsApp link
  const rawPhone = recruiter.phone || "+919359892819";
  const digitsOnly = rawPhone.replace(/\D/g, "");
  const whatsappNumber =
    digitsOnly.length === 10
      ? `91${digitsOnly}`
      : digitsOnly.startsWith("0") && digitsOnly.length === 11
      ? `91${digitsOnly.slice(1)}`
      : digitsOnly;

  // Pre-filled WhatsApp greeting message
  const prefilledWhatsappMsg = `Hello ${recruiter.name}, I have already applied for ${jobTitle} (Job ID: ${jobId}, Candidate ID: ${candidateId}). I am contacting you to follow up on my application status.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledWhatsappMsg)}`;

  // Direct Call URL
  const telUrl = `tel:${rawPhone.replace(/\s+/g, "")}`;

  // Direct Email URL
  const emailSubject = `Application Status Follow-up: ${jobTitle} (${jobId}) - Candidate ${candidateId}`;
  const emailBody = `Hello ${recruiter.name},\n\nI have already submitted my application for ${jobTitle} (Job ID: ${jobId}, Candidate ID: ${candidateId}).\n\nCould you please provide an update regarding my shortlisting and interview status?\n\nThank you,\n${candidateName}\nPhone: ${rawPhone}`;
  const mailtoUrl = `mailto:${recruiter.email || "info@riseupconsultancyy.com"}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Alert Badge & Title */}
        <div className="flex items-start gap-3.5 mb-4 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
              Application Already Exists
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
              You Have Already Applied
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Our records show an active application submitted under your contact details for this exact opening.
            </p>
          </div>
        </div>

        {/* Existing Application Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{jobTitle}</span>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold text-[10px] rounded-md border border-blue-200">
              {jobId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block font-medium">Candidate ID</span>
              <span className="font-mono font-bold text-slate-800">{candidateId}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Application Date</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formattedDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Current Status</span>
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                {currentStatus || "APPLIED / IN REVIEW"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Applicant Name</span>
              <span className="font-semibold text-slate-800 truncate block">{candidateName}</span>
            </div>
          </div>
        </div>

        {/* Assigned Recruiter Contact Card */}
        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                Your Assigned Recruiter SPOC
              </span>
            </div>
            {recruiter.code && (
              <span className="text-[10px] font-mono font-bold bg-white text-blue-800 px-2 py-0.5 border border-blue-200 rounded-md">
                Code: {recruiter.code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-3 bg-white p-3 rounded-xl border border-blue-100 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {recruiter.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "HR"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                {recruiter.name}
              </h4>
              <p className="text-[10px] text-slate-500 truncate">
                RiseUp Talent Acquisition Partner
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-snug mb-3">
            To prevent duplicates, each candidate is paired with a designated recruiter. Reach out directly to <strong>{recruiter.name}</strong> to check your interview schedule and progress.
          </p>

          {/* Action CTAs */}
          <div className="space-y-2">
            {/* Primary CTA: WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.01] cursor-pointer"
            >
              {/* WhatsApp Official SVG Icon */}
              <svg 
                className="w-4 h-4 fill-current shrink-0" 
                viewBox="0 0 24 24"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.66 1.438 5.169L2 22l4.987-1.396A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <span>Chat with Recruiter on WhatsApp</span>
            </a>

            {/* Secondary CTA Grid: Call & Email */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={telUrl}
                className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Call {rawPhone}</span>
              </a>

              <a
                href={mailtoUrl}
                className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Email Recruiter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Navigation: Browse Other Jobs */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 px-3 transition-colors cursor-pointer"
          >
            Close Window
          </button>

          <Link
            href="/jobs"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 py-2 px-3 transition-colors"
          >
            <span>Explore Other Positions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { submitCandidateApplicationAction } from "@/app/actions/candidate-actions";
import AlreadyAppliedModal, { ExistingApplicationDetails } from "@/components/AlreadyAppliedModal";

interface CandidateApplicationFormProps {
  slug: string;
  vacancyDetails: {
    id: string;
    jobId: string;
    title: string;
    category: string;
    city: string;
    country: string;
    availabilityRequired: string;
  };
  recruiterInfo: {
    hrName: string;
    referralTag: string;
  };
}

const CROSS_ROLES = [
  "Voice BPO / Inbound & Outbound Calling",
  "Non-Voice BPO / Email & Chat Support",
  "Back Office Operations / Data Entry",
  "Customer Support / Relationship Management",
  "IT Helpdesk / Technical Support",
  "Administrative / Front Desk Operations",
];

const QUALIFICATIONS = [
  "Any Graduate",
  "B.Com / BBA / BBM",
  "B.Sc / BCA / BCS",
  "B.E. / B.Tech / Engineering",
  "Postgraduate / MBA / MCA",
  "Undergraduate / Pursuing Graduation",
  "12th Pass / Higher Secondary",
  "Diploma Holder",
];

const EXPERIENCES = [
  "Fresher (0 Months)",
  "0 - 6 Months",
  "6 Months - 1 Year",
  "1 - 2 Years",
  "2 - 3 Years",
  "3 - 5 Years",
  "5+ Years",
];

export default function CandidateApplicationForm({ slug, vacancyDetails, recruiterInfo }: CandidateApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: (vacancyDetails.country === "Nigeria" ? "Nigeria" : "India") as "India" | "Nigeria",
    city: vacancyDetails.city || "",
    qualification: "Any Graduate",
    totalExperience: "Fresher (0 Months)",
    availability: "Immediate Joiner" as "Immediate Joiner" | "15 Days" | "30 Days",
  });

  const [interestedRoles, setInterestedRoles] = useState<string[]>([vacancyDetails.category]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alreadyAppliedData, setAlreadyAppliedData] = useState<ExistingApplicationDetails | null>(null);
  const [successData, setSuccessData] = useState<{
    candidateId: string;
    referralTag: string;
    hrName: string;
    message: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleRoleToggle = (role: string) => {
    setInterestedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (!e.target.files || e.target.files.length === 0) {
      setResumeFile(null);
      return;
    }

    const file = e.target.files[0];

    // Client-side quick checks
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Only PDF (.pdf) documents are accepted.");
      setResumeFile(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage(
        `File size exceeds the 2MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Please compress your PDF before uploading.`
      );
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage("Please provide your full name (at least 2 characters).");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMessage("Please enter a valid WhatsApp phone number (at least 7 digits).");
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage("Please enter your current residential city.");
      return;
    }

    if (!resumeFile) {
      setErrorMessage("Please attach your resume in PDF format (maximum 2MB).");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("slug", slug);
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("phone", formData.phone.trim());
      data.append("country", formData.country);
      data.append("city", formData.city.trim());
      data.append("qualification", formData.qualification);
      data.append("totalExperience", formData.totalExperience);
      data.append("availability", formData.availability);
      data.append("interestedRoles", JSON.stringify(interestedRoles));
      data.append("resume", resumeFile);

      const res = await submitCandidateApplicationAction(data);

      if (res.success && res.candidateId) {
        setSuccessData({
          candidateId: res.candidateId,
          referralTag: res.referralTag || recruiterInfo.referralTag,
          hrName: res.hrName || recruiterInfo.hrName,
          message: res.message || "Application submitted successfully!",
        });
      } else if (res.alreadyApplied && res.candidateId) {
        setAlreadyAppliedData({
          candidateId: res.candidateId,
          candidateName: res.candidateName || formData.fullName,
          jobId: res.jobId || vacancyDetails.jobId,
          jobTitle: res.jobTitle || vacancyDetails.title,
          appliedDate: res.appliedDate,
          currentStatus: res.currentStatus,
          recruiter: res.recruiter || {
            name: recruiterInfo.hrName,
            phone: "+91 93598 92819",
            email: "info@riseupconsultancyy.com",
            code: "HR-RECRUITER",
          },
          message: res.message,
        });
      } else {
        setErrorMessage(res.error || "Failed to submit application.");
      }
    } catch {
      setErrorMessage("Network error during submission. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-3 py-1 border border-slate-200">
            Candidate ID: {successData.candidateId}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 font-heading">
            Application Successfully Submitted!
          </h2>
          <p className="text-slate-600 max-w-md mx-auto text-xs mt-2 leading-relaxed">
            Your profile has been delivered directly into the review desk of your assigned RiseUp recruiter. You will receive an interview invitation via WhatsApp shortly.
          </p>
        </div>

        {/* Mandatory Referral Code Notice */}
        <div className="max-w-md mx-auto p-4 bg-blue-50 border-l-4 border-blue-600 text-left space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
            Crucial: Your Interview Referral Reference
          </div>
          <div className="text-xs font-mono font-bold text-blue-900 bg-white p-2 border border-blue-200">
            {successData.referralTag}
          </div>
          <p className="text-[11px] text-blue-800 leading-snug">
            When attending the interview at the company location or over phone, clearly state that you are referred by <strong>{successData.hrName}</strong> from <strong>RiseUp Consultancy</strong>.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-xs"
          >
            Explore More Job Openings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-none shadow-xs p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
          <User className="w-4 h-4 text-blue-600" />
          Candidate Application & Talent Registration
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Complete the form below. RiseUp Consultancy placement assistance is <strong>100% free</strong>.
        </p>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs font-medium flex items-center gap-2 rounded-none animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Personal Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="e.g. Ramesh Kulkarni"
            required
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="ramesh.k@gmail.com"
            required
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            WhatsApp Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="e.g. 9876543210"
            required
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Interview schedule & call letter sent via WhatsApp</span>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Current City Location <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="e.g. Pune / Mumbai / Lagos"
            required
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Highest Education Qualification <span className="text-rose-500">*</span>
          </label>
          <select
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          >
            {QUALIFICATIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Total Work Experience <span className="text-rose-500">*</span>
          </label>
          <select
            name="totalExperience"
            value={formData.totalExperience}
            onChange={handleInputChange}
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          >
            {EXPERIENCES.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Joining Availability <span className="text-rose-500">*</span>
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          >
            <option value="Immediate Joiner">Immediate Joiner (0 to 7 Days)</option>
            <option value="15 Days">Within 15 Days</option>
            <option value="30 Days">30 Days Notice Period</option>
          </select>
        </div>
      </div>

      {/* Talent Banking Cross-Role Checkboxes */}
      <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
            Consider Me for Additional Roles (Talent Banking)
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Select other departments you are qualified for to increase your placement opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {CROSS_ROLES.map((role) => {
            const isChecked = interestedRoles.includes(role);
            return (
              <label
                key={role}
                className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleRoleToggle(role)}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded-none focus:ring-0"
                />
                <span className="leading-snug">{role}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Resume File Upload (Hardened 2MB PDF Limit) */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
          Attach Resume / CV (PDF Only &bull; Strict 2MB Limit) <span className="text-rose-500">*</span>
        </label>

        {resumeFile ? (
          <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-900 block truncate">{resumeFile.name}</span>
                <span className="text-[10px] text-slate-500">
                  {(resumeFile.size / 1024).toFixed(1)} KB &bull; Verified PDF Document
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setResumeFile(null)}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-600 p-6 text-center space-y-2 transition-colors">
            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-600">
              <label className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                <span>Click to browse and upload resume</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Maximum allowed size: 2.0 Megabytes &bull; PDF Format
            </p>
          </div>
        )}
      </div>

      {/* Recruiter Guarantee Badge */}
      <div className="p-3.5 bg-slate-50 border-l-4 border-slate-700 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Application processed by <strong>{recruiterInfo.hrName}</strong> under RiseUp Free Placement Policy.</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying PDF & Submitting Application...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Free Job Application</span>
            </>
          )}
        </button>
      </div>
    </form>

    <AlreadyAppliedModal
      isOpen={!!alreadyAppliedData}
      onClose={() => setAlreadyAppliedData(null)}
      data={alreadyAppliedData}
    />
  </>
  );
}

"use client";

import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Check } from "lucide-react";
import { applyDirectJobAction } from "@/app/actions/public-actions";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  vacancyId?: string;
}

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

const CROSS_ROLES = [
  "Voice BPO / Inbound & Outbound Calling",
  "Non-Voice BPO / Email & Chat Support",
  "Back Office Operations / Data Entry",
  "Customer Support / Relationship Management",
  "IT Helpdesk / Technical Support",
  "Administrative / Front Desk Operations",
];

export default function ApplyModal({
  isOpen,
  onClose,
  jobTitle = "General Talent Pool",
  vacancyId,
}: ApplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [successCandidateId, setSuccessCandidateId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "India" as "India" | "Nigeria",
    city: "Pune",
    qualification: "Any Graduate",
    totalExperience: "Fresher (0 Months)",
    availability: "Immediate Joiner" as "Immediate Joiner" | "15 Days" | "30 Days",
  });

  const [interestedRoles, setInterestedRoles] = useState<string[]>([]);

  if (!isOpen) return null;

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
    setFileError("");
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Only PDF documents (.pdf) are accepted.");
      setResumeFile(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError(
        `File exceeds 2MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please upload a smaller PDF.`
      );
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage("Please enter your full legal name.");
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage("Please specify your current city.");
      return;
    }

    if (!resumeFile) {
      setFileError("Please attach your PDF resume to complete the application.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("phone", formData.phone.trim());
      data.append("country", formData.country);
      data.append("city", formData.city.trim());
      data.append("qualification", formData.qualification);
      data.append("totalExperience", formData.totalExperience);
      data.append("availability", formData.availability);
      data.append("interestedRoles", JSON.stringify(interestedRoles));
      data.append("jobTitle", jobTitle);
      if (vacancyId) {
        data.append("vacancyId", vacancyId);
      }
      data.append("resume", resumeFile);

      const res = await applyDirectJobAction(data);

      if (res.success && res.candidateId) {
        setSuccessCandidateId(res.candidateId);
      } else {
        setErrorMessage(res.error || "Failed to register application. Please try again.");
      }
    } catch {
      setErrorMessage("Network error during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessCandidateId(null);
    setErrorMessage(null);
    setFileError("");
    setResumeFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 shadow-2xl p-5 sm:p-7 rounded-3xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 text-slate-700 hover:text-white hover:bg-slate-900 flex items-center justify-center transition-colors rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {successCandidateId ? (
          <div className="py-8 text-center flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center rounded-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 border border-slate-200 rounded-full">
                Candidate ID: {successCandidateId}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-3 font-heading">
                Application Registered!
              </h3>
              <p className="mt-2 text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your unified profile and resume have been delivered directly to the RiseUp recruitment team for immediate screening. Our team will contact you via WhatsApp for interview scheduling.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 pr-8">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest mb-2 rounded-full">
                100% Free Candidate Placement
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
                Apply for Position
              </h2>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">{jobTitle}</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs flex items-center gap-2 rounded-xl">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Legal Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    WhatsApp Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="e.g. +91 98220 11223"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Email & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  >
                    <option value="India">India</option>
                    <option value="Nigeria">Nigeria</option>
                  </select>
                </div>
              </div>

              {/* Row 3: City & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Current City / Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="e.g. Pune, Mumbai, Lagos..."
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Highest Qualification <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  >
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Total Experience & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Total Experience <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="totalExperience"
                    value={formData.totalExperience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  >
                    {EXPERIENCES.map((exp) => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Joining Notice Period <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-xl font-medium"
                  >
                    <option value="Immediate Joiner">Immediate Joiner (0 to 7 Days)</option>
                    <option value="15 Days">Within 15 Days</option>
                    <option value="30 Days">30 Days Notice Period</option>
                  </select>
                </div>
              </div>

              {/* Cross Domain Interested Roles */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Cross-Domain Interested Roles (Optional)</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">select multiple to expand matching</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CROSS_ROLES.map((role) => {
                    const isSelected = interestedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={`text-left p-2.5 border text-[11px] font-medium transition-all rounded-xl flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 border-blue-600 text-blue-900 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate pr-1">{role}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resume Upload (Strict 2MB Limit) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Upload PDF Resume (Max 2MB) <span className="text-rose-500">*</span>
                </label>

                {resumeFile ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate">{resumeFile.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {(resumeFile.size / 1024).toFixed(1)} KB &bull; Verified PDF
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/20 cursor-pointer transition-colors rounded-xl">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700">Choose PDF Document</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Strictly up to 2.0 MB</span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                {fileError && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fileError}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-xl shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Unified Profile...</span>
                    </>
                  ) : (
                    <span>Submit Free Application</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
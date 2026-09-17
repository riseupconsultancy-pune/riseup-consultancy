"use client";

import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { applyDirectJobAction } from "@/app/actions/public-actions";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  vacancyId?: string;
}

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
    location: "Pune",
    experience: "1-3 years",
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Only PDF documents are accepted.");
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

    if (!resumeFile) {
      setFileError("Please attach your PDF resume to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("phone", formData.phone.trim());
      data.append("location", formData.location.trim());
      data.append("experience", formData.experience);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-300 shadow-2xl p-6 sm:p-8 rounded-none">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-8 h-8 bg-slate-100 text-slate-700 hover:text-white hover:bg-slate-900 flex items-center justify-center transition-colors rounded-none"
        >
          <X className="w-4 h-4" />
        </button>

        {successCandidateId ? (
          <div className="py-8 text-center flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 border border-slate-200">
                Candidate ID: {successCandidateId}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-3 font-heading">
                Application Registered!
              </h3>
              <p className="mt-2 text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your profile has been delivered to the RiseUp recruitment team for screening. You will be contacted via WhatsApp for interview scheduling.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="inline-block px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest mb-2 rounded-none">
                100% Free Placement Intake
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
                Apply for Position
              </h2>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">{jobTitle}</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs flex items-center gap-2 rounded-none">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    WhatsApp Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9822011223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Current Location / City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Pune / Mumbai / Lagos"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  >
                    <option value="Fresher (0-1 year)">Fresher (0-1 year)</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>

              {/* Resume Upload (Strict 2MB Limit) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Upload PDF Resume (Max 2MB) <span className="text-rose-500">*</span>
                </label>

                {resumeFile ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200">
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
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/20 cursor-pointer transition-colors rounded-none">
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
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying & Submitting...</span>
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
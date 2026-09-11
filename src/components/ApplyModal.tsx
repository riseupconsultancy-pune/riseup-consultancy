"use client";

import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Send } from "lucide-react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
}

export default function ApplyModal({ isOpen, onClose, jobTitle = "General Application" }: ApplyModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "Pune",
    experience: "Fresher / 0-1 yr",
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Only PDF documents are accepted.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError("File exceeds 2MB limit. Please upload a smaller PDF.");
      return;
    }

    setFileName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      setFileError("Please attach your PDF resume to continue.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              Our recruiters will review your resume and contact you for matched interview slots.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                Candidate Application
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Apply for Position</h2>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{jobTitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    <option value="Pune">Pune, India</option>
                    <option value="Dubai">Dubai, UAE</option>
                    <option value="Mumbai">Mumbai, India</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    <option value="Fresher / 0-1 yr">Fresher / 0-1 yr</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>

              {/* PDF Resume Upload (2MB strict) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Resume <span className="text-slate-400 font-normal">(PDF only, max 2MB)</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    {fileName ? (
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                        <FileText className="w-5 h-5" />
                        <span className="truncate max-w-[240px]">{fileName}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-700">Click to upload your PDF</span>
                        <span className="text-[10px] text-slate-400">PDF up to 2MB</span>
                      </>
                    )}
                  </div>
                </div>
                {fileError && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-rose-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fileError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Application
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
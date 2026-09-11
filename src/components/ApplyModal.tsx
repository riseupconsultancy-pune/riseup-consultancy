"use client";

import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
}

export default function ApplyModal({ isOpen, onClose, jobTitle = "General Talent Pool" }: ApplyModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 bg-slate-100 text-slate-700 hover:text-white hover:bg-slate-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Application Registered</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              Your profile has been forwarded to our recruitment specialists for shortlisting.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                Direct Candidate Intake
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Submit Your Profile</h2>
              <p className="text-xs font-semibold text-blue-600 mt-1">{jobTitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Legal Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Current City</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  >
                    <option value="Pune">Pune, India</option>
                    <option value="Mumbai">Mumbai, India</option>
                    <option value="Bengaluru">Bengaluru, India</option>
                    <option value="Lagos">Lagos, Nigeria</option>
                    <option value="Abuja">Abuja, Nigeria</option>
                    <option value="Other">Other Region</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  >
                    <option value="Fresher / 0-1 yr">Fresher / 0-1 yr</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                    <option value="10+ years (Leadership)">10+ years (Leadership)</option>
                  </select>
                </div>
              </div>

              {/* PDF Resume Upload (2MB strict) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Upload Resume <span className="text-slate-400 font-normal">(PDF only, max 2MB)</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-slate-900 p-4 text-center cursor-pointer transition-colors bg-slate-50">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    {fileName ? (
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                        <FileText className="w-5 h-5" />
                        <span className="truncate max-w-[240px]">{fileName}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-800">Select PDF Resume File</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Strictly up to 2MB</span>
                      </>
                    )}
                  </div>
                </div>
                {fileError && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-rose-600 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fileError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest transition-colors"
              >
                Submit Candidate Profile
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
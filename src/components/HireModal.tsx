"use client";

import React, { useState } from "react";
import { X, Building2, User, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitCorporateInquiryAction } from "@/app/actions/public-actions";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HireModal({ isOpen, onClose }: HireModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "Pune",
    roleRequirement: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("companyName", formData.companyName.trim());
      data.append("contactPerson", formData.contactPerson.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("phone", formData.phone.trim());
      data.append("location", formData.location.trim());
      data.append("roleRequirement", formData.roleRequirement.trim());

      const res = await submitCorporateInquiryAction(data);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.error || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setErrorMessage("Network error during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setErrorMessage(null);
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

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
                Requirement Received
              </h3>
              <p className="mt-2 text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Thank you for your inquiry. A dedicated RiseUp recruitment specialist will review your headcount mandate and contact you within 2 business hours.
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
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-2 rounded-none">
                Client Recruitment Intake
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
                Request Candidate Talent
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us about your open mandates. Free initial consultation & pre-screened shortlists.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs flex items-center gap-2 rounded-none">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Apex Global Solutions"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rajesh Kulkarni (HR)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Direct Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. +91 98220 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Operating Location / City <span className="text-rose-500">*</span>
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
                  Required Roles & Headcount Needs <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Need 15 Voice BPO agents in Pune, immediate joining, UK shift..."
                  value={formData.roleRequirement}
                  onChange={(e) => setFormData({ ...formData, roleRequirement: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white rounded-none"
                />
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
                      <span>Submitting Mandate...</span>
                    </>
                  ) : (
                    <span>Submit Talent Request</span>
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
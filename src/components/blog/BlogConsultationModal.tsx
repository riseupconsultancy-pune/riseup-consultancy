"use client";

import React, { useState } from "react";
import { X, Send, Phone, CheckCircle2, ShieldCheck, Clock, Building2 } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface BlogConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  sourceBlogTitle?: string;
}

export default function BlogConsultationModal({
  isOpen,
  onClose,
  defaultSubject = "BPO Staffing & Manpower Consultation",
  sourceBlogTitle,
}: BlogConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    workEmail: "",
    phone: "",
    seatsRequired: "10-25 seats",
    timeline: "Immediate (Within 48 hours)",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate brief submission / logging
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-900 transition-all scale-in duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100/80 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>Priority Corporate Intake</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
            Request Staffing Consultation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with Meenakshi Patel (HR Manager) for customized candidate lineups.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-heading">
                Consultation Request Acknowledged!
              </h4>
              <p className="text-slate-600 text-xs max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name || "Client"}</strong>. Our Pune corporate recruitment desk will call you back within <strong>2 business hours</strong> to discuss candidate profiles and commercial terms.
              </p>
              
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
                <p className="font-bold text-slate-800">Direct HR Desk Access:</p>
                <p className="text-slate-600">Phone: <a href="tel:+919359892819" className="text-blue-600 font-bold hover:underline">+91 93598 92819</a></p>
                <p className="text-slate-600">Email: <span className="font-semibold">info@riseupconsultancyy.com</span></p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {sourceBlogTitle && (
                <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100/80 text-[11px] text-blue-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">Reference: <strong>{sourceBlogTitle}</strong></span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. TeleTech BPO / Wipro Tech"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    placeholder="rajesh@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Seats / Profiles Needed
                  </label>
                  <select
                    value={formData.seatsRequired}
                    onChange={(e) => setFormData({ ...formData, seatsRequired: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-xs cursor-pointer"
                  >
                    <option value="5-10 seats">5 – 10 Profiles</option>
                    <option value="10-25 seats">10 – 25 Profiles</option>
                    <option value="25-50 seats">25 – 50 Profiles (Cohort)</option>
                    <option value="50-100+ seats">50 – 100+ Profiles (Bulk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Deployment Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-xs cursor-pointer"
                  >
                    <option value="Immediate (Within 48 hours)">Immediate (24–48 Hours)</option>
                    <option value="Within 7 Days">Within 7 Days</option>
                    <option value="Next Month Ramp">Next Month Ramp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specific Requirements / Shifts / Process
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Looking for 20 international voice agents for UK rotational shift in Kharadi, Versant 55+..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-xs resize-none"
                />
              </div>

              {/* Guarantees Box */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Zero Candidate Fees
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  24–48hr SLA Turnaround
                </span>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>Transmitting Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Mandate to Pune HR Desk</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 pt-1">
                <a
                  href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20interested%20in%20discussing%20BPO%20staffing%20services%20in%20Pune"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Instant WhatsApp Chat</span>
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href="tel:+919359892819"
                  className="text-slate-600 hover:text-blue-600 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call +91 93598 92819</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

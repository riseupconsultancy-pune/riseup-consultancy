"use client";

import React, { useState } from "react";
import { X, Building2, User, Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HireModal({ isOpen, onClose }: HireModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "Pune",
    roleRequirement: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <h3 className="text-2xl font-bold text-slate-900">Requirement Received</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              A dedicated recruitment partner will contact you within 2 business hours.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                Client Recruitment Intake
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Post a Hiring Requirement</h2>
              <p className="text-xs text-slate-500 mt-1">
                Receive pre-screened, verified candidate shortlists in 48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Company Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Apex Global"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Contact Person</label>
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Corporate Email</label>
                  <input
                    required
                    type="email"
                    placeholder="hr@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone / WhatsApp</label>
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Target Location</label>
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
                  <option value="Remote">Pan-India / Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Role & Key Requirements</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Positions needed, required years of experience, key technical competencies..."
                  value={formData.roleRequirement}
                  onChange={(e) => setFormData({ ...formData, roleRequirement: e.target.value })}
                  className="w-full p-3 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest transition-colors"
              >
                Submit Hiring Requirement
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, MessageCircle } from "lucide-react";
import { submitContactInquiryAction } from "@/app/actions/public-actions";
import WhatsAppIcon from "./WhatsAppIcon";

export default function ContactForm() {
  const [userType, setUserType] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("userType", userType);
      formData.append("subject", subject.trim() || (userType === "CANDIDATE" ? "Candidate Inquiry" : "Corporate Hiring Inquiry"));
      formData.append("message", message.trim());

      const res = await submitContactInquiryAction(formData);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to submit message. Please try again.");
      } else {
        setSuccessMessage(res.message || "Your inquiry has been submitted successfully!");
        // Reset form
        setFullName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please call or WhatsApp us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/30 overflow-hidden">
      {/* Top Sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

      {/* Header */}
      <div className="mb-8 pb-5 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-3 shadow-2xs">
          Direct Intake Channel
        </div>
        <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Send a Direct Message to Our Pune Recruitment Desk
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Whether you are an employer looking to staff an operation or a candidate seeking a verified role, our team will review and respond promptly.
        </p>
      </div>

      {/* Success State */}
      {successMessage ? (
        <div className="p-8 bg-emerald-50/90 border border-emerald-200 rounded-3xl animate-fadeIn text-center shadow-sm">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 rounded-2xl shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-emerald-950 mb-1.5">
            Inquiry Submitted Successfully
          </h4>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-lg mx-auto mb-6 font-medium">
            {successMessage}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="px-6 py-3 bg-white border border-emerald-300 text-emerald-900 font-bold text-xs uppercase tracking-wider hover:bg-emerald-100/50 transition-colors rounded-xl shadow-2xs cursor-pointer"
            >
              Send Another Message
            </button>
            <a
              href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20just%20submitted%20a%20message%20on%20your%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-md shadow-emerald-600/20 active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User Type Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              I am contacting as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("CANDIDATE")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  userType === "CANDIDATE"
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50"
                }`}
              >
                Job Seeker / Candidate
              </button>
              <button
                type="button"
                onClick={() => setUserType("EMPLOYER")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  userType === "EMPLOYER"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50"
                }`}
              >
                Employer / Hiring Company
              </button>
            </div>
          </div>

          {/* Row 1: Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-xs text-slate-900 outline-none transition-all rounded-xl shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (WhatsApp) <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-xs text-slate-900 outline-none transition-all rounded-xl shadow-2xs"
              />
            </div>
          </div>

          {/* Row 2: Email & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full px-4 py-3 bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-xs text-slate-900 outline-none transition-all rounded-xl shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {userType === "CANDIDATE" ? "Role or Query Topic" : "Company Name or Hiring Profile"}
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={userType === "CANDIDATE" ? "e.g. Customer Support / Voice Process" : "e.g. TechCorp Solutions Pvt Ltd"}
                className="w-full px-4 py-3 bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-xs text-slate-900 outline-none transition-all rounded-xl shadow-2xs"
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Message or Specific Requirements <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                userType === "CANDIDATE"
                  ? "Briefly describe your qualification, total experience (or fresher), and shift preference..."
                  : "Describe the positions, headcount, expected joining timeline, and location..."
              }
              className="w-full px-4 py-3 bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-xs text-slate-900 outline-none transition-all rounded-xl shadow-2xs resize-y"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message Directly</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-slate-500 text-center sm:text-right font-medium">
              Response guaranteed within 2 business hours &bull; 100% Confidential
            </span>
          </div>

        </form>
      )}

    </div>
  );
}

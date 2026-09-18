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
    <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-none shadow-2xs">
      
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block mb-1">
          Direct Intake Channel
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Send a Direct Message to Our Pune Recruitment Desk
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Whether you are an employer looking to staff an operation or a candidate seeking a verified role, our team will review and respond promptly.
        </p>
      </div>

      {/* Success State */}
      {successMessage ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-none animate-fadeIn text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-emerald-950 mb-1">
            Inquiry Submitted Successfully
          </h4>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-lg mx-auto mb-5">
            {successMessage}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="px-5 py-2.5 bg-white border border-emerald-300 text-emerald-900 font-bold text-xs uppercase tracking-wider hover:bg-emerald-100/50 transition-colors rounded-none"
            >
              Send Another Message
            </button>
            <a
              href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20just%20submitted%20a%20message%20on%20your%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* User Type Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              I am contacting as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("CANDIDATE")}
                className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider border rounded-none transition-all ${
                  userType === "CANDIDATE"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                Job Seeker / Candidate
              </button>
              <button
                type="button"
                onClick={() => setUserType("EMPLOYER")}
                className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider border rounded-none transition-all ${
                  userType === "EMPLOYER"
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                Employer / Hiring Company
              </button>
            </div>
          </div>

          {/* Row 1: Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white text-xs text-slate-900 outline-none transition-all rounded-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (WhatsApp) <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white text-xs text-slate-900 outline-none transition-all rounded-none"
              />
            </div>
          </div>

          {/* Row 2: Email & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white text-xs text-slate-900 outline-none transition-all rounded-none"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {userType === "CANDIDATE" ? "Role or Query Topic" : "Company Name or Hiring Profile"}
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={userType === "CANDIDATE" ? "e.g. Customer Support / Voice Process" : "e.g. TechCorp Solutions Pvt Ltd"}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white text-xs text-slate-900 outline-none transition-all rounded-none"
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white text-xs text-slate-900 outline-none transition-all rounded-none resize-y"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 rounded-none">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none shadow-xs cursor-pointer"
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

            <span className="text-[11px] text-slate-500 text-center sm:text-right">
              Response guaranteed within 2 business hours • 100% Confidential
            </span>
          </div>

        </form>
      )}

    </div>
  );
}

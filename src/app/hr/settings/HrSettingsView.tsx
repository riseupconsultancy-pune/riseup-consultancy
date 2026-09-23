"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles,
  Copy,
  Info
} from "lucide-react";
import { saveHrWhatsAppTemplateAction } from "@/app/actions/hr-actions";

interface HrSettingsViewProps {
  recruiterName: string;
  employeeCode: string;
  currentTemplate?: string | null;
}

const DEFAULT_TEMPLATE = `Dear {candidate_name},

Congratulations! You have been shortlisted for an interview with {company_name} for the position of *{job_title}* (Job ID: *{job_id}*).

📅 *Interview Date & Time:*
{interview_date}

📍 *Interview Venue:*
{interview_venue}

🗺️ *Google Maps GPS Location:*
{venue_location_url}

👤 *Contact Person / SPOC:* {contact_person}
📞 *Contact Phone:* {contact_phone}

⚠️ *Important Instructions:*
1. Kindly call {contact_phone} once you reach the venue.
2. At the company reception desk, please don't forget to mention *RiseUp Consultancy* as your consultancy referral.
3. Carry 2 printed hard copies of your updated resume and a valid Government Photo ID.
{interview_instructions}

Best of luck!
— {recruiter_name} | RiseUp Consultancy
📞 {recruiter_phone}`;

const PLACEHOLDERS = [
  { tag: "{candidate_name}", label: "Candidate Name" },
  { tag: "{job_title}", label: "Job Title" },
  { tag: "{job_id}", label: "Job ID" },
  { tag: "{company_name}", label: "Company Name" },
  { tag: "{work_city}", label: "Work City" },
  { tag: "{interview_date}", label: "Interview Date & Time" },
  { tag: "{interview_venue}", label: "Interview Venue" },
  { tag: "{venue_location_url}", label: "Google Maps URL" },
  { tag: "{contact_person}", label: "On-site SPOC" },
  { tag: "{contact_phone}", label: "Contact Phone" },
  { tag: "{recruiter_name}", label: "Recruiter Name" },
  { tag: "{recruiter_phone}", label: "Recruiter Phone" },
  { tag: "{referral_tag}", label: "Referral Code" },
  { tag: "{interview_instructions}", label: "Candidate Notes" },
];

export default function HrSettingsView({
  recruiterName,
  employeeCode,
  currentTemplate,
}: HrSettingsViewProps) {
  const [template, setTemplate] = useState(currentTemplate || DEFAULT_TEMPLATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleInsertTag = (tag: string) => {
    setTemplate((prev) => `${prev} ${tag}`);
  };

  const handleResetDefault = () => {
    setTemplate(DEFAULT_TEMPLATE);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template.trim() || template.trim().length < 10) {
      setStatusMessage({ text: "Template must be at least 10 characters long.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await saveHrWhatsAppTemplateAction(template.trim());
      if (res.success) {
        setStatusMessage({ text: res.message || "Template saved successfully!", type: "success" });
      } else {
        setStatusMessage({ text: res.error || "Failed to save template.", type: "error" });
      }
    } catch {
      setStatusMessage({ text: "Network error saving template.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate simulated preview
  const previewText = template
    .replace(/{candidate_name}/g, "Rahul Sharma")
    .replace(/{recruiter_name}/g, recruiterName)
    .replace(/{recruiter_phone}/g, "+91 98765 43210")
    .replace(/{job_title}/g, "Customer Support Specialist")
    .replace(/{job_id}/g, "RUP-JOB-1002")
    .replace(/{work_city}/g, "Pune HQ")
    .replace(/{company_name}/g, "Digitide Business Solutions")
    .replace(/{interview_date}/g, "Thu, 24 Sep 2026, 10:30 AM")
    .replace(/{interview_venue}/g, "4th Floor, Cerebrum IT Park, Kalyani Nagar, Pune - 411014")
    .replace(/{venue_location_url}/g, "https://maps.app.goo.gl/sample123")
    .replace(/{contact_person}/g, "Sneha Deshmukh (HR Manager)")
    .replace(/{contact_phone}/g, "+91 91234 56789")
    .replace(/{interview_instructions}/g, "Dress Code: Formal attire. Report 15 minutes before slot.")
    .replace(/{referral_tag}/g, `Referral: ${recruiterName} | RiseUp Consultancy`);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-emerald-600 inline-block"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Recruiter Preferences &bull; {employeeCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            WhatsApp 1-Tap Message Template
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure the message automatically loaded when you click the 1-Tap WhatsApp button on candidate cards.
          </p>
        </div>

        <Link
          href="/hr/candidates"
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Candidates
        </Link>
      </div>

      {/* Alert Notification */}
      {statusMessage && (
        <div
          className={`p-4 border-l-4 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-600 text-emerald-900"
              : "bg-rose-50 border-rose-600 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold uppercase hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form & Editor */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-none shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
            Invitation Message Template
          </label>
          <p className="text-[11px] text-slate-500 mb-3">
            Click on any placeholder chip below to automatically insert it into your message draft.
          </p>

          {/* Placeholders Bar */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PLACEHOLDERS.map((item) => (
              <button
                key={item.tag}
                type="button"
                onClick={() => handleInsertTag(item.tag)}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 border border-slate-300 transition-colors rounded-none"
              >
                <span>{item.tag}</span>
                <span className="text-[9px] text-slate-400 font-sans">({item.label})</span>
              </button>
            ))}
          </div>

          <textarea
            rows={7}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 p-3.5 text-xs text-slate-900 font-mono leading-relaxed rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Type your WhatsApp template here..."
          />
        </div>

        {/* Live WhatsApp Bubble Preview */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Live WhatsApp Message Bubble Preview
          </span>
          <div className="bg-slate-900/5 p-4 border border-slate-200">
            <div className="max-w-md bg-emerald-50 border border-emerald-300 p-3.5 rounded-none shadow-xs text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans relative">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp Message Simulation</span>
              </div>
              {previewText}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Template</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Template...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save WhatsApp Template</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

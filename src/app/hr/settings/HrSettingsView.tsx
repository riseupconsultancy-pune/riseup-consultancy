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

const DEFAULT_TEMPLATE = `Hello {candidate_name}, this is {recruiter_name} from RiseUp Consultancy regarding your application for {job_title} ({work_city}).

We have reviewed your profile and would like to schedule you for an interview. 

*Mandatory Referral Code at Interview:*
{referral_tag}

Please reply to confirm your availability.`;

const PLACEHOLDERS = [
  { tag: "{candidate_name}", label: "Candidate Name" },
  { tag: "{job_title}", label: "Job Title" },
  { tag: "{work_city}", label: "Work City" },
  { tag: "{company_name}", label: "Company Name" },
  { tag: "{recruiter_name}", label: "Your Name" },
  { tag: "{referral_tag}", label: "Official Referral Tag" },
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
    .replace(/{job_title}/g, "Customer Support Specialist")
    .replace(/{work_city}/g, "Pune HQ")
    .replace(/{company_name}/g, "Apex Global Solutions")
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

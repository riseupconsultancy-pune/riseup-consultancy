"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface BlogInlineHookProps {
  onOpenModal: () => void;
  title?: string;
  subtitle?: string;
}

export default function BlogInlineHook({
  onOpenModal,
  title = "Facing Attrition or Urgent Ramp Challenges?",
  subtitle = "Get pre-assessed, voice-cleared candidate shortlists within 24–48 hours. No upfront fees.",
}: BlogInlineHookProps) {
  return (
    <div className="my-8 p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        {subtitle}
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={onOpenModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Request Talent</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20need%20staffing%20support"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span>WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
}

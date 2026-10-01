"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface BlogInlineHookProps {
  onOpenModal: () => void;
  title?: string;
  subtitle?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export default function BlogInlineHook({
  onOpenModal,
  title = "Facing Attrition or Urgent Ramp Challenges?",
  subtitle = "Get pre-assessed, voice-cleared candidate shortlists within 24–48 hours. No upfront fees.",
  primaryText = "Request Talent",
  primaryLink,
  secondaryText = "WhatsApp Us",
  secondaryLink,
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
        {primaryLink ? (
          <Link
            href={primaryLink}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{primaryText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onOpenModal}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{primaryText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {secondaryLink ? (
          <Link
            href={secondaryLink}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>{secondaryText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <a
            href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20inquiring%20about%20Riseup%20BPO%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>{secondaryText}</span>
          </a>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Clock, Users, PhoneCall } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface BlogInlineHookProps {
  onOpenModal: () => void;
  title?: string;
  subtitle?: string;
  badge?: string;
  city?: string;
}

export default function BlogInlineHook({
  onOpenModal,
  title = "Facing Attrition or Urgent Ramp Challenges in Your Pune BPO?",
  subtitle = "Our Chandan Nagar recruitment desk can line up 15 to 50+ pre-assessed, voice-cleared candidates for your floor within 24 to 48 hours.",
  badge = "Immediate Cohort Lineup SLA",
  city = "Pune",
}: BlogInlineHookProps) {
  return (
    <div className="my-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/40">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>{badge}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug font-heading mb-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-4">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-emerald-400" /> 24–48hr Turnaround
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              <ShieldCheck className="w-3 h-3 text-blue-400" /> Zero Candidate Fee
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              <Users className="w-3 h-3 text-indigo-400" /> 30-Day Free Replacement
            </span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenModal}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 group"
          >
            <span>Request Lineup Consultation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20reading%20your%20Pune%20BPO%20staffing%20article%20and%20want%20to%20inquire%20about%20candidate%20lineups"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs tracking-wider uppercase rounded-2xl border border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Instant WhatsApp HR Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}

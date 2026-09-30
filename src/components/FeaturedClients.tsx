"use client";

import React from "react";
import Image from "next/image";
import { Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export interface ClientPartner {
  name: string;
  category: string;
  logo: string;
  alt: string;
  width: number;
  height: number;
}

export const CLIENT_PARTNERS: ClientPartner[] = [
  {
    name: "Concentrix",
    category: "Global CX & BPM Solutions",
    logo: "/images/clients/concentrix.png",
    alt: "Concentrix Corporate Hiring Partner Logo",
    width: 403,
    height: 63,
  },
  {
    name: "Credence Global Solutions",
    category: "Healthcare RCM & Financial BPO",
    logo: "/images/clients/credence-global-solutions.png",
    alt: "Credence Global Solutions Corporate Client Logo",
    width: 676,
    height: 160,
  },
  {
    name: "Transcom",
    category: "Global Customer Care & Digital Support",
    logo: "/images/clients/transcom.png",
    alt: "Transcom Customer Care Hiring Partner Logo",
    width: 703,
    height: 122,
  },
  {
    name: "EOS Globe",
    category: "Business Process Management & Tech",
    logo: "/images/clients/eos-globe.png",
    alt: "EOS Globe BPM Client Partner Logo",
    width: 292,
    height: 195,
  },
  {
    name: "Altruist Technologies",
    category: "Telecom & Contact Center Operations",
    logo: "/images/clients/altruist.png",
    alt: "Altruist Technologies BPO Partner Logo",
    width: 316,
    height: 290,
  },
  {
    name: "AM Infoweb",
    category: "Global Healthcare BPO & KPO",
    logo: "/images/clients/am-infoweb.png",
    alt: "AM Infoweb Healthcare BPO Partner Logo",
    width: 168,
    height: 68,
  },
  {
    name: "B-MAP Fintech",
    category: "Fintech & Transaction Operations",
    logo: "/images/clients/bmap-fintech.png",
    alt: "B-MAP Fintech Verification Client Logo",
    width: 650,
    height: 176,
  },
  {
    name: "Digitide Solutions",
    category: "Enterprise Digital & Back-Office BPM",
    logo: "/images/clients/digitide-solutions.png",
    alt: "Digitide Solutions Corporate Client Logo",
    width: 264,
    height: 71,
  },
  {
    name: "iMarque Solutions",
    category: "Healthcare, Publishing & Support BPO",
    logo: "/images/clients/imarque-solutions.png",
    alt: "iMarque Solutions Client Partner Logo",
    width: 266,
    height: 47,
  },
  {
    name: "Jaiban Organics",
    category: "Corporate Enterprise Operations",
    logo: "/images/clients/jaiban-organics.png",
    alt: "Jaiban Organics Corporate Client Logo",
    width: 198,
    height: 130,
  },
];

interface FeaturedClientsProps {
  headline?: string;
  subheadline?: string;
  showMetrics?: boolean;
  className?: string;
}

export default function FeaturedClients({
  headline = "Trusted by Leading Enterprises & Fast-Growing Companies",
  subheadline = "Supplying verified corporate talent cohorts and direct company payroll professionals across Pune and Pan-India.",
  showMetrics = true,
  className = "",
}: FeaturedClientsProps) {
  // Triple the list to create a completely seamless, gap-free infinite right-to-left loop
  const marqueeItems = [...CLIENT_PARTNERS, ...CLIENT_PARTNERS, ...CLIENT_PARTNERS];

  return (
    <section
      aria-label="Our Corporate Clients and Hiring Partners"
      className={`relative py-12 sm:py-16 bg-gradient-to-b from-slate-950 via-[#0B1528] to-slate-950 text-white border-y border-slate-800/80 overflow-hidden ${className}`}
    >
      {/* Atmospheric Ambient Glow Orbs */}
      <div className="absolute -top-24 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-9">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs rounded-full">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Corporate Hiring Network</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-heading uppercase">
            {headline}
          </h2>

          {subheadline && (
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {subheadline}
            </p>
          )}
        </div>
      </div>

      {/* Marquee Track Container with Left & Right Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden py-2 select-none group z-10">
        {/* Left Gradient Fade Mask */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 md:w-36 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10" 
        />
        
        {/* Right Gradient Fade Mask */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 md:w-36 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-10" 
        />

        {/* Continuous Right-to-Left Flowing Marquee Track */}
        <div 
          className="animate-marquee-left flex items-center gap-3.5 sm:gap-4.5"
          title="Corporate clients hiring through Rise Up Consultancy. Hover to pause."
        >
          {marqueeItems.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="w-[200px] sm:w-[235px] h-[88px] sm:h-[98px] bg-gradient-to-b from-white via-slate-50/95 to-blue-50/75 border border-white/80 ring-1 ring-blue-400/20 hover:ring-blue-400/50 hover:border-white transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35),0_0_12px_rgba(59,130,246,0.12)] hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35),0_0_18px_rgba(96,165,250,0.25)] hover:-translate-y-1 flex items-center justify-center p-3.5 sm:p-4 rounded-2xl shrink-0 group/card relative overflow-hidden backdrop-blur-xs"
            >
              {/* Glossy Top Sheen Reflection */}
              <div 
                className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/80 via-white/25 to-transparent pointer-events-none" 
                aria-hidden="true" 
              />

              {/* Hover Diagonal Light Flare */}
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" 
                aria-hidden="true" 
              />

              <div className="relative w-full h-full flex items-center justify-center z-10">
                <Image
                  src={client.logo}
                  alt={client.alt}
                  width={client.width}
                  height={client.height}
                  loading="lazy"
                  quality={65}
                  sizes="(max-width: 640px) 140px, 180px"
                  className="max-h-11 sm:max-h-12 max-w-[155px] sm:max-w-[190px] w-auto h-auto object-contain transition-transform duration-300 group-hover/card:scale-105 pointer-events-none filter drop-shadow-2xs"
                />
              </div>

              {/* Accessible Invisible Screen-Reader Label */}
              <span className="sr-only">{client.name} - {client.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Micro Trust Indicators Strip */}
      {showMetrics && (
        <div className="max-w-5xl mx-auto px-4 mt-7 sm:mt-9 pt-5 border-t border-slate-800/80 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2.5 text-slate-300 text-[11px] sm:text-xs font-semibold">
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Direct Corporate Payroll Placements</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Zero Placement Fee for Candidates</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>24–48hr Pre-Screened SLA</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>100% Verified Employer Mandates</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

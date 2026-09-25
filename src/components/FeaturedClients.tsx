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
    width: 447,
    height: 447,
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
    width: 800,
    height: 400,
  },
  {
    name: "EOS Globe",
    category: "Business Process Management & Tech",
    logo: "/images/clients/eos-globe.png",
    alt: "EOS Globe BPM Client Partner Logo",
    width: 800,
    height: 400,
  },
  {
    name: "Altruist Technologies",
    category: "Telecom & Contact Center Operations",
    logo: "/images/clients/altruist.png",
    alt: "Altruist Technologies BPO Partner Logo",
    width: 800,
    height: 400,
  },
  {
    name: "AM Infoweb",
    category: "Global Healthcare BPO & KPO",
    logo: "/images/clients/am-infoweb.png",
    alt: "AM Infoweb Healthcare BPO Partner Logo",
    width: 285,
    height: 119,
  },
  {
    name: "B-MAP Fintech",
    category: "Fintech & Transaction Operations",
    logo: "/images/clients/bmap-fintech.png",
    alt: "B-MAP Fintech Verification Client Logo",
    width: 800,
    height: 400,
  },
  {
    name: "Digitide Solutions",
    category: "Enterprise Digital & Back-Office BPM",
    logo: "/images/clients/digitide-solutions.png",
    alt: "Digitide Solutions Corporate Client Logo",
    width: 800,
    height: 400,
  },
  {
    name: "iMarque Solutions",
    category: "Healthcare, Publishing & Support BPO",
    logo: "/images/clients/imarque-official.png",
    alt: "iMarque Solutions Client Partner Logo",
    width: 281,
    height: 50,
  },
  {
    name: "Jaiban Organics",
    category: "Corporate Enterprise Operations",
    logo: "/images/clients/jaiban-organics.png",
    alt: "Jaiban Organics Corporate Client Logo",
    width: 200,
    height: 150,
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
      className={`relative py-10 sm:py-14 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-9">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Corporate Hiring Network</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading uppercase">
            {headline}
          </h2>

          {subheadline && (
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              {subheadline}
            </p>
          )}
        </div>
      </div>

      {/* Marquee Track Container with Left & Right Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden py-2 select-none group">
        {/* Left Gradient Fade Mask */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 md:w-36 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" 
        />
        
        {/* Right Gradient Fade Mask */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 md:w-36 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" 
        />

        {/* Continuous Right-to-Left Flowing Marquee Track */}
        <div 
          className="animate-marquee-left flex items-center gap-3.5 sm:gap-4.5"
          title="Corporate clients hiring through Rise Up Consultancy. Hover to pause."
        >
          {marqueeItems.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="w-[185px] sm:w-[215px] h-[84px] sm:h-[92px] bg-white border border-slate-200/90 hover:border-blue-600 transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-center p-3.5 sm:p-4 rounded-none shrink-0 group/card relative"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={client.logo}
                  alt={client.alt}
                  width={client.width}
                  height={client.height}
                  loading="lazy"
                  className="max-h-9 sm:max-h-10 max-w-[135px] sm:max-w-[160px] w-auto h-auto object-contain transition-transform duration-200 group-hover/card:scale-105 pointer-events-none"
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
        <div className="max-w-5xl mx-auto px-4 mt-7 sm:mt-9 pt-5 border-t border-slate-200/70">
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2.5 text-slate-600 text-[11px] sm:text-xs font-semibold">
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Direct Corporate Payroll Placements</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Zero Placement Fee for Candidates</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>24–48hr Pre-Screened SLA</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>100% Verified Employer Mandates</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

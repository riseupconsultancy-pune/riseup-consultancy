"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowUpRight, Bus, Clock, DollarSign, Building } from "lucide-react";

interface Hub {
  area: string;
  focus: string;
  typicalSalary: string;
  shifts: string;
  cabFacility: string;
  keyClients: string;
}

const HUBS: Hub[] = [
  {
    area: "Kharadi & Viman Nagar",
    focus: "Voice & Customer Experience Hub",
    typicalSalary: "₹22,000 – ₹42,000/mo",
    shifts: "Day, US & UK Rotational",
    cabFacility: "Home Pick & Drop within 30km",
    keyClients: "Tier-1 BPO & Global Tech Support",
  },
  {
    area: "Magarpatta City & Hadapsar",
    focus: "BFSI & Back Office Processing",
    typicalSalary: "₹20,000 – ₹38,000/mo",
    shifts: "Standard Day & Australian Shifts",
    cabFacility: "Centralized / Point-to-Point Cab",
    keyClients: "Private Banks & Wealth Management",
  },
  {
    area: "Hinjewadi IT Park & Baner",
    focus: "L1 Tech Support & GIC Operations",
    typicalSalary: "₹24,000 – ₹45,000/mo",
    shifts: "24/7 Rotational with Night Allowance",
    cabFacility: "Free 24/7 Security Escort Cabs",
    keyClients: "Enterprise IT & Shared Services",
  },
  {
    area: "Chandan Nagar & Yerwada",
    focus: "Domestic Voice & Sales Operations",
    typicalSalary: "₹18,000 – ₹32,000/mo + High Incentives",
    shifts: "Fixed Day Shifts (Mon – Sat)",
    cabFacility: "Metro / Public Transit Proximity",
    keyClients: "E-Commerce & Digital Outbound",
  },
];

export default function PuneHubsMatrix() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Subhead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Pune Employment Micro-Markets
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Where We Place: Key Job Locations Across Pune
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Verified corporate hiring mandates matched with your residential proximity, shift preference, and cab availability.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 bg-emerald-600 rounded-full" />
            <span>Active Walk-In Batches Running Daily</span>
          </div>
        </div>

        {/* Asymmetric 4 Hub Cards with Real Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {HUBS.map((hub, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-white border border-slate-200 hover:border-slate-900 transition-all rounded-none flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      {hub.area}
                    </h3>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                    {hub.typicalSalary}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-700 mb-3 pl-6">
                  {hub.focus}
                </p>

                {/* Practical Logistics Details */}
                <div className="pl-6 space-y-1.5 text-xs text-slate-600 border-l-2 border-slate-100 ml-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong className="text-slate-800 font-semibold">Shifts:</strong> {hub.shifts}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong className="text-slate-800 font-semibold">Commute:</strong> {hub.cabFacility}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong className="text-slate-800 font-semibold">Hiring Clients:</strong> {hub.keyClients}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/jobs"
                  className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>View Jobs in {hub.area.split(" ")[0]}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-slate-400 font-mono">Spot Interviews</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

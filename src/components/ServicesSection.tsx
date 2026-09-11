"use client";

import React from "react";
import { Users, Award, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

interface ServicesSectionProps {
  onHireClick?: () => void;
}

const SERVICES = [
  {
    icon: Users,
    title: "Permanent & Executive Staffing",
    description: "End-to-end talent placement matching rigorously vetted professionals with enterprise culture and technical benchmarks.",
    tag: "India & Nigeria",
  },
  {
    icon: Award,
    title: "C-Suite & Leadership Search",
    description: "Confidential executive headhunting for board members, VPs, and technical department heads across emerging markets.",
    tag: "Executive Search",
  },
  {
    icon: Zap,
    title: "Specialized Technical Contracting",
    description: "Rapid deployment of senior engineers, digital product architects, and operations specialists on flexible mandates.",
    tag: "Rapid SLA",
  },
  {
    icon: ShieldCheck,
    title: "Corporate Recruitment Advisory",
    description: "Market compensation benchmarking, organizational structuring, and high-volume talent pipeline management.",
    tag: "Advisory",
  },
];

export default function ServicesSection({ onHireClick }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="block text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Practice Areas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consultancy Solutions Built on Precision & Discretion
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            We operate with the rigour of an international executive search firm, tailoring search strategies to enterprise needs.
          </p>
        </div>

        {/* 4 Square Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="group p-8 bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-900 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white border border-slate-200 text-blue-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200 px-2 py-1 bg-white">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-blue-600">
                  <span>Inquire Practice</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
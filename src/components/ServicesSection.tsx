"use client";

import React from "react";
import { Users, Briefcase, Award, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

interface ServicesSectionProps {
  onHireClick?: () => void;
}

const SERVICES = [
  {
    icon: Users,
    title: "Permanent Staffing",
    description: "End-to-end talent acquisition matching pre-screened professionals with company culture and technical benchmarks.",
    tag: "Pune & Dubai",
  },
  {
    icon: Award,
    title: "Executive Search",
    description: "Confidential headhunting for C-suite, VPs, and specialized domain leaders to steer critical business expansions.",
    tag: "Leadership",
  },
  {
    icon: Zap,
    title: "Contract & IT Hiring",
    description: "Agile deployment of verified software engineers, product specialists, and technical staff on flexible models.",
    tag: "Rapid Turnaround",
  },
  {
    icon: ShieldCheck,
    title: "Career Acceleration",
    description: "Direct guidance, resume alignment, and guaranteed corporate interview matching for aspiring professionals.",
    tag: "For Candidates",
  },
];

export default function ServicesSection({ onHireClick }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            Core Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consultancy Solutions Built for Speed & Precision
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Whether scaling an enterprise or landing a career-defining role, RiseUp bridges the gap with zero friction.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="group relative p-7 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200/70">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center text-xs font-semibold text-blue-600">
                  <span>Learn More</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
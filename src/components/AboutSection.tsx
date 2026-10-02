"use client";

import React from "react";
import { Users, Target, Globe, Shield, Award, Sparkles, Building2 } from "lucide-react";

const LEADERSHIP = [
  {
    name: "Miss M. Patil",
    role: "Founder & Executive Management",
    department: "Executive Leadership",
    initials: "MP",
    description: "Spearheading strategic vision, enterprise partnerships, and operational expansion across Pan-India and global markets.",
  },
  {
    name: "Mrs. Y. S. Patil",
    role: "Management & Ownership",
    department: "Governance & Strategic Direction",
    initials: "YP",
    description: "Overseeing corporate governance, financial stewardship, and institutional growth for Rise Up Consultancy.",
  },
  {
    name: "Meenakshi Patel",
    role: "HR Manager & Management Team",
    department: "Talent Acquisition & Client Relations",
    initials: "MeP",
    description: "Leading recruitment workflows, talent screening pipelines, and corporate client relations in the Pune headquarters.",
  },
  {
    name: "Cynthia Glenn",
    role: "Nigeria & International Management",
    department: "Cross-Border Corridor Operations",
    initials: "CG",
    description: "Directing international staffing operations and enterprise talent corridors across Nigeria and regional African markets.",
  },
  {
    name: "Shaziya Khan",
    role: "Operations Manager",
    department: "BPO & Process Coordination",
    initials: "SK",
    description: "Driving operational execution, candidate coordination, and process compliance across high-volume staffing mandates.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16 sm:mb-20">
          
          {/* Left Column: Background & Scale */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-blue-500 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                About Rise Up Consultancy
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              A Purpose-Driven Recruitment Partner Built for Speed & Precision
            </h2>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              <p>
                <strong className="text-white font-semibold">Rise Up Consultancy Pune – Staffing & Recruiting Services</strong> was established in <strong className="text-white font-semibold">January 2025</strong> with the objective of providing reliable, professional, and end-to-end recruitment and staffing solutions to organizations and candidates.
              </p>
              <p>
                Founded by Miss M. Patil and starting with an agile core of 2 professionals, the firm has rapidly expanded its recruitment operations, establishing verified client connections and talent networks across Pan-India and international markets like Nigeria.
              </p>
              <p>
                Our philosophy centers on understanding exact client requirements, rigorous screening, seamless interview coordination, and nurturing transparent, long-term relationships with both employers and candidates.
              </p>
            </div>

            {/* Core Values Strip */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-white">Jan 2025</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Established Date</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-white">Pan-India</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">& Global Sourcing</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-white">100% Direct</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Independent Agency</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mission Card */}
          <div className="lg:col-span-5 p-7 sm:p-8 bg-slate-800/80 border border-slate-700 backdrop-blur-xs flex flex-col justify-between rounded-none">
            <div>
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 block">
                Our Guiding Mission
              </span>

              <blockquote className="text-base sm:text-lg font-medium text-white italic leading-relaxed mb-6">
                &ldquo;Our mission is to connect the right talent with the right opportunities while providing transparent, professional, and efficient recruitment solutions to clients and candidates.&rdquo;
              </blockquote>

              <p className="text-xs text-slate-300 leading-relaxed">
                We believe in sustainable career elevation for job seekers and precise, high-retention talent alignment for organizations.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700/80 flex items-center gap-3 text-xs text-slate-400 font-semibold">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rise Up Consultancy Pune Official Charter</span>
            </div>
          </div>

        </div>

        {/* Leadership Directory Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">
              Leadership & Management
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The Team Driving Rise Up Consultancy
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Pune Headquarters • International Corridor
          </span>
        </div>

        {/* 6 Leadership Cards (Responsive Grid on Desktop, Horizontal Snap Scroller on Mobile) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 sm:pb-0 gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {LEADERSHIP.map((leader, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-[84vw] max-w-[340px] sm:w-auto p-6 bg-slate-800/60 border border-slate-700 hover:border-blue-500/80 hover:bg-slate-800 transition-all duration-200 flex flex-col justify-between rounded-none"
            >
              <div>
                {/* Header with Avatar & Department */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 bg-slate-700 border border-slate-600 text-blue-400 font-bold text-sm flex items-center justify-center shrink-0">
                    {leader.initials}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-1 border border-slate-700 text-right">
                    {leader.department}
                  </span>
                </div>

                {/* Name & Role */}
                <h4 className="text-lg font-bold text-white mb-1">
                  {leader.name}
                </h4>
                <div className="text-xs font-semibold text-blue-400 mb-3">
                  {leader.role}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {leader.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span>Authorized Management Profile</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 mt-2">
          <span>Swipe horizontally to view all team members →</span>
        </div>

      </div>
    </section>
  );
}

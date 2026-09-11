"use client";

import React, { useState } from "react";
import { MapPin, Briefcase, ArrowUpRight, Clock } from "lucide-react";

interface FeaturedJobsProps {
  onApplyClick?: (jobTitle: string) => void;
}

const SAMPLE_JOBS = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    company: "TechNova Cloud Systems",
    location: "Pune, India",
    type: "Full-Time",
    salary: "₹12 - 18 LPA",
    experience: "3-5 Years",
    tags: ["React", "Node.js", "TypeScript"],
    featured: true,
  },
  {
    id: "2",
    title: "Corporate HR Business Partner",
    company: "Apex Global Retail",
    location: "Pune, India",
    type: "Full-Time",
    salary: "₹7 - 11 LPA",
    experience: "4+ Years",
    tags: ["Talent Acquisition", "HRMS", "Compliance"],
    featured: true,
  },
  {
    id: "3",
    title: "Commercial Operations Lead",
    company: "Sahara Logistics PLC",
    location: "Lagos, Nigeria",
    type: "On-Site",
    salary: "₦14M - 18M / yr",
    experience: "5+ Years",
    tags: ["Supply Chain", "B2B Operations", "Strategy"],
    featured: true,
  },
  {
    id: "4",
    title: "Financial Risk & Compliance Analyst",
    company: "Vertex Advisory Group",
    location: "Abuja, Nigeria",
    type: "Hybrid",
    salary: "₦10M - 15M / yr",
    experience: "3-6 Years",
    tags: ["Financial Auditing", "Risk Management", "Tax"],
    featured: false,
  },
];

export default function FeaturedJobs({ onApplyClick }: FeaturedJobsProps) {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredJobs =
    selectedFilter === "All"
      ? SAMPLE_JOBS
      : selectedFilter === "India"
      ? SAMPLE_JOBS.filter((j) => j.location.includes("India"))
      : selectedFilter === "Nigeria"
      ? SAMPLE_JOBS.filter((j) => j.location.includes("Nigeria"))
      : SAMPLE_JOBS;

  return (
    <section id="jobs" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Corporate Mandates
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Active Executive Openings
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Verified career opportunities commissioned by our enterprise client network across India and Nigeria.
            </p>
          </div>

          {/* Location Filters with Square Boxes */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {["All", "India", "Nigeria"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedFilter === filter
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid with Clean Square Edges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group p-8 bg-white border border-slate-200 hover:border-slate-900 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                      {job.company}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-1">
                      {job.title}
                    </h3>
                  </div>
                  {job.featured && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border border-slate-200 shrink-0">
                      Priority Role
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 mb-6">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {job.experience}
                  </span>
                  <span className="font-bold text-slate-900">
                    {job.salary}
                  </span>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Direct Mandate
                </span>
                <button
                  type="button"
                  onClick={() => onApplyClick?.(job.title)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider group-hover:bg-blue-600 transition-colors"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
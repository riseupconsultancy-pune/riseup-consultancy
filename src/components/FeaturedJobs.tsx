"use client";

import React, { useState } from "react";
import { MapPin, Briefcase, IndianRupee, ArrowUpRight, CheckCircle, Clock } from "lucide-react";

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
    title: "Business Development Manager",
    company: "Emirates Logistics Group",
    location: "Dubai, UAE",
    type: "On-Site",
    salary: "AED 12k - 16k / mo",
    experience: "5+ Years",
    tags: ["B2B Sales", "Client Acquisition", "Logistics"],
    featured: true,
  },
  {
    id: "4",
    title: "Financial Data Analyst",
    company: "FinVertex Advisory",
    location: "Pune, India",
    type: "Hybrid",
    salary: "₹8 - 14 LPA",
    experience: "2-4 Years",
    tags: ["Python", "SQL", "PowerBI"],
    featured: false,
  },
];

export default function FeaturedJobs({ onApplyClick }: FeaturedJobsProps) {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredJobs =
    selectedFilter === "All"
      ? SAMPLE_JOBS
      : selectedFilter === "Pune"
      ? SAMPLE_JOBS.filter((j) => j.location.includes("Pune"))
      : selectedFilter === "Dubai"
      ? SAMPLE_JOBS.filter((j) => j.location.includes("Dubai"))
      : SAMPLE_JOBS;

  return (
    <section id="jobs" className="py-16 sm:py-24 bg-slate-50/60 border-t border-slate-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Verified Openings
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked roles from our corporate client network in Pune & Dubai.
            </p>
          </div>

          {/* Quick Location Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-slate-200/80 shadow-2xs self-start sm:self-auto">
            {["All", "Pune", "Dubai"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {job.company}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                      {job.title}
                    </h3>
                  </div>
                  {job.featured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold shrink-0">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.experience}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {job.salary}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Direct Consultancy Match</span>
                <button
                  type="button"
                  onClick={() => onApplyClick?.(job.title)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold group-hover:bg-blue-600 transition-colors"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
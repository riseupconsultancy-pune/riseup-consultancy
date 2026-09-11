"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import ApplyModal from "@/components/ApplyModal";
import HireModal from "@/components/HireModal";
import { Search, MapPin, Clock, Briefcase, Filter, X, ArrowUpRight, Check, SlidersHorizontal } from "lucide-react";

interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  country: "India" | "Nigeria";
  industry: "IT" | "Non-IT";
  category: string;
  experienceLevel: "0-1" | "1-3" | "3-5" | "5+";
  experienceLabel: string;
  salary: string;
  type: string;
  tags: string[];
  description: string;
  featured: boolean;
}

const ALL_JOBS: JobOpening[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer",
    company: "TechNova Cloud Systems",
    location: "Pune, India",
    country: "India",
    industry: "IT",
    category: "Full Stack",
    experienceLevel: "3-5",
    experienceLabel: "3-5 Years",
    salary: "₹14 - 20 LPA",
    type: "Full-Time",
    tags: ["React", "Node.js", "TypeScript"],
    description: "Lead front-end architecture and API integration for enterprise SaaS systems.",
    featured: true,
  },
  {
    id: "job-2",
    title: "Junior Software Engineer",
    company: "InnoVenture Labs",
    location: "Pune, India",
    country: "India",
    industry: "IT",
    category: "Software",
    experienceLevel: "0-1",
    experienceLabel: "0-1 Year (Fresher)",
    salary: "₹4.5 - 6.5 LPA",
    type: "Full-Time",
    tags: ["JavaScript", "Python", "SQL"],
    description: "Great entry role for fresh engineering graduates eager to build cloud applications.",
    featured: false,
  },
  {
    id: "job-3",
    title: "HR Business Partner",
    company: "Apex Global Retail",
    location: "Pune, India",
    country: "India",
    industry: "Non-IT",
    category: "Human Resources",
    experienceLevel: "3-5",
    experienceLabel: "3-5 Years",
    salary: "₹8 - 12 LPA",
    type: "Full-Time",
    tags: ["Talent Acquisition", "HRMS"],
    description: "Manage client recruitment pipelines and performance assessments.",
    featured: true,
  },
  {
    id: "job-4",
    title: "Commercial Sales Lead",
    company: "Sahara Logistics PLC",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    industry: "Non-IT",
    category: "B2B Sales",
    experienceLevel: "1-3",
    experienceLabel: "1-3 Years",
    salary: "₦6M - 9M / yr",
    type: "On-Site",
    tags: ["B2B Sales", "Client Acquisition"],
    description: "Acquire enterprise corporate accounts across regional supply chain hubs.",
    featured: true,
  },
  {
    id: "job-5",
    title: "Backend & Cloud Engineer",
    company: "DataStream Systems",
    location: "Bengaluru, India",
    country: "India",
    industry: "IT",
    category: "Backend",
    experienceLevel: "1-3",
    experienceLabel: "1-3 Years",
    salary: "₹10 - 15 LPA",
    type: "Hybrid",
    tags: ["Python", "FastAPI", "Docker"],
    description: "Build robust microservices and high-concurrency cloud backends.",
    featured: false,
  },
  {
    id: "job-6",
    title: "Supply Chain Supervisor",
    company: "WestAfrica Consumer Brands",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    industry: "Non-IT",
    category: "Operations",
    experienceLevel: "3-5",
    experienceLabel: "3-5 Years",
    salary: "₦12M - 16M / yr",
    type: "Full-Time",
    tags: ["Logistics", "Inventory", "ERP"],
    description: "Coordinate warehouse operations, inventory accuracy, and distributor fulfillment.",
    featured: false,
  },
  {
    id: "job-7",
    title: "Accounts & Tax Associate",
    company: "Zenith Capital Advisory",
    location: "Mumbai, India",
    country: "India",
    industry: "Non-IT",
    category: "Finance",
    experienceLevel: "0-1",
    experienceLabel: "0-1 Year (Fresher)",
    salary: "₹5 - 7.5 LPA",
    type: "Full-Time",
    tags: ["GST", "Tally", "Excel"],
    description: "Corporate financial accounts preparation and client compliance auditing.",
    featured: false,
  },
  {
    id: "job-8",
    title: "Cloud Infrastructure Architect",
    company: "Horizon Fintech",
    location: "Abuja, Nigeria",
    country: "Nigeria",
    industry: "IT",
    category: "DevOps",
    experienceLevel: "5+",
    experienceLabel: "5+ Years",
    salary: "₦18M - 25M / yr",
    type: "Hybrid",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    description: "Scale high-availability cloud architecture for digital banking infrastructure.",
    featured: true,
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedExp, setSelectedExp] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("General Application");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return ALL_JOBS.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesIndustry =
        selectedIndustry === "All" || job.industry === selectedIndustry;

      const matchesExp =
        selectedExp === "All" || job.experienceLevel === selectedExp;

      const matchesCountry =
        selectedCountry === "All" || job.country === selectedCountry;

      return matchesSearch && matchesIndustry && matchesExp && matchesCountry;
    });
  }, [searchQuery, selectedIndustry, selectedExp, selectedCountry]);

  const handleApplyClick = (title: string) => {
    setSelectedJobTitle(title);
    setIsApplyModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedIndustry("All");
    setSelectedExp("All");
    setSelectedCountry("All");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedIndustry !== "All" || selectedExp !== "All" || selectedCountry !== "All" || searchQuery !== "";

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 pb-32">
      <Header />

      {/* Main Content Area: 25% Left Sidebar + 75% Right Job Cards */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full">
        
        {/* Mobile Filter & Search Bar (Top Compressed View) */}
        <div className="block lg:hidden mb-5 space-y-2.5">
          {/* Compact Mobile Search */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, skills, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 text-xs focus:outline-none focus:border-blue-600 rounded-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {["All", "IT", "Non-IT"].map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border shrink-0 ${
                  selectedIndustry === ind
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {ind === "All" ? "All" : ind}
              </button>
            ))}

            {["All", "0-1", "1-3", "3-5", "5+"].map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => setSelectedExp(exp)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border shrink-0 ${
                  selectedExp === exp
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {exp === "All" ? "Any Exp" : `${exp} yrs`}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 whitespace-nowrap shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Sidebar (25% Width on Desktop) with Top Search Bar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-300 p-5 shadow-xs sticky top-24">
            
            {/* Small Compact Search Bar at Top of Filter Section */}
            <div className="mb-5 pb-5 border-b border-slate-200">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Quick Search
              </span>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Role, skills, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Filters
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* 1. Industry Domain (All / IT / Non-IT) */}
            <div className="mb-5">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Industry
              </span>
              <div className="space-y-1">
                {[
                  { id: "All", label: "All Sectors" },
                  { id: "IT", label: "IT & Software" },
                  { id: "Non-IT", label: "Non-IT & Operations" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIndustry(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold border transition-all text-left ${
                      selectedIndustry === item.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedIndustry === item.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Experience Filter (0 to 5+ years) */}
            <div className="mb-5">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Experience
              </span>
              <div className="space-y-1">
                {[
                  { id: "All", label: "All Experience Levels" },
                  { id: "0-1", label: "0 - 1 Year (Fresher)" },
                  { id: "1-3", label: "1 - 3 Years" },
                  { id: "3-5", label: "3 - 5 Years" },
                  { id: "5+", label: "5+ Years (Senior / Lead)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedExp(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold border transition-all text-left ${
                      selectedExp === item.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedExp === item.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Location / Region */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Location
              </span>
              <div className="space-y-1">
                {[
                  { id: "All", label: "All Locations" },
                  { id: "India", label: "India (Pune / BLR / MUM)" },
                  { id: "Nigeria", label: "Nigeria (Lagos / Abuja)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCountry(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold border transition-all text-left ${
                      selectedCountry === item.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedCountry === item.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Column (75% Width on Desktop): Job Cards */}
          <section className="lg:col-span-9">
            
            {/* Header row */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500">
                <span className="text-slate-900">{filteredJobs.length}</span> Openings Available
              </span>
              <span className="text-slate-400 font-medium hidden sm:inline">
                Click Apply to submit resume directly
              </span>
            </div>

            {/* Empty state */}
            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200">
                <Briefcase className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No matching jobs found</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting the domain or experience filter.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                
                {/* MOBILE VIEW: Ultra-Compact Vertical Cards (Only Job Title, Exp, Location, Apply Button) */}
                <div className="block sm:hidden space-y-2.5">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 bg-white border border-slate-300 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-slate-900 truncate leading-snug">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-0.5 truncate">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            {job.experienceLabel}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyClick(job.title)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>

                {/* DESKTOP VIEW: Full Structured Cards (2 per row on large screens) */}
                <div className="hidden sm:grid sm:grid-cols-2 gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-5 bg-white border border-slate-200 hover:border-slate-900 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                              {job.company}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-0.5">
                              {job.title}
                            </h3>
                          </div>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase border border-slate-200 shrink-0">
                            {job.industry}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {job.experienceLabel}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            {job.location}
                          </span>
                          <span className="font-bold text-slate-800 ml-auto">
                            {job.salary}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {job.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyClick(job.title)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          <span>Apply</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </section>

        </div>

      </div>

      {/* Footer */}
      <Footer />

      {/* Solid Bottom Navigation Dock with Rounded Corners */}
      <FloatingDock onHireClick={() => setIsHireModalOpen(true)} />

      {/* Candidate Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={selectedJobTitle}
      />

      {/* Employer Intake Modal */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />
    </main>
  );
}
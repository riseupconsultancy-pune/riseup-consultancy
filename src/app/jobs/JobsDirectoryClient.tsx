"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import ApplyModal from "@/components/ApplyModal";
import HireModal from "@/components/HireModal";
import { Search, MapPin, Briefcase, Filter, X, ArrowUpRight, Check, SlidersHorizontal, Sparkles } from "lucide-react";

export interface MinimalistJob {
  id: string;
  jobId: string;
  title: string;
  category: string;
  city: string;
  country: string;
  workMode: string;
  expMin: number;
  expMax: number;
  skills: string[];
}

interface JobsDirectoryClientProps {
  initialJobs: MinimalistJob[];
}

export default function JobsDirectoryClient({ initialJobs }: JobsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedExp, setSelectedExp] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("General Application");
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | undefined>(undefined);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(q) ||
        job.city.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));

      const matchesCountry =
        selectedCountry === "All" || job.country.toLowerCase() === selectedCountry.toLowerCase();

      const matchesCategory =
        selectedCategory === "All" || job.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesExp =
        selectedExp === "All"
          ? true
          : selectedExp === "0-1"
          ? job.expMin <= 1
          : selectedExp === "1-3"
          ? (job.expMin <= 3 && job.expMax >= 1)
          : selectedExp === "3-5"
          ? (job.expMin <= 5 && job.expMax >= 3)
          : selectedExp === "5+"
          ? job.expMax >= 5
          : true;

      return matchesSearch && matchesCountry && matchesCategory && matchesExp;
    });
  }, [initialJobs, searchQuery, selectedCountry, selectedCategory, selectedExp]);

  const handleOpenApply = (title: string, id: string) => {
    setSelectedJobTitle(title);
    setSelectedVacancyId(id);
    setIsApplyModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCountry("All");
    setSelectedExp("All");
    setSelectedCategory("All");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCountry !== "All" || selectedExp !== "All" || selectedCategory !== "All" || searchQuery !== "";

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 pb-32">
      <Header />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full">
        {/* Mobile Filter & Search Bar */}
        <div className="block lg:hidden mb-5 space-y-2.5">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search role, skills, or city..."
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-800 rounded-none shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters {hasActiveFilters && "(Active)"}</span>
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2.5 bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-none"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          {/* Left Column: Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-5 bg-white border border-slate-200 p-5 rounded-none shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 font-heading">
                  Filter Openings
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Role, skills, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-600 rounded-none"
                />
              </div>
            </div>

            {/* Operating Region */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Operating Corridor
              </label>
              <div className="space-y-1">
                {["All", "India", "Nigeria"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCountry(c)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between ${
                      selectedCountry.toLowerCase() === c.toLowerCase()
                        ? "bg-slate-900 text-white font-bold"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span>{c === "All" ? "All Corridors" : c}</span>
                    {selectedCountry.toLowerCase() === c.toLowerCase() && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Experience Level
              </label>
              <div className="space-y-1">
                {[
                  { key: "All", label: "Any Experience" },
                  { key: "0-1", label: "Fresher / 0-1 Year" },
                  { key: "1-3", label: "1 - 3 Years" },
                  { key: "3-5", label: "3 - 5 Years" },
                  { key: "5+", label: "5+ Years Executive" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedExp(item.key)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between ${
                      selectedExp === item.key
                        ? "bg-slate-900 text-white font-bold"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedExp === item.key && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Placement Guarantee Callout */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1 rounded-none">
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-blue-800 block">
                100% Free for Candidates
              </span>
              <p className="text-[11px] text-blue-800 leading-snug">
                RiseUp Consultancy never charges registration, processing, or placement fees.
              </p>
            </div>
          </aside>

          {/* Right Column: Minimalist Job Cards Grid */}
          <div className="flex-1 w-full space-y-4">
            {/* Header / Active Count */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="text-xs text-slate-500">
                Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> verified job mandates
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Updated Daily &bull; Direct Sourcing
              </div>
            </div>

            {/* Minimalist Cards List */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center space-y-3 rounded-none">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  No matching jobs found
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting &quot;All Corridors&quot; to view open vacancies.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-none"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredJobs.map((job) => (
                  /* STRICT MINIMALIST JOB CARD (NO COMPANY NAME) */
                  <div
                    key={job.id}
                    className="bg-white border border-slate-200 p-5 rounded-none shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      {/* Job Role Title */}
                      <h3 className="text-base font-extrabold text-slate-900 font-heading leading-tight">
                        {job.title}
                      </h3>

                      {/* Location & Experience Attributes */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          {job.city}, {job.country} ({job.workMode})
                        </span>
                        <span>&bull;</span>
                        <span className="font-semibold text-slate-700">
                          {job.expMin === 0 ? "Fresher Eligible" : `${job.expMin} - ${job.expMax} Years`}
                        </span>
                      </div>

                      {/* Skills Tags (Minimalist Badges) */}
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          {job.skills.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200 rounded-none"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Minimalist Apply Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        {job.jobId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenApply(job.title, job.id)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-2xs"
                      >
                        <span>Apply Now</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <FloatingDock />

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={selectedJobTitle}
        vacancyId={selectedVacancyId}
      />

      {/* Hire Modal */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />
    </main>
  );
}

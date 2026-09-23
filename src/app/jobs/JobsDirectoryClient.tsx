"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import ApplyModal from "@/components/ApplyModal";
import HireModal from "@/components/HireModal";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Filter, 
  X, 
  ArrowUpRight, 
  Check, 
  SlidersHorizontal, 
  Sparkles,
  IndianRupee,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";

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
  description?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  createdAt?: string;
}

interface JobsDirectoryClientProps {
  initialJobs: MinimalistJob[];
}

function formatSalaryAmount(amount: number): string {
  if (amount >= 100000) {
    const inLakhs = amount / 100000;
    return `${inLakhs % 1 === 0 ? inLakhs.toFixed(0) : inLakhs.toFixed(1)} LPA`;
  }
  return amount.toLocaleString("en-IN");
}

function formatSalaryRange(min?: number | null, max?: number | null, currency = "INR"): string {
  const sym = currency === "NGN" ? "₦" : "₹";
  if (min && max) {
    if (min === max) return `${sym} ${formatSalaryAmount(min)}`;
    return `${sym} ${formatSalaryAmount(min)} - ${formatSalaryAmount(max)}`;
  }
  if (min) return `${sym} ${formatSalaryAmount(min)}+`;
  if (max) return `Up to ${sym} ${formatSalaryAmount(max)}`;
  return "";
}

export default function JobsDirectoryClient({ initialJobs }: JobsDirectoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCity = searchParams.get("city");
  const urlCountry = searchParams.get("country");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>(urlCountry || "All");
  const [selectedCity, setSelectedCity] = useState<string>(urlCity || "All");
  const [selectedExp, setSelectedExp] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedJobIds, setExpandedJobIds] = useState<Record<string, boolean>>({});

  const toggleExpandJob = (jobId: string) => {
    setExpandedJobIds((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // Sync state when URL search parameters change
  useEffect(() => {
    if (urlCity) {
      setSelectedCity(urlCity);
    }
    if (urlCountry) {
      setSelectedCountry(urlCountry);
    }
  }, [urlCity, urlCountry]);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("General Application");
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | undefined>(undefined);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  // Available unique cities from jobs
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    initialJobs.forEach((job) => {
      if (job.city) cities.add(job.city);
    });
    return Array.from(cities).sort();
  }, [initialJobs]);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(q) ||
        job.city.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q) ||
        (job.description && job.description.toLowerCase().includes(q)) ||
        job.skills.some((s) => s.toLowerCase().includes(q));

      const matchesCountry =
        selectedCountry === "All" || job.country.toLowerCase() === selectedCountry.toLowerCase();

      const matchesCity =
        selectedCity === "All" || job.city.toLowerCase() === selectedCity.toLowerCase();

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

      return matchesSearch && matchesCountry && matchesCity && matchesCategory && matchesExp;
    });
  }, [initialJobs, searchQuery, selectedCountry, selectedCity, selectedCategory, selectedExp]);

  const handleOpenApply = (title: string, id: string) => {
    setSelectedJobTitle(title);
    setSelectedVacancyId(id);
    setIsApplyModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCountry("All");
    setSelectedCity("All");
    setSelectedExp("All");
    setSelectedCategory("All");
    setSearchQuery("");
    router.push("/jobs");
  };

  const hasActiveFilters =
    selectedCountry !== "All" ||
    selectedCity !== "All" ||
    selectedExp !== "All" ||
    selectedCategory !== "All" ||
    searchQuery !== "";

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Header />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full flex-1">
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-800 rounded-none shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters {hasActiveFilters && "(Active)"}</span>
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2.5 bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-none cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start pb-12">
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
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase cursor-pointer"
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

            {/* Operating Corridor */}
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
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between cursor-pointer ${
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

            {/* City Filter */}
            {availableCities.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Serving City
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity("All");
                      router.push("/jobs");
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCity === "All"
                        ? "bg-slate-900 text-white font-bold"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span>All Cities</span>
                    {selectedCity === "All" && <Check className="w-3 h-3" />}
                  </button>
                  {availableCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city);
                        router.push(`/jobs?city=${encodeURIComponent(city)}`);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCity.toLowerCase() === city.toLowerCase()
                          ? "bg-slate-900 text-white font-bold"
                          : "hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span className="truncate">{city}</span>
                      {selectedCity.toLowerCase() === city.toLowerCase() && <Check className="w-3 h-3 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between cursor-pointer ${
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
            {/* Header / Active Count & Filter Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xs text-slate-500">
                  Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> verified job mandates
                </div>
                {selectedCity !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-none">
                    <MapPin className="w-3 h-3" />
                    City: {selectedCity}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCity("All");
                        router.push("/jobs");
                      }}
                      className="ml-1 hover:text-blue-950 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
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
                  Try clearing your search query or selecting &quot;All Corridors / All Cities&quot; to view open vacancies.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 items-start">
                {filteredJobs.map((job) => {
                  const isExpanded = !!expandedJobIds[job.id];
                  const salaryText = formatSalaryRange(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency || (job.country === "Nigeria" ? "NGN" : "INR")
                  );

                  return (
                    /* COMPREHENSIVE STRUCTURED MINIMALIST JOB CARD */
                    <div
                      key={job.id}
                      className="bg-white border border-slate-200 hover:border-slate-400 p-4 sm:p-5 rounded-none shadow-2xs transition-all flex flex-col justify-between space-y-3.5 group"
                    >
                      <div className="space-y-2.5">
                        {/* Top Line: Category & Work Mode Badges */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200 rounded-none">
                            {job.category}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-none">
                            {job.workMode}
                          </span>
                        </div>

                        {/* Job Role Title */}
                        <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-tight group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>

                        {/* Structured Quick Specs Strip */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{job.city}, {job.country}</span>
                          </span>

                          <span className="text-slate-300">&bull;</span>

                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{job.expMin === 0 ? "Fresher Eligible" : `${job.expMin} - ${job.expMax} Years`}</span>
                          </span>

                          {salaryText && (
                            <>
                              <span className="text-slate-300">&bull;</span>
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{salaryText} <span className="font-normal text-slate-400 text-[11px]">/ yr</span></span>
                              </span>
                            </>
                          )}
                        </div>

                        {/* Skills Chips (Minimalist Badges) */}
                        {job.skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            {job.skills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 border border-slate-200 rounded-none"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Expandable Job Description with Read More / Chevron Toggle */}
                        {job.description && (
                          <div className="pt-2 border-t border-slate-100">
                            {isExpanded ? (
                              <div className="space-y-2 animate-fadeIn">
                                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                                  {job.description}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleExpandJob(job.id)}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1"
                                >
                                  <span>Show less</span>
                                  <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                                  {job.description}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleExpandJob(job.id)}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer py-0.5"
                                >
                                  <span>Read more</span>
                                  <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Footer (Structured & Mobile Friendly) */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-slate-400">
                            {job.jobId}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-none">
                            Free Placement
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenApply(job.title, job.id)}
                          className="w-full min-[420px]:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-2xs cursor-pointer min-h-[36px]"
                        >
                          <span>Apply Now</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <FloatingDock />

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md p-5 border border-slate-300 rounded-none space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Filter Openings
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operating Corridor */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Operating Corridor
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {["All", "India", "Nigeria"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCountry(c)}
                    className={`py-2 text-xs font-semibold rounded-none border text-center ${
                      selectedCountry.toLowerCase() === c.toLowerCase()
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            {availableCities.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Serving City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-xs rounded-none"
                >
                  <option value="All">All Cities</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Experience */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Experience
              </label>
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-xs rounded-none"
              >
                <option value="All">Any Experience</option>
                <option value="0-1">Fresher / 0-1 Year</option>
                <option value="1-3">1 - 3 Years</option>
                <option value="3-5">3 - 5 Years</option>
                <option value="5+">5+ Years Executive</option>
              </select>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-none border border-slate-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-none"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

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

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
    <main suppressHydrationWarning className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 w-full flex-1">
        {/* Mobile Filter & Search Bar */}
        <div className="block lg:hidden mb-4 space-y-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search role, skills, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-blue-400 text-xs font-bold uppercase tracking-wider text-slate-800 rounded-xl shadow-2xs cursor-pointer transition-all active:scale-[0.99]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters {hasActiveFilters && "(Active)"}</span>
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start pb-16">
          {/* Left Column: Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-6 bg-gradient-to-b from-white via-slate-50/60 to-blue-50/20 border border-slate-200/80 p-6 rounded-2xl shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
                  Filter Openings
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase cursor-pointer transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Role, skills, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200/80 text-xs focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* Operating Corridor */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                Operating Corridor
              </label>
              <div className="space-y-1.5">
                {["All", "India", "Nigeria"].map((c) => {
                  const isActive = selectedCountry.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCountry(c)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs"
                          : "hover:bg-white text-slate-700 font-medium"
                      }`}
                    >
                      <span>{c === "All" ? "All Corridors" : c}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City Filter */}
            {availableCities.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Serving City
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity("All");
                      router.push("/jobs");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      selectedCity === "All"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs"
                        : "hover:bg-white text-slate-700 font-medium"
                    }`}
                  >
                    <span>All Cities</span>
                    {selectedCity === "All" && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                  {availableCities.map((city) => {
                    const isActive = selectedCity.toLowerCase() === city.toLowerCase();
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city);
                          router.push(`/jobs?city=${encodeURIComponent(city)}`);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs"
                            : "hover:bg-white text-slate-700 font-medium"
                        }`}
                      >
                        <span className="truncate">{city}</span>
                        {isActive && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Experience Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                Experience Level
              </label>
              <div className="space-y-1.5">
                {[
                  { key: "All", label: "Any Experience" },
                  { key: "0-1", label: "Fresher / 0-1 Year" },
                  { key: "1-3", label: "1 - 3 Years" },
                  { key: "3-5", label: "3 - 5 Years" },
                  { key: "5+", label: "5+ Years Executive" },
                ].map((item) => {
                  const isActive = selectedExp === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedExp(item.key)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs"
                          : "hover:bg-white text-slate-700 font-medium"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Minimalist Job Cards Grid */}
          <div className="flex-1 w-full space-y-5">
            {/* Header / Active Count & Filter Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200/80 gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="text-xs text-slate-600">
                  Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> verified job mandates
                </div>
                {selectedCity !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] font-bold rounded-full shadow-2xs">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>City: {selectedCity}</span>
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
              <div className="text-[11px] text-slate-400 font-mono bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
                Updated Daily • Direct Sourcing
              </div>
            </div>

            {/* Minimalist Cards List */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-slate-200/80 p-12 text-center space-y-4 rounded-3xl shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  No matching jobs found
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Try clearing your search query or selecting &quot;All Corridors / All Cities&quot; to view open vacancies.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-5 items-start">
                {filteredJobs.map((job) => {
                  const isExpanded = !!expandedJobIds[job.id];
                  const salaryText = formatSalaryRange(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency || (job.country === "Nigeria" ? "NGN" : "INR")
                  );

                  return (
                    /* SLIM, HIGH-DENSITY ULTRA-PREMIUM JOB CARD */
                    <div
                      key={job.id}
                      className="group relative bg-white sm:bg-gradient-to-b sm:from-white sm:via-slate-50/70 sm:to-blue-50/20 border border-slate-200/90 hover:border-blue-400/70 hover:shadow-md p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xs transition-all duration-200 flex flex-col justify-between overflow-hidden min-w-0 w-full h-auto self-start"
                    >
                      {/* Top Sheen */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

                      <div className="space-y-2 sm:space-y-3 min-w-0 w-full">
                        {/* Top Line: Category, Work Mode Badges & Job ID */}
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100 sm:bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md sm:rounded-full shrink-0">
                              {job.category}
                            </span>
                            <span className="text-[9.5px] sm:text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md sm:rounded-full shrink-0">
                              {job.workMode}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 shrink-0">
                            {job.jobId}
                          </span>
                        </div>

                        {/* Job Role Title - Strictly 1 line with ellipsis across all views to maintain card sizing consistency */}
                        <h3
                          title={job.title}
                          className="text-sm sm:text-base md:text-lg font-bold sm:font-black text-slate-900 font-heading leading-tight group-hover:text-blue-600 transition-colors truncate whitespace-nowrap overflow-hidden text-ellipsis block w-full min-w-0"
                        >
                          {job.title}
                        </h3>

                        {/* Structured Quick Specs Strip */}
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                            <span>{job.city}, {job.country}</span>
                          </span>

                          <span className="text-slate-300">•</span>

                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                            <span>{job.expMin === 0 ? "Fresher" : `${job.expMin}-${job.expMax} Yrs`}</span>
                          </span>

                          {salaryText && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                                <span>{salaryText} <span className="font-normal text-slate-400 text-[10px] sm:text-[11px]">/ yr</span></span>
                              </span>
                            </>
                          )}
                        </div>

                        {/* Skills Chips (Compact) */}
                        {job.skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
                            {job.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] sm:text-[10px] font-medium sm:font-semibold bg-slate-50 sm:bg-white text-slate-600 px-1.5 sm:px-2 py-0.5 border border-slate-200/80 rounded-md sm:rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="text-[9px] text-slate-400 font-medium">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Expandable Job Description */}
                        {job.description && (
                          <div className="pt-1.5 sm:pt-2 border-t border-slate-100">
                            {isExpanded ? (
                              <div className="space-y-1.5 animate-fadeIn p-2.5 sm:p-3 bg-slate-50/80 sm:bg-white/80 rounded-lg sm:rounded-xl border border-slate-100">
                                <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                                  {job.description}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleExpandJob(job.id)}
                                  className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-0.5"
                                >
                                  <span>Show less</span>
                                  <ChevronUp className="w-3 h-3 text-slate-500" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 leading-normal font-normal flex-1">
                                  {job.description}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleExpandJob(job.id)}
                                  className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer shrink-0 py-0.5"
                                >
                                  <span>Details</span>
                                  <ChevronDown className="w-3 h-3 text-blue-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Footer - Always single-row on mobile */}
                      <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md sm:rounded-full whitespace-nowrap">
                            100% Free Placement
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenApply(job.title, job.id)}
                          className="inline-flex items-center justify-center gap-1 px-3.5 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer min-h-[32px] sm:min-h-[38px] whitespace-nowrap"
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
          <div className="bg-white w-full sm:max-w-md p-6 border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Filter Openings
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operating Corridor */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                Operating Corridor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["All", "India", "Nigeria"].map((c) => {
                  const isActive = selectedCountry.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCountry(c)}
                      className={`py-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City */}
            {availableCities.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Serving City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                Experience
              </label>
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
              >
                <option value="All">Any Experience</option>
                <option value="0-1">Fresher / 0-1 Year</option>
                <option value="1-3">1 - 3 Years</option>
                <option value="3-5">3 - 5 Years</option>
                <option value="5+">5+ Years Executive</option>
              </select>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/25 transition-all"
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

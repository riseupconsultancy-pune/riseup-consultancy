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
    title: "Senior React & Node.js Developer",
    company: "TechNova Cloud Systems",
    location: "Pune, India",
    country: "India",
    industry: "IT",
    category: "Full Stack Engineering",
    experienceLevel: "3-5",
    experienceLabel: "3-5 Years",
    salary: "₹14 - 20 LPA",
    type: "Full-Time",
    tags: ["React", "Node.js", "TypeScript", "Next.js"],
    description: "Lead front-end architecture and API integration for our enterprise SaaS product.",
    featured: true,
  },
  {
    id: "job-2",
    title: "Junior Software Engineer (Fresher)",
    company: "InnoVenture Labs",
    location: "Pune, India",
    country: "India",
    industry: "IT",
    category: "Software Development",
    experienceLevel: "0-1",
    experienceLabel: "0-1 Year (Fresher)",
    salary: "₹4.5 - 6.5 LPA",
    type: "Full-Time",
    tags: ["JavaScript", "Python", "SQL", "Git"],
    description: "Great starting role for fresh computer science graduates eager to work in cloud systems.",
    featured: false,
  },
  {
    id: "job-3",
    title: "Corporate HR Business Partner",
    company: "Apex Global Retail",
    location: "Pune, India",
    country: "India",
    industry: "Non-IT",
    category: "Human Resources",
    experienceLevel: "3-5",
    experienceLabel: "3-5 Years",
    salary: "₹8 - 12 LPA",
    type: "Full-Time",
    tags: ["Talent Acquisition", "HRMS", "Compliance"],
    description: "Drive end-to-end recruitment pipelines and team performance management.",
    featured: true,
  },
  {
    id: "job-4",
    title: "Commercial Sales Executive",
    company: "Sahara Logistics PLC",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    industry: "Non-IT",
    category: "B2B Sales",
    experienceLevel: "1-3",
    experienceLabel: "1-3 Years",
    salary: "₦6M - 9M / yr",
    type: "On-Site",
    tags: ["Lead Generation", "Client Acquisition", "B2B"],
    description: "Expand corporate commercial client accounts across regional shipping hubs.",
    featured: true,
  },
  {
    id: "job-5",
    title: "Python Backend & AI Engineer",
    company: "DataStream Systems",
    location: "Bengaluru, India",
    country: "India",
    industry: "IT",
    category: "Backend & Data",
    experienceLevel: "1-3",
    experienceLabel: "1-3 Years",
    salary: "₹10 - 15 LPA",
    type: "Hybrid",
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    description: "Design high-performance microservices and AI agent workflows.",
    featured: false,
  },
  {
    id: "job-6",
    title: "Operations & Supply Chain Supervisor",
    company: "WestAfrica Consumer Brands",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    industry: "Non-IT",
    category: "Operations",
    experienceLevel: "3-5",
    experienceLabel: "3-5 Years",
    salary: "₦12M - 16M / yr",
    type: "Full-Time",
    tags: ["Warehouse Logistics", "Vendor Management", "ERP"],
    description: "Oversee inventory flow, fleet coordination, and distributor compliance.",
    featured: false,
  },
  {
    id: "job-7",
    title: "Financial Planning & Accounts Associate",
    company: "Zenith Capital Advisory",
    location: "Mumbai, India",
    country: "India",
    industry: "Non-IT",
    category: "Finance & Accounting",
    experienceLevel: "0-1",
    experienceLabel: "0-1 Year (Fresher)",
    salary: "₹5 - 7.5 LPA",
    type: "Full-Time",
    tags: ["Tally", "GST", "Financial Modeling", "Excel"],
    description: "Direct entry for B.Com / MBA finance graduates seeking corporate advisory practice.",
    featured: false,
  },
  {
    id: "job-8",
    title: "Senior DevOps & Cloud Architect",
    company: "Horizon Fintech",
    location: "Abuja, Nigeria",
    country: "Nigeria",
    industry: "IT",
    category: "Infrastructure",
    experienceLevel: "5+",
    experienceLabel: "5+ Years",
    salary: "₦18M - 25M / yr",
    type: "Hybrid",
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    description: "Architect high-availability payment gateway infrastructure across Pan-African nodes.",
    featured: true,
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedExp, setSelectedExp] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("General Application");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return ALL_JOBS.filter((job) => {
      // Keyword search
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Industry filter (All / IT / Non-IT)
      const matchesIndustry =
        selectedIndustry === "All" || job.industry === selectedIndustry;

      // Experience filter
      const matchesExp =
        selectedExp === "All" || job.experienceLevel === selectedExp;

      // Country filter
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

      {/* Hero Header Banner */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Verified Career Mandates
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore Open Vacancies
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
            Browse corporate vacancies directly commissioned to RiseUp Consultancy by enterprise partners in India and Nigeria.
          </p>

          {/* Search Input */}
          <div className="mt-6 relative max-w-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, skills, keywords, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area: 25% Left Filters + 75% Right Job Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Mobile Filter Bar (Compressed horizontally on top for mobile screens) */}
        <div className="block lg:hidden mb-6">
          <div className="flex items-center justify-between gap-2 p-3 bg-white border border-slate-200 shadow-xs mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Filters & Refinements
              </span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider"
            >
              {mobileFilterOpen ? "Close" : "Filter Options"}
            </button>
          </div>

          {/* Quick horizontal category pills on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", "IT", "Non-IT"].map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 text-xs font-bold whitespace-nowrap border shrink-0 ${
                  selectedIndustry === ind
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {ind === "All" ? "All Domains" : ind}
              </button>
            ))}

            {["All", "0-1", "1-3", "3-5"].map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => setSelectedExp(exp)}
                className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap border shrink-0 ${
                  selectedExp === exp
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {exp === "All" ? "Any Exp" : `${exp} yrs`}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar (25% Width on Desktop) */}
          <aside
            className={`lg:col-span-3 lg:block ${
              mobileFilterOpen ? "block" : "hidden"
            } bg-white border border-slate-300 p-6 shadow-xs sticky top-24`}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Filter Vacancies
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Filter 1: Industry / Domain (IT vs Non-IT) */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Domain / Sector
              </h4>
              <div className="space-y-1.5">
                {[
                  { id: "All", label: "All Sectors" },
                  { id: "IT", label: "IT & Software" },
                  { id: "Non-IT", label: "Non-IT / Operations" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIndustry(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold border transition-all text-left ${
                      selectedIndustry === item.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedIndustry === item.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: Experience (0 to 5+ years) */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Experience Level
              </h4>
              <div className="space-y-1.5">
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
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold border transition-all text-left ${
                      selectedExp === item.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedExp === item.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: Country */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Region / Country
              </h4>
              <div className="space-y-1.5">
                {[
                  { id: "All", label: "All Locations" },
                  { id: "India", label: "India (Pune / Mumbai / BLR)" },
                  { id: "Nigeria", label: "Nigeria (Lagos / Abuja)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCountry(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold border transition-all text-left ${
                      selectedCountry === item.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedCountry === item.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Column (75% Width on Desktop): Job Cards List */}
          <section className="lg:col-span-9">
            
            {/* Header / Stats row */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Showing <span className="text-slate-900">{filteredJobs.length}</span> Verified Positions
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Updated Daily • Direct Client Interviews
              </span>
            </div>

            {/* Job Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No matching openings found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your domain or experience filters, or submit a general application to join our talent pool.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 sm:p-7 bg-white border border-slate-200 hover:border-slate-900 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                              {job.company}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 uppercase border border-slate-200">
                              {job.industry}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">
                            {job.title}
                          </h3>
                        </div>

                        {job.featured && (
                          <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shrink-0">
                            Priority
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-5">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {job.experienceLabel}
                        </span>
                        <span className="font-bold text-slate-900">
                          {job.salary}
                        </span>
                      </div>

                      {/* Tag badges */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Apply Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {job.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleApplyClick(job.title)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <span>Apply Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </section>

        </div>

      </div>

      {/* Footer */}
      <Footer />

      {/* Liquid Glass Bottom Dock */}
      <FloatingDock onHireClick={() => setIsHireModalOpen(true)} />

      {/* Candidate Apply Modal with 2MB PDF Upload */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={selectedJobTitle}
      />

      {/* Employer Requirement Intake Modal */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />
    </main>
  );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Link2, 
  Copy, 
  Check, 
  Share2, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Power,
  Sparkles,
  MessageSquare,
  DollarSign
} from "lucide-react";
import { generateHrPublicLinkAction, toggleHrPublicLinkStatusAction } from "@/app/actions/hr-actions";

interface HrLinkData {
  id: string;
  uniqueSlug: string;
  status: string;
  clickCount: number;
  url: string;
}

interface VacancyItem {
  id: string;
  jobId: string;
  title: string;
  category: string;
  country: string;
  city: string;
  workMode: string;
  shift: string;
  headcount: number;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  expMin: number;
  expMax: number;
  availabilityRequired: string;
  description: string;
  requirements: string | null;
  companyName: string;
  myApplicationsCount: number;
  link: HrLinkData | null;
}

interface HrVacanciesDeskProps {
  vacancies: VacancyItem[];
  recruiterName: string;
  employeeCode: string;
}

export default function HrVacanciesDesk({ vacancies: initialVacancies, recruiterName, employeeCode }: HrVacanciesDeskProps) {
  const [vacancies, setVacancies] = useState<VacancyItem[]>(initialVacancies);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const filteredVacancies = vacancies.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || v.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleGenerateLink = async (vacancyId: string) => {
    setActionLoadingId(vacancyId);
    setFeedbackMessage(null);

    try {
      const res = await generateHrPublicLinkAction(vacancyId);
      if (res.success && res.link) {
        setVacancies((prev) =>
          prev.map((v) => (v.id === vacancyId ? { ...v, link: res.link! } : v))
        );
        setFeedbackMessage({ text: res.message || "Tracked link generated!", type: "success" });
      } else {
        setFeedbackMessage({ text: res.error || "Failed to generate link.", type: "error" });
      }
    } catch {
      setFeedbackMessage({ text: "Network error while generating link.", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleLinkStatus = async (linkId: string, currentStatus: string, vacancyId: string) => {
    setActionLoadingId(vacancyId);
    setFeedbackMessage(null);

    const targetStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";

    try {
      const res = await toggleHrPublicLinkStatusAction(linkId, targetStatus);
      if (res.success) {
        setVacancies((prev) =>
          prev.map((v) =>
            v.id === vacancyId && v.link
              ? { ...v, link: { ...v.link, status: targetStatus } }
              : v
          )
        );
        setFeedbackMessage({ text: res.message || `Link ${targetStatus}`, type: "success" });
      } else {
        setFeedbackMessage({ text: res.error || "Failed to update link.", type: "error" });
      }
    } catch {
      setFeedbackMessage({ text: "Network error updating link.", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyLink = (uniqueSlug: string) => {
    const fullUrl = `${window.location.origin}/apply/${uniqueSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(uniqueSlug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleShareWhatsApp = (vacancy: VacancyItem, uniqueSlug: string) => {
    const fullUrl = `${window.location.origin}/apply/${uniqueSlug}`;
    const message = `*Hiring Alert via RiseUp Consultancy*\n\nRole: ${vacancy.title}\nLocation: ${vacancy.city} (${vacancy.workMode})\nShift: ${vacancy.shift}\n\n*Apply Here (100% Free):*\n${fullUrl}\n\n_Referred by: ${recruiterName} | RiseUp Consultancy_`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Recruiter Sourcing Desk &bull; {employeeCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Live Openings & Tracked Sourcing Links
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate your personalized application links. Every candidate applying through your link automatically lands in your personal ATS pipeline with your official referral code.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 self-start sm:self-auto text-xs">
          <div className="text-[10px] uppercase font-bold text-blue-700">Your Official Referral Code</div>
          <div className="font-extrabold text-slate-900 mt-0.5">
            Referral: {recruiterName} | RiseUp Consultancy
          </div>
        </div>
      </div>

      {/* Global Action Feedback Notification */}
      {feedbackMessage && (
        <div
          className={`p-4 border-l-4 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-600 text-emerald-900"
              : "bg-rose-50 border-rose-600 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-bold uppercase hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search openings by title, Job ID (e.g. RUP-JOB-1001), category, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "ALL", label: "All Openings" },
            { key: "Voice", label: "Voice BPO" },
            { key: "Non-Voice", label: "Non-Voice" },
            { key: "Back Office", label: "Back Office" },
            { key: "IT", label: "IT / Tech" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCategoryFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-colors ${
                categoryFilter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vacancies Grid */}
      {filteredVacancies.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No active openings broadcasted
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== "ALL"
              ? "No job openings match your current search or category filter."
              : "When RiseUp Super Admin broadcasts new hiring mandates to recruiters, they will appear here immediately."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVacancies.map((vacancy) => {
            const hasLink = !!vacancy.link;
            const isLinkActive = vacancy.link?.status === "ACTIVE";

            return (
              <div
                key={vacancy.id}
                className="bg-white border border-slate-200 rounded-none shadow-xs p-5 sm:p-6 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left Column: Job Details */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 border border-slate-200">
                        {vacancy.jobId}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Broadcasted Live
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Quota: <strong>{vacancy.headcount} Openings</strong>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                        {vacancy.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                        <span className="font-semibold text-slate-800">{vacancy.category}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {vacancy.city}, {vacancy.country} ({vacancy.workMode})
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {vacancy.shift}
                        </span>
                      </div>
                    </div>

                    {/* Brief description snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vacancy.description}
                    </p>

                    {/* Meta highlights */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Experience: <strong>{vacancy.expMin}-{vacancy.expMax} Years</strong></span>
                      <span>&bull;</span>
                      <span>Availability: <strong>{vacancy.availabilityRequired}</strong></span>
                      {vacancy.salaryMin && vacancy.salaryMax && (
                        <>
                          <span>&bull;</span>
                          <span>
                            Salary: <strong>{vacancy.salaryCurrency} {vacancy.salaryMin.toLocaleString()} - {vacancy.salaryMax.toLocaleString()}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Sourcing Link Controls */}
                  <div className="bg-slate-50 p-4 border border-slate-200 lg:w-96 shrink-0 space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                      <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-blue-600" />
                        My Sourcing Channel
                      </span>
                      {hasLink && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                            isLinkActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {isLinkActive ? "Active" : "Paused"}
                        </span>
                      )}
                    </div>

                    {hasLink && vacancy.link ? (
                      <div className="space-y-3">
                        {/* URL Box */}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Your Unique Application URL
                          </div>
                          <div className="bg-white border border-slate-300 p-2 text-xs font-mono text-slate-800 truncate select-all">
                            /apply/{vacancy.link.uniqueSlug}
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-white p-2 border border-slate-200">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Applications</div>
                            <div className="text-base font-extrabold text-blue-600 font-heading">
                              {vacancy.myApplicationsCount}
                            </div>
                          </div>
                          <div className="bg-white p-2 border border-slate-200">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Clicks</div>
                            <div className="text-base font-extrabold text-slate-800 font-heading">
                              {vacancy.link.clickCount}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleCopyLink(vacancy.link!.uniqueSlug)}
                            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs"
                          >
                            {copiedSlug === vacancy.link.uniqueSlug ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleShareWhatsApp(vacancy, vacancy.link!.uniqueSlug)}
                            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                          <Link
                            href={`/apply/${vacancy.link.uniqueSlug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                          >
                            <span>Open Preview</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={() =>
                              handleToggleLinkStatus(
                                vacancy.link!.id,
                                vacancy.link!.status,
                                vacancy.id
                              )
                            }
                            disabled={actionLoadingId === vacancy.id}
                            className="text-slate-500 hover:text-slate-800 font-semibold"
                          >
                            {isLinkActive ? "Pause Link" : "Reactivate"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 py-2">
                        <p className="text-xs text-slate-600 leading-snug">
                          Generate a dedicated tracked application link for this opening to start sourcing candidates across WhatsApp & LinkedIn.
                        </p>
                        <button
                          onClick={() => handleGenerateLink(vacancy.id)}
                          disabled={actionLoadingId === vacancy.id}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{actionLoadingId === vacancy.id ? "Generating..." : "1-Click Generate Sourcing Link"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

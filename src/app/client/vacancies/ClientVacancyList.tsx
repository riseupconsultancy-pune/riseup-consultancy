"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  PlusCircle, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Radio,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import { toggleClientVacancyStatusAction } from "@/app/actions/client-actions";

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
  status: string;
  isBroadcastedToHR: boolean;
  isPostedOnWebsite: boolean;
  createdAt: string;
  totalCandidates: number;
  interviewCount: number;
  selectedCount: number;
}

interface ClientVacancyListProps {
  vacancies: VacancyItem[];
}

export default function ClientVacancyList({ vacancies: initialVacancies }: ClientVacancyListProps) {
  const [vacancies, setVacancies] = useState<VacancyItem[]>(initialVacancies);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const filteredVacancies = vacancies.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
        ? v.status === "ACTIVE"
        : statusFilter === "PENDING_REVIEW"
        ? v.status === "PENDING_REVIEW"
        : statusFilter === "CLOSED"
        ? v.status === "CLOSED" || v.status === "DISABLED"
        : statusFilter === "FULFILLED"
        ? v.status === "FULFILLED"
        : true;

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (vacancyId: string, currentStatus: string) => {
    setLoadingId(vacancyId);
    setActionMessage(null);

    const targetStatus = currentStatus === "ACTIVE" ? "CLOSED" : "ACTIVE";

    try {
      const res = await toggleClientVacancyStatusAction(vacancyId, targetStatus);
      if (res.success) {
        setVacancies((prev) =>
          prev.map((v) => (v.id === vacancyId ? { ...v, status: targetStatus } : v))
        );
        setActionMessage(res.message || `Status updated to ${targetStatus}`);
      } else {
        setActionMessage(res.error || "Failed to update status");
      }
    } catch {
      setActionMessage("Network error updating vacancy status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Corporate Client Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Posted Vacancies & Recruitment Mandates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your open hiring requirements, track recruitment progress, and review candidate applications.
          </p>
        </div>

        <Link
          href="/client/vacancies/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Vacancy</span>
        </Link>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="p-4 bg-blue-50 border-l-4 border-blue-600 text-blue-900 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn">
          <span>{actionMessage}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold uppercase text-blue-700 hover:text-blue-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, ID (e.g. RUP-JOB-1001), category, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs text-slate-900 font-medium rounded-none focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "ALL", label: "All Mandates" },
            { key: "ACTIVE", label: "Active" },
            { key: "PENDING_REVIEW", label: "Pending Review" },
            { key: "CLOSED", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-colors ${
                statusFilter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vacancies Grid / List */}
      {filteredVacancies.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No vacancies found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL"
              ? "No job vacancies match your search criteria or status filter."
              : "You have not submitted any recruitment vacancy requests yet."}
          </p>
          <Link
            href="/client/vacancies/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Vacancy</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVacancies.map((vacancy) => {
            const isPending = vacancy.status === "PENDING_REVIEW";
            const isActive = vacancy.status === "ACTIVE";
            const isClosed = vacancy.status === "CLOSED" || vacancy.status === "DISABLED";
            const isFulfilled = vacancy.status === "FULFILLED";

            return (
              <div
                key={vacancy.id}
                className="bg-white border border-slate-200 rounded-none shadow-xs p-5 sm:p-6 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Job Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 border border-slate-200">
                        {vacancy.jobId}
                      </span>

                      {/* Status Badges */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5">
                          <AlertCircle className="w-3 h-3" />
                          Pending Admin Review
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Active & Recruiting
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5">
                          <XCircle className="w-3 h-3" />
                          Closed / Paused
                        </span>
                      )}
                      {isFulfilled && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Quota Fulfilled
                        </span>
                      )}

                      {/* Recruiter Broadcast Indicator */}
                      {vacancy.isBroadcastedToHR && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5">
                          <Radio className="w-2.5 h-2.5 animate-pulse" />
                          Recruiters Active
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                      {vacancy.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
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

                  {/* Middle Column: Hiring Progress Metrics */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 border border-slate-200 text-center shrink-0">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Target Quota
                      </div>
                      <div className="text-base font-extrabold text-slate-900 font-heading">
                        {vacancy.headcount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Scheduled
                      </div>
                      <div className="text-base font-extrabold text-indigo-700 font-heading">
                        {vacancy.interviewCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Selected
                      </div>
                      <div className="text-base font-extrabold text-emerald-700 font-heading">
                        {vacancy.selectedCount}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                    <Link
                      href={`/client/candidates?vacancyId=${vacancy.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs text-center"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Review Candidates ({vacancy.interviewCount})</span>
                    </Link>

                    {!isPending && (
                      <button
                        onClick={() => handleToggleStatus(vacancy.id, vacancy.status)}
                        disabled={loadingId === vacancy.id}
                        className={`inline-flex items-center justify-center gap-1 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-none border text-center ${
                          isActive
                            ? "bg-white hover:bg-rose-50 border-rose-200 text-rose-700"
                            : "bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700"
                        }`}
                      >
                        {loadingId === vacancy.id ? (
                          "Updating..."
                        ) : isActive ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Close Mandate</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Reactivate Mandate</span>
                          </>
                        )}
                      </button>
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

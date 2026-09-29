import React from "react";
import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Radio
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = params.range || "today";

  const now = new Date();
  let filterDate = new Date();

  if (range === "today") {
    filterDate.setHours(0, 0, 0, 0);
  } else if (range === "week") {
    filterDate.setDate(now.getDate() - 7);
  } else if (range === "month") {
    filterDate.setDate(now.getDate() - 30);
  }

  // 15 minutes ago for Online HR presence
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Fetch Live Metrics in Parallel
  const [
    totalHRs,
    hrsLoggedInToday,
    hrsOnlineNow,
    totalClients,
    totalVacancies,
    activeBroadcastedVacancies,
    websitePublishedVacancies,
    totalCandidatesSourced,
    candidatesGoingForInterview,
    candidatesInterviewed,
    candidatesSelected,
    candidatesRejected,
    candidatesAbsent,
    recentCandidates,
    hrTeamList,
    newInquiriesCount,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "HR_RECRUITER", status: "ACTIVE" } }),
    prisma.user.count({ 
      where: { 
        role: "HR_RECRUITER", 
        lastLoginAt: { gte: startOfToday } 
      } 
    }),
    prisma.user.count({ 
      where: { 
        role: "HR_RECRUITER", 
        lastActiveAt: { gte: fifteenMinutesAgo } 
      } 
    }),
    prisma.clientProfile.count(),
    prisma.vacancy.count(),
    prisma.vacancy.count({ where: { status: "ACTIVE", isBroadcastedToHR: true } }),
    prisma.vacancy.count({ where: { status: "ACTIVE", isPostedOnWebsite: true } }),
    prisma.candidate.count({ where: { createdAt: { gte: filterDate } } }),
    prisma.candidate.count({ where: { status: "GOING_FOR_INTERVIEW", updatedAt: { gte: filterDate } } }),
    prisma.candidate.count({ where: { status: "INTERVIEWED", updatedAt: { gte: filterDate } } }),
    prisma.candidate.count({ where: { status: "SELECTED", updatedAt: { gte: filterDate } } }),
    prisma.candidate.count({ where: { status: "REJECTED", updatedAt: { gte: filterDate } } }),
    prisma.candidate.count({ where: { status: "ABSENT", updatedAt: { gte: filterDate } } }),
    prisma.candidate.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        vacancy: { select: { title: true, city: true } },
        hr: { include: { user: { select: { fullName: true } } } },
      },
    }),
    prisma.user.findMany({
      where: { role: "HR_RECRUITER" },
      take: 6,
      orderBy: { lastActiveAt: "desc" },
      include: { hrProfile: true },
    }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  const hrsAbsentToday = Math.max(0, totalHRs - hrsLoggedInToday);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Title Bar & Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full mb-2 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Operations Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Executive Master Dashboard
          </h1>
        </div>

        {/* Rounded Pill Segmented Buttons */}
        <div className="flex items-center p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs self-start sm:self-auto">
          {[
            { id: "today", label: "Today" },
            { id: "week", label: "This Week" },
            { id: "month", label: "This Month" },
          ].map((tab) => {
            const isActive = range === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/dashboard?range=${tab.id}`}
                className={`px-3.5 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* New Inquiries Action Alert Banner */}
      {newInquiriesCount > 0 && (
        <div className="p-5 bg-gradient-to-r from-rose-50/90 via-pink-50/40 to-rose-50/90 border border-rose-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-rose-950">
                Action Required: {newInquiriesCount} New Website Talent Request{newInquiriesCount > 1 ? "s" : ""} / Inquiry Awaiting Response
              </div>
              <div className="text-[11px] text-rose-700/90 font-medium">
                Prospective corporate clients and candidates submitted direct intake mandates through the public website.
              </div>
            </div>
          </div>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-md shadow-rose-600/20 shrink-0 cursor-pointer active:scale-[0.98]"
          >
            <span>Open Inquiries Desk</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* SECTION 1: Real-Time HR Presence & Attendance Tracker */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-heading">
              Live HR Workforce Presence
            </h2>
          </div>
          <Link
            href="/admin/recruiters"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>Manage Recruiter Team</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200/80 px-2 py-0.5 rounded-full inline-block mb-1 shadow-2xs">Total Recruiters</div>
            <div className="mt-1 text-2xl sm:text-4xl font-black text-slate-900 font-heading">{totalHRs}</div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">Active staffing team</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/25 border border-emerald-200/80 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs">Online Now</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="mt-1 text-2xl sm:text-4xl font-black text-emerald-700 font-heading">{hrsOnlineNow}</div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">Active in last 15 min</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/25 border border-blue-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full inline-block mb-1 shadow-2xs">Present Today</div>
            <div className="mt-1 text-2xl sm:text-4xl font-black text-blue-700 font-heading">{hrsLoggedInToday}</div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">Logged in today</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-amber-50/25 border border-amber-200/80 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-600/5 transition-all duration-300 rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block mb-1 shadow-2xs">Absent Today</div>
            <div className="mt-1 text-2xl sm:text-4xl font-black text-amber-700 font-heading">{hrsAbsentToday}</div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">No login recorded yet</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Candidate Pipeline KPIs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-heading">
            Candidate Pipeline Metrics ({range.toUpperCase()})
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Leads Sourced</div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 font-heading">{totalCandidatesSourced}</div>
            <div className="mt-1 text-[10.5px] text-slate-400 font-medium">All HR links + Web</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-purple-50/20 border border-slate-200/80 hover:border-purple-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Interview Scheduled</div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-black text-purple-700 font-heading">{candidatesGoingForInterview}</div>
            <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Approved by HR</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-sky-50/20 border border-slate-200/80 hover:border-sky-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Interviewed</div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-black text-sky-700 font-heading">{candidatesInterviewed}</div>
            <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Evaluated by client</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/20 border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Selected</div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-black text-emerald-700 font-heading">{candidatesSelected}</div>
            <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Confirmed offers</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-rose-50/20 border border-slate-200/80 hover:border-rose-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Rejected</div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-black text-rose-700 font-heading">{candidatesRejected}</div>
            <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Client evaluated</div>
          </div>

          <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-slate-50 border border-slate-200/80 hover:border-slate-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Absent / No-Show</div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-700 font-heading">{candidatesAbsent}</div>
            <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Missed interview</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Mandates & Broadcast Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="group relative bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 p-6 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-3xl shadow-2xs flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                Client Accounts
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">{totalClients}</div>
            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
              Corporate partner organizations with active hiring mandates across India and Nigeria corridors.
            </p>
          </div>
          <Link
            href="/admin/clients"
            className="mt-6 pt-4 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors"
          >
            <span>View Client Accounts</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
            </div>
          </Link>
        </div>

        <div className="group relative bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 p-6 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-3xl shadow-2xs flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                HR Pipeline
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">{activeBroadcastedVacancies}</div>
            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
              Active vacancies dispatched to the recruiter network for candidate link generation & sourcing.
            </p>
          </div>
          <Link
            href="/admin/vacancies"
            className="mt-6 pt-4 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors"
          >
            <span>Manage Vacancy Broadcasts</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
            </div>
          </Link>
        </div>

        <div className="group relative bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 p-6 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-3xl shadow-2xs flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs">
                Website Live
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">{websitePublishedVacancies}</div>
            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
              Openings live on the public `/jobs` section collecting direct candidate applications automatically.
            </p>
          </div>
          <Link
            href="/admin/candidates"
            className="mt-6 pt-4 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors"
          >
            <span>Review Website Inflow</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
            </div>
          </Link>
        </div>
      </div>

      {/* SECTION 4: Recent Candidate Movements & Recruiter Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Pipeline Updates (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-heading">
              Latest Candidate Stage Transitions
            </h3>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
              Live Audit Trail
            </span>
          </div>

          {recentCandidates.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No recent candidate submissions or stage updates in this timeframe.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentCandidates.map((c) => (
                <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-2xl transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">{c.fullName}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">({c.candidateId})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {c.vacancy.title} &bull; {c.vacancy.city}
                    </div>
                    {c.hr?.user?.fullName && (
                      <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                        Sourced by: {c.hr.user.fullName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs ${
                      c.status === "SELECTED" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                      c.status === "GOING_FOR_INTERVIEW" ? "bg-purple-50 text-purple-800 border border-purple-200" :
                      c.status === "INTERVIEWED" ? "bg-sky-50 text-sky-800 border border-sky-200" :
                      c.status === "REJECTED" ? "bg-rose-50 text-rose-800 border border-rose-200" :
                      c.status === "ABSENT" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                      c.status === "PLACED_OUTSIDE" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {c.status === "PLACED_OUTSIDE" ? "PLACED OUTSIDE" : c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HR Recruiter Roster (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-heading">
              Recruiter Presence Status
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-2.5">
            {hrTeamList.map((hr) => {
              const isOnline = hr.lastActiveAt && hr.lastActiveAt >= fifteenMinutesAgo;
              const hasLoggedInToday = hr.lastLoginAt && hr.lastLoginAt >= startOfToday;

              return (
                <div key={hr.id} className="flex items-center justify-between text-xs p-3 bg-slate-50/70 hover:bg-white border border-slate-200/70 hover:border-blue-200 rounded-2xl transition-all shadow-2xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">{hr.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{hr.hrProfile?.employeeCode || "HR"}</div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isOnline ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9.5px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Online
                      </span>
                    ) : hasLoggedInToday ? (
                      <span className="px-2.5 py-0.5 text-[9.5px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200/80 rounded-full shadow-2xs">
                        Present
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[9.5px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
                        Absent
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
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
    candidatesSelected,
    candidatesRejected,
    candidatesAbsent,
    recentCandidates,
    hrTeamList
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
  ]);

  const hrsAbsentToday = Math.max(0, totalHRs - hrsLoggedInToday);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Title Bar & Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-blue-600 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Operations Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Executive Dashboard
          </h1>
        </div>

        {/* Square Filter Segmented Buttons */}
        <div className="flex items-center p-1 bg-white border border-slate-300 rounded-none shadow-2xs self-start sm:self-auto">
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
                className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Real-Time HR Presence & Attendance Tracker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live HR Workforce Presence
            </h2>
          </div>
          <Link
            href="/admin/recruiters"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Manage Recruiter Team</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 border border-slate-200 border-l-4 border-l-slate-900 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Recruiters</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">{totalHRs}</div>
            <div className="mt-1 text-[11px] text-slate-400">Active staffing team</div>
          </div>

          <div className="bg-white p-4 border border-slate-200 border-l-4 border-l-emerald-600 rounded-none shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Online Now</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">{hrsOnlineNow}</div>
            <div className="mt-1 text-[11px] text-slate-400">Active in last 15 min</div>
          </div>

          <div className="bg-white p-4 border border-slate-200 border-l-4 border-l-blue-600 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Present Today</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-blue-700 font-heading">{hrsLoggedInToday}</div>
            <div className="mt-1 text-[11px] text-slate-400">Logged in today</div>
          </div>

          <div className="bg-white p-4 border border-slate-200 border-l-4 border-l-amber-600 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Absent Today</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-700 font-heading">{hrsAbsentToday}</div>
            <div className="mt-1 text-[11px] text-slate-400">No login recorded yet</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Candidate Pipeline KPIs (All Sources) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Candidate Pipeline Metrics ({range.toUpperCase()})
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Leads Sourced</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">{totalCandidatesSourced}</div>
            <div className="mt-1 text-[11px] text-slate-400">All HR links + Web</div>
          </div>

          <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Going for Interview</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-indigo-700 font-heading">{candidatesGoingForInterview}</div>
            <div className="mt-1 text-[11px] text-slate-400">Approved by HR</div>
          </div>

          <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Selected</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">{candidatesSelected}</div>
            <div className="mt-1 text-[11px] text-slate-400">Confirmed by client</div>
          </div>

          <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Rejected</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-700 font-heading">{candidatesRejected}</div>
            <div className="mt-1 text-[11px] text-slate-400">Client evaluated</div>
          </div>

          <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Absent / No-Show</div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-700 font-heading">{candidatesAbsent}</div>
            <div className="mt-1 text-[11px] text-slate-400">Missed interview</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Mandates & Broadcast Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-none shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Client Firms</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-heading">{totalClients}</div>
            <p className="mt-2 text-xs text-slate-500">
              Corporate partner organizations with active hiring mandates across India and Nigeria.
            </p>
          </div>
          <Link
            href="/admin/clients"
            className="mt-4 inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
          >
            <span>View Client Accounts</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-none shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Broadcasted to HR</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-heading">{activeBroadcastedVacancies}</div>
            <p className="mt-2 text-xs text-slate-500">
              Active vacancies dispatched to the recruiter network for lead link generation.
            </p>
          </div>
          <Link
            href="/admin/vacancies"
            className="mt-4 inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
          >
            <span>Manage Vacancy Broadcasts</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-none shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Published on Website</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-heading">{websitePublishedVacancies}</div>
            <p className="mt-2 text-xs text-slate-500">
              Openings live on the public `/jobs` section collecting direct candidate applications.
            </p>
          </div>
          <Link
            href="/admin/candidates"
            className="mt-4 inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
          >
            <span>Review Website Inflow</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* SECTION 4: Recent Candidate Movements & Recruiter Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Pipeline Updates (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Latest Candidate Stage Transitions
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Audit Trail</span>
          </div>

          {recentCandidates.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">
              No recent candidate submissions or stage updates in this timeframe.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentCandidates.map((c) => (
                <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{c.fullName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({c.candidateId})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {c.vacancy.title} &bull; {c.vacancy.city}
                    </div>
                    {c.hr?.user?.fullName && (
                      <div className="text-[10px] text-blue-600 font-medium">
                        Sourced by: {c.hr.user.fullName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${
                      c.status === "SELECTED" ? "bg-emerald-100 text-emerald-800" :
                      c.status === "GOING_FOR_INTERVIEW" ? "bg-indigo-100 text-indigo-800" :
                      c.status === "REJECTED" ? "bg-rose-100 text-rose-800" :
                      c.status === "ABSENT" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HR Recruiter Roster (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-none shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recruiter Presence Status
            </h3>
          </div>

          <div className="space-y-3">
            {hrTeamList.map((hr) => {
              const isOnline = hr.lastActiveAt && hr.lastActiveAt >= fifteenMinutesAgo;
              const hasLoggedInToday = hr.lastLoginAt && hr.lastLoginAt >= startOfToday;

              return (
                <div key={hr.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 border border-slate-100 rounded-none">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">{hr.fullName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{hr.hrProfile?.employeeCode || "HR"}</div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isOnline ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9.5px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Online
                      </span>
                    ) : hasLoggedInToday ? (
                      <span className="px-1.5 py-0.5 text-[9.5px] font-bold uppercase bg-blue-100 text-blue-800 rounded-none">
                        Present
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9.5px] font-bold uppercase bg-slate-200 text-slate-600 rounded-none">
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
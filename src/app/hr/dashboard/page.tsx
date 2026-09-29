import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  Link2,
  Share2,
  Calendar
} from "lucide-react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HRDashboardPage() {
  const session = await getSession();
  if (!session || !session.hrProfileId) {
    return null;
  }

  const hrProfileId = session.hrProfileId;

  // Fetch HR-specific data
  const [
    hrProfile,
    activeOpeningsCount,
    myLinksCount,
    totalLeadsSourced,
    candidatesGoingForInterview,
    candidatesInterviewed,
    candidatesSelected,
    recentCandidates
  ] = await Promise.all([
    prisma.hrProfile.findUnique({ 
      where: { id: hrProfileId },
      include: { user: true }
    }),
    prisma.vacancy.count({ where: { status: "ACTIVE", isBroadcastedToHR: true } }),
    prisma.hrPublicLink.count({ where: { hrId: hrProfileId, status: "ACTIVE" } }),
    prisma.candidate.count({ where: { hrId: hrProfileId } }),
    prisma.candidate.count({ where: { hrId: hrProfileId, status: "GOING_FOR_INTERVIEW" } }),
    prisma.candidate.count({ where: { hrId: hrProfileId, status: "INTERVIEWED" } }),
    prisma.candidate.count({ where: { hrId: hrProfileId, status: "SELECTED" } }),
    prisma.candidate.findMany({
      where: { hrId: hrProfileId },
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: {
        vacancy: { select: { title: true, city: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Banner with Recruiter Identity & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full mb-2 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Recruiter Workspace &bull; Code: {hrProfile?.employeeCode || "RUP-HR"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Welcome back, {hrProfile?.user.fullName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Link
            href="/hr/vacancies"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            <Link2 className="w-4 h-4" />
            <span>Generate Mandate Links</span>
          </Link>
          <Link
            href="/hr/candidates"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-xs"
          >
            <Users className="w-4 h-4" />
            <span>Open ATS Pipeline</span>
          </Link>
        </div>
      </div>

      {/* Recruiter Performance KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Mandates</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 font-heading">{activeOpeningsCount}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">{myLinksCount} active links created</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-slate-50 border border-slate-200/80 hover:border-slate-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Leads Sourced</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 font-heading">{totalLeadsSourced}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Total applications received</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-purple-50/20 border border-slate-200/80 hover:border-purple-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Interview Pipeline</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-purple-700 font-heading">{candidatesGoingForInterview}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Sent with official referral</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-sky-50/20 border border-slate-200/80 hover:border-sky-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Interviewed</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-sky-700 font-heading">{candidatesInterviewed}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Evaluated by clients</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/20 border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Selected</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-emerald-700 font-heading">{candidatesSelected}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Successful placements</div>
        </div>
      </div>

      {/* Sourcing Guide & Recent Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recruiter Workflow Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-3">
              Standard Operating Procedure
            </div>
            <h2 className="text-base font-black text-slate-900 mb-3 tracking-tight">
              Recruitment Protocol & Referral Format
            </h2>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-blue-50 border border-blue-200/70 rounded-2xl shadow-2xs">
                <span className="font-bold text-blue-950 block mb-1">Your Mandatory Referral Code:</span>
                <span className="font-mono font-bold text-blue-700 text-sm block">
                  Referral: {hrProfile?.user.fullName} | RiseUp Consultancy
                </span>
                <p className="mt-2 text-[11px] text-blue-900/80 leading-snug">
                  Instruct every candidate to clearly state this reference at the company reception and during the interview.
                </p>
              </div>

              <ol className="list-decimal pl-4 space-y-1.5 text-[11.5px] text-slate-600 font-medium">
                <li>Generate your tracked link for active openings.</li>
                <li>Share on WhatsApp groups and LinkedIn networks.</li>
                <li>Review candidate details & 2MB PDF resumes in your ATS.</li>
                <li>Click 1-tap WhatsApp to invite candidates for interview.</li>
                <li>Mark status as <strong>"Going for Interview"</strong> to push candidate to the Client's portal.</li>
              </ol>
            </div>
          </div>

          <Link
            href="/hr/vacancies"
            className="mt-6 w-full flex items-center justify-between p-3.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-xs"
          >
            <span>Browse Mandates & Generate Links</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Candidate Inflow (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-heading">
              Recent Leads in Your Pipeline
            </h2>
            <Link
              href="/hr/candidates"
              className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Full ATS
            </Link>
          </div>

          {recentCandidates.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No candidates sourced yet. Click "Generate Mandate Links" to create and share your custom link.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentCandidates.map((cand) => (
                <div key={cand.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-2xl transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{cand.fullName}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">({cand.candidateId})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {cand.vacancy.title} &bull; {cand.vacancy.city}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs ${
                      cand.status === "SELECTED" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                      cand.status === "GOING_FOR_INTERVIEW" ? "bg-purple-50 text-purple-800 border border-purple-200" :
                      cand.status === "INTERVIEWED" ? "bg-sky-50 text-sky-800 border border-sky-200" :
                      cand.status === "REJECTED" ? "bg-rose-50 text-rose-800 border border-rose-200" :
                      cand.status === "ABSENT" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                      cand.status === "PLACED_OUTSIDE" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {cand.status === "PLACED_OUTSIDE" ? "PLACED OUTSIDE" : cand.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Recruiter Workspace &bull; Code: {hrProfile?.employeeCode || "RUP-HR"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Welcome back, {hrProfile?.user.fullName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/hr/vacancies"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs"
          >
            <Link2 className="w-4 h-4" />
            <span>Generate Mandate Links</span>
          </Link>
          <Link
            href="/hr/candidates"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs"
          >
            <Users className="w-4 h-4" />
            <span>Open ATS Pipeline</span>
          </Link>
        </div>
      </div>

      {/* Recruiter Performance KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-blue-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Mandates</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">{activeOpeningsCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">{myLinksCount} active links created</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-slate-900">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Leads Sourced</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">{totalLeadsSourced}</div>
          <div className="mt-1 text-[11px] text-slate-400">Total applications received</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-purple-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Interview Pipeline</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-purple-700 font-heading">{candidatesGoingForInterview}</div>
          <div className="mt-1 text-[11px] text-slate-400">Sent with official referral</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-sky-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Interviewed</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-sky-700 font-heading">{candidatesInterviewed}</div>
          <div className="mt-1 text-[11px] text-slate-400">Evaluated by clients</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-emerald-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Selected</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">{candidatesSelected}</div>
          <div className="mt-1 text-[11px] text-slate-400">Successful placements</div>
        </div>
      </div>

      {/* Sourcing Guide & Recent Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recruiter Workflow Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-none shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Recruitment Protocol & Referral Format
            </h2>
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-none">
                <span className="font-bold text-blue-900 block mb-1">Your Mandatory Referral Code:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  Referral: {hrProfile?.user.fullName} | RiseUp Consultancy
                </span>
                <p className="mt-1.5 text-[11px] text-blue-800">
                  Instruct every candidate to clearly state this reference at the company reception and during the interview.
                </p>
              </div>

              <ol className="list-decimal pl-4 space-y-1.5 text-[11.5px] text-slate-600">
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
            className="mt-5 w-full flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
          >
            <span>Browse Mandates & Generate Links</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Candidate Inflow (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-none shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recent Leads in Your Pipeline
            </h2>
            <Link
              href="/hr/candidates"
              className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700"
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
                <div key={cand.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{cand.fullName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({cand.candidateId})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {cand.vacancy.title} &bull; {cand.vacancy.city}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${
                      cand.status === "SELECTED" ? "bg-emerald-100 text-emerald-800" :
                      cand.status === "GOING_FOR_INTERVIEW" ? "bg-purple-100 text-purple-800" :
                      cand.status === "INTERVIEWED" ? "bg-sky-100 text-sky-800" :
                      cand.status === "REJECTED" ? "bg-rose-100 text-rose-800" :
                      cand.status === "ABSENT" ? "bg-amber-100 text-amber-800" :
                      cand.status === "PLACED_OUTSIDE" ? "bg-slate-200 text-slate-700" :
                      "bg-blue-50 text-blue-700"
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
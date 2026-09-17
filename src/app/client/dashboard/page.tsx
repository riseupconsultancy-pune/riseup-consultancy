import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  PlusCircle, 
  ArrowUpRight,
  Building2,
  Calendar
} from "lucide-react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const session = await getSession();
  if (!session || !session.clientProfileId) {
    return null;
  }

  const clientProfileId = session.clientProfileId;

  // Fetch client-specific data
  const [
    clientProfile,
    totalVacancies,
    activeVacancies,
    scheduledCandidates,
    selectedCandidates,
    rejectedCandidates,
    absentCandidates,
    recentCandidatesList
  ] = await Promise.all([
    prisma.clientProfile.findUnique({ where: { id: clientProfileId } }),
    prisma.vacancy.count({ where: { clientId: clientProfileId } }),
    prisma.vacancy.count({ where: { clientId: clientProfileId, status: "ACTIVE" } }),
    prisma.candidate.count({ 
      where: { 
        vacancy: { clientId: clientProfileId },
        status: "GOING_FOR_INTERVIEW"
      } 
    }),
    prisma.candidate.count({ 
      where: { 
        vacancy: { clientId: clientProfileId },
        status: "SELECTED"
      } 
    }),
    prisma.candidate.count({ 
      where: { 
        vacancy: { clientId: clientProfileId },
        status: "REJECTED"
      } 
    }),
    prisma.candidate.count({ 
      where: { 
        vacancy: { clientId: clientProfileId },
        status: "ABSENT"
      } 
    }),
    prisma.candidate.findMany({
      where: { 
        vacancy: { clientId: clientProfileId },
        status: "GOING_FOR_INTERVIEW"
      },
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: {
        vacancy: { select: { jobId: true, title: true } },
        hr: { include: { user: { select: { fullName: true } } } },
      },
    }),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Banner with Company Identity & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {clientProfile?.companyName || "Corporate Client"} &bull; {clientProfile?.city}, {clientProfile?.country}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Recruitment Drive Overview
          </h1>
        </div>

        <Link
          href="/client/vacancies/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request Candidate / Post Vacancy</span>
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-slate-900">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Mandates</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">{activeVacancies}</div>
          <div className="mt-1 text-[11px] text-slate-400">{totalVacancies} total submitted</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-indigo-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Interview Pipeline</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-indigo-700 font-heading">{scheduledCandidates}</div>
          <div className="mt-1 text-[11px] text-slate-400">Scheduled by RiseUp HR</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-emerald-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Selected</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">{selectedCandidates}</div>
          <div className="mt-1 text-[11px] text-slate-400">Confirmed offers</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-rose-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Rejected</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-700 font-heading">{rejectedCandidates}</div>
          <div className="mt-1 text-[11px] text-slate-400">Evaluated</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-xs border-l-4 border-l-amber-600">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Absent / No-Show</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-700 font-heading">{absentCandidates}</div>
          <div className="mt-1 text-[11px] text-slate-400">Missed appointment</div>
        </div>
      </div>

      {/* Candidates Scheduled for Interview Queue */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Candidates Scheduled for Interview
            </h2>
            <p className="text-[11px] text-slate-500">
              Profiles pre-screened and sent by RiseUp recruiters. Update selection status directly below.
            </p>
          </div>
          <Link
            href="/client/candidates"
            className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage All Candidates</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentCandidatesList.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            No candidates currently scheduled for interview. When RiseUp recruiters screen and approve candidates, they will appear here instantly.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentCandidatesList.map((cand) => (
              <div key={cand.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 truncate">{cand.fullName}</span>
                    <span className="text-[10px] font-mono text-slate-400">({cand.candidateId})</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    <strong>Role:</strong> {cand.vacancy.title} &bull; <strong>Exp:</strong> {cand.totalExperience} &bull; <strong>Qual:</strong> {cand.qualification}
                  </div>
                  <div className="mt-1 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                    <span>Official Referral:</span>
                    <span className="bg-blue-50 px-2 py-0.5 border border-blue-200 rounded-none">
                      {cand.referralTag || `Referral: ${cand.hr?.user?.fullName || "RiseUp Team"} | RiseUp Consultancy`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/client/candidates?highlight=${cand.id}`}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-none"
                  >
                    Evaluate & Update Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
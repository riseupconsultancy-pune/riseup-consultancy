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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full mb-2 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              {clientProfile?.companyName || "Corporate Client"} &bull; {clientProfile?.city}, {clientProfile?.country}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Recruitment Drive Overview
          </h1>
        </div>

        <Link
          href="/client/vacancies/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request Candidate / Post Vacancy</span>
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Mandates</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 font-heading">{activeVacancies}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">{totalVacancies} total submitted</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-indigo-50/20 border border-slate-200/80 hover:border-indigo-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Interview Pipeline</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-indigo-700 font-heading">{scheduledCandidates}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Scheduled by RiseUp HR</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/20 border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Selected</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-emerald-700 font-heading">{selectedCandidates}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Confirmed offers</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-rose-50/20 border border-slate-200/80 hover:border-rose-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Rejected</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-rose-700 font-heading">{rejectedCandidates}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Evaluated</div>
        </div>

        <div className="group relative p-5 bg-gradient-to-b from-white via-slate-50/70 to-amber-50/20 border border-slate-200/80 hover:border-amber-400/60 hover:shadow-lg transition-all rounded-2xl shadow-2xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Absent / No-Show</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-black text-amber-700 font-heading">{absentCandidates}</div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-medium">Missed appointment</div>
        </div>
      </div>

      {/* Candidates Scheduled for Interview Queue */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-heading">
              Candidates Scheduled for Interview
            </h2>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">
              Profiles pre-screened and sent by RiseUp recruiters. Update selection status directly below.
            </p>
          </div>
          <Link
            href="/client/candidates"
            className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors self-start sm:self-auto"
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
              <div key={cand.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-2xl transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 truncate">{cand.fullName}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">({cand.candidateId})</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    <strong>Role:</strong> {cand.vacancy.title} &bull; <strong>Exp:</strong> {cand.totalExperience} &bull; <strong>Qual:</strong> {cand.qualification}
                  </div>
                  <div className="mt-1.5 text-[11px] text-blue-700 font-semibold flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Official Referral:</span>
                    <span className="bg-blue-50 text-blue-800 px-2.5 py-0.5 border border-blue-200/80 rounded-full text-[10.5px]">
                      {cand.referralTag || `Referral: ${cand.hr?.user?.fullName || "RiseUp Team"} | RiseUp Consultancy`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/client/candidates?highlight=${cand.id}`}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
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
import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import HrCandidatePipeline from "./HrCandidatePipeline";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Candidate ATS Pipeline & Talent Pool | RiseUp Recruiter Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HrCandidatesPage() {
  const session = await getSession();
  if (!session || session.role !== "HR_RECRUITER" || !session.hrProfileId) {
    redirect("/login");
  }

  const hrProfileId = session.hrProfileId;

  // Fetch recruiter details & template
  const hrProfile = await prisma.hrProfile.findUnique({
    where: { id: hrProfileId },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!hrProfile) {
    redirect("/login");
  }

  // Fetch all active, broadcasted vacancies for interview dispatching
  const activeVacancies = await prisma.vacancy.findMany({
    where: {
      status: "ACTIVE",
      isBroadcastedToHR: true,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      jobId: true,
      title: true,
      category: true,
      city: true,
      workMode: true,
      expMin: true,
      expMax: true,
      availabilityRequired: true,
      interviewVenue: true,
      interviewLocationUrl: true,
      interviewContactPerson: true,
      interviewContactPhone: true,
      interviewInstructions: true,
      client: {
        select: {
          companyName: true,
        },
      },
    },
  });

  // Fetch candidates strictly assigned to this recruiter's pool
  const candidates = await prisma.candidate.findMany({
    where: {
      hrId: hrProfileId,
    },
    orderBy: { updatedAt: "desc" },
    include: {
      vacancy: {
        select: {
          id: true,
          jobId: true,
          title: true,
          category: true,
          city: true,
          workMode: true,
          status: true,
          interviewVenue: true,
          interviewLocationUrl: true,
          interviewContactPerson: true,
          interviewContactPhone: true,
          interviewInstructions: true,
          client: {
            select: {
              companyName: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          newStatus: true,
          changedByRole: true,
          note: true,
          createdAt: true,
        },
      },
    },
  });

  // Unique list of vacancies represented in the candidate records
  const appliedVacancyMap = new Map<string, { id: string; jobId: string; title: string; status: string }>();
  candidates.forEach((c) => {
    if (!appliedVacancyMap.has(c.vacancy.id)) {
      appliedVacancyMap.set(c.vacancy.id, {
        id: c.vacancy.id,
        jobId: c.vacancy.jobId,
        title: c.vacancy.title,
        status: c.vacancy.status,
      });
    }
  });

  const formattedCandidates = candidates.map((c) => ({
    id: c.id,
    candidateId: c.candidateId,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    country: c.country,
    city: c.city,
    qualification: c.qualification,
    totalExperience: c.totalExperience,
    availability: c.availability,
    interestedRoles: (() => {
      try {
        return JSON.parse(c.interestedRoles) as string[];
      } catch {
        return [];
      }
    })(),
    resumeUrl: c.resumeUrl,
    resumeFileName: c.resumeFileName,
    resumeFileSize: c.resumeFileSize,
    referralTag: c.referralTag || `Referral: ${hrProfile.user.fullName} | RiseUp Consultancy`,
    status: c.status,
    clientFeedback: c.clientFeedback,
    interviewDate: c.interviewDate ? c.interviewDate.toISOString() : null,
    selectedAt: c.selectedAt ? c.selectedAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    vacancyId: c.vacancy.id,
    vacancyJobId: c.vacancy.jobId,
    vacancyTitle: c.vacancy.title,
    vacancyCategory: c.vacancy.category,
    vacancyCity: c.vacancy.city,
    vacancyStatus: c.vacancy.status,
    vacancyInterviewVenue: c.vacancy.interviewVenue || null,
    vacancyInterviewLocationUrl: c.vacancy.interviewLocationUrl || null,
    vacancyInterviewContactPerson: c.vacancy.interviewContactPerson || null,
    vacancyInterviewContactPhone: c.vacancy.interviewContactPhone || null,
    vacancyInterviewInstructions: c.vacancy.interviewInstructions || null,
    clientCompanyName: c.vacancy.client.companyName,
    isMyLead: c.hrId === hrProfileId,
    recentHistory: c.statusHistory.map((h) => ({
      id: h.id,
      newStatus: h.newStatus,
      changedByRole: h.changedByRole,
      note: h.note,
      createdAt: h.createdAt.toISOString(),
    })),
  }));

  const formattedActiveVacancies = activeVacancies.map((v) => ({
    id: v.id,
    jobId: v.jobId,
    title: v.title,
    category: v.category,
    city: v.city,
    workMode: v.workMode,
    expMin: v.expMin,
    expMax: v.expMax,
    availabilityRequired: v.availabilityRequired,
    interviewVenue: v.interviewVenue || null,
    interviewLocationUrl: v.interviewLocationUrl || null,
    interviewContactPerson: v.interviewContactPerson || null,
    interviewContactPhone: v.interviewContactPhone || null,
    interviewInstructions: v.interviewInstructions || null,
    clientCompanyName: v.client.companyName,
  }));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HrCandidatePipeline
        initialCandidates={formattedCandidates}
        activeVacancies={formattedActiveVacancies}
        appliedVacancies={Array.from(appliedVacancyMap.values())}
        recruiterName={hrProfile.user.fullName}
        recruiterPhone={hrProfile.user.phone || null}
        employeeCode={hrProfile.employeeCode}
        whatsappTemplate={hrProfile.whatsappTemplate}
      />
    </div>
  );
}

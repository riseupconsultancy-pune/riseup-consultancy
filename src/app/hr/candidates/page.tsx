import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import HrCandidatePipeline from "./HrCandidatePipeline";

export const metadata = {
  title: "Candidate ATS Pipeline | RiseUp Recruiter Portal",
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

  // Fetch candidates sourced through this recruiter's links
  const candidates = await prisma.candidate.findMany({
    where: { hrId: hrProfileId },
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

  // Unique vacancies for filter dropdown
  const vacancyMap = new Map<string, { id: string; jobId: string; title: string }>();
  candidates.forEach((c) => {
    if (!vacancyMap.has(c.vacancy.id)) {
      vacancyMap.set(c.vacancy.id, {
        id: c.vacancy.id,
        jobId: c.vacancy.jobId,
        title: c.vacancy.title,
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
    clientCompanyName: c.vacancy.client.companyName,
    recentHistory: c.statusHistory.map((h) => ({
      id: h.id,
      newStatus: h.newStatus,
      changedByRole: h.changedByRole,
      note: h.note,
      createdAt: h.createdAt.toISOString(),
    })),
  }));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HrCandidatePipeline
        initialCandidates={formattedCandidates}
        vacancies={Array.from(vacancyMap.values())}
        recruiterName={hrProfile.user.fullName}
        employeeCode={hrProfile.employeeCode}
        whatsappTemplate={hrProfile.whatsappTemplate}
      />
    </div>
  );
}

import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ClientCandidateReview from "./ClientCandidateReview";

export const metadata = {
  title: "Candidate Interview Evaluation Desk | RiseUp Client Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ClientCandidatesPage() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    redirect("/login");
  }

  const clientProfileId = session.clientProfileId;

  // Fetch client vacancies for filtering
  const vacancies = await prisma.vacancy.findMany({
    where: { clientId: clientProfileId },
    select: { id: true, jobId: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all candidates belonging to this client's vacancies that have reached the interview or decision stage
  const candidates = await prisma.candidate.findMany({
    where: {
      vacancy: { clientId: clientProfileId },
      status: {
        in: ["GOING_FOR_INTERVIEW", "INTERVIEWED", "SELECTED", "REJECTED", "ABSENT"],
      },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      vacancy: {
        select: {
          id: true,
          jobId: true,
          title: true,
          city: true,
        },
      },
      hr: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phone: true,
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
    resumeUrl: c.resumeUrl,
    resumeFileName: c.resumeFileName,
    referralTag: c.referralTag || (c.hr?.user?.fullName ? `Referral: ${c.hr.user.fullName} | RiseUp Consultancy` : "RiseUp Direct"),
    hrName: c.hr?.user?.fullName || "RiseUp Recruiter",
    hrPhone: c.hr?.user?.phone || null,
    status: c.status,
    clientFeedback: c.clientFeedback,
    updatedAt: c.updatedAt.toISOString(),
    vacancyId: c.vacancyId,
    vacancyJobId: c.vacancy.jobId,
    vacancyTitle: c.vacancy.title,
    vacancyCity: c.vacancy.city,
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
      <ClientCandidateReview
        initialCandidates={formattedCandidates}
        vacancies={vacancies}
      />
    </div>
  );
}

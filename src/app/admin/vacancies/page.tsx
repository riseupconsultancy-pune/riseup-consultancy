import React from "react";
import prisma from "@/lib/prisma";
import VacancyBroadcastHub from "./VacancyBroadcastHub";

export const dynamic = "force-dynamic";

export default async function AdminVacanciesPage() {
  const vacanciesData = await prisma.vacancy.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: {
        select: {
          companyName: true,
        },
      },
      _count: {
        select: {
          candidates: true,
        },
      },
      candidates: {
        where: { status: "SELECTED" },
        select: { id: true },
      },
    },
  });

  const formattedVacancies = vacanciesData.map((v) => ({
    id: v.id,
    jobId: v.jobId,
    title: v.title,
    category: v.category,
    companyName: v.client.companyName,
    country: v.country,
    city: v.city,
    expMin: v.expMin,
    expMax: v.expMax,
    workMode: v.workMode,
    shift: v.shift,
    salaryMin: v.salaryMin,
    salaryMax: v.salaryMax,
    salaryCurrency: v.salaryCurrency,
    headcount: v.headcount,
    availabilityRequired: v.availabilityRequired,
    interviewVenue: v.interviewVenue,
    interviewLocationUrl: v.interviewLocationUrl,
    interviewContactPerson: v.interviewContactPerson,
    interviewContactPhone: v.interviewContactPhone,
    interviewInstructions: v.interviewInstructions,
    status: v.status,
    isBroadcastedToHR: v.isBroadcastedToHR,
    isPostedOnWebsite: v.isPostedOnWebsite,
    broadcastedAt: v.broadcastedAt ? v.broadcastedAt.toISOString() : null,
    candidatesCount: v._count.candidates,
    selectedCount: v.candidates.length,
    createdAt: v.createdAt.toISOString(),
  }));

  return <VacancyBroadcastHub initialVacancies={formattedVacancies} />;
}
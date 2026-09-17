import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ClientVacancyList from "./ClientVacancyList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Posted Vacancies | RiseUp Client Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ClientVacanciesPage() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    redirect("/login");
  }

  const vacancies = await prisma.vacancy.findMany({
    where: { clientId: session.clientProfileId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          candidates: true,
        },
      },
      candidates: {
        select: {
          status: true,
        },
      },
    },
  });

  const formattedVacancies = vacancies.map((v) => {
    const totalCandidates = v._count.candidates;
    const interviewCount = v.candidates.filter(
      (c) => c.status === "GOING_FOR_INTERVIEW" || c.status === "INTERVIEWED"
    ).length;
    const selectedCount = v.candidates.filter((c) => c.status === "SELECTED").length;

    return {
      id: v.id,
      jobId: v.jobId,
      title: v.title,
      category: v.category,
      country: v.country,
      city: v.city,
      workMode: v.workMode,
      shift: v.shift || "Day Shift",
      headcount: v.headcount,
      status: v.status,
      isBroadcastedToHR: v.isBroadcastedToHR,
      isPostedOnWebsite: v.isPostedOnWebsite,
      createdAt: v.createdAt.toISOString(),
      totalCandidates,
      interviewCount,
      selectedCount,
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ClientVacancyList vacancies={formattedVacancies} />
    </div>
  );
}

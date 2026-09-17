import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import HrVacanciesDesk from "./HrVacanciesDesk";

export const metadata = {
  title: "Openings & Sourcing Links | RiseUp Recruiter Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HrVacanciesPage() {
  const session = await getSession();
  if (!session || session.role !== "HR_RECRUITER" || !session.hrProfileId) {
    redirect("/login");
  }

  const hrProfileId = session.hrProfileId;

  // Fetch HR profile info
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

  // Fetch all active vacancies broadcasted by Super Admin to HRs
  const vacancies = await prisma.vacancy.findMany({
    where: {
      status: "ACTIVE",
      isBroadcastedToHR: true,
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: {
        select: {
          companyName: true,
          city: true,
          country: true,
        },
      },
      hrLinks: {
        where: {
          hrId: hrProfileId,
        },
      },
      _count: {
        select: {
          candidates: {
            where: {
              hrId: hrProfileId,
            },
          },
        },
      },
    },
  });

  const formattedVacancies = vacancies.map((v) => {
    const existingLink = v.hrLinks[0] || null;

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
      salaryMin: v.salaryMin,
      salaryMax: v.salaryMax,
      salaryCurrency: v.salaryCurrency,
      expMin: v.expMin,
      expMax: v.expMax,
      availabilityRequired: v.availabilityRequired,
      description: v.description,
      requirements: v.requirements,
      companyName: v.client.companyName,
      myApplicationsCount: v._count.candidates,
      link: existingLink
        ? {
            id: existingLink.id,
            uniqueSlug: existingLink.uniqueSlug,
            status: existingLink.status,
            clickCount: existingLink.clickCount,
            url: `/apply/${existingLink.uniqueSlug}`,
          }
        : null,
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HrVacanciesDesk
        vacancies={formattedVacancies}
        recruiterName={hrProfile.user.fullName}
        employeeCode={hrProfile.employeeCode}
      />
    </div>
  );
}

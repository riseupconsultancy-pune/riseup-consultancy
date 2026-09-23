import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminCandidatePool from "./AdminCandidatePool";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Candidate Talent Pipeline | RiseUp Super Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCandidatePoolPage() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Fetch all candidate records across the platform (Newest first)
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vacancy: {
        select: {
          id: true,
          jobId: true,
          title: true,
          city: true,
          country: true,
          category: true,
          client: {
            select: {
              companyName: true,
            },
          },
        },
      },
      hr: {
        select: {
          id: true,
          employeeCode: true,
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

  // Fetch active recruiters for assignment dropdown
  const recruiters = await prisma.hrProfile.findMany({
    where: {
      user: { status: "ACTIVE" },
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { employeeCode: "asc" },
  });

  const formattedCandidates = candidates.map((c) => {
    let parsedRoles: string[] = [];
    try {
      if (c.interestedRoles) {
        const val = JSON.parse(c.interestedRoles);
        if (Array.isArray(val)) parsedRoles = val;
      }
    } catch {
      // fallback
    }

    return {
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
      interestedRoles: parsedRoles,
      resumeUrl: c.resumeUrl,
      resumeFileName: c.resumeFileName,
      resumeFileSize: c.resumeFileSize,
      source: c.source,
      status: c.status,
      referralTag: c.referralTag,
      hrId: c.hrId,
      hrName: c.hr?.user?.fullName || null,
      hrCode: c.hr?.employeeCode || null,
      vacancyId: c.vacancy.id,
      vacancyJobId: c.vacancy.jobId,
      vacancyTitle: c.vacancy.title,
      vacancyCategory: c.vacancy.category,
      clientCompanyName: c.vacancy.client.companyName,
      createdAt: c.createdAt.toISOString(),
      statusHistory: c.statusHistory.map((h) => ({
        id: h.id,
        newStatus: h.newStatus,
        changedByRole: h.changedByRole,
        note: h.note,
        createdAt: h.createdAt.toISOString(),
      })),
    };
  });

  const formattedRecruiters = recruiters.map((r) => ({
    id: r.id,
    employeeCode: r.employeeCode,
    fullName: r.user.fullName,
    email: r.user.email,
    phone: r.user.phone,
  }));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <AdminCandidatePool
        initialCandidates={formattedCandidates}
        recruiters={formattedRecruiters}
      />
    </div>
  );
}

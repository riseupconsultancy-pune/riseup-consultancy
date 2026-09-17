import React from "react";
import prisma from "@/lib/prisma";
import HrManager from "./HrManager";

export default async function AdminRecruitersPage() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const recruitersData = await prisma.hrProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          status: true,
          lastLoginAt: true,
          lastActiveAt: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          sourcedCandidates: true,
          publicLinks: {
            where: { status: "ACTIVE" },
          },
        },
      },
      sourcedCandidates: {
        where: { status: "SELECTED" },
        select: { id: true },
      },
    },
  });

  const formattedRecruiters = recruitersData.map((hr) => {
    const isOnline = !!(hr.user.lastActiveAt && hr.user.lastActiveAt >= fifteenMinutesAgo);
    const hasLoggedInToday = !!(hr.user.lastLoginAt && hr.user.lastLoginAt >= startOfToday);

    return {
      id: hr.id,
      userId: hr.user.id,
      employeeCode: hr.employeeCode,
      fullName: hr.user.fullName,
      email: hr.user.email,
      phone: hr.user.phone,
      commissionRate: hr.commissionRate,
      status: hr.user.status,
      isOnline,
      hasLoggedInToday,
      sourcedCount: hr._count.sourcedCandidates,
      placedCount: hr.sourcedCandidates.length,
      activeLinksCount: hr._count.publicLinks,
      createdAt: hr.createdAt.toISOString(),
    };
  });

  return <HrManager initialRecruiters={formattedRecruiters} />;
}
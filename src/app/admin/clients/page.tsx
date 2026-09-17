import React from "react";
import prisma from "@/lib/prisma";
import ClientManager from "./ClientManager";

export default async function AdminClientsPage() {
  const clientsData = await prisma.clientProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          status: true,
          phone: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          vacancies: true,
        },
      },
      vacancies: {
        select: {
          _count: {
            select: {
              candidates: {
                where: { status: "SELECTED" },
              },
            },
          },
        },
      },
    },
  });

  const formattedClients = clientsData.map((c) => {
    const placedTotal = c.vacancies.reduce(
      (acc, v) => acc + v._count.candidates,
      0
    );

    return {
      id: c.id,
      userId: c.user.id,
      companyName: c.companyName,
      country: c.country,
      city: c.city,
      industry: c.industry,
      contactPerson: c.contactPerson,
      phone: c.phone || c.user.phone,
      email: c.user.email,
      status: c.user.status,
      vacanciesCount: c._count.vacancies,
      placedCount: placedTotal,
      createdAt: c.createdAt.toISOString(),
    };
  });

  return <ClientManager initialClients={formattedClients} />;
}
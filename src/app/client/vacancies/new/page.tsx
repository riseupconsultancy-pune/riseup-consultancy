import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ClientVacancyWizard from "./ClientVacancyWizard";

export const metadata = {
  title: "Request Candidate / Post Vacancy | RiseUp Consultancy",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewVacancyPage() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    redirect("/login");
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { id: session.clientProfileId },
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

  if (!clientProfile) {
    redirect("/login");
  }

  const formattedClientProfile = {
    id: clientProfile.id,
    companyName: clientProfile.companyName,
    country: clientProfile.country,
    city: clientProfile.city,
    industry: clientProfile.industry || "BPO / BPM / Back Office",
    user: {
      fullName: clientProfile.user.fullName,
      email: clientProfile.user.email,
      phone: clientProfile.user.phone || "",
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <ClientVacancyWizard clientProfile={formattedClientProfile} />
    </div>
  );
}

import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import HrSettingsView from "./HrSettingsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "WhatsApp Template Settings | RiseUp Recruiter Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HrSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "HR_RECRUITER" || !session.hrProfileId) {
    redirect("/login");
  }

  const hrProfile = await prisma.hrProfile.findUnique({
    where: { id: session.hrProfileId },
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <HrSettingsView
        recruiterName={hrProfile.user.fullName}
        employeeCode={hrProfile.employeeCode}
        currentTemplate={hrProfile.whatsappTemplate}
      />
    </div>
  );
}

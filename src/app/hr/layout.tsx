import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquareShare 
} from "lucide-react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CrmShell from "@/components/crm/CrmShell";

export const metadata: Metadata = {
  title: "Recruiter Workspace | RiseUp Consultancy ATS",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const HR_NAV_ITEMS = [
  { href: "/hr/dashboard", label: "Recruiter Hub", icon: LayoutDashboard },
  { href: "/hr/vacancies", label: "Openings & Links", icon: Briefcase },
  { href: "/hr/candidates", label: "Candidate ATS Pipeline", icon: Users },
  { href: "/hr/settings", label: "WhatsApp Template", icon: MessageSquareShare },
];

export default async function HRLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "HR_RECRUITER") {
    redirect("/login");
  }

  // Update activity timestamp for live presence tracking
  await prisma.user.update({
    where: { id: session.userId },
    data: { lastActiveAt: new Date() },
  });

  return (
    <CrmShell 
      user={session} 
      portalTitle="Recruitment Operations" 
      navItems={HR_NAV_ITEMS}
    >
      {children}
    </CrmShell>
  );
}
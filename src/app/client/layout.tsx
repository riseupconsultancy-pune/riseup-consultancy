import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users, 
  FileCheck 
} from "lucide-react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CrmShell from "@/components/crm/CrmShell";

export const metadata: Metadata = {
  title: "Corporate Client Portal | RiseUp Consultancy",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const CLIENT_NAV_ITEMS = [
  { href: "/client/dashboard", label: "Drive Overview", icon: LayoutDashboard },
  { href: "/client/vacancies/new", label: "Request Candidate", icon: PlusCircle },
  { href: "/client/vacancies", label: "Posted Vacancies", icon: Briefcase },
  { href: "/client/candidates", label: "Interview Candidates", icon: Users },
  { href: "/client/agreements", label: "Client Agreements", icon: FileCheck },
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "CLIENT") {
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
      portalTitle="Corporate Client Workspace" 
      navItems={CLIENT_NAV_ITEMS}
    >
      {children}
    </CrmShell>
  );
}
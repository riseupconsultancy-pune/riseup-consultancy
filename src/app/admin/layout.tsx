import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Briefcase, 
  FileText, 
  UserCheck 
} from "lucide-react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CrmShell from "@/components/crm/CrmShell";

export const metadata: Metadata = {
  title: "Super Admin Console | RiseUp Consultancy CRM",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Master Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Client Management", icon: Building2 },
  { href: "/admin/recruiters", label: "HR Management", icon: Users },
  { href: "/admin/vacancies", label: "Vacancies & Broadcast", icon: Briefcase },
  { href: "/admin/agreements", label: "Client Agreements", icon: FileText },
  { href: "/admin/candidates", label: "Website Candidate Pool", icon: UserCheck },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "SUPER_ADMIN") {
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
      portalTitle="Executive Administration" 
      navItems={ADMIN_NAV_ITEMS}
    >
      {children}
    </CrmShell>
  );
}
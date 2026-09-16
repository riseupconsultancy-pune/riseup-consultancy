import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
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
    <CrmShell user={session}>
      {children}
    </CrmShell>
  );
}
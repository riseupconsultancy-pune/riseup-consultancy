import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminInquiryDesk from "./AdminInquiryDesk";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Talent Requests & Inquiries | RiseUp Admin CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminInquiriesPage() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Fetch all inquiries sorted by creation date descending
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminInquiryDesk initialInquiries={JSON.parse(JSON.stringify(inquiries))} />
    </div>
  );
}

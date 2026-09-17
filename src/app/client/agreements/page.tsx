import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ClientAgreementsView from "./ClientAgreementsView";

export const metadata = {
  title: "Service Agreements & E-Sign | RiseUp Client Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ClientAgreementsPage() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    redirect("/login");
  }

  const agreements = await prisma.clientAgreement.findMany({
    where: { clientId: session.clientProfileId },
    orderBy: { createdAt: "desc" },
    include: {
      client: {
        select: {
          companyName: true,
          city: true,
          country: true,
        },
      },
      admin: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });

  const formattedAgreements = agreements.map((a) => ({
    id: a.id,
    agreementNumber: a.agreementNumber,
    companyName: a.client.companyName,
    placementFeePercent: a.placementFeePercent,
    paymentTermDays: a.paymentTermDays,
    replacementGuaranteeDays: a.replacementGuaranteeDays,
    termsText: a.termsText,
    hashToken: a.hashToken,
    status: a.status,
    signedByName: a.signedByName,
    signedByDesignation: a.signedByDesignation,
    signedAt: a.signedAt ? a.signedAt.toISOString() : null,
    signerIp: a.signerIp,
    createdAt: a.createdAt.toISOString(),
    adminName: a.admin.fullName,
  }));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ClientAgreementsView agreements={formattedAgreements} />
    </div>
  );
}

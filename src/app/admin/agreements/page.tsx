import React from "react";
import prisma from "@/lib/prisma";
import AgreementManager from "./AgreementManager";

export const dynamic = "force-dynamic";

export default async function AdminAgreementsPage() {
  const [agreementsData, clientsList] = await Promise.all([
    prisma.clientAgreement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            companyName: true,
          },
        },
      },
    }),
    prisma.clientProfile.findMany({
      orderBy: { companyName: "asc" },
      select: {
        id: true,
        companyName: true,
        city: true,
        country: true,
      },
    }),
  ]);

  const formattedAgreements = agreementsData.map((a) => ({
    id: a.id,
    agreementNumber: a.agreementNumber,
    companyName: a.client.companyName,
    placementFeePercent: a.placementFeePercent,
    paymentTermDays: a.paymentTermDays,
    replacementGuaranteeDays: a.replacementGuaranteeDays,
    hashToken: a.hashToken,
    status: a.status,
    signedByName: a.signedByName,
    signedByDesignation: a.signedByDesignation,
    signedAt: a.signedAt ? a.signedAt.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <AgreementManager
      initialAgreements={formattedAgreements}
      clientsList={clientsList}
    />
  );
}
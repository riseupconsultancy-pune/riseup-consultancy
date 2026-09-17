import React from "react";
import prisma from "@/lib/prisma";
import PublicAgreementSigner from "./PublicAgreementSigner";
import { AlertCircle, FileX } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    hashToken: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Execute Recruitment Agreement | RiseUp Consultancy",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PublicAgreementSignPage({ params }: PageProps) {
  const { hashToken } = await params;

  const agreement = await prisma.clientAgreement.findUnique({
    where: { hashToken },
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

  if (!agreement) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-none shadow-xs p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <FileX className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 font-heading">
            Agreement Not Found or Link Expired
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            The requested contract URL is either invalid, revoked, or has expired. Please contact your RiseUp Consultancy account manager to request a fresh signature invitation.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-slate-800 transition-colors"
            >
              Return to RiseUp Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedAgreement = {
    id: agreement.id,
    agreementNumber: agreement.agreementNumber,
    companyName: agreement.client.companyName,
    city: agreement.client.city,
    country: agreement.client.country,
    placementFeePercent: agreement.placementFeePercent,
    paymentTermDays: agreement.paymentTermDays,
    replacementGuaranteeDays: agreement.replacementGuaranteeDays,
    termsText: agreement.termsText,
    hashToken: agreement.hashToken,
    status: agreement.status,
    signedByName: agreement.signedByName,
    signedByDesignation: agreement.signedByDesignation,
    signedAt: agreement.signedAt ? agreement.signedAt.toISOString() : null,
    signerIp: agreement.signerIp,
    createdAt: agreement.createdAt.toISOString(),
    adminName: agreement.admin.fullName,
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PublicAgreementSigner agreement={formattedAgreement} />
      </div>
    </div>
  );
}

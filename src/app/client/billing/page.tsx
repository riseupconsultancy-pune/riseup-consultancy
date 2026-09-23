import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ClientBillingDesk, {
  CandidateBillingItem,
  ClientProfileData,
} from "./ClientBillingDesk";
import { InvoiceData } from "@/components/crm/InvoiceModalView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Billing & Invoices | RiseUp Client Workspace",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ClientBillingPage() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    redirect("/login");
  }

  // 1. Fetch Client Profile
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { id: session.clientProfileId },
  });

  if (!clientProfile) {
    redirect("/login");
  }

  // 2. Fetch Selected Candidates for this client
  const candidatesRaw = await prisma.candidate.findMany({
    where: {
      status: "SELECTED",
      vacancy: {
        clientId: session.clientProfileId,
      },
    },
    include: {
      vacancy: {
        select: {
          title: true,
          category: true,
        },
      },
      invoice: {
        select: {
          id: true,
          invoiceNumber: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedCandidates: CandidateBillingItem[] = candidatesRaw.map((c) => ({
    id: c.id,
    candidateId: c.candidateId,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    vacancyTitle: c.vacancy.title,
    vacancyCategory: c.vacancy.category,
    selectedAt: c.selectedAt ? c.selectedAt.toISOString() : null,
    empId: c.empId,
    process: c.process,
    designation: c.designation,
    dateOfJoining: c.dateOfJoining ? c.dateOfJoining.toISOString() : null,
    billingAmount: c.billingAmount,
    billingInfoStatus: c.billingInfoStatus,
    invoiceId: c.invoiceId,
    invoiceNumber: c.invoice?.invoiceNumber || null,
  }));

  // 3. Fetch Invoices for this client
  const invoicesRaw = await prisma.invoice.findMany({
    where: {
      clientId: session.clientProfileId,
    },
    include: {
      items: {
        orderBy: { srNo: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatDateStr = (d: Date | null) => {
    if (!d) return null;
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedInvoices: InvoiceData[] = invoicesRaw.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    invoiceDate: formatDateStr(inv.invoiceDate) || "",
    dueDate: formatDateStr(inv.dueDate),
    terms: inv.terms,
    billingCycle: inv.billingCycle,
    placeOfSupply: inv.placeOfSupply,

    sellerName: inv.sellerName,
    sellerAddress: inv.sellerAddress,
    sellerGstin: inv.sellerGstin,
    sellerPan: inv.sellerPan,
    sellerHsnSac: inv.sellerHsnSac,
    sellerBankName: inv.sellerBankName,
    sellerAccountName: inv.sellerAccountName,
    sellerAccountNumber: inv.sellerAccountNumber,
    sellerIfsc: inv.sellerIfsc,
    termsText: inv.termsText,

    clientName: inv.clientName,
    clientAddress: inv.clientAddress,
    clientGstin: inv.clientGstin,
    clientContactPerson: inv.clientContactPerson,

    subTotal: inv.subTotal,
    taxesJson: inv.taxesJson,
    taxTotal: inv.taxTotal,
    tdsDeducted: inv.tdsDeducted,
    grandTotal: inv.grandTotal,
    totalInWords: inv.totalInWords,
    balanceDue: inv.balanceDue,

    status: inv.status,
    paymentDate: inv.paymentDate ? inv.paymentDate.toISOString() : null,
    paymentReference: inv.paymentReference,
    clientFeedback: inv.clientFeedback,

    items: inv.items.map((item) => ({
      id: item.id,
      srNo: item.srNo,
      empId: item.empId,
      candidateName: item.candidateName,
      process: item.process,
      designation: item.designation,
      dateOfJoining: formatDateStr(item.dateOfJoining),
      billingAmount: item.billingAmount,
    })),
  }));

  const clientProfileData: ClientProfileData = {
    id: clientProfile.id,
    companyName: clientProfile.companyName,
    city: clientProfile.city,
    country: clientProfile.country,
    contactPerson: clientProfile.contactPerson,
    phone: clientProfile.phone,
    billingAddress: clientProfile.billingAddress,
    billingGstin: clientProfile.billingGstin,
    billingPan: clientProfile.billingPan,
    billingContactPerson: clientProfile.billingContactPerson,
    billingEmail: clientProfile.billingEmail,
    billingPhone: clientProfile.billingPhone,
  };

  return (
    <ClientBillingDesk
      clientProfile={clientProfileData}
      candidates={formattedCandidates}
      invoices={formattedInvoices}
    />
  );
}

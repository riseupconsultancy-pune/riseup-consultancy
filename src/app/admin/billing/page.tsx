import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminBillingDesk, {
  AdminCandidateBillingItem,
  ClientSelectItem,
  ConsultancyConfigData,
  TaxSettingItem,
} from "./AdminBillingDesk";
import { InvoiceData } from "@/components/crm/InvoiceModalView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Billing & Invoices Master Desk | RiseUp Admin Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminBillingPage() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // 1. Fetch Selected Candidates
  const candidatesRaw = await prisma.candidate.findMany({
    where: {
      status: "SELECTED",
    },
    include: {
      vacancy: {
        include: {
          client: {
            select: {
              id: true,
              companyName: true,
            },
          },
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

  const formattedCandidates: AdminCandidateBillingItem[] = candidatesRaw.map((c) => ({
    id: c.id,
    candidateId: c.candidateId,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    clientId: c.vacancy.client.id,
    clientCompanyName: c.vacancy.client.companyName,
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

  // 2. Fetch Clients for dropdown
  const clientsRaw = await prisma.clientProfile.findMany({
    select: {
      id: true,
      companyName: true,
      city: true,
      country: true,
      contactPerson: true,
      phone: true,
      billingAddress: true,
      billingGstin: true,
      billingPan: true,
      billingContactPerson: true,
      billingEmail: true,
      billingPhone: true,
    },
    orderBy: { companyName: "asc" },
  });

  const clients: ClientSelectItem[] = clientsRaw.map((cl) => ({
    id: cl.id,
    companyName: cl.companyName,
    city: cl.city,
    country: cl.country,
    contactPerson: cl.contactPerson,
    phone: cl.phone,
    billingAddress: cl.billingAddress,
    billingGstin: cl.billingGstin,
    billingPan: cl.billingPan,
    billingContactPerson: cl.billingContactPerson,
    billingEmail: cl.billingEmail,
    billingPhone: cl.billingPhone,
  }));

  // 3. Fetch Invoices
  const invoicesRaw = await prisma.invoice.findMany({
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
    clientId: inv.clientId,
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

  // 4. Fetch or Init Consultancy Billing Config
  let config = await prisma.consultancyBillingConfig.findUnique({
    where: { id: "RISEUP_BILLING_CONFIG" },
  });

  if (!config) {
    config = await prisma.consultancyBillingConfig.create({
      data: {
        id: "RISEUP_BILLING_CONFIG",
        companyName: "Rise Up Consultancy Pune",
        tagline: "Staffing and Recruiting Services",
        address:
          "1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.",
        gstin: "27ABLFR4477Q1Z4",
        pan: "ABLFR4477Q",
        hsnSac: "998512",
        placeOfSupply: "Pune",
        bankName: "AU Small Finance Bank",
        bankAccountName: "Rise Up Consultancy Pune",
        bankAccountNumber: "2502261678246645",
        bankIfsc: "AUBL0002616",
        termsText:
          "Payment Due: Net 30 days from invoice date. Late Payments: Overdue invoices incur a 1.5% monthly interest fee plus recovery costs. Queries: Raise billing discrepancies within 7 days of invoice receipt.",
      },
    });
  }

  const consultancyConfigData: ConsultancyConfigData = {
    id: config.id,
    companyName: config.companyName,
    tagline: config.tagline,
    address: config.address,
    gstin: config.gstin,
    pan: config.pan,
    hsnSac: config.hsnSac,
    placeOfSupply: config.placeOfSupply,
    bankName: config.bankName,
    bankAccountName: config.bankAccountName,
    bankAccountNumber: config.bankAccountNumber,
    bankIfsc: config.bankIfsc,
    termsText: config.termsText,
  };

  // 5. Fetch or Init Tax Settings
  let taxesRaw = await prisma.taxSetting.findMany({
    orderBy: { rate: "asc" },
  });

  if (taxesRaw.length === 0) {
    // Seed default CGST 9%, SGST 9%, IGST 18%
    await prisma.taxSetting.createMany({
      data: [
        { name: "CGST", rate: 9.0, isSelectedByDefault: true },
        { name: "SGST", rate: 9.0, isSelectedByDefault: true },
        { name: "IGST", rate: 18.0, isSelectedByDefault: false },
      ],
    });
    taxesRaw = await prisma.taxSetting.findMany({
      orderBy: { rate: "asc" },
    });
  }

  const taxSettingsData: TaxSettingItem[] = taxesRaw.map((t) => ({
    id: t.id,
    name: t.name,
    rate: t.rate,
    isSelectedByDefault: t.isSelectedByDefault,
  }));

  return (
    <AdminBillingDesk
      candidates={formattedCandidates}
      clients={clients}
      invoices={formattedInvoices}
      consultancyConfig={consultancyConfigData}
      taxSettings={taxSettingsData}
    />
  );
}

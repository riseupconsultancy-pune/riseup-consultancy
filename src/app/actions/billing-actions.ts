"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { numberToWordsINR } from "@/lib/number-to-words";

/**
 * 1. Client updates their default company billing profile
 */
export async function updateClientBillingProfileAction(data: {
  billingAddress: string;
  billingGstin?: string;
  billingPan?: string;
  billingContactPerson?: string;
  billingEmail?: string;
  billingPhone?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updated = await prisma.clientProfile.update({
      where: { id: session.clientProfileId },
      data: {
        billingAddress: data.billingAddress.trim(),
        billingGstin: data.billingGstin?.trim().toUpperCase() || null,
        billingPan: data.billingPan?.trim().toUpperCase() || null,
        billingContactPerson: data.billingContactPerson?.trim() || null,
        billingEmail: data.billingEmail?.trim().toLowerCase() || null,
        billingPhone: data.billingPhone?.trim() || null,
      },
    });

    revalidatePath("/client/billing");
    return { success: true, clientProfile: updated };
  } catch (error) {
    console.error("Error updating billing profile:", error);
    return { success: false, error: "Failed to update billing profile." };
  }
}

/**
 * 2. Client submits joining & billing details for a SELECTED candidate
 * Automatically flips candidate status from Yellow (PENDING_INFO) to Green (INFO_SUBMITTED)
 */
export async function submitCandidateJoiningInfoAction(data: {
  candidateId: string;
  empId: string;
  process: string;
  designation: string;
  dateOfJoining: string; // YYYY-MM-DD
  billingAmount: number;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: data.candidateId },
      include: {
        vacancy: true,
      },
    });

    if (!candidate) {
      return { success: false, error: "Candidate not found" };
    }

    if (
      session.role === "CLIENT" &&
      candidate.vacancy.clientId !== session.clientProfileId
    ) {
      return { success: false, error: "Forbidden" };
    }

    const dojDate = new Date(data.dateOfJoining);

    const updated = await prisma.candidate.update({
      where: { id: data.candidateId },
      data: {
        empId: data.empId.trim(),
        process: data.process.trim(),
        designation: data.designation.trim(),
        dateOfJoining: dojDate,
        billingAmount: Number(data.billingAmount),
        billingInfoStatus: "INFO_SUBMITTED", // Changes Yellow -> Green
      },
    });

    revalidatePath("/client/billing");
    revalidatePath("/admin/billing");
    return { success: true, candidate: updated };
  } catch (error) {
    console.error("Error submitting joining info:", error);
    return { success: false, error: "Failed to submit candidate onboarding info." };
  }
}

/**
 * 3. Admin can edit/override candidate billing details directly
 */
export async function updateCandidateBillingByAdminAction(data: {
  candidateId: string;
  empId?: string;
  process?: string;
  designation?: string;
  dateOfJoining?: string;
  billingAmount?: number;
  billingInfoStatus?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  try {
    const updateData: Record<string, unknown> = {};
    if (data.empId !== undefined) updateData.empId = data.empId.trim();
    if (data.process !== undefined) updateData.process = data.process.trim();
    if (data.designation !== undefined) updateData.designation = data.designation.trim();
    if (data.dateOfJoining !== undefined) {
      updateData.dateOfJoining = data.dateOfJoining ? new Date(data.dateOfJoining) : null;
    }
    if (data.billingAmount !== undefined) {
      updateData.billingAmount = Number(data.billingAmount);
    }
    if (data.billingInfoStatus !== undefined) {
      updateData.billingInfoStatus = data.billingInfoStatus;
    }

    const updated = await prisma.candidate.update({
      where: { id: data.candidateId },
      data: updateData,
    });

    revalidatePath("/admin/billing");
    revalidatePath("/client/billing");
    return { success: true, candidate: updated };
  } catch (error) {
    console.error("Error updating candidate billing by admin:", error);
    return { success: false, error: "Failed to update candidate." };
  }
}

/**
 * 4. Super Admin updates consultancy billing config
 */
export async function updateConsultancyBillingConfigAction(data: {
  companyName: string;
  tagline?: string | null;
  address: string;
  gstin: string;
  pan: string;
  hsnSac: string;
  placeOfSupply: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  termsText: string;
}) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  try {
    const config = await prisma.consultancyBillingConfig.upsert({
      where: { id: "RISEUP_BILLING_CONFIG" },
      update: {
        companyName: data.companyName.trim(),
        tagline: data.tagline?.trim() || null,
        address: data.address.trim(),
        gstin: data.gstin.trim().toUpperCase(),
        pan: data.pan.trim().toUpperCase(),
        hsnSac: data.hsnSac.trim(),
        placeOfSupply: data.placeOfSupply.trim(),
        bankName: data.bankName.trim(),
        bankAccountName: data.bankAccountName.trim(),
        bankAccountNumber: data.bankAccountNumber.trim(),
        bankIfsc: data.bankIfsc.trim().toUpperCase(),
        termsText: data.termsText.trim(),
      },
      create: {
        id: "RISEUP_BILLING_CONFIG",
        companyName: data.companyName.trim(),
        tagline: data.tagline?.trim() || null,
        address: data.address.trim(),
        gstin: data.gstin.trim().toUpperCase(),
        pan: data.pan.trim().toUpperCase(),
        hsnSac: data.hsnSac.trim(),
        placeOfSupply: data.placeOfSupply.trim(),
        bankName: data.bankName.trim(),
        bankAccountName: data.bankAccountName.trim(),
        bankAccountNumber: data.bankAccountNumber.trim(),
        bankIfsc: data.bankIfsc.trim().toUpperCase(),
        termsText: data.termsText.trim(),
      },
    });

    revalidatePath("/admin/billing");
    return { success: true, config };
  } catch (error) {
    console.error("Error updating consultancy billing config:", error);
    return { success: false, error: "Failed to update consultancy config." };
  }
}

/**
 * 5. Admin saves tax settings (e.g. CGST 9%, SGST 9%, IGST 18%)
 */
export async function saveTaxSettingsAction(
  taxes: Array<{ id?: string; name: string; rate: number; isSelectedByDefault: boolean }>
) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  try {
    // Delete existing and recreate or update
    await prisma.taxSetting.deleteMany({});
    for (const tax of taxes) {
      await prisma.taxSetting.create({
        data: {
          name: tax.name.trim().toUpperCase(),
          rate: Number(tax.rate),
          isSelectedByDefault: Boolean(tax.isSelectedByDefault),
        },
      });
    }

    revalidatePath("/admin/billing");
    return { success: true };
  } catch (error) {
    console.error("Error saving tax settings:", error);
    return { success: false, error: "Failed to save tax settings." };
  }
}

/**
 * 6. Admin generates an official invoice for verified (Green) candidate(s)
 */
export async function generateInvoiceAction(data: {
  clientId: string;
  candidateIds: string[];
  billingCycle?: string;
  invoiceDate?: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  terms?: string;
  placeOfSupply?: string;
  taxes: Array<{ name: string; rate: number }>;
  tdsDeducted?: number;
}) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  if (!data.candidateIds || data.candidateIds.length === 0) {
    return { success: false, error: "Please select at least one candidate." };
  }

  try {
    // 1. Fetch Client Profile
    const client = await prisma.clientProfile.findUnique({
      where: { id: data.clientId },
    });
    if (!client) {
      return { success: false, error: "Client not found" };
    }

    // 2. Fetch Consultancy Billing Config
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

    // 3. Fetch Selected Candidates
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: data.candidateIds },
      },
    });

    if (candidates.length === 0) {
      return { success: false, error: "Selected candidates not found." };
    }

    // 4. Calculate Subtotal
    let subTotal = 0;
    candidates.forEach((c) => {
      subTotal += Number(c.billingAmount || 0);
    });

    // 5. Calculate Taxes
    let taxTotal = 0;
    const computedTaxes: Array<{ name: string; rate: number; amount: number }> = [];
    if (data.taxes && data.taxes.length > 0) {
      for (const t of data.taxes) {
        const amt = Math.round((subTotal * (t.rate / 100)) * 100) / 100;
        taxTotal += amt;
        computedTaxes.push({
          name: t.name,
          rate: t.rate,
          amount: amt,
        });
      }
    }

    const tdsDeducted = Number(data.tdsDeducted || 0);
    const grandTotal = Math.round((subTotal + taxTotal - tdsDeducted) * 100) / 100;
    const balanceDue = grandTotal;
    const totalInWords = numberToWordsINR(grandTotal);

    // 6. Generate sequential invoice number (e.g. RUP-INV-1001)
    const counter = await prisma.systemCounter.upsert({
      where: { id: "INVOICE_COUNTER" },
      update: { currentValue: { increment: 1 } },
      create: { id: "INVOICE_COUNTER", currentValue: 1001 },
    });
    const invoiceNumber = `RUP-INV-${counter.currentValue}`;

    const invDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date();
    let dueDate: Date | null = null;
    if (data.dueDate) {
      dueDate = new Date(data.dueDate);
    } else {
      // Default to 30 days after invoice date
      dueDate = new Date(invDate);
      dueDate.setDate(dueDate.getDate() + 30);
    }

    // 7. Create Invoice and Items in a transaction
    const invoice = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId: client.id,
          invoiceDate: invDate,
          dueDate,
          terms: data.terms || "Net 30 Days",
          billingCycle: data.billingCycle || null,
          placeOfSupply: data.placeOfSupply || config?.placeOfSupply || "Pune",

          sellerName: config?.companyName || "Rise Up Consultancy Pune",
          sellerAddress: config?.address || "",
          sellerGstin: config?.gstin || "",
          sellerPan: config?.pan || "",
          sellerHsnSac: config?.hsnSac || "998512",
          sellerBankName: config?.bankName || "",
          sellerAccountName: config?.bankAccountName || "",
          sellerAccountNumber: config?.bankAccountNumber || "",
          sellerIfsc: config?.bankIfsc || "",
          termsText: config?.termsText || "",

          clientName: client.companyName,
          clientAddress: client.billingAddress || `${client.city}, ${client.country}`,
          clientGstin: client.billingGstin || null,
          clientContactPerson: client.billingContactPerson || client.contactPerson || null,

          subTotal,
          taxesJson: JSON.stringify(computedTaxes),
          taxTotal,
          tdsDeducted,
          grandTotal,
          totalInWords,
          balanceDue,
          status: "SENT",
        },
      });

      // Create line items
      for (let i = 0; i < candidates.length; i++) {
        const c = candidates[i];
        await tx.invoiceItem.create({
          data: {
            invoiceId: inv.id,
            candidateId: c.id,
            srNo: i + 1,
            empId: c.empId || null,
            candidateName: c.fullName,
            process: c.process || null,
            designation: c.designation || null,
            dateOfJoining: c.dateOfJoining || null,
            billingAmount: Number(c.billingAmount || 0),
          },
        });

        // Mark candidate as INVOICED
        await tx.candidate.update({
          where: { id: c.id },
          data: {
            billingInfoStatus: "INVOICED",
            invoiceId: inv.id,
          },
        });
      }

      return inv;
    });

    revalidatePath("/admin/billing");
    revalidatePath("/client/billing");
    return { success: true, invoice };
  } catch (error) {
    console.error("Error generating invoice:", error);
    return { success: false, error: "Failed to generate invoice." };
  }
}

/**
 * 7. Mark invoice as paid
 */
export async function markInvoicePaidAction(data: {
  invoiceId: string;
  paymentDate: string;
  paymentReference: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
    });

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (
      session.role === "CLIENT" &&
      invoice.clientId !== session.clientProfileId
    ) {
      return { success: false, error: "Forbidden" };
    }

    const payDate = new Date(data.paymentDate);

    const updated = await prisma.invoice.update({
      where: { id: data.invoiceId },
      data: {
        status: "PAID",
        paymentDate: payDate,
        paymentReference: data.paymentReference.trim(),
        balanceDue: 0,
      },
    });

    revalidatePath("/client/billing");
    revalidatePath("/admin/billing");
    return { success: true, invoice: updated };
  } catch (error) {
    console.error("Error marking invoice paid:", error);
    return { success: false, error: "Failed to update payment status." };
  }
}

/**
 * 8. Client requests revision or submits feedback
 */
export async function requestInvoiceRevisionAction(data: {
  invoiceId: string;
  feedback: string;
}) {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
    });

    if (!invoice || invoice.clientId !== session.clientProfileId) {
      return { success: false, error: "Invoice not found or access denied" };
    }

    const updated = await prisma.invoice.update({
      where: { id: data.invoiceId },
      data: {
        status: "REVISION_REQUESTED",
        clientFeedback: data.feedback.trim(),
      },
    });

    revalidatePath("/client/billing");
    revalidatePath("/admin/billing");
    return { success: true, invoice: updated };
  } catch (error) {
    console.error("Error requesting revision:", error);
    return { success: false, error: "Failed to submit revision request." };
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInvoiceDocxBuffer } from "@/lib/invoice-docx-generator";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
          orderBy: { srNo: "asc" },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Role check: Client can only download their own invoice; Super Admin can download any
    if (session.role === "CLIENT" && invoice.clientId !== session.clientProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse taxes from taxesJson
    let parsedTaxes: Array<{ name: string; rate: number; amount: number }> = [];
    try {
      parsedTaxes = JSON.parse(invoice.taxesJson || "[]");
    } catch {
      parsedTaxes = [];
    }

    // Format dates as DD/MM/YYYY
    const formatDate = (date: Date | null) => {
      if (!date) return "";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const docxBuffer = await generateInvoiceDocxBuffer({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: formatDate(invoice.invoiceDate),
      dueDate: invoice.dueDate ? formatDate(invoice.dueDate) : "",
      terms: invoice.terms,
      placeOfSupply: invoice.placeOfSupply,
      seller: {
        companyName: invoice.sellerName,
        address: invoice.sellerAddress,
        gstin: invoice.sellerGstin,
        pan: invoice.sellerPan,
        hsnSac: invoice.sellerHsnSac,
        bankName: invoice.sellerBankName,
        accountName: invoice.sellerAccountName,
        accountNumber: invoice.sellerAccountNumber,
        ifsc: invoice.sellerIfsc,
        termsText: invoice.termsText,
      },
      client: {
        companyName: invoice.clientName,
        address: invoice.clientAddress,
        gstin: invoice.clientGstin,
      },
      items: invoice.items.map((item) => ({
        srNo: item.srNo,
        empId: item.empId,
        candidateName: item.candidateName,
        process: item.process,
        designation: item.designation,
        dateOfJoining: item.dateOfJoining ? formatDate(item.dateOfJoining) : "-",
        billingAmount: item.billingAmount,
      })),
      subTotal: invoice.subTotal,
      taxes: parsedTaxes,
      tdsDeducted: invoice.tdsDeducted,
      grandTotal: invoice.grandTotal,
      totalInWords: invoice.totalInWords,
      balanceDue: invoice.balanceDue,
    });

    const filename = `${invoice.invoiceNumber}.docx`;

    return new NextResponse(docxBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(docxBuffer.length),
      },
    });
  } catch (error) {
    console.error("Error generating invoice docx:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}

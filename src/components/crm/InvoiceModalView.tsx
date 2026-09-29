"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Calendar,
  CreditCard
} from "lucide-react";

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientId?: string;
  invoiceDate: string;
  dueDate: string | null;
  terms: string;
  billingCycle: string | null;
  placeOfSupply: string;

  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  sellerPan: string;
  sellerHsnSac: string;
  sellerBankName: string;
  sellerAccountName: string;
  sellerAccountNumber: string;
  sellerIfsc: string;
  termsText: string;

  clientName: string;
  clientAddress: string;
  clientGstin: string | null;
  clientContactPerson: string | null;

  subTotal: number;
  taxesJson: string;
  taxTotal: number;
  tdsDeducted: number;
  grandTotal: number;
  totalInWords: string;
  balanceDue: number;

  status: string; // DRAFT, SENT, PAID, REVISION_REQUESTED
  paymentDate?: string | null;
  paymentReference?: string | null;
  clientFeedback?: string | null;

  items: Array<{
    id: string;
    srNo: number;
    empId: string | null;
    candidateName: string;
    process: string | null;
    designation: string | null;
    dateOfJoining: string | null;
    billingAmount: number;
  }>;
}

interface InvoiceModalViewProps {
  invoice: InvoiceData;
  onClose: () => void;
  onMarkPaid?: () => void;
  onRequestRevision?: () => void;
  canMarkPaid?: boolean;
  canRequestRevision?: boolean;
}

export default function InvoiceModalView({
  invoice,
  onClose,
  onMarkPaid,
  onRequestRevision,
  canMarkPaid = false,
  canRequestRevision = false,
}: InvoiceModalViewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  let taxes: Array<{ name: string; rate: number; amount: number }> = [];
  try {
    taxes = JSON.parse(invoice.taxesJson || "[]");
  } catch {
    taxes = [];
  }

  const formatCurrency = (amt: number) => {
    return amt.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: amt % 1 === 0 ? 0 : 2,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-950 text-white border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base tracking-tight font-mono">{invoice.invoiceNumber}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs ${
                    invoice.status === "PAID"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : invoice.status === "REVISION_REQUESTED"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {invoice.status === "PAID"
                    ? "Paid"
                    : invoice.status === "REVISION_REQUESTED"
                    ? "Revision Requested"
                    : "Sent / Pending"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Bill &bull; {invoice.clientName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canMarkPaid && invoice.status !== "PAID" && onMarkPaid && (
              <button
                onClick={onMarkPaid}
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all min-h-[40px] cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Paid</span>
              </button>
            )}

            {canRequestRevision && invoice.status !== "PAID" && onRequestRevision && (
              <button
                onClick={onRequestRevision}
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all min-h-[40px] cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Request Revision</span>
              </button>
            )}

            <a
              href={`/api/invoices/${invoice.id}/download-docx`}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all min-h-[40px] cursor-pointer"
              title="Download Editable Microsoft Word (.docx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.docx)</span>
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] cursor-pointer"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Revision Alert banner if applicable */}
        {invoice.clientFeedback && (
          <div className="print:hidden bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs text-amber-900 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Client Revision Feedback: </span>
              <span>{invoice.clientFeedback}</span>
            </div>
          </div>
        )}

        {/* Invoice Printable Sheet (Strictly matching invoice_format.docx) */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-[800px] bg-white text-slate-900 border border-slate-300 shadow-md p-6 sm:p-10 font-sans print:border-none print:shadow-none print:p-0"
            style={{ minHeight: "1000px" }}
          >
            {/* Header: Letterhead from invoice_format.docx */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 relative shrink-0">
                    <Image
                      src="/brand/invoice/logo.jpeg"
                      alt="Rise Up Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                      {invoice.sellerName.toUpperCase()}
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-600 uppercase mt-1">
                      Staffing and Recruiting Services
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm tracking-widest uppercase rounded-none">
                    INVOICE
                  </span>
                </div>
              </div>
            </div>

            {/* Table 0: Top Meta Grid */}
            <div className="border border-slate-400 grid grid-cols-1 sm:grid-cols-2 text-xs mb-4">
              <div className="p-2.5 border-b sm:border-b-0 sm:border-r border-slate-400 space-y-1">
                <p>
                  <strong className="font-bold text-slate-900">Address: </strong>
                  <span className="text-slate-800">{invoice.sellerAddress}</span>
                </p>
                <p>
                  <strong className="font-bold text-slate-900">Place of Supply: </strong>
                  <span className="text-slate-800">{invoice.placeOfSupply}</span>
                </p>
              </div>

              <div className="p-2.5 space-y-1">
                <div className="flex justify-between">
                  <p>
                    <strong className="font-bold text-slate-900">GSTIN: </strong>
                    <span className="text-slate-800">{invoice.sellerGstin}</span>
                  </p>
                  <p>
                    <strong className="font-bold text-slate-900">PAN: </strong>
                    <span className="text-slate-800">{invoice.sellerPan}</span>
                  </p>
                </div>
                <p>
                  <strong className="font-bold text-slate-900">HSN/SAC No. : </strong>
                  <span className="text-slate-800">{invoice.sellerHsnSac}</span>
                </p>
                <div className="pt-1 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <p>
                    <strong className="font-bold text-slate-900">Invoice No.: </strong>
                    <span className="font-bold text-blue-700">{invoice.invoiceNumber}</span>
                  </p>
                  <p>
                    <strong className="font-bold text-slate-900">Invoice Date: </strong>
                    <span className="text-slate-800">{invoice.invoiceDate}</span>
                  </p>
                  <p>
                    <strong className="font-bold text-slate-900">Terms: </strong>
                    <span className="text-slate-800">{invoice.terms}</span>
                  </p>
                  <p>
                    <strong className="font-bold text-slate-900">Due Date: </strong>
                    <span className="text-slate-800">{invoice.dueDate || "-"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Table 1: Bill To */}
            <div className="border border-slate-400 p-2.5 text-xs mb-4 bg-slate-50/50">
              <p className="font-bold text-slate-900 text-sm mb-1 underline">Bill To,</p>
              <div className="space-y-0.5 text-slate-800">
                <p>
                  <strong className="font-semibold text-slate-900">Client / Company Name: </strong>
                  <span className="font-bold text-slate-900">{invoice.clientName}</span>
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">Address: </strong>
                  <span>{invoice.clientAddress}</span>
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">GSTIN: </strong>
                  <span className="font-mono">{invoice.clientGstin || "N/A"}</span>
                </p>
                {invoice.clientContactPerson && (
                  <p>
                    <strong className="font-semibold text-slate-900">Attention: </strong>
                    <span>{invoice.clientContactPerson}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Table 2: Candidate Line Items */}
            <div className="border border-slate-400 overflow-x-auto mb-4">
              <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-200 border-b border-slate-400 font-bold text-slate-900">
                    <th className="py-2 px-2 border-r border-slate-400 text-center w-12">SR No.</th>
                    <th className="py-2 px-2 border-r border-slate-400 text-center w-20">Emp ID</th>
                    <th className="py-2 px-2 border-r border-slate-400">Candidate Name</th>
                    <th className="py-2 px-2 border-r border-slate-400 text-center">Process</th>
                    <th className="py-2 px-2 border-r border-slate-400">Designation</th>
                    <th className="py-2 px-2 border-r border-slate-400 text-center w-24">DOJ</th>
                    <th className="py-2 px-2 text-right w-28">Billing Amt (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="py-2 px-2 border-r border-slate-400 text-center font-medium">
                        {item.srNo}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-400 text-center font-mono">
                        {item.empId || "-"}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-400 font-semibold text-slate-900">
                        {item.candidateName}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-400 text-center">
                        {item.process || "-"}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-400">
                        {item.designation || "-"}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-400 text-center font-mono">
                        {item.dateOfJoining || "-"}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-medium">
                        {formatCurrency(item.billingAmount)}
                      </td>
                    </tr>
                  ))}
                  {/* Total row at bottom of Table 2 */}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-900">
                    <td colSpan={5} className="py-2 px-2 border-r border-slate-400"></td>
                    <td className="py-2 px-2 border-r border-slate-400 text-center uppercase tracking-wider">
                      TOTAL
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-sm">
                      {formatCurrency(invoice.subTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 3: Amount Summary */}
            <div className="flex justify-end mb-3">
              <div className="w-full sm:w-80 border border-slate-400 text-xs">
                <div className="grid grid-cols-2 bg-slate-200 border-b border-slate-400 font-bold p-1.5">
                  <span>Amount Summary</span>
                  <span className="text-right">Amount (₹)</span>
                </div>
                <div className="divide-y divide-slate-300">
                  <div className="grid grid-cols-2 p-1.5">
                    <span className="text-slate-700">Sub Total</span>
                    <span className="text-right font-mono">{formatCurrency(invoice.subTotal)}</span>
                  </div>

                  {taxes.map((t, i) => (
                    <div key={i} className="grid grid-cols-2 p-1.5">
                      <span className="text-slate-700">{t.name} @ {t.rate}%</span>
                      <span className="text-right font-mono">{formatCurrency(t.amount)}</span>
                    </div>
                  ))}

                  {invoice.tdsDeducted > 0 && (
                    <div className="grid grid-cols-2 p-1.5 text-rose-700">
                      <span>TDS Deducted</span>
                      <span className="text-right font-mono">-{formatCurrency(invoice.tdsDeducted)}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 p-1.5 bg-slate-100 font-bold text-slate-900 text-sm">
                    <span>GRAND TOTAL</span>
                    <span className="text-right font-mono text-blue-700">
                      ₹{formatCurrency(invoice.grandTotal)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 p-1.5 font-semibold text-slate-900">
                    <span>Balance Due</span>
                    <span className="text-right font-mono">
                      ₹{formatCurrency(invoice.balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total in Words */}
            <div className="border-b border-slate-300 pb-2 mb-4 text-xs">
              <p>
                <strong className="font-bold text-slate-900">Total in Words: </strong>
                <span className="font-serif italic font-semibold text-slate-800 underline decoration-slate-400">
                  {invoice.totalInWords}
                </span>
              </p>
            </div>

            {/* Table 4: Bank Details & Authorized Signature */}
            <div className="border border-slate-400 grid grid-cols-1 sm:grid-cols-2 text-xs mb-4">
              <div className="p-3 border-b sm:border-b-0 sm:border-r border-slate-400 space-y-1">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-300 pb-1 mb-1.5">
                  BANK DETAILS
                </p>
                <p>
                  <strong className="text-slate-900">Bank Name: </strong>
                  <span>{invoice.sellerBankName}</span>
                </p>
                <p>
                  <strong className="text-slate-900">Account Name: </strong>
                  <span>{invoice.sellerAccountName}</span>
                </p>
                <p>
                  <strong className="text-slate-900">Account Number: </strong>
                  <span className="font-mono font-bold">{invoice.sellerAccountNumber}</span>
                </p>
                <p>
                  <strong className="text-slate-900">IFSC Code: </strong>
                  <span className="font-mono font-bold">{invoice.sellerIfsc}</span>
                </p>
              </div>

              <div className="p-3 flex flex-col justify-between items-center sm:items-end text-right">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-300 pb-1 w-full text-center sm:text-right">
                  Authorized Signature
                </p>
                <div className="my-2 relative w-36 h-20">
                  <Image
                    src="/brand/invoice/stamp.png"
                    alt="Authorized Stamp & Sign"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-[11px] text-slate-600 font-medium">Signature with Stamp</p>
              </div>
            </div>

            {/* Table 5: Terms & Conditions */}
            <div className="border border-slate-400 p-2.5 text-xs bg-slate-50/50">
              <p className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">
                Terms & Conditions
              </p>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {invoice.termsText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

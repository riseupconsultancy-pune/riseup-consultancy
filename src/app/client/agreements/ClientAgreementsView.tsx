"use client";

import React, { useState } from "react";
import { 
  FileCheck, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Eye, 
  PenTool, 
  Copy, 
  Check, 
  X, 
  Building2, 
  AlertCircle,
  ExternalLink,
  DollarSign,
  Calendar
} from "lucide-react";
import { signClientAgreementAction } from "@/app/actions/client-actions";

interface AgreementItem {
  id: string;
  agreementNumber: string;
  companyName: string;
  placementFeePercent: number;
  paymentTermDays: number;
  replacementGuaranteeDays: number;
  termsText: string;
  hashToken: string;
  status: string;
  signedByName: string | null;
  signedByDesignation: string | null;
  signedAt: string | null;
  signerIp: string | null;
  createdAt: string;
  adminName: string;
}

interface ClientAgreementsViewProps {
  agreements: AgreementItem[];
}

export default function ClientAgreementsView({ agreements: initialAgreements }: ClientAgreementsViewProps) {
  const [agreements, setAgreements] = useState<AgreementItem[]>(initialAgreements);
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementItem | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // E-Sign Form State
  const [signedByName, setSignedByName] = useState("");
  const [signedByDesignation, setSignedByDesignation] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCopyLink = (hashToken: string) => {
    const url = `${window.location.origin}/agreement/sign/${hashToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(hashToken);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleOpenModal = (agreement: AgreementItem) => {
    setSelectedAgreement(agreement);
    setSignedByName(agreement.signedByName || "");
    setSignedByDesignation(agreement.signedByDesignation || "");
    setAgreedToTerms(agreement.status === "SIGNED");
    setErrorMessage(null);
  };

  const handleExecuteSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgreement) return;

    if (!signedByName.trim() || !signedByDesignation.trim()) {
      setErrorMessage("Please enter your full legal name and official designation.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("You must accept the terms of the recruitment service agreement.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const data = new FormData();
      data.append("agreementId", selectedAgreement.id);
      data.append("signedByName", signedByName.trim());
      data.append("signedByDesignation", signedByDesignation.trim());

      const res = await signClientAgreementAction(data);
      if (res.success) {
        setSuccessMessage(res.message || "Agreement signed successfully!");
        setAgreements((prev) =>
          prev.map((a) =>
            a.id === selectedAgreement.id
              ? {
                  ...a,
                  status: "SIGNED",
                  signedByName: signedByName.trim(),
                  signedByDesignation: signedByDesignation.trim(),
                  signedAt: new Date().toISOString(),
                }
              : a
          )
        );
        setSelectedAgreement((prev) =>
          prev
            ? {
                ...prev,
                status: "SIGNED",
                signedByName: signedByName.trim(),
                signedByDesignation: signedByDesignation.trim(),
                signedAt: new Date().toISOString(),
              }
            : null
        );
      } else {
        setErrorMessage(res.error || "Failed to execute signature.");
      }
    } catch {
      setErrorMessage("Network error while submitting signature.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Corporate Legal Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Recruitment Service Agreements & E-Sign
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review legal staffing terms, candidate placement fee milestones, replacement guarantees, and execute digital signatures.
          </p>
        </div>
      </div>

      {/* Global Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 text-xs font-medium flex items-center justify-between rounded-none animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-bold uppercase text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Agreements List */}
      {agreements.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            No Service Agreements on File
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When RiseUp Consultancy drafts your customized Master Recruitment Service Agreement, it will appear here for review and digital signature.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {agreements.map((agreement) => {
            const isSigned = agreement.status === "SIGNED";

            return (
              <div
                key={agreement.id}
                className="bg-white border border-slate-200 rounded-none shadow-xs p-5 sm:p-6 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Agreement Identity & Commercials */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 border border-slate-200">
                        {agreement.agreementNumber}
                      </span>

                      {isSigned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Executed & Signed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5">
                          <Clock className="w-3 h-3" />
                          Awaiting Digital Signature
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        Issued by {agreement.adminName}
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                      Master Recruitment & Staffing Agreement &bull; {agreement.companyName}
                    </h2>

                    {/* Key Commercial Terms Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Placement Fee
                        </span>
                        <span className="font-extrabold text-blue-600 text-sm">
                          {agreement.placementFeePercent}% of Annual CTC
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Payment Timeline
                        </span>
                        <span className="font-semibold text-slate-800">
                          {agreement.paymentTermDays} Days from Joining
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Replacement Warranty
                        </span>
                        <span className="font-semibold text-slate-800">
                          {agreement.replacementGuaranteeDays} Days Free Replacement
                        </span>
                      </div>
                    </div>

                    {isSigned && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Digitally signed by <strong>{agreement.signedByName}</strong> ({agreement.signedByDesignation}) on {new Date(agreement.signedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenModal(agreement)}
                      className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs text-center ${
                        isSigned
                          ? "bg-slate-900 hover:bg-slate-800 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {isSigned ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Signed Contract</span>
                        </>
                      ) : (
                        <>
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Review & E-Sign</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyLink(agreement.hashToken)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors rounded-none border border-slate-300"
                    >
                      {copiedToken === agreement.hashToken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Direct Sign Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL CONTRACT & E-SIGN MODAL */}
      {selectedAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-none shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                    {selectedAgreement.agreementNumber} &bull; Master Recruitment Service Agreement
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    RiseUp Consultancy & {selectedAgreement.companyName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Legal Document Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 text-xs leading-relaxed bg-white">
              {/* Document Header */}
              <div className="text-center pb-6 border-b border-slate-200 space-y-1">
                <div className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Official Legal Mandate
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 uppercase font-heading">
                  Recruitment & Placement Service Agreement
                </h1>
                <p className="text-slate-500 text-[11px]">
                  Governed by the Contract Act & Commercial Staffing Regulations
                </p>
              </div>

              {/* Parties Declaration */}
              <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                <p>
                  This Recruitment Service Agreement is made between:
                </p>
                <p>
                  <strong>1. RISEUP CONSULTANCY</strong> (Headquartered at Pune, India, with authorized operations in India & Nigeria), hereinafter referred to as the <em>&quot;Agency&quot;</em>.
                </p>
                <p>
                  <strong>2. {selectedAgreement.companyName.toUpperCase()}</strong>, hereinafter referred to as the <em>&quot;Client&quot;</em>.
                </p>
              </div>

              {/* Standard Legal Clauses */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs">
                    1. Scope of Staffing Services
                  </h4>
                  <p className="text-slate-600 mt-1">
                    The Agency shall act as a professional search and recruitment consultancy to identify, pre-screen, and forward suitable candidate profiles for full-time, part-time, or contract openings requested by the Client across BPO, BPM, IT, and back-office divisions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs">
                    2. Commercial Fee Structure
                  </h4>
                  <p className="text-slate-600 mt-1">
                    In consideration of successful candidate placements, the Client agrees to pay the Agency a professional placement fee of <strong>{selectedAgreement.placementFeePercent}%</strong> of the candidate&apos;s annualized gross Cost to Company (CTC) / agreed annual compensation.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs">
                    3. Invoicing & 30-Day Payment Terms
                  </h4>
                  <p className="text-slate-600 mt-1">
                    Invoices shall be raised upon the candidate&apos;s official joining date. Payment shall be due strictly within <strong>{selectedAgreement.paymentTermDays} calendar days</strong> from the date of the candidate&apos;s joining.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs">
                    4. Candidate Replacement Warranty
                  </h4>
                  <p className="text-slate-600 mt-1">
                    If any selected candidate leaves the Client&apos;s employment voluntarily or is terminated for performance within <strong>{selectedAgreement.replacementGuaranteeDays} calendar days</strong> of their joining date, the Agency undertakes to provide a free replacement candidate for the same role profile, subject to the invoice having been settled within the agreed 30-day payment term.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs">
                    5. Non-Solicitation & Candidate Exclusivity
                  </h4>
                  <p className="text-slate-600 mt-1">
                    Any candidate profile submitted by the Agency to the Client carrying the official recruiter referral tag remains the proprietary introduction of RiseUp Consultancy for a period of twelve (12) months. If the Client hires the candidate directly or through another channel within this period, standard placement fees shall remain payable.
                  </p>
                </div>

                {selectedAgreement.termsText && (
                  <div className="pt-2 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">
                      6. Additional Commercial Addenda
                    </h4>
                    <p className="text-slate-600 mt-1 whitespace-pre-line">
                      {selectedAgreement.termsText}
                    </p>
                  </div>
                )}
              </div>

              {/* Digital E-Sign Form / Status Box */}
              {selectedAgreement.status === "SIGNED" ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold uppercase text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Agreement Digitally Executed & Bound
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-900 pt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Authorized Signatory</span>
                      <span className="font-bold">{selectedAgreement.signedByName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Designation</span>
                      <span className="font-bold">{selectedAgreement.signedByDesignation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Execution Timestamp</span>
                      <span className="font-mono">{new Date(selectedAgreement.signedAt!).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Signer IP Stamp</span>
                      <span className="font-mono">{selectedAgreement.signerIp || "Verified Secure Session"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleExecuteSignature} className="p-5 bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold uppercase text-xs border-b border-slate-200 pb-2">
                    <PenTool className="w-4 h-4 text-blue-600" />
                    Digital Signature Execution Desk
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Full Legal Name of Signatory <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Deshmukh"
                        value={signedByName}
                        onChange={(e) => setSignedByName(e.target.value)}
                        className="w-full bg-white border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Official Corporate Designation <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Director of Human Resources / VP Talent"
                        value={signedByDesignation}
                        onChange={(e) => setSignedByDesignation(e.target.value)}
                        className="w-full bg-white border border-slate-300 p-2 text-xs font-semibold text-slate-900 rounded-none focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="agreementConsent"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded-none focus:ring-0"
                    />
                    <label htmlFor="agreementConsent" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                      I confirm that I am an authorized signatory of <strong>{selectedAgreement.companyName}</strong> and have full legal capacity to execute this recruitment service agreement. My electronic submission constitutes a binding contract.
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? "Executing E-Signature..." : "Execute & Sign Agreement"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedAgreement(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileCheck, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  PenTool, 
  Building2, 
  Clock, 
  ArrowLeft,
  Lock
} from "lucide-react";
import { signPublicAgreementAction } from "@/app/actions/client-actions";

interface PublicAgreementSignerProps {
  agreement: {
    id: string;
    agreementNumber: string;
    companyName: string;
    city: string;
    country: string;
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
  };
}

export default function PublicAgreementSigner({ agreement: initialAgreement }: PublicAgreementSignerProps) {
  const [agreement, setAgreement] = useState(initialAgreement);
  const [signedByName, setSignedByName] = useState("");
  const [signedByDesignation, setSignedByDesignation] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSigned = agreement.status === "SIGNED";

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signedByName.trim() || !signedByDesignation.trim()) {
      setErrorMessage("Please enter your full legal name and official corporate designation.");
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
      data.append("hashToken", agreement.hashToken);
      data.append("signedByName", signedByName.trim());
      data.append("signedByDesignation", signedByDesignation.trim());

      const res = await signPublicAgreementAction(data);
      if (res.success) {
        setSuccessMessage(res.message || "Agreement executed successfully!");
        setAgreement((prev) => ({
          ...prev,
          status: "SIGNED",
          signedByName: signedByName.trim(),
          signedByDesignation: signedByDesignation.trim(),
          signedAt: new Date().toISOString(),
        }));
      } else {
        setErrorMessage(res.error || "Failed to execute agreement.");
      }
    } catch {
      setErrorMessage("Network error while submitting signature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              RiseUp Consultancy &bull; Legal Affairs Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            Master Recruitment Service Agreement Execution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">
            Mandate: {agreement.agreementNumber} &bull; Prepared for {agreement.companyName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted Contract</span>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 text-xs font-medium flex items-center gap-2 rounded-none animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Contract Paper */}
      <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 sm:p-10 space-y-8">
        {/* Document Header */}
        <div className="text-center pb-8 border-b border-slate-200 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Confidential Commercial Contract
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 uppercase font-heading tracking-tight">
            Recruitment & Placement Service Agreement
          </h2>
          <p className="text-xs text-slate-500">
            Binding between RiseUp Consultancy and {agreement.companyName}
          </p>
        </div>

        {/* Commercial Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Placement Fee
            </span>
            <span className="font-extrabold text-blue-600 text-base">
              {agreement.placementFeePercent}% of Annual CTC
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Payment Maturity
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
              {agreement.replacementGuaranteeDays} Days Guarantee
            </span>
          </div>
        </div>

        {/* Parties Description */}
        <div className="p-4 bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>
            This Recruitment Mandate Agreement (&quot;Agreement&quot;) is executed between:
          </p>
          <p>
            <strong>1. RISEUP CONSULTANCY</strong>, a professional staffing enterprise having its corporate headquarters at Pune, Maharashtra, India, and authorized recruitment corridors in India and Nigeria (&quot;Agency&quot;).
          </p>
          <p>
            <strong>2. {agreement.companyName.toUpperCase()}</strong>, located at {agreement.city}, {agreement.country} (&quot;Client&quot;).
          </p>
        </div>

        {/* Standard Clauses */}
        <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-900 uppercase text-xs">
              Clause 1: Scope of Services & Candidate Sourcing
            </h3>
            <p className="text-slate-600 mt-1">
              The Agency agrees to source, pre-screen, and present candidates for job vacancies requested by the Client across BPO, BPM, Back Office, IT, and specialized corporate mandates. All referred candidates shall carry the official recruiter referral tag.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-xs">
              Clause 2: Commercial Terms & Professional Fees
            </h3>
            <p className="text-slate-600 mt-1">
              For every candidate selected and hired by the Client through the Agency&apos;s referral, the Client agrees to compensate the Agency a professional placement fee of <strong>{agreement.placementFeePercent}%</strong> of the candidate&apos;s annualized gross Cost to Company (CTC).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-xs">
              Clause 3: Invoicing & Payment Terms
            </h3>
            <p className="text-slate-600 mt-1">
              Placement invoices shall be raised upon the candidate&apos;s verified date of joining. Invoices are strictly payable within <strong>{agreement.paymentTermDays} calendar days</strong> from the candidate&apos;s date of joining.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-xs">
              Clause 4: Candidate Tenure & Replacement Guarantee
            </h3>
            <p className="text-slate-600 mt-1">
              Should a placed candidate voluntarily resign or be terminated for performance within <strong>{agreement.replacementGuaranteeDays} calendar days</strong> of their joining date, the Agency will provide one (1) replacement candidate at no extra cost, provided the initial placement fee was remitted within the stipulated 30-day timeline.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-xs">
              Clause 5: Non-Solicitation & Candidate Exclusivity
            </h3>
            <p className="text-slate-600 mt-1">
              Candidate resumes submitted by the Agency are confidential and proprietary. In the event the Client engages, hires, or contracts any referred candidate within twelve (12) months from referral date, the Client remains liable for full placement compensation.
            </p>
          </div>

          {agreement.termsText && (
            <div className="pt-2 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 uppercase text-xs">
                Clause 6: Special Mandate Conditions & Addenda
              </h3>
              <p className="text-slate-600 mt-1 whitespace-pre-line">
                {agreement.termsText}
              </p>
            </div>
          )}
        </div>

        {/* E-Signature Box */}
        {isSigned ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold uppercase text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Contract Digitally Signed & Legally Executed</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-emerald-950 pt-2 border-t border-emerald-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Authorized Corporate Signatory
                </span>
                <span className="font-extrabold text-sm">{agreement.signedByName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Designation / Role
                </span>
                <span className="font-semibold">{agreement.signedByDesignation}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Timestamp of Execution
                </span>
                <span className="font-mono">
                  {agreement.signedAt ? new Date(agreement.signedAt).toLocaleString() : "Verified"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Signer Network IP Stamp
                </span>
                <span className="font-mono">{agreement.signerIp || "Secure Recorded Session"}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSign} className="p-6 bg-slate-50 border border-slate-200 space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold uppercase text-xs border-b border-slate-200 pb-3">
              <PenTool className="w-4 h-4 text-blue-600" />
              <span>Authorized Digital Signature Submission</span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Legal Name of Signatory <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adebayo Ogunlesi"
                  value={signedByName}
                  onChange={(e) => setSignedByName(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 rounded-none focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Official Corporate Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director / Chief People Officer"
                  value={signedByDesignation}
                  onChange={(e) => setSignedByDesignation(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 rounded-none focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="publicAgreementConsent"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded-none focus:ring-0"
              />
              <label htmlFor="publicAgreementConsent" className="text-xs text-slate-600 leading-snug cursor-pointer">
                I hereby declare that I am duly authorized on behalf of <strong>{agreement.companyName}</strong> to execute this recruitment mandate. By clicking the button below, I legally bind the company to the terms set forth herein.
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Executing Digital Signature..." : "Execute & Sign Master Agreement"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

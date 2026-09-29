"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Check, 
  Copy, 
  ExternalLink, 
  Building2, 
  Calendar, 
  AlertCircle,
  X,
  FileCheck
} from "lucide-react";
import { createAgreementAction } from "@/app/actions/admin-actions";

interface AgreementRecord {
  id: string;
  agreementNumber: string;
  companyName: string;
  placementFeePercent: number;
  paymentTermDays: number;
  replacementGuaranteeDays: number;
  hashToken: string;
  status: string;
  signedByName: string | null;
  signedByDesignation: string | null;
  signedAt: string | null;
  createdAt: string;
}

interface ClientOption {
  id: string;
  companyName: string;
  city: string;
  country: string;
}

const DEFAULT_TERMS = `RECRUITMENT SERVICES & PLACEMENT AGREEMENT

1. SCOPE OF SERVICES:
RiseUp Consultancy ("Agency") agrees to source, screen, and refer qualified candidate profiles to the Client ("Company") for available employment mandates in India and Nigeria.

2. PROFESSIONAL PLACEMENT FEE:
The Company agrees to pay the Agency a professional fee calculated as an agreed percentage (8.33% standard) of the placed candidate''s Gross Annual Cost to Company (CTC), or an agreed fixed commercial rate per joined candidate.

3. INVOICE & PAYMENT TERMS:
Invoices will be raised upon the candidate''s official Date of Joining. Full payment shall mature and become payable within thirty (30) consecutive calendar days from the candidate''s official joining date.

4. REPLACEMENT GUARANTEE:
In the event a placed candidate voluntarily resigns or is terminated for performance within ninety (90) calendar days from their date of joining, the Agency guarantees to provide a free replacement candidate within thirty (30) days.

5. CANDIDATE OWNERSHIP:
Any candidate referred by the Agency shall remain the exclusive referral of RiseUp Consultancy for a period of twelve (12) months from the date of submission.`;

export default function AgreementManager({
  initialAgreements,
  clientsList,
}: {
  initialAgreements: AgreementRecord[];
  clientsList: ClientOption[];
}) {
  const [agreements, setAgreements] = useState<AgreementRecord[]>(initialAgreements);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = agreements.filter(
    (a) =>
      a.agreementNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (hashToken: string) => {
    const url = `${window.location.origin}/agreement/sign/${hashToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(hashToken);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await createAgreementAction(formData);

      if (!res.success) {
        setActionError(res.error || "Failed to create agreement.");
        setIsSubmitting(false);
        return;
      }

      setActionSuccess("Agreement generated successfully with secure e-sign link!");
      setIsCreateOpen(false);
      window.location.reload();
    } catch {
      setActionError("Unexpected error occurred while generating agreement.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
              <FileCheck className="w-3.5 h-3.5" />
              Contract Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Client Service Agreements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate, track, and manage cryptographic e-signable corporate recruitment agreements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActionError(null);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 self-start sm:self-auto cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Draft New Agreement</span>
        </button>
      </div>

      {/* Alert Notifications */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200/80 text-xs text-emerald-800 font-semibold rounded-2xl flex items-center gap-2.5 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-red-50/90 border border-red-200/80 text-xs text-red-800 font-semibold rounded-2xl flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by agreement ID or client company name..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200/80 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 outline-none shadow-2xs transition-all min-h-[44px]"
        />
      </div>

      {/* Agreements Data Table Container */}
      <div className="relative bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-medium">
            No client agreements generated yet. Click "Draft New Agreement" to issue your first contract.
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B1528] text-white uppercase text-[10px] tracking-wider border-b border-white/10">
                    <th className="py-3.5 px-5 font-bold">Agreement #</th>
                    <th className="py-3.5 px-5 font-bold">Client Company</th>
                    <th className="py-3.5 px-4 font-bold text-center">Fee %</th>
                    <th className="py-3.5 px-4 font-bold text-center">Payment Term</th>
                    <th className="py-3.5 px-4 font-bold text-center">Guarantee</th>
                    <th className="py-3.5 px-4 font-bold text-center">Status</th>
                    <th className="py-3.5 px-5 font-bold text-right">E-Sign Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((agr) => {
                    const isCopied = copiedToken === agr.hashToken;

                    return (
                      <tr key={agr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-blue-600">
                          {agr.agreementNumber}
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 text-sm">{agr.companyName}</div>
                          {agr.signedByName ? (
                            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                              Signed by: {agr.signedByName} ({agr.signedByDesignation})
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Pending signature from client
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-800">
                          {agr.placementFeePercent}%
                        </td>
                        <td className="py-4 px-4 text-center text-slate-600 font-medium">
                          {agr.paymentTermDays} Days
                        </td>
                        <td className="py-4 px-4 text-center text-slate-600 font-medium">
                          {agr.replacementGuaranteeDays} Days
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs ${
                            agr.status === "SIGNED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : "bg-blue-50 text-blue-700 border border-blue-200/80"
                          }`}>
                            {agr.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(agr.hashToken)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer min-h-[38px] shadow-2xs ${
                              isCopied
                                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                                : "bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200/70"
                            }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? "Link Copied" : "Copy E-Sign Link"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((agr) => {
                const isCopied = copiedToken === agr.hashToken;

                return (
                  <div key={agr.id} className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                        {agr.agreementNumber}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        agr.status === "SIGNED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "bg-blue-50 text-blue-700 border border-blue-200/80"
                      }`}>
                        {agr.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{agr.companyName}</h4>
                      {agr.signedByName && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          Signed by: {agr.signedByName} ({agr.signedByDesignation})
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee %</span>
                        <span className="font-bold text-slate-800 text-xs">{agr.placementFeePercent}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Term</span>
                        <span className="font-medium text-slate-700 text-xs">{agr.paymentTermDays} Days</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Guarantee</span>
                        <span className="font-medium text-slate-700 text-xs">{agr.replacementGuaranteeDays} Days</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(agr.hashToken)}
                        className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer min-h-[44px] shadow-2xs ${
                          isCopied
                            ? "bg-emerald-600 text-white shadow-emerald-500/20"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? "E-Sign Link Copied" : "Copy E-Sign Link"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Draft New Agreement */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative bg-white border border-slate-200 shadow-2xl w-full max-w-xl p-5 sm:p-7 rounded-3xl animate-fadeIn max-h-[92vh] overflow-y-auto">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-heading">
                  Draft Client Service Agreement
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates an e-signable contract with a unique cryptographic verification hash.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Corporate Client *
                </label>
                <select
                  name="clientId"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 outline-none min-h-[44px] transition-all"
                >
                  <option value="">-- Choose Corporate Client --</option>
                  {clientsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.city}, {c.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Placement Fee (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="placementFeePercent"
                    defaultValue="8.33"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 outline-none min-h-[44px] transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">8.33% = 1 month CTC</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Term (Days) *
                  </label>
                  <input
                    type="number"
                    name="paymentTermDays"
                    defaultValue="30"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 outline-none min-h-[44px] transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Default 30 days</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Warranty (Days) *
                  </label>
                  <input
                    type="number"
                    name="replacementGuaranteeDays"
                    defaultValue="90"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 outline-none min-h-[44px] transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Default 90 days</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contract Legal Terms & Clauses *
                </label>
                <textarea
                  name="termsText"
                  rows={8}
                  defaultValue={DEFAULT_TERMS}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 outline-none font-mono leading-relaxed transition-all"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer min-h-[44px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 cursor-pointer min-h-[44px] transition-all"
                >
                  {isSubmitting ? "Generating..." : "Generate Agreement & Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
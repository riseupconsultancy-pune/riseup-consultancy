"use client";

import React, { useState } from "react";
import { 
  Receipt, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Plus, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Check, 
  X,
  Search,
  Filter,
  UserCheck,
  Send,
  MessageSquare,
  Briefcase,
  Hash,
  ArrowRight
} from "lucide-react";
import { 
  updateClientBillingProfileAction, 
  submitCandidateJoiningInfoAction,
  markInvoicePaidAction,
  requestInvoiceRevisionAction
} from "@/app/actions/billing-actions";
import InvoiceModalView, { InvoiceData } from "@/components/crm/InvoiceModalView";

export interface CandidateBillingItem {
  id: string;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  vacancyTitle: string;
  vacancyCategory: string;
  selectedAt: string | null;
  empId: string | null;
  process: string | null;
  designation: string | null;
  dateOfJoining: string | null;
  billingAmount: number | null;
  billingInfoStatus: string; // PENDING_INFO, INFO_SUBMITTED, INVOICED
  invoiceId: string | null;
  invoiceNumber?: string | null;
}

export interface ClientProfileData {
  id: string;
  companyName: string;
  city: string;
  country: string;
  contactPerson: string | null;
  phone: string | null;
  billingAddress: string | null;
  billingGstin: string | null;
  billingPan: string | null;
  billingContactPerson: string | null;
  billingEmail: string | null;
  billingPhone: string | null;
}

interface ClientBillingDeskProps {
  clientProfile: ClientProfileData;
  candidates: CandidateBillingItem[];
  invoices: InvoiceData[];
}

export default function ClientBillingDesk({
  clientProfile: initialProfile,
  candidates: initialCandidates,
  invoices: initialInvoices,
}: ClientBillingDeskProps) {
  const [profile, setProfile] = useState<ClientProfileData>(initialProfile);
  const [candidates, setCandidates] = useState<CandidateBillingItem[]>(initialCandidates);
  const [invoices, setInvoices] = useState<InvoiceData[]>(initialInvoices);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"CANDIDATES" | "INVOICES">("CANDIDATES");
  const [candidateFilter, setCandidateFilter] = useState<"ALL" | "PENDING" | "SUBMITTED" | "INVOICED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateBillingItem | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceData | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<InvoiceData | null>(null);
  const [revisingInvoice, setRevisingInvoice] = useState<InvoiceData | null>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    billingAddress: profile.billingAddress || `${profile.city}, ${profile.country}`,
    billingGstin: profile.billingGstin || "",
    billingPan: profile.billingPan || "",
    billingContactPerson: profile.billingContactPerson || profile.contactPerson || "",
    billingEmail: profile.billingEmail || "",
    billingPhone: profile.billingPhone || profile.phone || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Candidate Joining Info Form
  const [candidateForm, setCandidateForm] = useState({
    empId: "",
    process: "",
    designation: "",
    dateOfJoining: "",
    billingAmount: 2500,
  });
  const [isSubmittingCandidate, setIsSubmittingCandidate] = useState(false);

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    paymentReference: "",
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Revision Form
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const res = await updateClientBillingProfileAction(profileForm);
    setIsSavingProfile(false);
    if (res.success && res.clientProfile) {
      setProfile({
        ...profile,
        ...res.clientProfile,
      });
      setShowProfileModal(false);
      showNotification("success", "Billing profile updated successfully!");
    } else {
      showNotification("error", res.error || "Failed to update billing profile");
    }
  };

  // Open candidate joining form
  const handleOpenCandidateModal = (cand: CandidateBillingItem) => {
    setSelectedCandidate(cand);
    setCandidateForm({
      empId: cand.empId || "",
      process: cand.process || "TCS GEM",
      designation: cand.designation || cand.vacancyTitle || "Customer Support",
      dateOfJoining: cand.dateOfJoining ? cand.dateOfJoining.split("T")[0] : new Date().toISOString().split("T")[0],
      billingAmount: cand.billingAmount || 2500,
    });
  };

  // Candidate Form Submit
  const handleSubmitCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    setIsSubmittingCandidate(true);

    const res = await submitCandidateJoiningInfoAction({
      candidateId: selectedCandidate.id,
      empId: candidateForm.empId,
      process: candidateForm.process,
      designation: candidateForm.designation,
      dateOfJoining: candidateForm.dateOfJoining,
      billingAmount: Number(candidateForm.billingAmount),
    });

    setIsSubmittingCandidate(false);
    if (res.success && res.candidate) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === selectedCandidate.id
            ? {
                ...c,
                empId: res.candidate.empId,
                process: res.candidate.process,
                designation: res.candidate.designation,
                dateOfJoining: res.candidate.dateOfJoining ? res.candidate.dateOfJoining.toISOString() : null,
                billingAmount: res.candidate.billingAmount,
                billingInfoStatus: res.candidate.billingInfoStatus,
              }
            : c
        )
      );
      setSelectedCandidate(null);
      showNotification("success", "Candidate joining details submitted! Ready for invoicing.");
    } else {
      showNotification("error", res.error || "Failed to submit candidate details");
    }
  };

  // Submit Payment
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    setIsSubmittingPayment(true);

    const res = await markInvoicePaidAction({
      invoiceId: payingInvoice.id,
      paymentDate: paymentForm.paymentDate,
      paymentReference: paymentForm.paymentReference,
    });

    setIsSubmittingPayment(false);
    if (res.success && res.invoice) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === payingInvoice.id
            ? {
                ...inv,
                status: "PAID",
                paymentDate: res.invoice.paymentDate ? res.invoice.paymentDate.toISOString() : null,
                paymentReference: res.invoice.paymentReference,
                balanceDue: 0,
              }
            : inv
        )
      );
      setPayingInvoice(null);
      if (viewingInvoice?.id === payingInvoice.id) {
        setViewingInvoice((prev) => (prev ? { ...prev, status: "PAID", balanceDue: 0 } : null));
      }
      showNotification("success", `Invoice ${payingInvoice.invoiceNumber} marked as Paid!`);
    } else {
      showNotification("error", res.error || "Failed to mark invoice as paid");
    }
  };

  // Submit Revision
  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisingInvoice) return;
    setIsSubmittingRevision(true);

    const res = await requestInvoiceRevisionAction({
      invoiceId: revisingInvoice.id,
      feedback: revisionFeedback,
    });

    setIsSubmittingRevision(false);
    if (res.success && res.invoice) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === revisingInvoice.id
            ? {
                ...inv,
                status: "REVISION_REQUESTED",
                clientFeedback: res.invoice.clientFeedback,
              }
            : inv
        )
      );
      setRevisingInvoice(null);
      setRevisionFeedback("");
      showNotification("success", "Revision request submitted to Rise Up Consultancy admin!");
    } else {
      showNotification("error", res.error || "Failed to submit revision request");
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.empId && c.empId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.process && c.process.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (candidateFilter === "PENDING") return c.billingInfoStatus === "PENDING_INFO";
    if (candidateFilter === "SUBMITTED") return c.billingInfoStatus === "INFO_SUBMITTED";
    if (candidateFilter === "INVOICED") return c.billingInfoStatus === "INVOICED";
    return true;
  });

  const pendingCount = candidates.filter((c) => c.billingInfoStatus === "PENDING_INFO").length;
  const submittedCount = candidates.filter((c) => c.billingInfoStatus === "INFO_SUBMITTED").length;
  const invoicedCount = candidates.filter((c) => c.billingInfoStatus === "INVOICED").length;

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-none flex items-center justify-between border-l-4 shadow-2xs transition ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-600 text-emerald-900"
              : "bg-rose-50 border-rose-600 text-rose-900"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="text-xs font-bold">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Default Corporate Profile Widget */}
      <div className="bg-white rounded-none border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Receipt className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Corporate Billing Desk
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Candidate Onboarding & Invoices
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Submit employee onboarding details for selected candidates and track formal consultancy bills.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs min-h-[44px]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Billing Profile</span>
            </button>
          </div>
        </div>

        {/* Corporate Billing Profile Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-none p-3.5 sm:p-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5 mb-2.5">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Active Billing Entity:
              </span>
              <span className="font-black text-slate-900 text-sm">{profile.companyName}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              GSTIN: <strong className="text-slate-800 font-bold">{profile.billingGstin || "Not Configured"}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-700">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Registered Billing Address</span>
              <span className="font-medium line-clamp-2">{profile.billingAddress || `${profile.city}, ${profile.country}`}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Invoicing Contact</span>
              <span className="font-medium">{profile.billingContactPerson || profile.contactPerson || "Accounts Dept."}</span>
              {profile.billingEmail && <span className="block text-[11px] text-slate-500">{profile.billingEmail}</span>}
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Tax Identifiers</span>
              <span className="font-mono text-slate-800">
                PAN: {profile.billingPan || "N/A"} | GST: {profile.billingGstin || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("CANDIDATES")}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] ${
            activeTab === "CANDIDATES"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Selected Candidates ({candidates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("INVOICES")}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] ${
            activeTab === "INVOICES"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoices Received ({invoices.length})</span>
        </button>
      </div>

      {/* TAB 1: Candidate Onboarding Desk */}
      {activeTab === "CANDIDATES" && (
        <div className="space-y-4">
          {/* Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-none">
              <button
                onClick={() => setCandidateFilter("ALL")}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  candidateFilter === "ALL"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All ({candidates.length})
              </button>
              <button
                onClick={() => setCandidateFilter("PENDING")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  candidateFilter === "PENDING"
                    ? "bg-amber-600 text-white"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <span className="w-2 h-2 bg-amber-500 rounded-none shrink-0" />
                <span>Pending ({pendingCount})</span>
              </button>
              <button
                onClick={() => setCandidateFilter("SUBMITTED")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  candidateFilter === "SUBMITTED"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-none shrink-0" />
                <span>Ready ({submittedCount})</span>
              </button>
              <button
                onClick={() => setCandidateFilter("INVOICED")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  candidateFilter === "INVOICED"
                    ? "bg-blue-600 text-white"
                    : "text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                <span className="w-2 h-2 bg-blue-500 rounded-none shrink-0" />
                <span>Invoiced ({invoicedCount})</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate or Emp ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 focus:border-blue-600 text-slate-900 rounded-none outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* DESKTOP VIEW: Data Table (Hidden on small mobile screens) */}
          <div className="hidden md:block bg-white rounded-none border border-slate-200 overflow-hidden shadow-2xs">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-14 px-4 text-slate-400 text-xs">
                No candidates match your selected criteria.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">Candidate</th>
                    <th className="py-3 px-3.5">Role / Opening</th>
                    <th className="py-3 px-3.5">Emp ID</th>
                    <th className="py-3 px-3.5">Process / Team</th>
                    <th className="py-3 px-3.5">DOJ</th>
                    <th className="py-3 px-3.5">Billing Amt</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{c.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="text-slate-900 font-semibold">{c.vacancyTitle}</div>
                        <div className="text-[11px] text-slate-500">{c.vacancyCategory}</div>
                      </td>
                      <td className="py-3 px-3.5 font-mono">
                        {c.empId ? (
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 border border-slate-200">
                            {c.empId}
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold text-[11px]">MISSING</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        {c.process || <span className="text-slate-400 italic">Pending</span>}
                      </td>
                      <td className="py-3 px-3.5 font-mono">
                        {c.dateOfJoining ? (
                          new Date(c.dateOfJoining).toLocaleDateString("en-IN")
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                        {c.billingAmount ? `₹${c.billingAmount.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="py-3 px-3.5">
                        {c.billingInfoStatus === "PENDING_INFO" && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-none uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-none" />
                            <span>Pending Info</span>
                          </span>
                        )}
                        {c.billingInfoStatus === "INFO_SUBMITTED" && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-none uppercase tracking-wider">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Ready to Bill</span>
                          </span>
                        )}
                        {c.billingInfoStatus === "INVOICED" && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300 rounded-none uppercase tracking-wider">
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>{c.invoiceNumber || "Invoiced"}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        {c.billingInfoStatus !== "INVOICED" ? (
                          <button
                            onClick={() => handleOpenCandidateModal(c)}
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs ${
                              c.billingInfoStatus === "PENDING_INFO"
                                ? "bg-amber-600 hover:bg-amber-700 text-white"
                                : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{c.billingInfoStatus === "PENDING_INFO" ? "Fill Details" : "Edit"}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono font-bold">BILLED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* MOBILE VIEW: Responsive Square Card Roster (Shown on 320px–768px viewports) */}
          <div className="block md:hidden space-y-3">
            {filteredCandidates.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 text-center text-xs text-slate-400 font-medium rounded-none">
                No candidates match your selected criteria.
              </div>
            ) : (
              filteredCandidates.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 p-4 rounded-none shadow-2xs space-y-3"
                >
                  {/* Top: Name & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm font-heading">{c.fullName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{c.phone}</p>
                    </div>
                    <div>
                      {c.billingInfoStatus === "PENDING_INFO" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-none uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-none" />
                          <span>Pending Info</span>
                        </span>
                      )}
                      {c.billingInfoStatus === "INFO_SUBMITTED" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-none uppercase tracking-wider">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Ready to Bill</span>
                        </span>
                      )}
                      {c.billingInfoStatus === "INVOICED" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-300 rounded-none uppercase tracking-wider">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span>{c.invoiceNumber || "Invoiced"}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* High-signal 2x2 data grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 border border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Role / Opening</span>
                      <span className="font-semibold text-slate-900 line-clamp-1">{c.vacancyTitle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Employee ID</span>
                      <span className="font-mono font-bold text-slate-900">
                        {c.empId || <span className="text-amber-700">Missing</span>}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Process</span>
                      <span className="font-semibold text-slate-800">{c.process || "-"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Joining Date (DOJ)</span>
                      <span className="font-mono text-slate-800">
                        {c.dateOfJoining ? new Date(c.dateOfJoining).toLocaleDateString("en-IN") : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Billing Amount & Touch-sized action button */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Billing Fee</span>
                      <span className="text-sm font-black text-slate-900 font-mono">
                        {c.billingAmount ? `₹${c.billingAmount.toLocaleString("en-IN")}` : "₹2,500"}
                      </span>
                    </div>

                    {c.billingInfoStatus !== "INVOICED" ? (
                      <button
                        onClick={() => handleOpenCandidateModal(c)}
                        className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none shadow-2xs min-h-[44px] min-w-[130px] transition-colors ${
                          c.billingInfoStatus === "PENDING_INFO"
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{c.billingInfoStatus === "PENDING_INFO" ? "Fill Info" : "Edit Details"}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1.5 border border-slate-200">
                        BILLED
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Invoices Received Desk */}
      {activeTab === "INVOICES" && (
        <div className="space-y-4">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-none border border-slate-200 overflow-hidden shadow-2xs">
            {invoices.length === 0 ? (
              <div className="text-center py-14 px-4 text-slate-400 text-xs">
                No invoices received yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">Invoice No</th>
                    <th className="py-3 px-3.5">Billing Date</th>
                    <th className="py-3 px-3.5">Billing Cycle</th>
                    <th className="py-3 px-3.5 text-center">Candidates</th>
                    <th className="py-3 px-3.5">Grand Total</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5 font-bold font-mono text-blue-700">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">
                        <div>{inv.invoiceDate}</div>
                        {inv.dueDate && <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>}
                      </td>
                      <td className="py-3 px-3.5 text-slate-800">
                        {inv.billingCycle || "Standard Placement"}
                      </td>
                      <td className="py-3 px-3.5 text-center font-bold">
                        {inv.items.length} Heads
                      </td>
                      <td className="py-3 px-3.5 font-mono font-black text-slate-900 text-sm">
                        ₹{inv.grandTotal.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3.5">
                        {inv.status === "PAID" && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-none uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Paid</span>
                          </span>
                        )}
                        {inv.status === "SENT" && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300 rounded-none uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Pending Payment</span>
                          </span>
                        )}
                        {inv.status === "REVISION_REQUESTED" && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-none uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Revision Requested</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <a
                            href={`/api/invoices/${inv.id}/download-docx`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-none bg-white hover:bg-slate-100 text-blue-700 text-xs font-bold uppercase tracking-wider transition-colors border border-blue-300 shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Word</span>
                          </a>

                          {inv.status !== "PAID" && (
                            <button
                              onClick={() => setPayingInvoice(inv)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay</span>
                            </button>
                          )}

                          {inv.status !== "PAID" && (
                            <button
                              onClick={() => {
                                setRevisingInvoice(inv);
                                setRevisionFeedback(inv.clientFeedback || "");
                              }}
                              className="p-1.5 rounded-none bg-white border border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                              title="Request Revision"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* MOBILE INVOICE CARDS */}
          <div className="block md:hidden space-y-3">
            {invoices.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 text-center text-xs text-slate-400 font-medium rounded-none">
                No invoices received yet.
              </div>
            ) : (
              invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white border border-slate-200 p-4 rounded-none shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Official Invoice</span>
                      <h4 className="font-mono font-black text-blue-700 text-base">{inv.invoiceNumber}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{inv.billingCycle || "Standard Billing"}</p>
                    </div>

                    <div>
                      {inv.status === "PAID" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-none uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Paid</span>
                        </span>
                      )}
                      {inv.status === "SENT" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-300 rounded-none uppercase tracking-wider">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>Pending</span>
                        </span>
                      )}
                      {inv.status === "REVISION_REQUESTED" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-none uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Revision</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 border border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Invoice Date</span>
                      <span className="font-mono text-slate-800">{inv.invoiceDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Due Date</span>
                      <span className="font-mono text-slate-800">{inv.dueDate || "Net 30"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Candidate Count</span>
                      <span className="font-bold text-slate-900">{inv.items.length} Placements</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Grand Total</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        ₹{inv.grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {inv.clientFeedback && (
                    <div className="p-2 bg-amber-50 border-l-2 border-amber-500 text-[11px] text-amber-900">
                      <strong>Feedback Sent:</strong> {inv.clientFeedback}
                    </div>
                  )}

                  {/* Mobile Action Buttons (Grid with 44px min touch target) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-none min-h-[44px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Bill</span>
                    </button>

                    <a
                      href={`/api/invoices/${inv.id}/download-docx`}
                      className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-none border border-blue-300 min-h-[44px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Word .docx</span>
                    </a>

                    {inv.status !== "PAID" && (
                      <button
                        onClick={() => setPayingInvoice(inv)}
                        className="col-span-2 inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-none min-h-[44px]"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Confirm Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Edit Default Billing Profile */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-none shadow-2xl border border-slate-300 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Corporate Billing Profile
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Entity Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={profile.companyName}
                  className="w-full px-3 py-2.5 rounded-none border border-slate-200 bg-slate-100 text-slate-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Billing Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={profileForm.billingAddress}
                  onChange={(e) => setProfileForm({ ...profileForm, billingAddress: e.target.value })}
                  placeholder="e.g. Kharadi Pune -411014"
                  className="w-full px-3 py-2.5 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN (15 Digits)</label>
                  <input
                    type="text"
                    value={profileForm.billingGstin}
                    onChange={(e) => setProfileForm({ ...profileForm, billingGstin: e.target.value })}
                    placeholder="27AACCC4278P1Z3"
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 font-mono text-slate-900 uppercase outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={profileForm.billingPan}
                    onChange={(e) => setProfileForm({ ...profileForm, billingPan: e.target.value })}
                    placeholder="AACCC4278P"
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 font-mono text-slate-900 uppercase outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoicing Contact Person</label>
                  <input
                    type="text"
                    value={profileForm.billingContactPerson}
                    onChange={(e) => setProfileForm({ ...profileForm, billingContactPerson: e.target.value })}
                    placeholder="Director HR / Finance"
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Email</label>
                  <input
                    type="email"
                    value={profileForm.billingEmail}
                    onChange={(e) => setProfileForm({ ...profileForm, billingEmail: e.target.value })}
                    placeholder="accounts@company.com"
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider text-xs min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs shadow-2xs transition-colors min-h-[44px]"
                >
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Candidate Onboarding Details Form */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-none shadow-2xl border border-slate-300 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Onboarding Joining Data
                </span>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {selectedCandidate.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCandidate} className="space-y-3.5 mt-4 text-xs">
              <div className="p-3 bg-blue-50 border-l-4 border-blue-600 text-blue-900 text-xs">
                Provide client employee ID, verified designation, and joining date to convert this candidate into <strong>Ready for Invoicing</strong> status.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Employee ID (Emp ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.empId}
                    onChange={(e) => setCandidateForm({ ...candidateForm, empId: e.target.value })}
                    placeholder="e.g. 1520417"
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 font-mono text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date of Joining (DOJ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={candidateForm.dateOfJoining}
                    onChange={(e) => setCandidateForm({ ...candidateForm, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Process / Team <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.process}
                    onChange={(e) => setCandidateForm({ ...candidateForm, process: e.target.value })}
                    placeholder="e.g. TCS GEM, Meesho"
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.designation}
                    onChange={(e) => setCandidateForm({ ...candidateForm, designation: e.target.value })}
                    placeholder="e.g. Tele sales Executive"
                    className="w-full px-3 py-2.5 rounded-none border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Billing Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={candidateForm.billingAmount}
                    onChange={(e) => setCandidateForm({ ...candidateForm, billingAmount: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2.5 rounded-none border border-slate-300 font-mono text-slate-900 font-bold outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider text-xs min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCandidate}
                  className="px-5 py-2.5 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs shadow-2xs transition-colors min-h-[44px]"
                >
                  {isSubmittingCandidate ? "Saving..." : "Save Joining Info"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Mark as Paid Form */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-none shadow-2xl border border-slate-300 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Record Bill Payment
                </h3>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3.5 mt-4 text-xs">
              <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900">
                <p className="font-mono font-bold text-sm">{payingInvoice.invoiceNumber}</p>
                <p className="text-xs mt-0.5">
                  Grand Total: <strong>₹{payingInvoice.grandTotal.toLocaleString("en-IN")}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-none border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Reference / UTR Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR12893819283 / NEFT / IMPS"
                  value={paymentForm.paymentReference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentReference: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-none border border-slate-300 font-mono text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider text-xs min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2.5 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs shadow-2xs transition-colors min-h-[44px]"
                >
                  {isSubmittingPayment ? "Confirming..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Request Invoice Revision */}
      {revisingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-none shadow-2xl border border-slate-300 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Request Invoice Revision
                </h3>
              </div>
              <button
                onClick={() => setRevisingInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-3.5 mt-4 text-xs">
              <div className="p-3 bg-amber-50 border-l-4 border-amber-600 text-amber-900 text-xs">
                Provide notes on discrepancies for <strong>{revisingInvoice.invoiceNumber}</strong>. Rise Up admin will review and resend an updated invoice.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Revision Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Candidate joining date rescheduled to 25-02-2026. Please adjust invoice."
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-none border border-slate-300 focus:border-amber-600 text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRevisingInvoice(null)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider text-xs min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRevision}
                  className="px-5 py-2.5 rounded-none bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-xs shadow-2xs transition-colors min-h-[44px]"
                >
                  {isSubmittingRevision ? "Submitting..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Full Invoice Viewer */}
      {viewingInvoice && (
        <InvoiceModalView
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onMarkPaid={() => setPayingInvoice(viewingInvoice)}
          onRequestRevision={() => {
            setRevisingInvoice(viewingInvoice);
            setRevisionFeedback(viewingInvoice.clientFeedback || "");
          }}
          canMarkPaid={true}
          canRequestRevision={true}
        />
      )}
    </div>
  );
}

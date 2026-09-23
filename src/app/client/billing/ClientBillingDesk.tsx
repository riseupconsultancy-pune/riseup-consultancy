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
  MessageSquare
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
      showNotification("success", "Candidate joining details submitted! Status updated to Ready for Invoicing.");
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
      showNotification("success", "Revision request sent to Rise Up Consultancy admin!");
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-md transition ${
            notification.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-rose-50 border border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner & Billing Profile Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Billing & Candidate Invoicing
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Client Desk
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Provide onboarding details for selected candidates and track official consultancy invoices.
              </p>
            </div>
          </div>

          {/* Billing Profile Quick Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-[320px]">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Default Billing Profile
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1">{profile.companyName}</p>
              <p className="text-xs text-slate-600 line-clamp-1">
                {profile.billingAddress || `${profile.city}, ${profile.country}`}
              </p>
              <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-500 font-mono">
                <span>GSTIN: {profile.billingGstin || "Not Set"}</span>
                {profile.billingPan && <span>PAN: {profile.billingPan}</span>}
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("CANDIDATES")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeTab === "CANDIDATES"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Selected Candidates Onboarding</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === "CANDIDATES" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {candidates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("INVOICES")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeTab === "INVOICES"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoices Received</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === "INVOICES" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {invoices.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Selected Candidates Onboarding Desk */}
      {activeTab === "CANDIDATES" && (
        <div className="space-y-4">
          {/* Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setCandidateFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  candidateFilter === "ALL"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Selected ({candidates.length})
              </button>
              <button
                onClick={() => setCandidateFilter("PENDING")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  candidateFilter === "PENDING"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending Info ({pendingCount})</span>
              </button>
              <button
                onClick={() => setCandidateFilter("SUBMITTED")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  candidateFilter === "SUBMITTED"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Ready to Bill ({submittedCount})</span>
              </button>
              <button
                onClick={() => setCandidateFilter("INVOICED")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  candidateFilter === "INVOICED"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Invoiced ({invoicedCount})</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate or Emp ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Candidate Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-16 px-4">
                <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Selected Candidates</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Once interview candidates are evaluated and marked as &quot;Selected&quot;, they will appear here to complete joining details for official invoice generation.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Role / Opening</th>
                      <th className="py-3 px-4">Emp ID</th>
                      <th className="py-3 px-4">Process / Team</th>
                      <th className="py-3 px-4">DOJ</th>
                      <th className="py-3 px-4">Billing Amt</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{c.fullName}</div>
                          <div className="text-[11px] text-slate-500">{c.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-900 font-semibold">{c.vacancyTitle}</div>
                          <div className="text-[11px] text-slate-500">{c.vacancyCategory}</div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {c.empId ? (
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {c.empId}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not Assigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {c.process || <span className="text-slate-400 italic">Not Set</span>}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {c.dateOfJoining ? (
                            new Date(c.dateOfJoining).toLocaleDateString("en-IN")
                          ) : (
                            <span className="text-slate-400 italic">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {c.billingAmount ? `₹${c.billingAmount.toLocaleString("en-IN")}` : "-"}
                        </td>
                        <td className="py-3 px-4">
                          {c.billingInfoStatus === "PENDING_INFO" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                              <span>Pending Info</span>
                            </span>
                          )}
                          {c.billingInfoStatus === "INFO_SUBMITTED" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Ready to Bill</span>
                            </span>
                          )}
                          {c.billingInfoStatus === "INVOICED" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              <FileText className="w-3 h-3 text-blue-600" />
                              <span>Invoiced</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {c.billingInfoStatus !== "INVOICED" ? (
                            <button
                              onClick={() => handleOpenCandidateModal(c)}
                              className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition ${
                                c.billingInfoStatus === "PENDING_INFO"
                                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{c.billingInfoStatus === "PENDING_INFO" ? "Fill Details" : "Edit"}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">Billed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Invoices Received Desk */}
      {activeTab === "INVOICES" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {invoices.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Invoices Received Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Once Rise Up Consultancy generates bills for your verified candidates, your official invoices will appear here with live Word (.docx) downloads and payment tracking.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Invoice No</th>
                      <th className="py-3 px-4">Billing Date</th>
                      <th className="py-3 px-4">Billing Cycle / Batch</th>
                      <th className="py-3 px-4 text-center">Candidates</th>
                      <th className="py-3 px-4">Grand Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-blue-700 font-mono text-sm">{inv.invoiceNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div>{inv.invoiceDate}</div>
                          {inv.dueDate && (
                            <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">
                          {inv.billingCycle || "Standard Billing"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                            {inv.items.length} Heads
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 font-mono text-sm">
                            ₹{inv.grandTotal.toLocaleString("en-IN")}
                          </div>
                          {inv.balanceDue > 0 && inv.status !== "PAID" && (
                            <div className="text-[11px] text-rose-600 font-semibold">
                              Due: ₹{inv.balanceDue.toLocaleString("en-IN")}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {inv.status === "PAID" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Paid</span>
                            </span>
                          )}
                          {inv.status === "SENT" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              <span>Pending Payment</span>
                            </span>
                          )}
                          {inv.status === "REVISION_REQUESTED" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Revision Requested</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setViewingInvoice(inv)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                              title="View Official Invoice Format"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            <a
                              href={`/api/invoices/${inv.id}/download-docx`}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition border border-blue-200"
                              title="Download Editable Word Document (.docx)"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Word</span>
                            </a>

                            {inv.status !== "PAID" && (
                              <button
                                onClick={() => setPayingInvoice(inv)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-2xs"
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
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition"
                                title="Request Revision or Note Discrepancy"
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Edit Default Billing Profile */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Edit Corporate Billing Profile</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Entity Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={profile.companyName}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-semibold"
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
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    GSTIN <span className="text-slate-400 font-normal">(15 digits)</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.billingGstin}
                    onChange={(e) => setProfileForm({ ...profileForm, billingGstin: e.target.value })}
                    placeholder="27AACCC4278P1Z3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-900 uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={profileForm.billingPan}
                    onChange={(e) => setProfileForm({ ...profileForm, billingPan: e.target.value })}
                    placeholder="AACCC4278P"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoicing Contact Person</label>
                  <input
                    type="text"
                    value={profileForm.billingContactPerson}
                    onChange={(e) => setProfileForm({ ...profileForm, billingContactPerson: e.target.value })}
                    placeholder="Accounts Manager"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Email</label>
                  <input
                    type="email"
                    value={profileForm.billingEmail}
                    onChange={(e) => setProfileForm({ ...profileForm, billingEmail: e.target.value })}
                    placeholder="accounts@company.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Candidate Joining Verification
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedCandidate.fullName}</h3>
                <p className="text-xs text-slate-500">
                  Role: {selectedCandidate.vacancyTitle} ({selectedCandidate.vacancyCategory})
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCandidate} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 text-xs">
                Please enter the onboarded employee ID and verified joining date to ready this candidate for official invoice generation.
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Billing Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={candidateForm.billingAmount}
                    onChange={(e) => setCandidateForm({ ...candidateForm, billingAmount: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCandidate}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition"
                >
                  {isSubmittingCandidate ? "Submitting..." : "Save Joining Info (Ready to Bill)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Mark as Paid Form */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Mark Invoice Paid</h3>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <p className="font-bold text-sm">{payingInvoice.invoiceNumber}</p>
                <p className="text-xs">
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
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Reference / UTR Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR12893819283 / IMPS / NEFT"
                  value={paymentForm.paymentReference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentReference: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">Request Invoice Revision</h3>
              </div>
              <button
                onClick={() => setRevisingInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                Provide notes on any discrepancies, candidate attendance updates, or billing amount corrections needed on <strong>{revisingInvoice.invoiceNumber}</strong>. Rise Up consultancy admin will review and resend.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Revision Reason / Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Candidate Mandar Sanjay Kulkarni date of joining was rescheduled to 25-02-2026. Please adjust invoice accordingly."
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRevisingInvoice(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRevision}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs transition"
                >
                  {isSubmittingRevision ? "Submitting..." : "Send Revision Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Full Invoice Viewer (Strictly matching invoice_format.docx layout) */}
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

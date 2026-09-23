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
  Settings,
  Percent,
  PlusCircle,
  Trash2
} from "lucide-react";
import { 
  generateInvoiceAction,
  updateCandidateBillingByAdminAction,
  updateConsultancyBillingConfigAction,
  saveTaxSettingsAction,
  markInvoicePaidAction
} from "@/app/actions/billing-actions";
import InvoiceModalView, { InvoiceData } from "@/components/crm/InvoiceModalView";
import { numberToWordsINR } from "@/lib/number-to-words";

export interface AdminCandidateBillingItem {
  id: string;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  clientId: string;
  clientCompanyName: string;
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

export interface ClientSelectItem {
  id: string;
  companyName: string;
  billingAddress: string | null;
  billingGstin: string | null;
}

export interface ConsultancyConfigData {
  id: string;
  companyName: string;
  tagline: string | null;
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
}

export interface TaxSettingItem {
  id: string;
  name: string;
  rate: number;
  isSelectedByDefault: boolean;
}

interface AdminBillingDeskProps {
  candidates: AdminCandidateBillingItem[];
  clients: ClientSelectItem[];
  invoices: InvoiceData[];
  consultancyConfig: ConsultancyConfigData;
  taxSettings: TaxSettingItem[];
}

export default function AdminBillingDesk({
  candidates: initialCandidates,
  clients,
  invoices: initialInvoices,
  consultancyConfig: initialConfig,
  taxSettings: initialTaxes,
}: AdminBillingDeskProps) {
  const [candidates, setCandidates] = useState<AdminCandidateBillingItem[]>(initialCandidates);
  const [invoices, setInvoices] = useState<InvoiceData[]>(initialInvoices);
  const [consultancyConfig, setConsultancyConfig] = useState<ConsultancyConfigData>(initialConfig);
  const [taxSettings, setTaxSettings] = useState<TaxSettingItem[]>(initialTaxes);

  // Tabs
  const [activeTab, setActiveTab] = useState<"CANDIDATES" | "INVOICES" | "SETTINGS">("CANDIDATES");

  // Filters
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "SUBMITTED" | "INVOICED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Candidate Selection for Invoicing
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<AdminCandidateBillingItem | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceData | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<InvoiceData | null>(null);

  // Invoice Generation Wizard State
  const [invoiceWizard, setInvoiceWizard] = useState({
    clientId: "",
    billingCycle: "Placement Batch - " + new Date().toLocaleString("en-IN", { month: "short", year: "numeric" }),
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    terms: "Net 30 Days",
    placeOfSupply: consultancyConfig.placeOfSupply || "Pune",
    selectedTaxes: taxSettings.filter((t) => t.isSelectedByDefault).map((t) => ({ name: t.name, rate: t.rate })),
    tdsDeducted: 0,
  });
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Candidate Edit Modal State
  const [editCandidateForm, setEditCandidateForm] = useState({
    empId: "",
    process: "",
    designation: "",
    dateOfJoining: "",
    billingAmount: 2500,
    billingInfoStatus: "INFO_SUBMITTED",
  });
  const [isSavingCandidate, setIsSavingCandidate] = useState(false);

  // Consultancy Settings State
  const [configForm, setConfigForm] = useState<ConsultancyConfigData>(consultancyConfig);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Tax Settings State
  const [taxesList, setTaxesList] = useState<TaxSettingItem[]>(taxSettings);
  const [isSavingTaxes, setIsSavingTaxes] = useState(false);

  // Payment Modal State
  const [paymentForm, setPaymentForm] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    paymentReference: "",
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Toggle candidate selection
  const handleToggleSelectCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Invoice Generation Modal
  const handleOpenGenerateModal = () => {
    if (selectedCandidateIds.length === 0) {
      showNotification("error", "Please select at least one candidate ready for billing.");
      return;
    }

    // Verify all selected candidates belong to the same client
    const selectedCands = candidates.filter((c) => selectedCandidateIds.includes(c.id));
    const firstClientId = selectedCands[0]?.clientId;
    const allSameClient = selectedCands.every((c) => c.clientId === firstClientId);

    if (!allSameClient) {
      showNotification(
        "error",
        "Selected candidates must belong to the same Client Company to be billed together on one invoice."
      );
      return;
    }

    setInvoiceWizard({
      ...invoiceWizard,
      clientId: firstClientId,
      selectedTaxes: taxSettings.filter((t) => t.isSelectedByDefault).map((t) => ({ name: t.name, rate: t.rate })),
    });
    setShowGenerateModal(true);
  };

  // Live calculations for Invoice Wizard
  const selectedCandidatesForInvoice = candidates.filter((c) =>
    selectedCandidateIds.includes(c.id)
  );

  const wizardSubTotal = selectedCandidatesForInvoice.reduce(
    (sum, c) => sum + (c.billingAmount || 0),
    0
  );

  const wizardTaxTotal = invoiceWizard.selectedTaxes.reduce((sum, t) => {
    return sum + Math.round(wizardSubTotal * (t.rate / 100) * 100) / 100;
  }, 0);

  const wizardGrandTotal = Math.round(
    (wizardSubTotal + wizardTaxTotal - Number(invoiceWizard.tdsDeducted || 0)) * 100
  ) / 100;

  const wizardTotalInWords = numberToWordsINR(wizardGrandTotal);

  // Generate Invoice Submit
  const handleConfirmGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingInvoice(true);

    const res = await generateInvoiceAction({
      clientId: invoiceWizard.clientId,
      candidateIds: selectedCandidateIds,
      billingCycle: invoiceWizard.billingCycle,
      invoiceDate: invoiceWizard.invoiceDate,
      dueDate: invoiceWizard.dueDate || undefined,
      terms: invoiceWizard.terms,
      placeOfSupply: invoiceWizard.placeOfSupply,
      taxes: invoiceWizard.selectedTaxes,
      tdsDeducted: Number(invoiceWizard.tdsDeducted || 0),
    });

    setIsGeneratingInvoice(false);

    if (res.success && res.invoice) {
      // Update candidate statuses locally
      setCandidates((prev) =>
        prev.map((c) =>
          selectedCandidateIds.includes(c.id)
            ? {
                ...c,
                billingInfoStatus: "INVOICED",
                invoiceId: res.invoice.id,
                invoiceNumber: res.invoice.invoiceNumber,
              }
            : c
        )
      );

      // Add to invoices list
      const formatDateStr = (d: Date | null) => {
        if (!d) return null;
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const newInv: InvoiceData = {
        id: res.invoice.id,
        invoiceNumber: res.invoice.invoiceNumber,
        invoiceDate: formatDateStr(res.invoice.invoiceDate) || "",
        dueDate: formatDateStr(res.invoice.dueDate),
        terms: res.invoice.terms,
        billingCycle: res.invoice.billingCycle,
        placeOfSupply: res.invoice.placeOfSupply,
        sellerName: res.invoice.sellerName,
        sellerAddress: res.invoice.sellerAddress,
        sellerGstin: res.invoice.sellerGstin,
        sellerPan: res.invoice.sellerPan,
        sellerHsnSac: res.invoice.sellerHsnSac,
        sellerBankName: res.invoice.sellerBankName,
        sellerAccountName: res.invoice.sellerAccountName,
        sellerAccountNumber: res.invoice.sellerAccountNumber,
        sellerIfsc: res.invoice.sellerIfsc,
        termsText: res.invoice.termsText,
        clientName: res.invoice.clientName,
        clientAddress: res.invoice.clientAddress,
        clientGstin: res.invoice.clientGstin,
        clientContactPerson: res.invoice.clientContactPerson,
        subTotal: res.invoice.subTotal,
        taxesJson: res.invoice.taxesJson,
        taxTotal: res.invoice.taxTotal,
        tdsDeducted: res.invoice.tdsDeducted,
        grandTotal: res.invoice.grandTotal,
        totalInWords: res.invoice.totalInWords,
        balanceDue: res.invoice.balanceDue,
        status: res.invoice.status,
        paymentDate: null,
        paymentReference: null,
        clientFeedback: null,
        items: selectedCandidatesForInvoice.map((item, idx) => ({
          id: item.id,
          srNo: idx + 1,
          empId: item.empId,
          candidateName: item.fullName,
          process: item.process,
          designation: item.designation,
          dateOfJoining: item.dateOfJoining ? formatDateStr(new Date(item.dateOfJoining)) : "-",
          billingAmount: item.billingAmount || 0,
        })),
      };

      setInvoices((prev) => [newInv, ...prev]);
      setSelectedCandidateIds([]);
      setShowGenerateModal(false);
      showNotification("success", `Invoice ${res.invoice.invoiceNumber} successfully created and sent to client!`);
    } else {
      showNotification("error", res.error || "Failed to generate invoice");
    }
  };

  // Open Edit Candidate
  const handleOpenEditCandidate = (cand: AdminCandidateBillingItem) => {
    setEditingCandidate(cand);
    setEditCandidateForm({
      empId: cand.empId || "",
      process: cand.process || "",
      designation: cand.designation || cand.vacancyTitle,
      dateOfJoining: cand.dateOfJoining ? cand.dateOfJoining.split("T")[0] : "",
      billingAmount: cand.billingAmount || 2500,
      billingInfoStatus: cand.billingInfoStatus,
    });
  };

  // Submit Candidate Edit
  const handleSaveCandidateEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    setIsSavingCandidate(true);

    const res = await updateCandidateBillingByAdminAction({
      candidateId: editingCandidate.id,
      empId: editCandidateForm.empId,
      process: editCandidateForm.process,
      designation: editCandidateForm.designation,
      dateOfJoining: editCandidateForm.dateOfJoining || undefined,
      billingAmount: Number(editCandidateForm.billingAmount),
      billingInfoStatus: editCandidateForm.billingInfoStatus,
    });

    setIsSavingCandidate(false);
    if (res.success && res.candidate) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === editingCandidate.id
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
      setEditingCandidate(null);
      showNotification("success", "Candidate onboarding details updated by admin.");
    } else {
      showNotification("error", res.error || "Failed to update candidate.");
    }
  };

  // Save Consultancy Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    const res = await updateConsultancyBillingConfigAction({
      ...configForm,
      tagline: configForm.tagline || null,
    });
    setIsSavingConfig(false);
    if (res.success && res.config) {
      setConsultancyConfig(res.config);
      showNotification("success", "Rise Up Consultancy billing details updated!");
    } else {
      showNotification("error", res.error || "Failed to update consultancy config.");
    }
  };

  // Save Tax Settings
  const handleSaveTaxes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTaxes(true);
    const res = await saveTaxSettingsAction(taxesList);
    setIsSavingTaxes(false);
    if (res.success) {
      setTaxSettings(taxesList);
      showNotification("success", "Tax configuration rules saved!");
    } else {
      showNotification("error", res.error || "Failed to save tax rules.");
    }
  };

  // Mark Paid
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
      showNotification("success", `Invoice ${payingInvoice.invoiceNumber} marked as Paid!`);
    } else {
      showNotification("error", res.error || "Failed to mark as paid");
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    if (selectedClientFilter !== "ALL" && c.clientId !== selectedClientFilter) return false;

    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientCompanyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.empId && c.empId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.process && c.process.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "PENDING") return c.billingInfoStatus === "PENDING_INFO";
    if (statusFilter === "SUBMITTED") return c.billingInfoStatus === "INFO_SUBMITTED";
    if (statusFilter === "INVOICED") return c.billingInfoStatus === "INVOICED";
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

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Invoicing & Placement Billing Desk
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                  Super Admin
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Generate official billing invoices matching the exact format of <code>invoice_format.docx</code> with automated tax calculations and live Word (.docx) export.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {selectedCandidateIds.length > 0 && (
              <button
                onClick={handleOpenGenerateModal}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition animate-pulse"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Generate Invoice ({selectedCandidateIds.length})</span>
              </button>
            )}
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
          <span>Selected Candidates Queue</span>
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
          <span>Invoices Master Desk</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === "INVOICES" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SETTINGS")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeTab === "SETTINGS"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Consultancy & Tax Config</span>
        </button>
      </div>

      {/* TAB 1: Candidates Queue & Invoicing */}
      {activeTab === "CANDIDATES" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Client Dropdown */}
              <div className="relative">
                <select
                  value={selectedClientFilter}
                  onChange={(e) => setSelectedClientFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="ALL">All Clients ({clients.length})</option>
                  {clients.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      {cl.companyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Pills */}
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === "ALL"
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All ({candidates.length})
              </button>
              <button
                onClick={() => setStatusFilter("SUBMITTED")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === "SUBMITTED"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Ready to Bill ({submittedCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === "PENDING"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending Info ({pendingCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter("INVOICED")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === "INVOICED"
                    ? "bg-blue-600 text-white"
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
                placeholder="Search candidate, client, Emp ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Selection Banner if items selected */}
          {selectedCandidateIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="font-bold">
                  {selectedCandidateIds.length} candidate(s) selected for billing batch.
                </span>
                <span className="text-blue-700">
                  Total Billing Sum: ₹{wizardSubTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedCandidateIds([])}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleOpenGenerateModal}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition"
                >
                  Generate Invoice
                </button>
              </div>
            </div>
          )}

          {/* Candidates Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-16 px-4">
                <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Candidates Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Candidates marked as &quot;Selected&quot; by clients or admin will appear in this queue.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-10 text-center">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Client Company</th>
                      <th className="py-3 px-4">Role / Process</th>
                      <th className="py-3 px-4">Emp ID</th>
                      <th className="py-3 px-4">DOJ</th>
                      <th className="py-3 px-4">Billing Amt</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredCandidates.map((c) => {
                      const isSelected = selectedCandidateIds.includes(c.id);
                      const isReadyToBill = c.billingInfoStatus === "INFO_SUBMITTED";

                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-slate-50/80 transition ${
                            isSelected ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-center">
                            {isReadyToBill ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectCandidate(c.id)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{c.fullName}</div>
                            <div className="text-[11px] text-slate-500">{c.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{c.clientCompanyName}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-900 font-semibold">{c.process || c.vacancyTitle}</div>
                            <div className="text-[11px] text-slate-500">{c.designation || "-"}</div>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {c.empId ? (
                              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {c.empId}
                              </span>
                            ) : (
                              <span className="text-amber-600 italic font-semibold">Missing</span>
                            )}
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
                                <span>{c.invoiceNumber || "Invoiced"}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleOpenEditCandidate(c)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Invoices Master Desk */}
      {activeTab === "INVOICES" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {invoices.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Invoices Created Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Select candidates with green status from the queue and click &quot;Generate Invoice&quot; to issue official bills.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Invoice No</th>
                      <th className="py-3 px-4">Client Company</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Billing Cycle</th>
                      <th className="py-3 px-4 text-center">Heads</th>
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
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{inv.clientName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{inv.clientGstin || "No GST"}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div>{inv.invoiceDate}</div>
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
                              <span>Sent / Pending</span>
                            </span>
                          )}
                          {inv.status === "REVISION_REQUESTED" && (
                            <div>
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Revision Requested</span>
                              </span>
                              {inv.clientFeedback && (
                                <p className="text-[11px] text-amber-900 line-clamp-1 mt-0.5">
                                  {inv.clientFeedback}
                                </p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setViewingInvoice(inv)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            <a
                              href={`/api/invoices/${inv.id}/download-docx`}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition border border-blue-200"
                              title="Download Word (.docx)"
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
                                <span>Mark Paid</span>
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

      {/* TAB 3: Consultancy & Tax Configuration */}
      {activeTab === "SETTINGS" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rise Up Consultancy Billing Profile */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Rise Up Consultancy Details</h3>
                <p className="text-xs text-slate-500">
                  Appears on all official invoices (Table 0, Table 4, Table 5)
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Firm Name</label>
                <input
                  type="text"
                  required
                  value={configForm.companyName}
                  onChange={(e) => setConfigForm({ ...configForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Office Address</label>
                <textarea
                  required
                  rows={2}
                  value={configForm.address}
                  onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    required
                    value={configForm.gstin}
                    onChange={(e) => setConfigForm({ ...configForm, gstin: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PAN</label>
                  <input
                    type="text"
                    required
                    value={configForm.pan}
                    onChange={(e) => setConfigForm({ ...configForm, pan: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HSN/SAC</label>
                  <input
                    type="text"
                    required
                    value={configForm.hsnSac}
                    onChange={(e) => setConfigForm({ ...configForm, hsnSac: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1">
                  Bank Account Details (AU Small Finance Bank)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankName}
                      onChange={(e) => setConfigForm({ ...configForm, bankName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Account Name</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankAccountName}
                      onChange={(e) => setConfigForm({ ...configForm, bankAccountName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Account Number</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankAccountNumber}
                      onChange={(e) => setConfigForm({ ...configForm, bankAccountNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">IFSC Code</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankIfsc}
                      onChange={(e) => setConfigForm({ ...configForm, bankIfsc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 bg-white uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Terms & Conditions</label>
                <textarea
                  required
                  rows={2}
                  value={configForm.termsText}
                  onChange={(e) => setConfigForm({ ...configForm, termsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition"
                >
                  {isSavingConfig ? "Saving..." : "Save Consultancy Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Tax Management */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <Percent className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Tax Configurations (GST)</h3>
                    <p className="text-xs text-slate-500">
                      Configure multiple taxes & percentages used during invoice calculation
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setTaxesList([
                      ...taxesList,
                      {
                        id: Math.random().toString(),
                        name: "TAX",
                        rate: 18,
                        isSelectedByDefault: false,
                      },
                    ])
                  }
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tax</span>
                </button>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                {taxesList.map((tax, idx) => (
                  <div
                    key={tax.id || idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Tax Name</label>
                        <input
                          type="text"
                          value={tax.name}
                          onChange={(e) => {
                            const updated = [...taxesList];
                            updated[idx].name = e.target.value.toUpperCase();
                            setTaxesList(updated);
                          }}
                          placeholder="e.g. CGST, SGST, IGST"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 uppercase bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Rate (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={tax.rate}
                          onChange={(e) => {
                            const updated = [...taxesList];
                            updated[idx].rate = Number(e.target.value);
                            setTaxesList(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                      <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-slate-600 font-medium">
                        <input
                          type="checkbox"
                          checked={tax.isSelectedByDefault}
                          onChange={(e) => {
                            const updated = [...taxesList];
                            updated[idx].isSelectedByDefault = e.target.checked;
                            setTaxesList(updated);
                          }}
                          className="w-3.5 h-3.5 rounded text-indigo-600"
                        />
                        <span>Default</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setTaxesList(taxesList.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveTaxes}
                disabled={isSavingTaxes}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition text-xs"
              >
                {isSavingTaxes ? "Saving..." : "Save Tax Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Invoice Generation Wizard */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <Receipt className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Generate Official Placement Invoice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Billed to: <strong>{selectedCandidatesForInvoice[0]?.clientCompanyName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmGenerateInvoice} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Cycle / Batch Name</label>
                  <input
                    type="text"
                    required
                    value={invoiceWizard.billingCycle}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, billingCycle: e.target.value })}
                    placeholder="e.g. October 2026 Batch"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Place of Supply</label>
                  <input
                    type="text"
                    required
                    value={invoiceWizard.placeOfSupply}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, placeOfSupply: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceWizard.invoiceDate}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceWizard.dueDate}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, dueDate: e.target.value })}
                    placeholder="30 days default"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={invoiceWizard.terms}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, terms: e.target.value })}
                    placeholder="Net 30 Days"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Candidate Items Included */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Included Candidate Line Items ({selectedCandidatesForInvoice.length})
                </label>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">SR</th>
                        <th className="py-2 px-3">Emp ID</th>
                        <th className="py-2 px-3">Candidate</th>
                        <th className="py-2 px-3">Process</th>
                        <th className="py-2 px-3 text-right">Amt (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedCandidatesForInvoice.map((c, i) => (
                        <tr key={c.id}>
                          <td className="py-2 px-3 text-slate-400">{i + 1}</td>
                          <td className="py-2 px-3 font-mono">{c.empId || "-"}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{c.fullName}</td>
                          <td className="py-2 px-3 text-slate-600">{c.process}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{(c.billingAmount || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Apply Taxes (GST)</label>
                <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {taxSettings.map((t) => {
                    const isChecked = invoiceWizard.selectedTaxes.some((st) => st.name === t.name);
                    return (
                      <label key={t.id} className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setInvoiceWizard({
                                ...invoiceWizard,
                                selectedTaxes: [...invoiceWizard.selectedTaxes, { name: t.name, rate: t.rate }],
                              });
                            } else {
                              setInvoiceWizard({
                                ...invoiceWizard,
                                selectedTaxes: invoiceWizard.selectedTaxes.filter((st) => st.name !== t.name),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span>{t.name} @ {t.rate}%</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Financial Summary Box */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Sub Total:</span>
                  <span className="font-mono">₹{wizardSubTotal.toLocaleString("en-IN")}</span>
                </div>

                {invoiceWizard.selectedTaxes.map((t, idx) => {
                  const amt = Math.round(wizardSubTotal * (t.rate / 100) * 100) / 100;
                  return (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>{t.name} @ {t.rate}%:</span>
                      <span className="font-mono">₹{amt.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between pt-1 border-t border-blue-200">
                  <span className="font-bold text-slate-700">TDS Deducted (₹):</span>
                  <input
                    type="number"
                    min={0}
                    value={invoiceWizard.tdsDeducted}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, tdsDeducted: Number(e.target.value) })}
                    className="w-32 px-2 py-1 text-right rounded border border-slate-300 font-mono text-xs bg-white"
                  />
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t-2 border-blue-300">
                  <span>GRAND TOTAL:</span>
                  <span className="font-mono text-blue-700">₹{wizardGrandTotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="text-[11px] text-slate-600 italic font-serif pt-1 border-t border-blue-100">
                  <strong className="not-italic font-sans text-slate-800">In Words: </strong>
                  {wizardTotalInWords}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingInvoice}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition"
                >
                  {isGeneratingInvoice ? "Generating..." : "Generate & Send Official Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Candidate Details */}
      {editingCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Admin Candidate Billing Override
                </span>
                <h3 className="text-lg font-bold text-slate-900">{editingCandidate.fullName}</h3>
                <p className="text-xs text-slate-500">
                  Client: {editingCandidate.clientCompanyName}
                </p>
              </div>
              <button
                onClick={() => setEditingCandidate(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidateEdit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee ID (Emp ID)</label>
                  <input
                    type="text"
                    value={editCandidateForm.empId}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, empId: e.target.value })}
                    placeholder="1520417"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Joining (DOJ)</label>
                  <input
                    type="date"
                    value={editCandidateForm.dateOfJoining}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Process / Team</label>
                  <input
                    type="text"
                    value={editCandidateForm.process}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, process: e.target.value })}
                    placeholder="TCS GEM"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editCandidateForm.designation}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editCandidateForm.billingAmount}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, billingAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Status</label>
                  <select
                    value={editCandidateForm.billingInfoStatus}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, billingInfoStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                  >
                    <option value="PENDING_INFO">🟡 Pending Info</option>
                    <option value="INFO_SUBMITTED">🟢 Ready to Bill (Submitted)</option>
                    <option value="INVOICED">🔵 Invoiced</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCandidate}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition"
                >
                  {isSavingCandidate ? "Saving..." : "Save Candidate Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Mark Paid Form */}
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
                  Client: {payingInvoice.clientName} • Grand Total: <strong>₹{payingInvoice.grandTotal.toLocaleString("en-IN")}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  required
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reference / UTR / Cheque No.</label>
                <input
                  type="text"
                  required
                  value={paymentForm.paymentReference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentReference: e.target.value })}
                  placeholder="UTR129837198273"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900"
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
                  {isSubmittingPayment ? "Updating..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Full Invoice Viewer */}
      {viewingInvoice && (
        <InvoiceModalView
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onMarkPaid={() => setPayingInvoice(viewingInvoice)}
          canMarkPaid={true}
        />
      )}
    </div>
  );
}

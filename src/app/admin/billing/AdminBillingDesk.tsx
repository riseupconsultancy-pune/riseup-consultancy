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
  Trash2,
  Briefcase,
  ChevronDown
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
  city?: string;
  country?: string;
  contactPerson?: string | null;
  phone?: string | null;
  billingAddress: string | null;
  billingGstin: string | null;
  billingPan?: string | null;
  billingContactPerson?: string | null;
  billingEmail?: string | null;
  billingPhone?: string | null;
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
        clientId: res.invoice.clientId,
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

  // Client Selection logic
  const selectedClient = clients.find((c) => c.id === selectedClientFilter);

  // Relevant Candidates (client-filtered)
  const clientCandidates = selectedClientFilter === "ALL"
    ? candidates
    : candidates.filter((c) => c.clientId === selectedClientFilter);

  // Relevant Invoices (client-filtered)
  const clientInvoices = selectedClientFilter === "ALL"
    ? invoices
    : invoices.filter((inv) => 
        inv.clientId 
          ? inv.clientId === selectedClientFilter 
          : (selectedClient ? inv.clientName.toLowerCase().includes(selectedClient.companyName.toLowerCase()) : true)
      );

  // Filtered candidates for table/cards based on search and status
  const filteredCandidates = clientCandidates.filter((c) => {
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

  // Client / Global Metrics
  const totalSelectedCount = clientCandidates.length;
  const pendingCount = clientCandidates.filter((c) => c.billingInfoStatus === "PENDING_INFO").length;
  const submittedCount = clientCandidates.filter((c) => c.billingInfoStatus === "INFO_SUBMITTED").length;
  const invoicedCount = clientCandidates.filter((c) => c.billingInfoStatus === "INVOICED").length;

  const totalInvoicedSum = clientInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  const totalBalanceDue = clientInvoices.reduce((sum, inv) => sum + (inv.balanceDue || (inv.status === "PAID" ? 0 : inv.grandTotal)), 0);
  const totalPaidSum = clientInvoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

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

      {/* Top Header Banner */}
      <div className="bg-white rounded-none border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Receipt className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Super Admin Invoicing Control
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Invoicing & Placement Billing Desk
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Generate official billing invoices matching <code>invoice_format.docx</code> with automated tax calculations and live Word (.docx) export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedCandidateIds.length > 0 && (
              <button
                onClick={handleOpenGenerateModal}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-colors min-h-[44px]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Generate Invoice ({selectedCandidateIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* PRIMARY CLIENT SELECTOR & MULTI-CLIENT PROFILE WIDGET */}
        <div className="bg-slate-50 border border-slate-200 rounded-none p-3.5 sm:p-4 text-xs space-y-3">
          {/* Dropdown Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Filter by Corporate Client:
              </span>
            </div>

            <div className="relative w-full sm:w-80">
              <select
                value={selectedClientFilter}
                onChange={(e) => {
                  setSelectedClientFilter(e.target.value);
                  setSelectedCandidateIds([]); // Clear selection across clients
                }}
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-none outline-none focus:border-blue-600 cursor-pointer min-h-[44px]"
              >
                <option value="ALL">🏢 All Corporate Clients ({clients.length} Registered)</option>
                {clients.map((cl) => {
                  const clientCandsCount = candidates.filter((c) => c.clientId === cl.id).length;
                  return (
                    <option key={cl.id} value={cl.id}>
                      {cl.companyName} ({clientCandsCount} candidates)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Conditional Profile View: Selected Client vs All Clients Overview */}
          {selectedClient ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                    Client Entity & Location
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">{selectedClient.companyName}</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedClient.city || "Pune"}, {selectedClient.country || "India"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                    Registered Billing Address
                  </span>
                  <span className="font-medium text-slate-800 line-clamp-2">
                    {selectedClient.billingAddress || "Billing address not configured by client"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                    Tax Identifiers & Contact
                  </span>
                  <div className="font-mono text-slate-800 text-[11px]">
                    GSTIN: <strong className="font-bold">{selectedClient.billingGstin || "N/A"}</strong>
                    {selectedClient.billingPan && <span> • PAN: {selectedClient.billingPan}</span>}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {selectedClient.billingContactPerson || selectedClient.contactPerson || "Accounts Dept"}
                    {selectedClient.billingEmail && ` (${selectedClient.billingEmail})`}
                  </div>
                </div>
              </div>

              {/* Client High-Signal Metrics Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-slate-200">
                <div className="p-2 bg-white border border-slate-200 rounded-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected</span>
                  <span className="text-base font-black text-slate-900 font-mono">{totalSelectedCount}</span>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-none text-amber-900">
                  <span className="text-[10px] font-bold uppercase block">Pending Info</span>
                  <span className="text-base font-black font-mono">{pendingCount}</span>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-none text-emerald-900">
                  <span className="text-[10px] font-bold uppercase block">Ready to Bill</span>
                  <span className="text-base font-black font-mono">{submittedCount}</span>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-none text-blue-900">
                  <span className="text-[10px] font-bold uppercase block">Invoiced</span>
                  <span className="text-base font-black font-mono">{invoicedCount}</span>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Invoices</span>
                  <span className="text-base font-black text-slate-900 font-mono">{clientInvoices.length}</span>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Invoiced</span>
                  <span className="text-sm font-black text-slate-900 font-mono">₹{totalInvoicedSum.toLocaleString("en-IN")}</span>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 text-white rounded-none">
                  <span className="text-[10px] font-bold text-slate-300 uppercase block">Balance Due</span>
                  <span className="text-sm font-black text-amber-400 font-mono">₹{totalBalanceDue.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Aggregate Multi-Client Portfolio Summary */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="p-2.5 bg-white border border-slate-200 rounded-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Registered Clients</span>
                <span className="text-base font-black text-slate-900 font-mono">{clients.length} Clients</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Total Candidates</span>
                <span className="text-base font-black text-slate-900 font-mono">{candidates.length} Selected</span>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-none text-emerald-900">
                <span className="text-[10px] font-bold uppercase block tracking-wider">Ready to Bill</span>
                <span className="text-base font-black font-mono">{submittedCount} Candidates</span>
              </div>
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-none text-blue-900">
                <span className="text-[10px] font-bold uppercase block tracking-wider">Total Invoices</span>
                <span className="text-base font-black font-mono">{invoices.length} Issued</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Total Billed ₹</span>
                <span className="text-base font-black text-slate-900 font-mono">₹{totalInvoicedSum.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 text-white rounded-none">
                <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">Total Balance Due ₹</span>
                <span className="text-base font-black text-amber-400 font-mono">₹{totalBalanceDue.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("CANDIDATES")}
          className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] ${
            activeTab === "CANDIDATES"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Candidates Queue</span>
          <span className="sm:hidden">Candidates</span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-none font-bold ${
              activeTab === "CANDIDATES" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {clientCandidates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("INVOICES")}
          className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] ${
            activeTab === "INVOICES"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Invoices Master</span>
          <span className="sm:hidden">Invoices</span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-none font-bold ${
              activeTab === "INVOICES" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {clientInvoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SETTINGS")}
          className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] ${
            activeTab === "SETTINGS"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Tax & Consultancy Config</span>
          <span className="sm:hidden">Config</span>
        </button>
      </div>

      {/* TAB 1: Candidates Queue & Invoicing */}
      {activeTab === "CANDIDATES" && (
        <div className="space-y-4">
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-none">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  statusFilter === "ALL"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All ({clientCandidates.length})
              </button>
              <button
                onClick={() => setStatusFilter("SUBMITTED")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  statusFilter === "SUBMITTED"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-none shrink-0" />
                <span>Ready ({submittedCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  statusFilter === "PENDING"
                    ? "bg-amber-600 text-white"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <span className="w-2 h-2 bg-amber-500 rounded-none shrink-0" />
                <span>Pending ({pendingCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter("INVOICED")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors min-h-[36px] ${
                  statusFilter === "INVOICED"
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

          {/* Selection Banner if items selected */}
          {selectedCandidateIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-300 rounded-none p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-900 shadow-2xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold">
                  {selectedCandidateIds.length} candidate(s) selected for billing batch.
                </span>
                <span className="text-blue-700 font-mono font-bold">
                  (Sum: ₹{wizardSubTotal.toLocaleString("en-IN")})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedCandidateIds([])}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold uppercase tracking-wider min-h-[44px]"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleOpenGenerateModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-2xs transition-colors min-h-[44px]"
                >
                  Generate Invoice
                </button>
              </div>
            </div>
          )}

          {/* DESKTOP VIEW: Data Table (Hidden on small mobile screens) */}
          <div className="hidden md:block bg-white rounded-none border border-slate-200 overflow-hidden shadow-2xs">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-16 px-4">
                <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-heading">No Candidates Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Candidates marked as &quot;Selected&quot; by clients or admin will appear in this queue.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5 w-10 text-center">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="py-3 px-3.5">Candidate</th>
                      <th className="py-3 px-3.5">Client Company</th>
                      <th className="py-3 px-3.5">Role / Process</th>
                      <th className="py-3 px-3.5">Emp ID</th>
                      <th className="py-3 px-3.5">DOJ</th>
                      <th className="py-3 px-3.5">Billing Amt</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredCandidates.map((c) => {
                      const isSelected = selectedCandidateIds.includes(c.id);
                      const isReadyToBill = c.billingInfoStatus === "INFO_SUBMITTED";

                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isSelected ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <td className="py-3 px-3.5 text-center">
                            {isReadyToBill ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectCandidate(c.id)}
                                className="w-4 h-4 rounded-none border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                              />
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-900">{c.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-900">{c.clientCompanyName}</div>
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="text-slate-900 font-semibold">{c.process || c.vacancyTitle}</div>
                            <div className="text-[11px] text-slate-500">{c.designation || "-"}</div>
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
                          <td className="py-3 px-3.5 font-mono">
                            {c.dateOfJoining ? (
                              new Date(c.dateOfJoining).toLocaleDateString("en-IN")
                            ) : (
                              <span className="text-slate-400 italic">Pending</span>
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
                            <button
                              onClick={() => handleOpenEditCandidate(c)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-none bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
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

          {/* MOBILE VIEW: Responsive Square Card Roster (Shown on 320px–768px viewports) */}
          <div className="block md:hidden space-y-3">
            {filteredCandidates.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 text-center text-xs text-slate-400 font-medium rounded-none">
                No candidates match your selected criteria.
              </div>
            ) : (
              filteredCandidates.map((c) => {
                const isSelected = selectedCandidateIds.includes(c.id);
                const isReadyToBill = c.billingInfoStatus === "INFO_SUBMITTED";

                return (
                  <div
                    key={c.id}
                    className={`bg-white border p-4 rounded-none shadow-2xs space-y-3 transition-colors ${
                      isSelected ? "border-blue-500 bg-blue-50/20" : "border-slate-200"
                    }`}
                  >
                    {/* Top: Name, Phone & Status */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-start space-x-2.5">
                        {isReadyToBill && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectCandidate(c.id)}
                            className="w-5 h-5 rounded-none border-slate-300 text-blue-600 focus:ring-0 cursor-pointer mt-0.5"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm font-heading">{c.fullName}</h4>
                          <p className="text-[11px] text-slate-500 font-mono">{c.phone}</p>
                        </div>
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
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Client Entity</span>
                        <span className="font-semibold text-slate-900 line-clamp-1">{c.clientCompanyName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Employee ID</span>
                        <span className="font-mono font-bold text-slate-900">
                          {c.empId || <span className="text-amber-700">Missing</span>}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Process / Role</span>
                        <span className="font-semibold text-slate-800 line-clamp-1">{c.process || c.vacancyTitle}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">DOJ</span>
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

                      <div className="flex items-center space-x-2">
                        {isReadyToBill && (
                          <button
                            type="button"
                            onClick={() => handleToggleSelectCandidate(c.id)}
                            className={`inline-flex items-center justify-center px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-none min-h-[44px] transition-colors ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditCandidate(c)}
                          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none bg-slate-900 hover:bg-slate-800 text-white min-h-[44px] transition-colors shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Invoices Master Desk */}
      {activeTab === "INVOICES" && (
        <div className="space-y-4">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-none border border-slate-200 overflow-hidden shadow-2xs">
            {clientInvoices.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-heading">No Invoices Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Select candidates with green status from the queue and click &quot;Generate Invoice&quot; to issue official bills.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5">Invoice No</th>
                      <th className="py-3 px-3.5">Client Company</th>
                      <th className="py-3 px-3.5">Date</th>
                      <th className="py-3 px-3.5">Billing Cycle</th>
                      <th className="py-3 px-3.5 text-center">Heads</th>
                      <th className="py-3 px-3.5">Grand Total</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {clientInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3.5">
                          <span className="font-bold text-blue-700 font-mono text-sm">{inv.invoiceNumber}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900">{inv.clientName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{inv.clientGstin || "No GST"}</div>
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <div>{inv.invoiceDate}</div>
                          {inv.dueDate && <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>}
                        </td>
                        <td className="py-3 px-3.5 text-slate-800 font-medium">
                          {inv.billingCycle || "Standard Billing"}
                        </td>
                        <td className="py-3 px-3.5 text-center font-bold">
                          {inv.items.length} Heads
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 font-mono text-sm">
                            ₹{inv.grandTotal.toLocaleString("en-IN")}
                          </div>
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
                              <span>Sent / Pending</span>
                            </span>
                          )}
                          {inv.status === "REVISION_REQUESTED" && (
                            <div>
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-none uppercase tracking-wider">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Revision Requested</span>
                              </span>
                              {inv.clientFeedback && (
                                <p className="text-[11px] text-amber-900 line-clamp-1 mt-0.5 font-medium">
                                  {inv.clientFeedback}
                                </p>
                              )}
                            </div>
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
                              title="Download Word (.docx)"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Word</span>
                            </a>

                            {inv.status !== "PAID" && (
                              <button
                                onClick={() => setPayingInvoice(inv)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
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

          {/* MOBILE INVOICE CARDS */}
          <div className="block md:hidden space-y-3">
            {clientInvoices.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 text-center text-xs text-slate-400 font-medium rounded-none">
                No invoices found for this client.
              </div>
            ) : (
              clientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white border border-slate-200 p-4 rounded-none shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Official Invoice</span>
                      <h4 className="font-mono font-black text-blue-700 text-base">{inv.invoiceNumber}</h4>
                      <p className="text-[11px] text-slate-900 font-bold">{inv.clientName}</p>
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
                          <span>Sent</span>
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
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Date</span>
                      <span className="font-mono text-slate-800">{inv.invoiceDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Due Date</span>
                      <span className="font-mono text-slate-800">{inv.dueDate || "Net 30"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Candidates</span>
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
                      <strong>Client Feedback:</strong> {inv.clientFeedback}
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
                        <span>Confirm Payment (Mark Paid)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Consultancy & Tax Configuration */}
      {activeTab === "SETTINGS" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Rise Up Consultancy Billing Profile */}
          <div className="bg-white rounded-none border border-slate-200 p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Rise Up Consultancy Details</h3>
                <p className="text-xs text-slate-500">
                  Appears on all official invoices (Table 0, Table 4, Table 5)
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Company / Firm Name
                </label>
                <input
                  type="text"
                  required
                  value={configForm.companyName}
                  onChange={(e) => setConfigForm({ ...configForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 font-bold outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Office Address
                </label>
                <textarea
                  required
                  rows={2}
                  value={configForm.address}
                  onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">GSTIN</label>
                  <input
                    type="text"
                    required
                    value={configForm.gstin}
                    onChange={(e) => setConfigForm({ ...configForm, gstin: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-none border border-slate-300 font-mono text-slate-900 uppercase outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">PAN</label>
                  <input
                    type="text"
                    required
                    value={configForm.pan}
                    onChange={(e) => setConfigForm({ ...configForm, pan: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-none border border-slate-300 font-mono text-slate-900 uppercase outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">HSN/SAC</label>
                  <input
                    type="text"
                    required
                    value={configForm.hsnSac}
                    onChange={(e) => setConfigForm({ ...configForm, hsnSac: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-none border border-slate-300 font-mono text-slate-900 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-none space-y-2">
                <p className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider">
                  Bank Account Details (AU Small Finance Bank)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5 uppercase tracking-wider">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankName}
                      onChange={(e) => setConfigForm({ ...configForm, bankName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-none border border-slate-300 text-slate-900 bg-white outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5 uppercase tracking-wider">Account Name</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankAccountName}
                      onChange={(e) => setConfigForm({ ...configForm, bankAccountName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-none border border-slate-300 text-slate-900 bg-white outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5 uppercase tracking-wider">Account Number</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankAccountNumber}
                      onChange={(e) => setConfigForm({ ...configForm, bankAccountNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-none border border-slate-300 font-mono text-slate-900 bg-white outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5 uppercase tracking-wider">IFSC Code</label>
                    <input
                      type="text"
                      required
                      value={configForm.bankIfsc}
                      onChange={(e) => setConfigForm({ ...configForm, bankIfsc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-none border border-slate-300 font-mono text-slate-900 bg-white uppercase outline-none min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Terms & Conditions
                </label>
                <textarea
                  required
                  rows={2}
                  value={configForm.termsText}
                  onChange={(e) => setConfigForm({ ...configForm, termsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-5 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-2xs transition-colors min-h-[44px]"
                >
                  {isSavingConfig ? "Saving..." : "Save Consultancy Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Tax Management */}
          <div className="bg-white rounded-none border border-slate-200 p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <Percent className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">Tax Configurations (GST)</h3>
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
                  className="inline-flex items-center space-x-1 px-3 py-2 rounded-none bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold uppercase tracking-wider transition-colors border border-blue-200 min-h-[44px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tax</span>
                </button>
              </div>

              <div className="space-y-2.5 mt-4 text-xs">
                {taxesList.map((tax, idx) => (
                  <div
                    key={tax.id || idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-none flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5 uppercase tracking-wider">Tax Name</label>
                        <input
                          type="text"
                          value={tax.name}
                          onChange={(e) => {
                            const updated = [...taxesList];
                            updated[idx].name = e.target.value.toUpperCase();
                            setTaxesList(updated);
                          }}
                          placeholder="e.g. CGST, SGST, IGST"
                          className="w-full px-2.5 py-1.5 rounded-none border border-slate-300 font-mono text-slate-900 uppercase bg-white outline-none min-h-[40px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5 uppercase tracking-wider">Rate (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={tax.rate}
                          onChange={(e) => {
                            const updated = [...taxesList];
                            updated[idx].rate = Number(e.target.value);
                            setTaxesList(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-none border border-slate-300 font-mono text-slate-900 bg-white outline-none min-h-[40px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                      <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-slate-600 font-bold uppercase">
                        <input
                          type="checkbox"
                          checked={tax.isSelectedByDefault}
                          onChange={(e) => {
                            const updated = [...taxesList];
                            updated[idx].isSelectedByDefault = e.target.checked;
                            setTaxesList(updated);
                          }}
                          className="w-4 h-4 rounded-none text-blue-600 focus:ring-0"
                        />
                        <span>Default</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setTaxesList(taxesList.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Delete Tax Rule"
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
                className="px-5 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-2xs transition-colors text-xs min-h-[44px]"
              >
                {isSavingTaxes ? "Saving..." : "Save Tax Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Invoice Generation Wizard */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-none shadow-2xl border border-slate-300 p-4 sm:p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <Receipt className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    Generate Official Placement Invoice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Billed to: <strong>{selectedCandidatesForInvoice[0]?.clientCompanyName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmGenerateInvoice} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Billing Cycle / Batch Name
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceWizard.billingCycle}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, billingCycle: e.target.value })}
                    placeholder="e.g. October 2026 Batch"
                    className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Place of Supply
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceWizard.placeOfSupply}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, placeOfSupply: e.target.value })}
                    className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    required
                    value={invoiceWizard.invoiceDate}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoiceWizard.dueDate}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, dueDate: e.target.value })}
                    placeholder="30 days default"
                    className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={invoiceWizard.terms}
                    onChange={(e) => setInvoiceWizard({ ...invoiceWizard, terms: e.target.value })}
                    placeholder="Net 30 Days"
                    className="w-full px-3 py-2 rounded-none border border-slate-300 focus:border-blue-600 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              {/* Candidate Items Included */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Included Candidate Line Items ({selectedCandidatesForInvoice.length})
                </label>
                <div className="border border-slate-200 rounded-none overflow-x-auto max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[480px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
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
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Apply Taxes (GST)
                </label>
                <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-none">
                  {taxSettings.map((t) => {
                    const isChecked = invoiceWizard.selectedTaxes.some((st) => st.name === t.name);
                    return (
                      <label key={t.id} className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800 text-xs">
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
                          className="w-4 h-4 rounded-none text-blue-600 focus:ring-0"
                        />
                        <span>{t.name} @ {t.rate}%</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Financial Summary Box */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-none space-y-2">
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
                    className="w-32 px-2 py-1 text-right rounded-none border border-slate-300 font-mono text-xs bg-white outline-none min-h-[36px]"
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

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingInvoice}
                  className="px-6 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-2xs transition-colors min-h-[44px]"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-none shadow-2xl border border-slate-300 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                  Admin Candidate Billing Override
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">{editingCandidate.fullName}</h3>
                <p className="text-xs text-slate-500">
                  Client: {editingCandidate.clientCompanyName}
                </p>
              </div>
              <button
                onClick={() => setEditingCandidate(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidateEdit} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Employee ID (Emp ID)
                  </label>
                  <input
                    type="text"
                    value={editCandidateForm.empId}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, empId: e.target.value })}
                    placeholder="1520417"
                    className="w-full px-3 py-2 rounded-none border border-slate-300 font-mono text-slate-900 outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Date of Joining (DOJ)
                  </label>
                  <input
                    type="date"
                    value={editCandidateForm.dateOfJoining}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2 rounded-none border border-slate-300 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Process / Team
                  </label>
                  <input
                    type="text"
                    value={editCandidateForm.process}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, process: e.target.value })}
                    placeholder="TCS GEM"
                    className="w-full px-3 py-2 rounded-none border border-slate-300 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={editCandidateForm.designation}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-none border border-slate-300 text-slate-900 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Billing Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editCandidateForm.billingAmount}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, billingAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-none border border-slate-300 font-mono text-slate-900 font-bold outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Billing Status
                  </label>
                  <select
                    value={editCandidateForm.billingInfoStatus}
                    onChange={(e) => setEditCandidateForm({ ...editCandidateForm, billingInfoStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-none border border-slate-300 font-bold text-slate-900 bg-white outline-none min-h-[44px]"
                  >
                    <option value="PENDING_INFO">Pending Info</option>
                    <option value="INFO_SUBMITTED">Ready to Bill (Submitted)</option>
                    <option value="INVOICED">Invoiced</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCandidate}
                  className="px-5 py-2.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-2xs transition-colors min-h-[44px]"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-none shadow-2xl border border-slate-300 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">Mark Invoice Paid</h3>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3.5 mt-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-none text-emerald-900">
                <p className="font-bold text-sm font-mono">{payingInvoice.invoiceNumber}</p>
                <p className="text-xs">
                  Client: {payingInvoice.clientName} • Grand Total: <strong>₹{payingInvoice.grandTotal.toLocaleString("en-IN")}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">Payment Date</label>
                <input
                  type="date"
                  required
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-slate-300 text-slate-900 outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">Reference / UTR / Cheque No.</label>
                <input
                  type="text"
                  required
                  value={paymentForm.paymentReference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentReference: e.target.value })}
                  placeholder="UTR129837198273"
                  className="w-full px-3 py-2 rounded-none border border-slate-300 font-mono text-slate-900 outline-none min-h-[44px]"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2.5 rounded-none border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2.5 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider shadow-2xs transition-colors min-h-[44px]"
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

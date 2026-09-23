"use client";

import React, { useState, useTransition } from "react";
import { 
  Search, 
  Filter, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Trash2, 
  Send, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Briefcase,
  MessageSquare,
  FileCheck2,
  Copy,
  Check,
  UserPlus,
  Loader2
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { 
  updateInquiryStatusAction, 
  saveInquiryNotesAction, 
  convertInquiryToClientAction, 
  deleteInquiryAction 
} from "@/app/actions/inquiry-actions";

export interface InquiryItem {
  id: string;
  inquiryNumber: string;
  type: string;
  fullName: string;
  companyName: string | null;
  email: string;
  phone: string;
  city: string | null;
  country: string;
  subject: string | null;
  roleRequirement: string | null;
  message: string | null;
  source: string;
  status: string;
  adminNotes: string | null;
  assignedTo: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface AdminInquiryDeskProps {
  initialInquiries: InquiryItem[];
}

type TabType = "ALL" | "NEW" | "TALENT_REQUESTS" | "CANDIDATE_QUERIES" | "EMPLOYER_QUERIES" | "IN_PROGRESS" | "CONNECTED" | "CONVERTED" | "CLOSED";

export default function AdminInquiryDesk({ initialInquiries }: AdminInquiryDeskProps) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helper to format phone for WhatsApp
  const formatWhatsAppUrl = (phone: string, inquiry: InquiryItem) => {
    let cleanPhone = phone.replace(/[^\d+]/g, "");
    if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.substring(1);
    } else if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
      cleanPhone = `91${cleanPhone}`;
    }

    let defaultMsg = "";
    if (inquiry.type === "TALENT_REQUEST") {
      defaultMsg = `Hello ${inquiry.fullName}, greetings from RiseUp Consultancy Pune! We received your corporate hiring inquiry for ${inquiry.companyName || "your company"}. We have pre-screened candidates available and would like to coordinate your requirement details.`;
    } else if (inquiry.type === "CANDIDATE_QUERY") {
      defaultMsg = `Hello ${inquiry.fullName}, greetings from RiseUp Consultancy. We received your message regarding ${inquiry.subject || "job openings"}. How can our recruitment team help you today?`;
    } else {
      defaultMsg = `Hello ${inquiry.fullName}, greetings from RiseUp Consultancy Pune. We received your inquiry regarding ${inquiry.subject || "our services"} and would like to assist you.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showNotice = (type: "success" | "error", text: string) => {
    setActionNotice({ type, text });
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Status changer
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    // Optimistic UI
    setInquiries((prev) =>
      prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
    );

    startTransition(async () => {
      const res = await updateInquiryStatusAction(inquiryId, newStatus);
      if (res.success) {
        showNotice("success", `Inquiry status updated to ${newStatus}.`);
      } else {
        showNotice("error", res.error || "Failed to update status.");
      }
    });
  };

  // Save notes
  const handleSaveNotes = async (inquiryId: string) => {
    const currentNote = notesState[inquiryId] ?? inquiries.find((i) => i.id === inquiryId)?.adminNotes ?? "";
    
    startTransition(async () => {
      const res = await saveInquiryNotesAction(inquiryId, currentNote);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, adminNotes: currentNote } : item))
        );
        showNotice("success", "Admin internal notes saved.");
      } else {
        showNotice("error", res.error || "Failed to save notes.");
      }
    });
  };

  // Convert to Client
  const handleConvertToClient = async (inquiry: InquiryItem) => {
    const confirmed = window.confirm(
      `Convert inquiry from "${inquiry.companyName || inquiry.fullName}" into an active Corporate Client profile?`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const res = await convertInquiryToClientAction(inquiry.id);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiry.id ? { ...item, status: "CONVERTED" } : item))
        );
        showNotice("success", res.message || "Inquiry converted to client account successfully.");
      } else {
        showNotice("error", res.error || "Failed to convert inquiry.");
      }
    });
  };

  // Delete
  const handleDelete = async (inquiryId: string) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this inquiry record?");
    if (!confirmed) return;

    // Optimistic delete
    setInquiries((prev) => prev.filter((i) => i.id !== inquiryId));

    startTransition(async () => {
      const res = await deleteInquiryAction(inquiryId);
      if (res.success) {
        showNotice("success", "Inquiry record deleted.");
      } else {
        showNotice("error", res.error || "Failed to delete inquiry.");
      }
    });
  };

  // Stats calculation
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "NEW").length;
  const talentRequestsCount = inquiries.filter((i) => i.type === "TALENT_REQUEST").length;
  const candidateQueriesCount = inquiries.filter((i) => i.type === "CANDIDATE_QUERY").length;
  const employerQueriesCount = inquiries.filter((i) => i.type === "EMPLOYER_QUERY").length;
  const inProgressCount = inquiries.filter((i) => i.status === "IN_PROGRESS").length;
  const connectedCount = inquiries.filter((i) => i.status === "CONNECTED").length;
  const convertedCount = inquiries.filter((i) => i.status === "CONVERTED").length;
  const closedCount = inquiries.filter((i) => i.status === "CLOSED").length;

  // Filter inquiries
  const filteredInquiries = inquiries.filter((item) => {
    // Tab filter
    if (activeTab === "NEW" && item.status !== "NEW") return false;
    if (activeTab === "TALENT_REQUESTS" && item.type !== "TALENT_REQUEST") return false;
    if (activeTab === "CANDIDATE_QUERIES" && item.type !== "CANDIDATE_QUERY") return false;
    if (activeTab === "EMPLOYER_QUERIES" && item.type !== "EMPLOYER_QUERY") return false;
    if (activeTab === "IN_PROGRESS" && item.status !== "IN_PROGRESS") return false;
    if (activeTab === "CONNECTED" && item.status !== "CONNECTED") return false;
    if (activeTab === "CONVERTED" && item.status !== "CONVERTED") return false;
    if (activeTab === "CLOSED" && item.status !== "CLOSED") return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.fullName.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchPhone = item.phone.toLowerCase().includes(q);
      const matchCompany = item.companyName?.toLowerCase().includes(q) ?? false;
      const matchNumber = item.inquiryNumber.toLowerCase().includes(q);
      const matchCity = item.city?.toLowerCase().includes(q) ?? false;
      const matchMessage = item.message?.toLowerCase().includes(q) ?? false;
      const matchRole = item.roleRequirement?.toLowerCase().includes(q) ?? false;
      return matchName || matchEmail || matchPhone || matchCompany || matchNumber || matchCity || matchMessage || matchRole;
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 bg-rose-600 animate-pulse" />
            NEW INTAKE
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 bg-blue-600" />
            IN PROGRESS
          </span>
        );
      case "CONNECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 bg-emerald-600" />
            CONNECTED / REACHED
          </span>
        );
      case "CONVERTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            CONVERTED CLIENT
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-300">
            CLOSED / ARCHIVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getTypeBadge = (type: string, source: string) => {
    switch (type) {
      case "TALENT_REQUEST":
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
              <Briefcase className="w-3 h-3" />
              Talent Request
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
              {source === "HERO_REQUEST_TALENT" ? "Hero Modal" : source}
            </span>
          </div>
        );
      case "EMPLOYER_QUERY":
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white">
              <Building2 className="w-3 h-3" />
              Employer Query
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
              Contact Desk
            </span>
          </div>
        );
      case "CANDIDATE_QUERY":
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white">
              <User className="w-3 h-3" />
              Candidate Query
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
              Contact Desk
            </span>
          </div>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-white">
            <MessageSquare className="w-3 h-3" />
            General Inquiry
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Notification Toast */}
      {actionNotice && (
        <div
          className={`p-4 text-xs font-bold flex items-center justify-between transition-all border rounded-none ${
            actionNotice.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-rose-50 text-rose-900 border-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-slate-500 hover:text-slate-900 text-xs uppercase px-2 py-0.5 border border-slate-300 bg-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-none shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-widest">
                CRM Master Desk
              </span>
              {newCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  {newCount} New Inquiries
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Talent Requests & Website Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Centralized intake pipeline capturing corporate headcount requests and candidate queries from the website with real-time status indicators.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh Desk</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Total Inquiries
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {totalCount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">All Sources</span>
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 p-3.5 sm:p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
              New / Unhandled
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-rose-700 font-heading">
                {newCount}
              </span>
              <span className="text-[10px] text-rose-600 font-bold">Needs Action</span>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 p-3.5 sm:p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Talent Requests
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-blue-700 font-heading">
                {talentRequestsCount + employerQueriesCount}
              </span>
              <span className="text-[10px] text-blue-600 font-medium">Corporate Leads</span>
            </div>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 p-3.5 sm:p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
              Converted to Clients
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-purple-700 font-heading">
                {convertedCount}
              </span>
              <span className="text-[10px] text-purple-600 font-bold">Active Accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 space-y-4 rounded-none shadow-2xs">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by name, company, email, phone, ID (e.g. RUP-INQ-1001), city or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 transition-colors rounded-none"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "ALL"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            All ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("NEW")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
              activeTab === "NEW"
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
            }`}
          >
            <span className="w-1.5 h-1.5 bg-current rounded-none animate-pulse" />
            <span>New Intake ({newCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("TALENT_REQUESTS")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "TALENT_REQUESTS"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Talent Requests ({talentRequestsCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("CANDIDATE_QUERIES")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "CANDIDATE_QUERIES"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Candidate Queries ({candidateQueriesCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("EMPLOYER_QUERIES")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "EMPLOYER_QUERIES"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Employer Queries ({employerQueriesCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("IN_PROGRESS")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "IN_PROGRESS"
                ? "bg-blue-800 text-white border-blue-800"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            In Progress ({inProgressCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("CONNECTED")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "CONNECTED"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Connected ({connectedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("CONVERTED")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "CONVERTED"
                ? "bg-purple-700 text-white border-purple-700"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Converted ({convertedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("CLOSED")}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border ${
              activeTab === "CLOSED"
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Closed ({closedCount})
          </button>
        </div>
      </div>

      {/* Inquiries List View */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center rounded-none">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No Inquiries Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? `No inquiries match your search filter "${searchTerm}".`
              : "No inquiries currently in this category tab."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => {
            const isNotesExpanded = expandedNotesId === inquiry.id;
            const currentNote = notesState[inquiry.id] ?? inquiry.adminNotes ?? "";
            const isCorporate = inquiry.type === "TALENT_REQUEST" || inquiry.type === "EMPLOYER_QUERY";

            return (
              <div
                key={inquiry.id}
                className={`bg-white border transition-all rounded-none ${
                  inquiry.status === "NEW"
                    ? "border-rose-300 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Inquiry Card Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Inquiry ID */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {inquiry.inquiryNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(inquiry.inquiryNumber, inquiry.id)}
                        className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                        title="Copy Inquiry Number"
                      >
                        {copiedId === inquiry.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {/* Type Badge */}
                    {getTypeBadge(inquiry.type, inquiry.source)}

                    {/* Status Badge */}
                    {getStatusBadge(inquiry.status)}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Inquiry Card Body */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Grid Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Column 1: Contact details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{inquiry.fullName}</span>
                      </div>

                      {inquiry.companyName && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{inquiry.companyName}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {inquiry.city || "Pune"}, {inquiry.country}
                        </span>
                      </div>
                    </div>

                    {/* Column 2: Direct Contact Channels */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="hover:text-blue-600 font-semibold"
                        >
                          {inquiry.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="hover:text-blue-600 truncate max-w-[200px]"
                        >
                          {inquiry.email}
                        </a>
                      </div>

                      {inquiry.subject && (
                        <div className="text-[11px] text-slate-500 font-medium">
                          Subject: <span className="text-slate-800 font-semibold">{inquiry.subject}</span>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Quick Action Buttons */}
                    <div className="flex flex-col justify-center gap-2">
                      <div className="flex items-center gap-2">
                        {/* WhatsApp Quick Trigger */}
                        <a
                          href={formatWhatsAppUrl(inquiry.phone, inquiry)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors rounded-none"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Direct Call */}
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="inline-flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider transition-colors border border-slate-200"
                          title="Call phone"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-700" />
                        </a>
                      </div>

                      {/* Convert to Corporate Client (For Talent / Employer Leads) */}
                      {isCorporate && inquiry.status !== "CONVERTED" && (
                        <button
                          type="button"
                          onClick={() => handleConvertToClient(inquiry)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider border border-blue-200 transition-colors"
                        >
                          <UserPlus className="w-3 h-3 text-blue-600" />
                          <span>Convert to Client Account</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Requirement / Message Box */}
                  {(inquiry.roleRequirement || inquiry.message) && (
                    <div className="bg-slate-50 border border-slate-200 p-3 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        {inquiry.type === "TALENT_REQUEST"
                          ? "Required Headcount & Role Details:"
                          : "Inquiry Message / Statement:"}
                      </span>
                      <p className="text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                        {inquiry.roleRequirement || inquiry.message}
                      </p>
                    </div>
                  )}

                  {/* Status Modifier & Admin Notes Controls */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        Update Status:
                      </label>
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className="px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-slate-900 rounded-none cursor-pointer"
                      >
                        <option value="NEW">NEW INTAKE</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="CONNECTED">CONNECTED / REACHED</option>
                        <option value="CONVERTED">CONVERTED CLIENT</option>
                        <option value="CLOSED">CLOSED / ARCHIVED</option>
                      </select>
                    </div>

                    {/* Right action toggles: Notes toggle & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedNotesId(isNotesExpanded ? null : inquiry.id)
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                      >
                        <span>Admin Notes {inquiry.adminNotes ? "(1)" : "(0)"}</span>
                        {isNotesExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Admin Internal Notes Editor */}
                  {isNotesExpanded && (
                    <div className="p-3 bg-amber-50/60 border border-amber-200 mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          Internal Recruiter & Admin Notes (Private)
                        </span>
                        <span className="text-[10px] text-amber-700">Not visible to client</span>
                      </div>
                      <textarea
                        rows={3}
                        value={currentNote}
                        onChange={(e) =>
                          setNotesState({ ...notesState, [inquiry.id]: e.target.value })
                        }
                        placeholder="Add follow-up notes, call remarks, contract negotiation progress, or assigned recruiter..."
                        className="w-full p-2.5 text-xs bg-white border border-amber-300 focus:outline-none focus:border-amber-600 text-slate-900 rounded-none font-sans"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleSaveNotes(inquiry.id)}
                          className="px-4 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                          Save Internal Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

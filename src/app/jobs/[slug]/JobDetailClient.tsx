"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  Upload, 
  FileText, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft, 
  Building2, 
  Send,
  Zap,
  Sparkles
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { applyDirectJobAction } from "@/app/actions/public-actions";
import AlreadyAppliedModal, { ExistingApplicationDetails } from "@/components/AlreadyAppliedModal";

interface JobData {
  id: string;
  jobId: string;
  title: string;
  category: string;
  city: string;
  country: string;
  workMode: string;
  shift: string;
  expMin: number;
  expMax: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  description: string;
  requirements?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface JobDetailClientProps {
  job: JobData;
}

const QUALIFICATIONS = [
  "Any Graduate",
  "B.Com / BBA / BBM",
  "B.Sc / BCA / BCS",
  "B.E. / B.Tech / Engineering",
  "Postgraduate / MBA / MCA",
  "Undergraduate / Pursuing Graduation",
  "12th Pass / Higher Secondary",
  "Diploma Holder",
];

const EXPERIENCES = [
  "Fresher (0 Months)",
  "0 - 6 Months",
  "6 Months - 1 Year",
  "1 - 2 Years",
  "2 - 3 Years",
  "3 - 5 Years",
  "5+ Years",
];

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [successCandidateId, setSuccessCandidateId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alreadyAppliedData, setAlreadyAppliedData] = useState<ExistingApplicationDetails | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: job.city,
    country: job.country,
    qualification: "Any Graduate",
    totalExperience: `${job.expMin} - ${job.expMax} Years`,
    availability: "Immediate Joiner" as "Immediate Joiner" | "15 Days" | "30 Days",
  });

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} in ${job.city} | RiseUp Consultancy`,
          text: `Check out this opening for ${job.title} in ${job.city}. 100% Free Placement!`,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setFileError("Only PDF, DOC, or DOCX files are permitted.");
        setResumeFile(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFileError("Resume file size must be less than 2MB.");
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length === 12 && val.startsWith("91")) {
      val = val.slice(2);
    } else if (val.length === 11 && val.startsWith("0")) {
      val = val.slice(1);
    }
    val = val.slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: val }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFileError("");

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number (without country code).");
      return;
    }

    if (!resumeFile) {
      setFileError("Please attach your updated resume (PDF or DOCX).");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("country", formData.country);
      data.append("city", formData.city);
      data.append("qualification", formData.qualification);
      data.append("totalExperience", formData.totalExperience);
      data.append("availability", formData.availability);
      data.append("vacancyId", job.id);
      data.append("jobTitle", job.title);
      data.append("resume", resumeFile);

      const res = await applyDirectJobAction(data);

      if (res.success) {
        setSuccessCandidateId(res.candidateId || "CONFIRMED");
      } else if (res.alreadyApplied && res.candidateId && res.candidateName && res.jobId && res.jobTitle && res.recruiter) {
        setAlreadyAppliedData({
          candidateId: res.candidateId,
          candidateName: res.candidateName,
          jobId: res.jobId,
          jobTitle: res.jobTitle,
          appliedDate: res.appliedDate,
          currentStatus: res.currentStatus,
          recruiter: res.recruiter,
          message: res.message,
        });
      } else {
        setErrorMessage(res.error || "Submission failed. Please check your information.");
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again or apply via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hello RiseUp Consultancy team, I am interested in applying for: ${job.title} (${job.jobId}) in ${job.city}. Please share the interview schedule and requirements.`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919359892819&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full">
      {/* Already Applied Modal */}
      <AlreadyAppliedModal
        isOpen={!!alreadyAppliedData}
        onClose={() => setAlreadyAppliedData(null)}
        data={alreadyAppliedData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Full Specifications & Overview (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Job Overview Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
            {/* Badges & Actions */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-full">
                  {job.category}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                  100% Free Placement
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full">
                  {job.workMode}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  title="Share this job"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-heading tracking-tight leading-tight mb-4">
              {job.title}
            </h1>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 mb-6 text-left">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Location
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{job.city}, {job.country}</span>
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Experience
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{job.expMin === 0 ? "Fresher to " : `${job.expMin} - `}{job.expMax} Years</span>
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Shift / Schedule
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{job.shift || "Day Shift"}</span>
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Compensation
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {job.salaryMin && job.salaryMax
                      ? `₹${(job.salaryMin / 100000).toFixed(1)} - ₹${(job.salaryMax / 100000).toFixed(1)} LPA`
                      : "Best in Industry"}
                  </span>
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4 text-left border-t border-slate-100 pt-6">
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Role Description &amp; Responsibilities
              </h2>
              <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm">
                {job.description}
              </div>

              {job.requirements && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <h2 className="text-lg font-bold text-slate-900 font-heading">
                    Candidate Requirements &amp; Skills
                  </h2>
                  <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm">
                    {job.requirements}
                  </div>
                </div>
              )}
            </div>

            {/* Trust Reassurance Strip */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100/70">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Direct Company Payroll</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Direct hiring on client corporate payroll.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Zero Candidate Fees</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">100% free placement assistance guaranteed.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <Building2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Top MNC &amp; Corporates</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Interview drives with verified organizations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Apply via WhatsApp Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-center sm:text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Fast-Track Interview Process
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight font-heading">
                Prefer WhatsApp for Quick Scheduling?
              </h3>
              <p className="text-xs text-emerald-100 mt-1 max-w-md">
                Connect directly with our recruitment desk on WhatsApp for instant feedback and schedule slots.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 fill-emerald-600" />
              <span>Apply via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Column: Inlined Direct Application Form (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md text-left">
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                Ref: {job.jobId}
              </span>
              <h3 className="text-lg font-black text-slate-900 font-heading mt-1.5">
                Apply for this Position
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit your profile directly to our hiring team. No charges applied.
              </p>
            </div>

            {successCandidateId ? (
              <div className="p-6 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-heading">
                  Application Submitted!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <strong className="text-slate-800">{formData.fullName}</strong>. Your application has been logged under ID: <strong className="font-mono text-emerald-800">{successCandidateId}</strong>.
                </p>
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                    <span>Ping HR on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800 font-medium">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition-all text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition-all text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all bg-slate-50/70 focus-within:bg-white">
                      <span className="inline-flex items-center px-3 text-xs font-bold text-slate-600 bg-slate-100/90 border-r border-slate-200 select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        name="phone"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2.5 text-xs outline-none bg-transparent transition-all text-slate-900 font-medium"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">10-digit number without country code</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current City *
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Pune"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition-all text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Qualification *
                    </label>
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition-all text-slate-900"
                    >
                      {QUALIFICATIONS.map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Total Experience
                    </label>
                    <select
                      name="totalExperience"
                      value={formData.totalExperience}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition-all text-slate-900"
                    >
                      {EXPERIENCES.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Notice Period
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition-all text-slate-900"
                    >
                      <option value="Immediate Joiner">Immediate Joiner</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                </div>

                {/* Resume Upload Box */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Upload Resume (PDF / DOCX) *
                  </label>
                  <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-white transition-colors">
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    {resumeFile ? (
                      <div className="flex items-center gap-2 text-blue-700">
                        <FileText className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-semibold truncate max-w-[200px]">
                          {resumeFile.name}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-slate-600 block">
                          Click to browse resume
                        </span>
                        <span className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 2MB</span>
                      </div>
                    )}
                  </label>
                  {fileError && (
                    <span className="text-[11px] text-red-600 font-medium block mt-1">
                      {fileError}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Profile...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Strict Privacy • Direct Corporate Submission</span>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Browse All Open Vacancies</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

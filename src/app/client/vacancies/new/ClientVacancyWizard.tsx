"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Briefcase, 
  FileCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  MapPin,
  Users,
  DollarSign,
  ShieldCheck
} from "lucide-react";
import { createClientVacancyAction } from "@/app/actions/client-actions";

interface ClientVacancyWizardProps {
  clientProfile: {
    id: string;
    companyName: string;
    country: string;
    city: string;
    industry: string;
    user: {
      fullName: string;
      email: string;
      phone: string;
    };
  };
}

const CATEGORIES = [
  "Voice BPO / Customer Service",
  "Non-Voice BPO / Email & Chat",
  "Back Office Operations",
  "BPM / Data Processing",
  "IT Support / Helpdesk",
  "IT Software / Engineering",
  "Sales & Business Development",
  "Finance & Accounts",
  "Human Resources & Admin",
];

const SHIFT_OPTIONS = [
  "Day Shift (9:30 AM - 6:30 PM)",
  "UK Shift (1:30 PM - 10:30 PM)",
  "US Shift (6:30 PM - 3:30 AM / Night)",
  "Rotational Shift (24/7 Window)",
  "Split Shift",
];

const INDIA_CITIES = [
  "Pune (HQ)",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Coimbatore",
  "Delhi NCR",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Indore",
];

const NIGERIA_CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Benin City",
];

export default function ClientVacancyWizard({ clientProfile }: ClientVacancyWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ jobId: string; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    companyName: clientProfile.companyName,
    country: (clientProfile.country === "Nigeria" ? "Nigeria" : "India") as "India" | "Nigeria",
    city: clientProfile.city || "Pune (HQ)",
    workMode: "On-site" as "On-site" | "Hybrid" | "Remote",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    
    // Step 2
    title: "",
    category: "Voice BPO / Customer Service",
    headcount: 5,
    expMin: 0,
    expMax: 2,
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: clientProfile.country === "Nigeria" ? "NGN" : "INR",
    availabilityRequired: "Immediate Joiner",
    description: "",
    requirements: "",
  });

  const cityOptions = formData.country === "Nigeria" ? NIGERIA_CITIES : INDIA_CITIES;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const validateStep1 = () => {
    if (!formData.city.trim()) {
      setErrorMessage("Please specify the office / work location city.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setErrorMessage("Job title must be at least 3 characters long.");
      return false;
    }
    if (Number(formData.headcount) < 1) {
      setErrorMessage("Open headcount must be at least 1.");
      return false;
    }
    if (Number(formData.expMax) < Number(formData.expMin)) {
      setErrorMessage("Maximum experience cannot be less than minimum experience.");
      return false;
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      setErrorMessage("Please provide a job description of at least 20 characters.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, String(value));
        }
      });

      const res = await createClientVacancyAction(data);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to submit vacancy.");
        setIsSubmitting(false);
      } else {
        setSuccessResult({
          jobId: res.jobId || "NEW-JOB",
          message: res.message || "Vacancy submitted successfully.",
        });
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <div className="bg-white border border-slate-200 rounded-none shadow-xs p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-3 py-1">
            Job ID: {successResult.jobId}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-4 font-heading">
            Vacancy Request Submitted for Review
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-sm mt-2">
            Your mandate has been successfully logged and dispatched to the RiseUp Super Admin desk. Once reviewed, it will be broadcasted to all active recruiters and recruiters will begin screening candidates immediately.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/client/vacancies"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs"
          >
            View Posted Vacancies
          </Link>
          <button
            onClick={() => {
              setSuccessResult(null);
              setStep(1);
              setFormData((prev) => ({
                ...prev,
                title: "",
                headcount: 5,
                description: "",
                requirements: "",
              }));
            }}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
          >
            Submit Another Vacancy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {clientProfile.companyName} &bull; Vacancy Request Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Request Candidates / Post New Mandate
          </h1>
        </div>
        <Link
          href="/client/vacancies"
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Vacancies
        </Link>
      </div>

      {/* Progress Steps Indicator */}
      <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-4">
        <div
          className={`flex items-center gap-2 pb-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            step >= 1 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-700 text-[10px]">
            1
          </span>
          <span className="hidden sm:inline">1. Work Setup</span>
        </div>
        <div
          className={`flex items-center gap-2 pb-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            step >= 2 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
          }`}
        >
          <span className={`w-5 h-5 flex items-center justify-center text-[10px] ${
            step >= 2 ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-slate-100 text-slate-400"
          }`}>
            2
          </span>
          <span className="hidden sm:inline">2. Role Criteria</span>
        </div>
        <div
          className={`flex items-center gap-2 pb-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            step === 3 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
          }`}
        >
          <span className={`w-5 h-5 flex items-center justify-center text-[10px] ${
            step === 3 ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-slate-100 text-slate-400"
          }`}>
            3
          </span>
          <span className="hidden sm:inline">3. Review & Submit</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs font-medium flex items-center gap-2 rounded-none">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Corporate Profile & Work Setup */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Step 1: Corporate Profile & Office Location
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Confirm your company details and specify where the selected candidates will work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Employer Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                disabled
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-600 font-bold rounded-none cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Tied to your corporate account</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Operating Region / Country <span className="text-rose-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={(e) => {
                  const newCountry = e.target.value as "India" | "Nigeria";
                  setFormData((prev) => ({
                    ...prev,
                    country: newCountry,
                    city: newCountry === "Nigeria" ? "Lagos" : "Pune (HQ)",
                    salaryCurrency: newCountry === "Nigeria" ? "NGN" : "INR",
                  }));
                }}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              >
                <option value="India">India</option>
                <option value="Nigeria">Nigeria</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work City Location <span className="text-rose-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Arrangement Mode <span className="text-rose-500">*</span>
              </label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              >
                <option value="On-site">On-site (At Company Office)</option>
                <option value="Hybrid">Hybrid (Split On-site / Remote)</option>
                <option value="Remote">100% Remote / Work from Home</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Shift Timing Schedule <span className="text-rose-500">*</span>
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              >
                {SHIFT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs"
            >
              <span>Continue to Role Criteria</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Role Specifications & Job Criteria */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Step 2: Role Details, Headcount & Experience
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Specify job title, open headcount target, experience, and salary range.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Customer Support Specialist - UK Voice Process"
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Department / Hiring Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Open Headcount Required <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="headcount"
                min="1"
                max="500"
                value={formData.headcount}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Minimum Experience (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="expMin"
                min="0"
                max="30"
                value={formData.expMin}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">0 = Fresher eligible</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Maximum Experience (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="expMax"
                min="0"
                max="30"
                value={formData.expMax}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Salary Min (Annual CTC / Monthly)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 text-xs font-bold text-slate-600">
                  {formData.salaryCurrency}
                </span>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  placeholder="e.g. 250000"
                  className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Salary Max (Annual CTC / Monthly)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 text-xs font-bold text-slate-600">
                  {formData.salaryCurrency}
                </span>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  placeholder="e.g. 450000"
                  className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Availability Required from Candidate <span className="text-rose-500">*</span>
              </label>
              <select
                name="availabilityRequired"
                value={formData.availabilityRequired}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              >
                <option value="Immediate Joiner">Immediate Joiner (0 to 7 Days)</option>
                <option value="15 Days">Within 15 Days</option>
                <option value="30 Days">30 Days Notice Period</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Detailed Job Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Explain the day-to-day responsibilities, process flow, and targets for this role..."
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Key Skills & Candidate Qualifications (Optional)
              </label>
              <textarea
                name="requirements"
                rows={3}
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="e.g. Any Graduate, Excellent Verbal English, Typing speed 30+ WPM, Flexible with rotational shifts..."
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-medium rounded-none focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs"
            >
              <span>Review Mandate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Terms Confirmation */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Step 3: Confirm Details & Commercial Terms
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your recruitment mandate before submitting it to the RiseUp Super Admin desk.
            </p>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Role Title</span>
              <span className="font-extrabold text-slate-900 text-sm">{formData.title}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Category</span>
              <span className="font-semibold text-slate-800">{formData.category}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Location & Mode</span>
              <span className="font-semibold text-slate-800">
                {formData.city}, {formData.country} &bull; {formData.workMode}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Shift</span>
              <span className="font-semibold text-slate-800">{formData.shift}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Target Headcount</span>
              <span className="font-extrabold text-blue-600">{formData.headcount} Candidates</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Experience Bracket</span>
              <span className="font-semibold text-slate-800">
                {formData.expMin} - {formData.expMax} Years ({formData.availabilityRequired})
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Compensation Bracket</span>
              <span className="font-semibold text-slate-800">
                {formData.salaryMin && formData.salaryMax
                  ? `${formData.salaryCurrency} ${Number(formData.salaryMin).toLocaleString()} - ${Number(formData.salaryMax).toLocaleString()}`
                  : "As per company standards"}
              </span>
            </div>
          </div>

          {/* Commercial & Operational Notice */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 text-blue-900 text-xs space-y-1.5 rounded-none">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              RiseUp Professional Placement Terms
            </div>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              Upon submission, this mandate will be verified by RiseUp Admin and pushed directly to active recruiters. All candidate profiles sent to you for interview will carry the official recruiter referral tag. Commercial placement billing applies only upon successful candidate joining as defined in your Master Service Agreement.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors rounded-none disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Mandate...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Vacancy Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

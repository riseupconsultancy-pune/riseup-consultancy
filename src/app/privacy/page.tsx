import React from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Rise Up Consultancy Pune",
  description:
    "Official privacy policy of Rise Up Consultancy Pune. Details how candidate resumes, applicant data, and client inquiries are securely managed and protected.",
  alternates: {
    canonical: "https://riseupconsultancy.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Rise Up Consultancy Pune",
    description: "Our commitment to candidate data privacy and secure recruitment operations.",
    url: "https://riseupconsultancy.in/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb Strip */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 text-xs text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Privacy Policy</span>
          </div>
        </div>

        {/* Page Hero */}
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 rounded-none">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Protection &amp; Confidentiality</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Rise Up Consultancy is committed to protecting your personal information and handling your candidate resume data with the highest standards of confidentiality and security.
            </p>
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Effective Date: {lastUpdated} • Rise Up Consultancy, Chandan Nagar, Pune
            </p>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 text-sm leading-relaxed text-slate-700">

            {/* Core Principle Callout */}
            <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-none shadow-xs">
              <div className="flex items-start gap-3.5">
                <Lock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-blue-950 font-heading">
                    Zero Data Selling Guarantee
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-blue-900 leading-relaxed">
                    <strong>We do not sell, rent, or trade candidate resumes or client contact data to third-party telemarketers or external advertising networks under any circumstances.</strong> Data submitted to Rise Up Consultancy is strictly utilized for employment verification and corporate recruitment matching.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">01.</span> Information We Collect
              </h2>
              <p>When you apply for vacancies or request corporate talent supply on our portal, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Candidate Identity:</strong> Full legal name, mobile number, WhatsApp phone, email address, current city, and state.</li>
                <li><strong>Professional Credentials:</strong> Educational qualifications, work experience, current notice period, target roles, and uploaded resume files (PDF formats up to 2MB).</li>
                <li><strong>Corporate Inquiries:</strong> Company name, designated HR/operations contact person, hiring headcount requirements, and business contact information.</li>
                <li><strong>Technical Telemetry:</strong> Standard non-identifying telemetry including browser type, operating system, and IP address collected via Google Analytics (G-QS11NZHQ73) to enhance user experience.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">02.</span> How We Use Your Information
              </h2>
              <p>Your information is used solely for the following legitimate business purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Evaluating your qualifications against active corporate job vacancies.</li>
                <li>Presenting shortlisted profiles to verified client organizations with your consent.</li>
                <li>Scheduling interview slots, sending venue directions, and providing offer updates via phone or WhatsApp.</li>
                <li>Fulfilling legal compliance, corporate audit records, and placement tracking within our internal CRM.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">03.</span> Resume &amp; Document Security
              </h2>
              <p>
                Uploaded resumes are stored in secure, private directories with randomized binary identifiers. We perform strict server-side file inspections (verifying PDF magic bytes `%PDF-`) to prevent malicious uploads and ensure file integrity. Access to candidate files is restricted strictly to authorized Rise Up recruiters and client talent acquisition SPOCs.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">04.</span> Data Retention &amp; Candidate Rights
              </h2>
              <p>
                Candidates may request updates to their contact details, withdrawal of active applications, or deletion of their stored resume from our talent pool at any time by contacting our recruitment desk at <a href="mailto:contact@riseupconsultancyy.com" className="text-blue-600 underline">contact@riseupconsultancyy.com</a>.
              </p>
            </div>

            {/* Section 5 */}
            <div className="p-6 bg-white border border-slate-200 rounded-none space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-heading">
                05. Privacy Grievance Officer
              </h2>
              <p className="text-xs text-slate-600">
                In accordance with the Information Technology Act 2000 and SPDI Rules, queries regarding this privacy policy can be addressed to:
              </p>
              <div className="mt-2 text-xs space-y-1 text-slate-700">
                <p><strong>Grievance Officer: Meenakshi Patel (HR Manager)</strong></p>
                <p>Rise Up Consultancy Pune</p>
                <p>Near Kumar Megaplex, Nagar Road, Chandan Nagar, Pune, Maharashtra 411014</p>
                <p>Phone: +91 93598 92819 | Email: contact@riseupconsultancyy.com</p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      <FloatingDock />
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import Link from "next/link";
import { CheckCircle2, Scale } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms and Conditions | Rise Up Consultancy Pune",
  description:
    "Official terms and conditions governing candidate placement, corporate talent supply, and recruitment services provided by Rise Up Consultancy Pune.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Terms and Conditions | Rise Up Consultancy Pune",
    description: "Official candidate placement and corporate staffing terms of service.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
};

export default function TermsPage() {
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
            <span className="text-slate-900 font-semibold">Terms &amp; Conditions</span>
          </div>
        </div>

        {/* Page Hero */}
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 rounded-none">
              <Scale className="w-3.5 h-3.5" />
              <span>Legal &amp; Placement Policy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading leading-tight">
              Terms &amp; Conditions of Service
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              These terms govern the use of the Rise Up Consultancy portal, recruitment workflows, candidate placement services, and corporate staffing agreements.
            </p>
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Effective Date: {lastUpdated} • Rise Up Consultancy, Chandan Nagar, Pune
            </p>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 text-sm leading-relaxed text-slate-700">

            {/* Zero Candidate Fee Guarantee Callout */}
            <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-none shadow-xs">
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-emerald-950 font-heading">
                    100% Free Placement Guarantee for Candidates
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    <strong>Rise Up Consultancy strictly NEVER charges any registration fee, application fee, document verification charge, or interview fee from job seekers.</strong> All recruitment costs are covered directly by authorized corporate client employers. Anyone claiming to represent Rise Up Consultancy and demanding money for an interview or offer letter is fraudulent and should be reported to us immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">01.</span> Scope &amp; Definitions
              </h2>
              <p>
                Rise Up Consultancy (&ldquo;Agency&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an authorized corporate talent acquisition firm headquartered in Chandan Nagar, Pune, Maharashtra. These terms apply to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Job Seekers / Candidates:</strong> Individuals who submit applications, CVs, or resumes through our website or recruiter links for verified vacancies.</li>
                <li><strong>Corporate Employers / Clients:</strong> Enterprises, BPOs, and organizations that engage Rise Up Consultancy to source, screen, and supply talent.</li>
                <li><strong>Website Visitors:</strong> Any person accessing our domain or digital portal.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">02.</span> Candidate Rights &amp; Responsibilities
              </h2>
              <p>
                By submitting an application or resume on this portal:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>You confirm that all personal, academic, and professional details provided in your application and resume are true, accurate, and verifiable.</li>
                <li>You grant Rise Up Consultancy consent to evaluate your profile and present your CV to verified hiring client partners matching your skill profile and location preference.</li>
                <li>You agree to attend scheduled virtual or on-site client interviews on time and communicate any schedule conflicts at least 4 hours in advance to your assigned HR recruiter.</li>
                <li>You acknowledge that final selection, compensation offers, and appointment letters are at the sole discretion of the hiring corporate client.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">03.</span> Corporate Client &amp; Employer Terms
              </h2>
              <p>
                All corporate talent supply engagements, staffing mandates, and executive search services are executed under mutually signed <strong>Corporate Client Placement Agreements</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Direct Company Payroll:</strong> Candidates sourced by Rise Up Consultancy are placed on direct company payrolls unless specified otherwise under specific contract staffing agreements.</li>
                <li><strong>Standard Payment Terms:</strong> Invoices are generated upon successful joining of the candidate and are payable under Net 30 Days terms unless otherwise stated in the signed agreement.</li>
                <li><strong>90-Day Free Replacement Guarantee:</strong> If a placed candidate leaves or is separated within ninety (90) calendar days from the date of joining, Rise Up Consultancy will source and provide an equivalent qualified replacement at zero additional charge.</li>
                <li><strong>Non-Circumvention:</strong> Corporate clients agree not to solicit or hire candidates submitted by Rise Up Consultancy through backdoor channels for a period of 12 months following initial profile submission.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">04.</span> Intellectual Property &amp; Portal Use
              </h2>
              <p>
                All content, branding marks, logos, user interfaces, CRM architecture, document generators, and software code on this portal are the proprietary intellectual property of Rise Up Consultancy Pune. Unauthorized scraping, reproduction, reverse-engineering, or commercial exploitation is strictly prohibited under Indian IT Act 2000 regulations.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">05.</span> Limitation of Liability
              </h2>
              <p>
                Rise Up Consultancy acts as an intermediary facilitating recruitment connections between verified employers and job seekers. While we conduct rigorous preliminary screening, we are not liable for employment disputes, workplace conditions, or individual actions occurring post-employment on client company premises.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">06.</span> Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Pune, Maharashtra, India</strong>.
              </p>
            </div>

            {/* Section 7 */}
            <div className="p-6 bg-white border border-slate-200 rounded-none space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-heading">
                07. Contact &amp; Grievance Redressal
              </h2>
              <p className="text-xs text-slate-600">
                For questions regarding these terms, candidate assistance, or corporate partnerships, please reach out to our official desk:
              </p>
              <div className="mt-2 text-xs space-y-1 text-slate-700">
                <p><strong>Rise Up Consultancy Pune</strong></p>
                <p>Near Kumar Megaplex, Nagar Road, Chandan Nagar, Pune, Maharashtra 411014</p>
                <p>Phone: +91 93598 92819 / +91 70301 22065</p>
                <p>Email: contact@riseupconsultancyy.com</p>
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

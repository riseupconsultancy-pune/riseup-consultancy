"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBanner from "@/components/TrustBanner";
import SpecializationMatrix from "@/components/SpecializationMatrix";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import ApplyModal from "@/components/ApplyModal";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleHireClick = () => {
    setIsHireModalOpen(true);
  };

  const handleJobsClick = () => {
    router.push("/jobs");
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white pb-28 sm:pb-36">
      {/* 1. Official Header */}
      <Header />

      {/* 2. Executive Hero Section with Official Tagline */}
      <Hero onHireClick={handleHireClick} onJobsClick={handleJobsClick} />

      {/* 3. Official Trust & Authenticity Badges */}
      <TrustBanner />

      {/* 4. Current Hiring Specialization (BPO & Non-Technical) */}
      <SpecializationMatrix onJobsClick={handleJobsClick} />

      {/* 5. Comprehensive Practice Areas & Staffing Services */}
      <ServicesSection onHireClick={handleHireClick} />

      {/* 6. About Us, Mission & Leadership Directory */}
      <AboutSection />

      {/* 7. Quick Overview of Featured BPO/Non-Tech Roles */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Active Hiring Mandates
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Open Positions
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 self-start sm:self-auto"
            >
              <span>Browse All Openings with Live Filters</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Quick Cards: Mobile Horizontal Scroller, Desktop Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 sm:pb-0 gap-5 sm:grid sm:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            
            {/* Card 1 */}
            <div className="snap-start shrink-0 w-[82vw] max-w-[340px] sm:w-auto p-6 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex flex-col justify-between rounded-none">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5">
                    Voice Process
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Immediate
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">Customer Success Associate</h3>
                <p className="text-xs text-slate-500 mt-2">Pune, India • Fresher / 1-3 Years • Day Shift</p>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  Inbound customer communications, account verification, and first-contact resolution for enterprise clients.
                </p>
              </div>
              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center justify-between pt-4 border-t border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>View Job & Apply</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="snap-start shrink-0 w-[82vw] max-w-[340px] sm:w-auto p-6 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex flex-col justify-between rounded-none">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5">
                    Non-Voice / Back Office
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Immediate
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">Operations & Records Specialist</h3>
                <p className="text-xs text-slate-500 mt-2">Pune, India • 0-2 Years • Day Shift</p>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  Transaction processing, documentation verification, and back-office documentation for financial services accounts.
                </p>
              </div>
              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center justify-between pt-4 border-t border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>View Job & Apply</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="snap-start shrink-0 w-[82vw] max-w-[340px] sm:w-auto p-6 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex flex-col justify-between rounded-none">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5">
                    Chat & Email Support
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Immediate
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">Digital Customer Support Specialist</h3>
                <p className="text-xs text-slate-500 mt-2">Pune / Mumbai • 1-3 Years • Rotational Shift</p>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  Providing swift chat and email query resolutions for tech and retail accounts. Excellent typing and written communication.
                </p>
              </div>
              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center justify-between pt-4 border-t border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>View Job & Apply</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Mobile Swipe Notice */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 mt-2">
            <span>Swipe horizontally to view more positions →</span>
          </div>

        </div>
      </section>

      {/* 8. Contact, Location & Working Hours Hub */}
      <ContactSection />

      {/* 9. Official Footer */}
      <Footer />

      {/* 10. Liquid Glass Bottom Navigation Dock */}
      <FloatingDock onHireClick={handleHireClick} />

      {/* 11. Corporate Inquiry Modal */}
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />

      {/* 12. Candidate Profile Intake Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle="General BPO / Non-Technical Application"
      />
    </main>
  );
}
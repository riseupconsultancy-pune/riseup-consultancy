"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBanner from "@/components/TrustBanner";
import SpecializationMatrix from "@/components/SpecializationMatrix";
import CandidateJourney from "@/components/CandidateJourney";
import PuneHubsMatrix from "@/components/PuneHubsMatrix";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import ApplyModal from "@/components/ApplyModal";
import VerificationBadge from "@/components/VerificationBadge";
import { 
  ArrowUpRight, 
  MapPin, 
  PhoneCall, 
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("Customer Care Executive");

  const handleHireClick = () => {
    setIsHireModalOpen(true);
  };

  const handleJobsClick = () => {
    router.push("/jobs");
  };

  const handleQuickApply = (title: string) => {
    setSelectedJobTitle(title);
    setIsApplyModalOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white pb-24 sm:pb-32">
      {/* 1. Official Header */}
      <Header />

      {/* 2. Executive Hero Section with Official Tagline & Dual CTAs */}
      <Hero onHireClick={handleHireClick} onJobsClick={handleJobsClick} />

      {/* 3. Candidate Placement Pathway (48-Hour Roadmap) */}
      <CandidateJourney />

      {/* 4. Official Trust & Verification Standards */}
      <TrustBanner />

      {/* 5. Key Employment Micro-Markets Across Pune (Kharadi, Magarpatta, Hinjewadi) */}
      <PuneHubsMatrix />

      {/* 6. Current Hiring Specialization (BPO & Non-Technical) */}
      <SpecializationMatrix onJobsClick={handleJobsClick} />

      {/* 7. Featured Open Positions */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-slate-200 gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Active Hiring Mandates
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Pune Vacancies
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors self-start sm:self-auto shrink-0 pb-1"
            >
              <span>Browse All Openings with Live Filters</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Quick Cards: Mobile Horizontal Scroller, Desktop 3-Col Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 sm:pb-0 gap-3.5 sm:grid sm:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            
            {/* Card 1: Voice */}
            <div className="snap-start shrink-0 w-[80vw] max-w-[320px] sm:w-auto p-4 sm:p-5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex flex-col justify-between rounded-none group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5">
                    Voice Process
                  </span>
                  <VerificationBadge label="IMMEDIATE" variant="outline" size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Customer Success Associate
                </h3>
                <p className="text-xs text-slate-500 mt-1">Pune, India • Fresher / 1-3 Yrs • Day Shift</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">English Fluency</span>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">Inbound Voice</span>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">Customer Care</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleQuickApply("Customer Success Associate (Voice)")}
                  className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Quick Apply</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <Link href="/jobs" className="text-[10px] font-semibold text-slate-500 hover:text-slate-900">
                  View Details
                </Link>
              </div>
            </div>

            {/* Card 2: Non-Voice */}
            <div className="snap-start shrink-0 w-[80vw] max-w-[320px] sm:w-auto p-4 sm:p-5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex flex-col justify-between rounded-none group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5">
                    Non-Voice / Back Office
                  </span>
                  <VerificationBadge label="IMMEDIATE" variant="outline" size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Operations & Records Specialist
                </h3>
                <p className="text-xs text-slate-500 mt-1">Pune, India • 0-2 Yrs • Day Shift</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">35+ WPM Typing</span>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">MS Excel</span>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">KYC Processing</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleQuickApply("Operations & Records Specialist (Non-Voice)")}
                  className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Quick Apply</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <Link href="/jobs" className="text-[10px] font-semibold text-slate-500 hover:text-slate-900">
                  View Details
                </Link>
              </div>
            </div>

            {/* Card 3: Chat & Email */}
            <div className="snap-start shrink-0 w-[80vw] max-w-[320px] sm:w-auto p-4 sm:p-5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex flex-col justify-between rounded-none group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5">
                    Chat & Email Support
                  </span>
                  <VerificationBadge label="IMMEDIATE" variant="outline" size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Digital Support Specialist
                </h3>
                <p className="text-xs text-slate-500 mt-1">Pune / Mumbai • 1-3 Yrs • Rotational Shift</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">Live Chat</span>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">Email Support</span>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5">Ticket Handling</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleQuickApply("Digital Support Specialist (Chat & Email)")}
                  className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Quick Apply</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <Link href="/jobs" className="text-[10px] font-semibold text-slate-500 hover:text-slate-900">
                  View Details
                </Link>
              </div>
            </div>

          </div>

          {/* Mobile Swipe Notice */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-2">
            <span>Swipe horizontally to view more positions →</span>
          </div>

        </div>
      </section>

      {/* 7. Dedicated Page Spotlight: About Us & Leadership Profile */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 rounded-none">
            
            <div className="max-w-2xl">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block mb-1">
                Established January 2025 • Pune, India
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Direct Corporate Staffing Built on Integrity
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Headquartered in Chandan Nagar, Pune with international cross-border corridors into Nigeria, Rise Up Consultancy eliminates recruitment sub-brokering. We connect enterprise employers directly with pre-screened talent across BPO, banking, and customer support.
              </p>

              {/* 3 Highlights */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block font-mono">1,200+</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Candidates Placed</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block font-mono">24-48h</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Sourcing SLA</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-blue-600 block font-mono">100%</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Free for Seekers</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 lg:w-72">
              <Link
                href="/about"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none shadow-xs"
              >
                <span>Read Story & Leadership</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
              >
                <span>All 13 Practice Areas</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Dedicated Page Spotlight: Chandan Nagar HQ & Direct Contact */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Office & Contact Information */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Direct Contact & Headquarters Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Visit Our Pune Office or Speak to HR Directly
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Official candidates and hiring employers can reach out directly during standard business hours.
              </p>

              {/* Direct Calling & Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                
                {/* Meenakshi Patel */}
                <a
                  href="tel:+919359892819"
                  className="p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex items-center gap-3 rounded-none group"
                >
                  <div className="w-8 h-8 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Meenakshi Patel (HR)</span>
                    <span className="text-xs font-extrabold text-slate-900 truncate block font-mono">+91 93598 92819</span>
                  </div>
                </a>

                {/* Shaziya Khan */}
                <a
                  href="tel:+917030122065"
                  className="p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors flex items-center gap-3 rounded-none group"
                >
                  <div className="w-8 h-8 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shaziya Khan (Recruiter)</span>
                    <span className="text-xs font-extrabold text-slate-900 truncate block font-mono">+91 70301 22065</span>
                  </div>
                </a>

              </div>

              {/* Physical Address Pill */}
              <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-200 flex items-start gap-3 rounded-none">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <strong className="font-bold text-slate-900">Pune HQ:</strong> Near Kumar Megaplex, Chandan Nagar, Pune, Maharashtra 411014.
                </div>
              </div>
            </div>

            {/* Right: Quick Action Banner */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-none flex flex-col justify-between">
              <div>
                <VerificationBadge label="OFFICIAL RECRUITMENT DESK" variant="solid" size="sm" className="mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Need Immediate Hiring Assistance?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Whether you are scaling a 50-agent customer support cohort or seeking an immediate BPO opening in Pune, our team is ready to assist.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleHireClick}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
                >
                  <span>Submit Corporate Hiring Requirement</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
                >
                  <span>View Google Map & Virtual Nigeria Hub</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

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
        jobTitle={selectedJobTitle}
      />
    </main>
  );
}
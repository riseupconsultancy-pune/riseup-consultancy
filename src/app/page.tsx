"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import ApplyModal from "@/components/ApplyModal";
import Link from "next/link";
import { ArrowUpRight, Briefcase } from "lucide-react";

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
      {/* Top Header */}
      <Header />

      {/* Main Executive Hero Section */}
      <Hero onHireClick={handleHireClick} onJobsClick={handleJobsClick} />

      {/* Quick Overview of Featured Roles with Direct Link to /jobs */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                Latest Mandates
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Open Positions
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 self-start sm:self-auto"
            >
              <span>View All Openings with Filters</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">IT & Software</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Senior Full Stack Engineer</h3>
                <p className="text-xs text-slate-500 mt-2">Pune, India • 3-5 Years • ₹14 - 20 LPA</p>
              </div>
              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold uppercase text-slate-900 hover:text-blue-600"
              >
                <span>Details & Apply</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Non-IT / Retail</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Corporate HR Business Partner</h3>
                <p className="text-xs text-slate-500 mt-2">Pune, India • 3-5 Years • ₹8 - 12 LPA</p>
              </div>
              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold uppercase text-slate-900 hover:text-blue-600"
              >
                <span>Details & Apply</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Logistics & Supply</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Commercial Sales Executive</h3>
                <p className="text-xs text-slate-500 mt-2">Lagos, Nigeria • 1-3 Years • ₦6M - 9M</p>
              </div>
              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold uppercase text-slate-900 hover:text-blue-600"
              >
                <span>Details & Apply</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Consultancy Services Practice Areas */}
      <ServicesSection onHireClick={handleHireClick} />

      {/* Footer */}
      <Footer />

      {/* Apple-Inspired Liquid Glass Bottom Navigation Dock */}
      <FloatingDock onHireClick={handleHireClick} />

      {/* Client Requirement Intake Modal */}
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />

      {/* Candidate Profile Submission Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle="General Talent Network"
      />
    </main>
  );
}
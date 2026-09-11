"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedJobs from "@/components/FeaturedJobs";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import ApplyModal from "@/components/ApplyModal";

export default function HomePage() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("General Talent Pool");
  const [activeTab, setActiveTab] = useState("home");

  const handleHireClick = () => {
    setIsHireModalOpen(true);
  };

  const handleJobsClick = () => {
    const jobsEl = document.getElementById("jobs");
    if (jobsEl) {
      jobsEl.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const handleApplyClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setIsApplyModalOpen(true);
  };

  const handleDockTabSelect = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "jobs") {
      document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "services") {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "hire") {
      setIsHireModalOpen(true);
    } else if (tab === "contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Hero Section */}
      <Hero onHireClick={handleHireClick} onJobsClick={handleJobsClick} />

      {/* Featured Jobs Section */}
      <FeaturedJobs onApplyClick={handleApplyClick} />

      {/* Consultancy Services Section */}
      <ServicesSection onHireClick={handleHireClick} />

      {/* Footer */}
      <Footer />

      {/* Apple-Style Floating Glass Dock (Sticky Bottom Navigation) */}
      <FloatingDock activeTab={activeTab} onTabSelect={handleDockTabSelect} />

      {/* Employer Requirement Modal */}
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />

      {/* Candidate Job Application Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={selectedJobTitle}
      />
    </main>
  );
}
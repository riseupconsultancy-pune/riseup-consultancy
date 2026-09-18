"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import VerificationBadge from "@/components/VerificationBadge";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Building2, 
  CalendarCheck,
  Send,
  Briefcase
} from "lucide-react";

export default function ContactPage() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white pb-28 sm:pb-36">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Official Contact & Location Desk
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Get in Touch with Our Pune Headquarters
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Reach out directly to our HR leadership for corporate hiring mandates, talent requests, or location coordination.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <VerificationBadge label="AUTHORIZED COMMUNICATION CHANNELS ONLY" />
              <span className="text-xs text-slate-500 font-semibold">
                No Third-Party Agencies
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Office Pillars */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Direct HR Calling & WhatsApp */}
            <div className="p-4 sm:p-6 bg-white border border-slate-200 hover:border-slate-900 transition-all rounded-none flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5">
                    Direct HR Line
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-1.5">
                  HR Management Calling Contacts
                </h2>
                <p className="text-xs text-slate-600 mb-4">
                  Direct phone access to our Pune recruitment team:
                </p>

                {/* Meenakshi Patel */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 mb-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Meenakshi Patel</span>
                    <span className="text-[10px] text-blue-600 uppercase font-semibold">HR Manager</span>
                  </div>
                  <a
                    href="tel:+919359892819"
                    className="mt-1.5 text-sm font-extrabold text-slate-900 hover:text-blue-600 flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>+91 93598 92819</span>
                  </a>
                </div>

                {/* Shaziya Khan */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 mb-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Shaziya Khan</span>
                    <span className="text-[10px] text-blue-600 uppercase font-semibold">Manager</span>
                  </div>
                  <a
                    href="tel:+917030122065"
                    className="mt-1.5 text-sm font-extrabold text-slate-900 hover:text-blue-600 flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>+91 70301 22065</span>
                  </a>
                </div>

                {/* Official Email */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 mb-5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Official Domain Email
                  </span>
                  <a
                    href="mailto:contact@riseupconsultancyy.com"
                    className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>contact@riseupconsultancyy.com</span>
                  </a>
                </div>
              </div>

              {/* 1-Tap WhatsApp Action */}
              <a
                href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20contacting%20Rise%20Up%20Consultancy%20Pune%20regarding%20staffing%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors rounded-none"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>

            {/* Card 2: Pune Headquarters & Map Access */}
            <div className="p-4 sm:p-6 bg-white border border-slate-200 hover:border-slate-900 transition-all rounded-none flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5">
                    Registered Center
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-1.5">
                  Pune Headquarters
                </h2>
                <p className="text-xs text-slate-600 mb-4">
                  Registered office location in Maharashtra, India:
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 mb-4">
                  <span className="text-xs font-bold text-slate-900 block mb-1">
                    Rise Up Consultancy Pune
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Chandan Nagar, Pune – 411014,<br />
                    Maharashtra, India.
                  </p>
                </div>

                {/* Nigeria Virtual Corridor */}
                <div className="p-4 bg-slate-50 border border-slate-200 mb-5">
                  <div className="flex items-center justify-between mb-1 text-xs font-bold text-slate-900">
                    <span>Nigeria Virtual Hub</span>
                    <span className="text-[10px] text-blue-600 uppercase">Cross-Border</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Coordinated by Cynthia Glenn for international talent sourcing and multinational enterprise client accounts.
                  </p>
                </div>

                {/* LinkedIn Badge */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 mb-5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Official LinkedIn Page</span>
                  <a
                    href="https://www.linkedin.com/company/rise-up-consultancy-pune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Google Maps Button */}
              <a
                href="https://share.google/EHi7eqNdq3gmPzWCD"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors rounded-none"
              >
                <span>Open Pin in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Card 3: Operating Schedule & Intake Desk */}
            <div className="p-4 sm:p-6 bg-white border border-slate-200 hover:border-slate-900 transition-all rounded-none flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5">
                    Official Hours
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-1.5">
                  Recruitment Desk Hours
                </h2>
                <p className="text-xs text-slate-600 mb-4">
                  Authorized operating windows for calls and corporate meetings:
                </p>

                {/* Schedule Table */}
                <div className="bg-slate-50 border border-slate-200 divide-y divide-slate-200 mb-4">
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Monday – Friday</span>
                    <span className="font-bold text-blue-600">10:00 AM – 7:00 PM</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Saturday</span>
                    <span className="font-bold text-rose-600 uppercase text-[10px]">Closed</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Sunday</span>
                    <span className="font-bold text-rose-600 uppercase text-[10px]">Closed</span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50 border border-blue-200 text-xs text-slate-700 leading-relaxed mb-5">
                  <strong className="font-bold text-slate-900 block mb-0.5">24/7 Digital Intake:</strong>
                  Candidate resumes and corporate hiring requests submitted online are queued and acknowledged next business morning.
                </div>
              </div>

              {/* Submit Mandate Button */}
              <button
                onClick={() => setIsHireModalOpen(true)}
                type="button"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors rounded-none cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Submit Hiring Inquiry</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      <Footer />
      <FloatingDock onHireClick={() => setIsHireModalOpen(true)} />
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </main>
  );
}

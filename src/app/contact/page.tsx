"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import VerificationBadge from "@/components/VerificationBadge";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ContactForm from "@/components/ContactForm";
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
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-slate-50/60 border-b border-slate-200/80 py-14 sm:py-20">
        {/* Ambient Glow & Micro-Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/90 border border-blue-200/60 rounded-full mb-4 shadow-2xs backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Official Contact & Location Desk
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Get in Touch with Our <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">Pune Headquarters</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Reach out directly to our HR leadership for corporate hiring mandates, talent requests, or location coordination.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <VerificationBadge label="AUTHORIZED COMMUNICATION CHANNELS ONLY" />
              <span className="text-xs text-slate-600 font-semibold bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
                No Third-Party Agencies
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Office Pillars */}
      <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: Direct HR Calling & WhatsApp */}
            <div className="group relative p-6 sm:p-7 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xs">
              {/* Top Sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full shadow-2xs">
                    Direct HR Line
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2 tracking-tight">
                  HR Management Calling Contacts
                </h2>
                <p className="text-xs text-slate-600 mb-5 font-normal leading-relaxed">
                  Direct phone access to our Pune recruitment team:
                </p>

                {/* Meenakshi Patel */}
                <div className="p-4 bg-white/90 border border-slate-200/80 rounded-2xl mb-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Meenakshi Patel</span>
                    <span className="text-[10px] text-blue-700 uppercase font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">HR Manager</span>
                  </div>
                  <a
                    href="tel:+919359892819"
                    className="mt-2 text-sm font-black text-slate-900 hover:text-blue-600 flex items-center gap-2 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span>+91 93598 92819</span>
                  </a>
                </div>

                {/* Shaziya Khan */}
                <div className="p-4 bg-white/90 border border-slate-200/80 rounded-2xl mb-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Shaziya Khan</span>
                    <span className="text-[10px] text-blue-700 uppercase font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Manager</span>
                  </div>
                  <a
                    href="tel:+917030122065"
                    className="mt-2 text-sm font-black text-slate-900 hover:text-blue-600 flex items-center gap-2 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span>+91 70301 22065</span>
                  </a>
                </div>

                {/* Official Email */}
                <div className="p-4 bg-white/90 border border-slate-200/80 rounded-2xl mb-6 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Official Domain Email
                  </span>
                  <a
                    href="mailto:info@riseupconsultancyy.com"
                    className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-2 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">info@riseupconsultancyy.com</span>
                  </a>
                </div>
              </div>

              {/* 1-Tap WhatsApp Action */}
              <a
                href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20contacting%20Rise%20Up%20Consultancy%20Pune%20regarding%20staffing%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all rounded-xl shadow-md shadow-emerald-600/20 active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>

            {/* Card 2: Pune Headquarters & Map Access */}
            <div className="group relative p-6 sm:p-7 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xs">
              {/* Top Sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                    Registered Center
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2 tracking-tight">
                  Pune Headquarters
                </h2>
                <p className="text-xs text-slate-600 mb-5 font-normal leading-relaxed">
                  Registered office location in Maharashtra, India:
                </p>

                <div className="p-4 bg-white/90 border border-slate-200/80 rounded-2xl mb-3.5 shadow-2xs">
                  <span className="text-xs font-black text-slate-900 block mb-1">
                    Rise Up Consultancy Pune
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Chandan Nagar, Pune – 411014,<br />
                    Maharashtra, India.
                  </p>
                </div>

                {/* Nigeria Virtual Corridor */}
                <div className="p-4 bg-white/90 border border-slate-200/80 rounded-2xl mb-3.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-slate-900">
                    <span>Nigeria Virtual Hub</span>
                    <span className="text-[10px] text-blue-700 uppercase font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Cross-Border</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Coordinated by Cynthia Glenn for international talent sourcing and enterprise client accounts.
                  </p>
                </div>

                {/* LinkedIn Badge */}
                <div className="p-4 bg-white/90 border border-slate-200/80 rounded-2xl mb-6 shadow-2xs flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Official LinkedIn</span>
                  <a
                    href="https://www.linkedin.com/company/rise-up-consultancy-pune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Google Maps Button */}
              <a
                href="https://share.google/EHi7eqNdq3gmPzWCD"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all rounded-xl shadow-xs active:scale-[0.98]"
              >
                <span>Open Pin in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Card 3: Operating Schedule & Intake Desk */}
            <div className="group relative p-6 sm:p-7 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xs">
              {/* Top Sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                    Official Hours
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2 tracking-tight">
                  Recruitment Desk Hours
                </h2>
                <p className="text-xs text-slate-600 mb-5 font-normal leading-relaxed">
                  Authorized operating windows for calls and corporate meetings:
                </p>

                {/* Schedule Table */}
                <div className="bg-white/90 border border-slate-200/80 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-2xs mb-4">
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Monday – Friday</span>
                    <span className="font-bold text-blue-600">10:00 AM – 7:00 PM</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Saturday</span>
                    <span className="font-bold text-rose-600 uppercase text-[10px] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">Closed</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Sunday</span>
                    <span className="font-bold text-rose-600 uppercase text-[10px] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">Closed</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-blue-50 border border-blue-200/70 text-xs text-slate-700 leading-relaxed mb-6 rounded-2xl shadow-2xs">
                  <strong className="font-bold text-slate-900 block mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    24/7 Digital Intake:
                  </strong>
                  Candidate resumes and corporate hiring requests submitted online are queued and acknowledged next business morning.
                </div>
              </div>

              {/* Submit Mandate Button */}
              <button
                onClick={() => setIsHireModalOpen(true)}
                type="button"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Submit Hiring Inquiry</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Direct Online Contact Form */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      <Footer />
      <FloatingDock onHireClick={() => setIsHireModalOpen(true)} />
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </main>
  );
}

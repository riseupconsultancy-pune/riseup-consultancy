"use client";

import React from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Building2, 
  ShieldCheck,
  CalendarCheck
} from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Contact & Locations
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Connect with Our Authorized Recruitment Desk
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Reach out directly to our HR leadership for corporate hiring mandates, candidate inquiries, or location coordination.
          </p>
        </div>

        {/* 3 Main Columns: Contact Desk, Address & Maps, Working Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Official HR Contacts */}
          <div className="p-7 bg-slate-50 border border-slate-200 flex flex-col justify-between rounded-none">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-1">
                  Direct HR Desk
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Authorized Calling Contacts
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Direct phone connections with our Pune recruitment leadership:
              </p>

              {/* Contact 1: Meenakshi Patel */}
              <div className="p-4 bg-white border border-slate-200 mb-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Meenakshi Patel</span>
                  <span className="text-[10px] font-semibold text-blue-600 uppercase">HR Manager</span>
                </div>
                <a
                  href="tel:+919359892819"
                  className="mt-2 text-sm font-extrabold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>+91 93598 92819</span>
                </a>
              </div>

              {/* Contact 2: Shaziya Khan */}
              <div className="p-4 bg-white border border-slate-200 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Shaziya Khan</span>
                  <span className="text-[10px] font-semibold text-blue-600 uppercase">Manager</span>
                </div>
                <a
                  href="tel:+917030122065"
                  className="mt-2 text-sm font-extrabold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>+91 70301 22065</span>
                </a>
              </div>
            </div>

            {/* Official WhatsApp 1-Click Action */}
            <a
              href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20reaching%20out%20via%20Rise%20Up%20Consultancy%20official%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors rounded-none"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat on WhatsApp Directly</span>
            </a>
          </div>

          {/* Card 2: Pune Headquarters & Map Access */}
          <div className="p-7 bg-slate-50 border border-slate-200 flex flex-col justify-between rounded-none">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-1">
                  Pune Headquarters
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Office Location
              </h3>
              <p className="text-xs text-slate-600 mb-5">
                Visit or direct physical postal correspondence to our registered Pune operations center:
              </p>

              <div className="p-4 bg-white border border-slate-200 mb-5">
                <div className="text-sm font-bold text-slate-900 mb-1">
                  Rise Up Consultancy Pune
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chandan Nagar, Pune – 411014,<br />
                  Maharashtra, India.
                </p>
              </div>

              {/* Nigeria Office Mention */}
              <div className="p-4 bg-white border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">International Corridor</span>
                  <span className="text-[10px] font-semibold text-blue-600 uppercase">Nigeria</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Under the management of Cynthia Glenn, coordinating talent placement across regional African enterprise clients.
                </p>
              </div>
            </div>

            {/* Google Maps External Button */}
            <a
              href="https://share.google/EHi7eqNdq3gmPzWCD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors rounded-none"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Official Working Hours */}
          <div className="p-7 bg-slate-50 border border-slate-200 flex flex-col justify-between rounded-none">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-1">
                  Operating Hours
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Official Working Schedule
              </h3>
              <p className="text-xs text-slate-600 mb-5">
                Our recruiting team operates under strict business coordination windows:
              </p>

              {/* Schedule Table */}
              <div className="bg-white border border-slate-200 divide-y divide-slate-100 mb-6">
                <div className="p-3.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">Monday – Friday</span>
                  <span className="font-bold text-blue-600">10:00 AM – 7:00 PM</span>
                </div>
                <div className="p-3.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">Saturday</span>
                  <span className="font-bold text-rose-600 uppercase text-[11px]">Off / Closed</span>
                </div>
                <div className="p-3.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">Sunday</span>
                  <span className="font-bold text-rose-600 uppercase text-[11px]">Off / Closed</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200/80 mb-4 text-xs text-slate-700 leading-relaxed">
                <strong className="font-bold text-slate-900">24/7 Digital Intake:</strong> While physical desks follow business hours, candidate job applications through this portal are accepted 24/7 and processed next business morning.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Authorized Operating Hours Verified</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

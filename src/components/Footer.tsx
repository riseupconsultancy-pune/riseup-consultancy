import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-32 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info with Official Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-700 bg-white shrink-0">
                <Image
                  src="/images/rise_up_consultancy_pune_logo.png"
                  alt="Rise Up Consultancy Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight font-heading">Rise Up Consultancy</span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                  Pune – Staffing & Recruiting Services
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-2">
              <strong className="text-white">&ldquo;Talent Aligned. Futures Elevated.&rdquo;</strong>
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-5">
              Established January 2025 in Pune. Connecting organizations with verified BPO, corporate, and non-technical talent across Pan-India and global corridors.
            </p>

            {/* Quick Actions Strip: WhatsApp + Email + LinkedIn */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <a
                href="https://wa.me/919359892819?text=Hello%20Rise%20Up%20Consultancy,%20I%20would%20like%20to%20inquire%20about%20your%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors rounded-none"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp HR</span>
              </a>

              <a
                href="mailto:contact@riseupconsultancyy.com"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-700 transition-colors rounded-none"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>contact@riseupconsultancyy.com</span>
              </a>

              <a
                href="https://www.linkedin.com/company/rise-up-consultancy-pune"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 bg-slate-800 border border-slate-700 text-slate-300 hover:text-blue-400 hover:border-blue-500 transition-colors rounded-none font-bold text-xs"
                title="LinkedIn Page"
              >
                in
              </a>
            </div>

            {/* Quick Multi-Page Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          {/* Pune Headquarters */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Pune Headquarters
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chandan Nagar, Pune – 411014,<br />
              Maharashtra, India.
            </p>
            <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-400">
              <a href="tel:+919359892819" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+91 93598 92819 (Meenakshi Patel)</span>
              </a>
              <a href="tel:+917030122065" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+91 70301 22065 (Shaziya Khan)</span>
              </a>
              <a
                href="https://share.google/EHi7eqNdq3gmPzWCD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-semibold mt-1"
              >
                <span>View Google Maps Pin</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Working Hours & International */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">
              Operating Schedule
            </h4>
            <div className="text-xs text-slate-400 space-y-1 leading-relaxed">
              <p className="text-white font-medium">Monday – Friday:</p>
              <p className="text-blue-400 font-semibold">10:00 AM – 7:00 PM</p>
              <p className="pt-1 text-slate-400">Saturday & Sunday: <span className="text-rose-400 font-semibold">Closed</span></p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <h5 className="text-xs font-semibold text-slate-300 mb-1">International Corridor</h5>
              <p className="text-xs text-slate-400">
                Nigeria Virtual Operations Hub under Cynthia Glenn coordinating cross-border African hiring.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Rise Up Consultancy Pune. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <Link href="/login" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">
              CRM Portal Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
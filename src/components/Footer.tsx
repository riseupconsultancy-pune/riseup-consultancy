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
                  src="/images/rise_up_consultancy_pune_logo.jpg"
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

            <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-3">
              <strong className="text-white">&ldquo;Talent Aligned. Futures Elevated.&rdquo;</strong>
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
              Established in January 2025 in Pune. Connecting organizations with high-performing BPO, corporate, and non-technical talent across Pan-India and international markets with 100% direct sourcing.
            </p>

            {/* 1-Click WhatsApp Button */}
            <a
              href="https://wa.me/919359892819?text=Hello%20Rise%20Up%20Consultancy,%20I%20would%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors rounded-none"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: +91 93598 92819 (Meenakshi Patel)</span>
            </a>
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
              <p className="pt-1 text-slate-400">Saturday & Sunday: <span className="text-rose-400 font-semibold">Off</span></p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <h5 className="text-xs font-semibold text-slate-300 mb-1">International Corridor</h5>
              <p className="text-xs text-slate-400">
                Nigeria Management under Cynthia Glenn coordinating cross-border African hiring.
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
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 pb-32 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info with Official Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-700 bg-white shrink-0">
                <Image
                  src="/images/rise_up_consultancy_pune_logo.jpg"
                  alt="Rise Up Consultancy Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight font-heading">RiseUp Consultancy</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Staffing and Recruiting Services
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              Premier recruitment and executive staffing consultancy connecting high-growth businesses with verified professionals across India and Nigeria.
            </p>
            {/* 1-Click WhatsApp Button */}
            <a
              href="https://wa.me/919876543210?text=Hello%20RiseUp%20Consultancy,%20I%20would%20like%20to%20know%20more%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Chat on WhatsApp Directly
            </a>
          </div>

          {/* Pune Office */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Pune, India
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kalyani Nagar / Baner Business Hub,<br />
              Pune, Maharashtra 411006
            </p>
            <div className="mt-3 flex flex-col gap-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> +91 98765 43210
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> contact@riseupconsultancy.in
              </span>
            </div>
          </div>

          {/* Nigeria Office */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Lagos, Nigeria
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Victoria Island Commercial District,<br />
              Lagos, Nigeria
            </p>
            <div className="mt-3 flex flex-col gap-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> +234 1 234 5678
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> nigeria@riseupconsultancy.com
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RiseUp Consultancy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <Link href="/login" className="text-slate-400 hover:text-blue-400 transition-colors">
              CRM Portal Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
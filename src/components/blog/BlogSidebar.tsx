"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles,
  BookOpen
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface BlogSidebarProps {
  currentPost: BlogPost;
  relatedPosts: BlogPost[];
  onOpenConsultationModal: () => void;
}

export default function BlogSidebar({
  currentPost,
  relatedPosts,
  onOpenConsultationModal,
}: BlogSidebarProps) {
  const [formData, setFormData] = useState({
    name: "",
    workEmail: "",
    phone: "",
    company: "",
    hiringNeed: "BPO Voice Staffing",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSidebarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <aside className="w-full lg:w-[360px] shrink-0 space-y-6 lg:sticky lg:top-24">
      
      {/* 1. Quick Right-Side Contact / Consultation Form */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
            Pune Recruitment Desk
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Sourcing
          </span>
        </div>

        <h3 className="text-lg font-black text-slate-900 tracking-tight font-heading mb-1.5">
          Request Staffing Consultation
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Need candidates for your Pune facility? Share your mandate for immediate 24-hr turnaround.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-xs">Inquiry Received</h4>
            <p className="text-[11px] text-slate-600">
              Our Pune team will contact you within <strong>2 hours</strong>.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer pt-1"
            >
              Submit Another Mandate
            </button>
          </div>
        ) : (
          <form onSubmit={handleSidebarSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rajesh Sharma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={formData.workEmail}
                onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                placeholder="rajesh@company.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Direct Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Process / Staffing Required
              </label>
              <select
                value={formData.hiringNeed}
                onChange={(e) => setFormData({ ...formData, hiringNeed: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
              >
                <option value="BPO Voice Staffing">BPO Voice Executives (US/UK/Domestic)</option>
                <option value="Non-Voice Chat Support">Non-Voice Chat & Email Support</option>
                <option value="BFSI & KYC Manpower">BFSI, Operations & KYC Manpower</option>
                <option value="Inside Sales Team">Inside Sales & Lead Gen Reps</option>
                <option value="Bulk Turnkey RPO">Bulk Turnkey RPO (50+ Seats)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              {submitting ? (
                <span>Routing...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Hiring Mandate</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" /> 2hr SLA Call Back
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <ShieldCheck className="w-3 h-3" /> No Candidate Fees
          </span>
        </div>
      </div>

      {/* 2. Direct HR Leadership Card (Meenakshi Patel & Shaziya Khan) */}
      <div className="p-5 bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Direct HR Leadership Desk
        </h4>

        {/* Meenakshi Patel */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-black text-slate-900">Meenakshi Patel</span>
            <span className="text-[10px] text-blue-700 uppercase font-bold bg-blue-50 px-1.5 py-0.5 rounded">HR Manager</span>
          </div>
          <a
            href="tel:+919359892819"
            className="text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center gap-2 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-3 h-3" />
            </div>
            <span>+91 93598 92819</span>
          </a>
        </div>

        {/* Shaziya Khan */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-black text-slate-900">Shaziya Khan</span>
            <span className="text-[10px] text-blue-700 uppercase font-bold bg-blue-50 px-1.5 py-0.5 rounded">Manager</span>
          </div>
          <a
            href="tel:+917030122065"
            className="text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center gap-2 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-3 h-3" />
            </div>
            <span>+91 70301 22065</span>
          </a>
        </div>

        {/* 1-Tap WhatsApp Button */}
        <a
          href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20reviewing%20your%20BPO%20staffing%20article%20and%20need%20candidate%20profiles"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>Chat Directly on WhatsApp</span>
        </a>

        {/* Physical Office Address */}
        <div className="pt-2 text-[11px] text-slate-500 space-y-1">
          <p className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Chandan Nagar, Pune – 411014, Maharashtra (5 mins from Kharadi EON IT Park)</span>
          </p>
        </div>
      </div>

      {/* 3. Relevant / Trending Topic Cards */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Related Staffing Topics</span>
          </h4>
          <Link href="/blog" className="text-[11px] font-bold text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {relatedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight block truncate">
                  {post.category}
                </span>
                <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h5>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {post.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}

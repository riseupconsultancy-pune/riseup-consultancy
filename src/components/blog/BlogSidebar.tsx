"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { Phone, MapPin, BookOpen } from "lucide-react";
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
  return (
    <aside className="w-full lg:w-[340px] shrink-0 space-y-5 lg:sticky lg:top-24">

      {/* 1. Request Talent CTA — Adapts to candidate job search or employer mandate */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          {currentPost.cta?.primaryLink ? "Looking for BPO Jobs?" : "Need Staffing Support?"}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {currentPost.cta?.primaryLink
            ? "Explore active voice, non-voice chat, and technical support vacancies with 100% zero candidate fees."
            : "Share your hiring requirements and receive pre-screened candidate shortlists within 24 hours."}
        </p>
        {currentPost.cta?.primaryLink ? (
          <Link
            href={currentPost.cta.primaryLink}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center block"
          >
            {currentPost.cta.primaryText || "Browse Active Jobs"}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Request Talent
          </button>
        )}
      </div>

      {/* 2. Direct Contact Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Direct Contact
        </h4>

        {/* Meenakshi Patel */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-semibold text-slate-900 block">Meenakshi Patel</span>
            <span className="text-xs text-slate-500">HR Manager</span>
          </div>
          <a
            href="tel:+919359892819"
            className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            +91 93598 92819
          </a>
        </div>

        {/* Shaziya Khan */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-semibold text-slate-900 block">Shaziya Khan</span>
            <span className="text-xs text-slate-500">Manager</span>
          </div>
          <a
            href="tel:+917030122065"
            className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            +91 70301 22065
          </a>
        </div>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919359892819?text=Hello%20Meenakshi%20Patel,%20I%20am%20reviewing%20your%20BPO%20staffing%20article%20and%20need%20candidate%20profiles"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>

        {/* Address */}
        <p className="text-xs text-slate-500 flex items-start gap-1.5 pt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>Chandan Nagar, Pune – 411014, Maharashtra</span>
        </p>
      </div>

      {/* 3. Related Topics */}
      {relatedPosts.length > 0 && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Related Topics</span>
            </h4>
            <Link href="/blog" className="text-xs font-medium text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h5>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import { BlogPost } from "@/types/blog";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogInlineHook from "@/components/blog/BlogInlineHook";
import BlogFaqAccordion from "@/components/blog/BlogFaqAccordion";
import BlogCommentsSection from "@/components/blog/BlogCommentsSection";
import BlogConsultationModal from "@/components/blog/BlogConsultationModal";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  MapPin, 
  ListOrdered
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface BlogArticleClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogArticleClient({ post, relatedPosts }: BlogArticleClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Article Body (65% width on desktop) */}
          <article className="w-full lg:flex-1 min-w-0">
            
            {/* 1. Header & Engagement Bar */}
            <BlogHeader post={post} onCommentsClick={scrollToComments} />

            {/* 2. Featured Hero Cover Image */}
            <div className="relative w-full h-[260px] sm:h-[420px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 mb-8 bg-slate-100">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-4 sm:p-6 text-white">
                <span className="text-xs font-semibold text-slate-200 block">
                  {post.coverImageAlt}
                </span>
              </div>
            </div>

            {/* 3. Quick Table of Contents (Anchor Jump Links) */}
            <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm mb-10 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-wider mb-3">
                <ListOrdered className="w-4 h-4 text-blue-600" />
                <span>Executive Table of Contents</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-medium">
                <li>
                  <a href="#subject-section" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    1. The Pune BPO Landscape
                  </a>
                </li>
                <li>
                  <a href="#problem-section" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    2. The Problem: 45%+ Attrition & Ghosting
                  </a>
                </li>
                <li>
                  <a href="#solution-section" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    3. The Solution: 4-Stage Cohort Vetting
                  </a>
                </li>
                <li>
                  <a href="#services-section" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    4. Specialized Staffing Tracks & SLAs
                  </a>
                </li>
                <li>
                  <a href="#comparison-section" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    5. Commercial Comparison Table
                  </a>
                </li>
                <li>
                  <a href="#faq-section" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    6. Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* ============================================================== */}
            {/* 4. SECTION 1: THE SUBJECT                                      */}
            {/* ============================================================== */}
            <section id="subject-section" className="mb-10 scroll-mt-24 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Section 1: Industry Briefing</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                {post.subject.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {post.subject.summary}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {post.subject.metrics.map((metric, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      {metric.label}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-blue-600 tracking-tight font-heading block">
                      {metric.value}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================== */}
            {/* 5. SECTION 2: THE PROBLEM                                      */}
            {/* ============================================================== */}
            <section id="problem-section" className="mb-10 scroll-mt-24 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Section 2: The Core Challenge</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                {post.problem.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {post.problem.description}
              </p>

              {/* Pain Point Cards */}
              <div className="space-y-3.5 pt-2">
                {post.problem.painPoints.map((pain, i) => (
                  <div key={i} className="p-5 bg-white rounded-2xl border border-rose-100 shadow-2xs hover:border-rose-300 transition-colors">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      {pain.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                      {pain.description}
                    </p>
                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-rose-900 flex items-start gap-2">
                      <strong className="font-bold shrink-0">Bottom-Line Impact:</strong>
                      <span>{pain.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================== */}
            {/* 6. EMBEDDED INLINE HOOK (CLICK TO OPEN POPUP MODAL)             */}
            {/* ============================================================== */}
            <BlogInlineHook
              onOpenModal={() => setIsModalOpen(true)}
              title="Need 15 to 50+ Pre-Assessed BPO Voice Agents in Pune This Week?"
              subtitle="Avoid Day-1 ghosting and unvetted resume spam. Receive voice-cleared candidate shortlists with verified night-shift transport viability in 24–48 hours."
              badge="Pune Regional Staffing SLA"
            />

            {/* ============================================================== */}
            {/* 7. SECTION 3: THE SOLUTION                                     */}
            {/* ============================================================== */}
            <section id="solution-section" className="mb-10 scroll-mt-24 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Section 3: The Solution Framework</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                {post.solution.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {post.solution.description}
              </p>

              {/* 4 Step Process Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {post.solution.steps.map((step, i) => (
                  <div key={i} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center mb-3">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================== */}
            {/* 8. SECTION 4: OUR RELEVANT SERVICES                            */}
            {/* ============================================================== */}
            <section id="services-section" className="mb-10 scroll-mt-24 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Section 4: Our Specialized Services</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                {post.relevantServices.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {post.relevantServices.description}
              </p>

              {/* Services Cards */}
              <div className="space-y-4 pt-2">
                {post.relevantServices.services.map((srv, i) => (
                  <div key={i} className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="max-w-xl">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                          {srv.sla}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Pune Corridor
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {srv.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        {srv.description}
                      </p>
                      <div className="text-xs text-slate-500 font-medium">
                        <strong>Best Fit:</strong> {srv.suitableFor}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 self-start"
                    >
                      <span>Inquire Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================== */}
            {/* 9. SECTION 5: COMMERCIAL COMPARISON TABLE                      */}
            {/* ============================================================== */}
            <section id="comparison-section" className="mb-10 scroll-mt-24 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Section 5: SLA Comparison</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                {post.comparisonTable.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {post.comparisonTable.subtitle}
              </p>

              {/* Styled Table */}
              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      {post.comparisonTable.headers.map((h, i) => (
                        <th 
                          key={i} 
                          className={`p-3.5 sm:p-4 font-black uppercase tracking-wider ${
                            i === 2 ? "text-blue-700 bg-blue-50/50" : "text-slate-700"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {post.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 sm:p-4 font-bold text-slate-900 whitespace-nowrap">
                          {row[0]}
                        </td>
                        <td className="p-3.5 sm:p-4 text-slate-500">
                          {row[1]}
                        </td>
                        <td className="p-3.5 sm:p-4 font-semibold text-slate-900 bg-blue-50/30">
                          <span className="flex items-center gap-1.5 text-blue-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            {row[2]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ============================================================== */}
            {/* 10. SECTION 6: FAQS WITH ACCORDION & SCHEMAS                    */}
            {/* ============================================================== */}
            <div id="faq-section" className="scroll-mt-24">
              <BlogFaqAccordion faqs={post.faqs} topicTitle={post.title} />
            </div>

            {/* ============================================================== */}
            {/* 11. SECTION 7: COMMENTS & DISCUSSION                           */}
            {/* ============================================================== */}
            <BlogCommentsSection comments={post.comments} postTitle={post.title} />

            {/* ============================================================== */}
            {/* 12. RELATED POSTS CARDS                                        */}
            {/* ============================================================== */}
            <RelatedPosts posts={relatedPosts} />

          </article>

          {/* Right Column: Sticky Sidebar on Desktop */}
          <BlogSidebar
            currentPost={post}
            relatedPosts={relatedPosts}
            onOpenConsultationModal={() => setIsModalOpen(true)}
          />

        </div>
      </div>

      <Footer />
      <FloatingDock onHireClick={() => setIsModalOpen(true)} />

      {/* Pop-up Consultation Modal */}
      <BlogConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultSubject={`Hiring Consultation for ${post.title}`}
        sourceBlogTitle={post.title}
      />
    </main>
  );
}

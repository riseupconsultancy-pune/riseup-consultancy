"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import { BlogPost } from "@/types/blog";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogInlineHook from "@/components/blog/BlogInlineHook";
import BlogFaqAccordion from "@/components/blog/BlogFaqAccordion";
import BlogCommentsSection from "@/components/blog/BlogCommentsSection";
import RelatedPosts from "@/components/blog/RelatedPosts";

interface BlogArticleClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogArticleClient({ post, relatedPosts }: BlogArticleClientProps) {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Article Body */}
          <article className="w-full lg:flex-1 min-w-0 max-w-full overflow-hidden">
            
            {/* 1. Header & Engagement Bar */}
            <BlogHeader post={post} onCommentsClick={scrollToComments} />

            {/* 2. Cover Image */}
            <div className="relative w-full h-[220px] sm:h-[380px] rounded-2xl overflow-hidden border border-slate-200 mb-8 bg-slate-100">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>

            {/* 3. Table of Contents */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Table of Contents</h2>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-600">
                <li><a href="#subject-section" className="hover:text-blue-600 transition-colors">{post.subject.title}</a></li>
                <li><a href="#problem-section" className="hover:text-blue-600 transition-colors">{post.problem.headline}</a></li>
                <li><a href="#solution-section" className="hover:text-blue-600 transition-colors">{post.solution.headline}</a></li>
                <li><a href="#services-section" className="hover:text-blue-600 transition-colors">{post.relevantServices.headline}</a></li>
                <li><a href="#comparison-section" className="hover:text-blue-600 transition-colors">{post.comparisonTable.title}</a></li>
                <li><a href="#faq-section" className="hover:text-blue-600 transition-colors">Frequently Asked Questions</a></li>
              </ol>
            </div>

            {/* ============================================================== */}
            {/* SECTION 1: THE SUBJECT                                         */}
            {/* ============================================================== */}
            <section id="subject-section" className="mb-10 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {post.subject.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                {post.subject.summary}
              </p>

              {/* Key Metrics — Simple Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-3 font-semibold text-slate-700">Metric</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Value</th>
                      <th className="text-left p-3 font-semibold text-slate-700 hidden sm:table-cell">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {post.subject.metrics.map((metric, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-600">{metric.label}</td>
                        <td className="p-3 font-semibold text-slate-900">{metric.value}</td>
                        <td className="p-3 text-slate-500 hidden sm:table-cell">{metric.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ============================================================== */}
            {/* SECTION 2: THE PROBLEM                                         */}
            {/* ============================================================== */}
            <section id="problem-section" className="mb-10 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {post.problem.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                {post.problem.description}
              </p>

              {/* Pain Points — Clean numbered list */}
              <div className="space-y-4">
                {post.problem.painPoints.map((pain, i) => (
                  <div key={i} className="border-l-2 border-slate-300 pl-4">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
                      {i + 1}. {pain.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                      {pain.description}
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      <strong>Impact:</strong> {pain.impact}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================== */}
            {/* INLINE CTA — Opens HireModal                                   */}
            {/* ============================================================== */}
            <BlogInlineHook
              onOpenModal={() => setIsHireModalOpen(true)}
              title="Need 15 to 50+ Pre-Assessed BPO Voice Agents in Pune This Week?"
              subtitle="Avoid Day-1 ghosting and unvetted resume spam. Receive voice-cleared candidate shortlists with verified night-shift transport viability in 24–48 hours."
            />

            {/* ============================================================== */}
            {/* SECTION 3: THE SOLUTION                                        */}
            {/* ============================================================== */}
            <section id="solution-section" className="mb-10 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {post.solution.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                {post.solution.description}
              </p>

              {/* Steps — Clean numbered table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-3 font-semibold text-slate-700 w-12">Step</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Process</th>
                      <th className="text-left p-3 font-semibold text-slate-700 hidden sm:table-cell">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {post.solution.steps.map((step, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-blue-600">{step.stepNumber}</td>
                        <td className="p-3 font-semibold text-slate-900">{step.title}</td>
                        <td className="p-3 text-slate-600 hidden sm:table-cell">{step.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ============================================================== */}
            {/* SECTION 4: OUR RELEVANT SERVICES                               */}
            {/* ============================================================== */}
            <section id="services-section" className="mb-10 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {post.relevantServices.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                {post.relevantServices.description}
              </p>

              {/* Services — Clean list with CTA */}
              <div className="space-y-4">
                {post.relevantServices.services.map((srv, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
                          {srv.name}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-2">
                          {srv.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          <span><strong>SLA:</strong> {srv.sla}</span>
                          <span><strong>Best Fit:</strong> {srv.suitableFor}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsHireModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
                      >
                        Get in Touch →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================== */}
            {/* SECTION 5: COMMERCIAL COMPARISON TABLE                         */}
            {/* ============================================================== */}
            <section id="comparison-section" className="mb-10 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {post.comparisonTable.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {post.comparisonTable.subtitle}
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {post.comparisonTable.headers.map((h, i) => (
                        <th
                          key={i}
                          className={`text-left p-3 font-semibold ${
                            i === 2 ? "text-blue-700" : "text-slate-700"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {post.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                          {row[0]}
                        </td>
                        <td className="p-3 text-slate-500">
                          {row[1]}
                        </td>
                        <td className="p-3 font-semibold text-blue-700">
                          ✓ {row[2]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ============================================================== */}
            {/* SECTION 6: FAQS                                                */}
            {/* ============================================================== */}
            <div id="faq-section" className="scroll-mt-24">
              <BlogFaqAccordion faqs={post.faqs} topicTitle={post.title} />
            </div>

            {/* ============================================================== */}
            {/* SECTION 7: COMMENTS                                            */}
            {/* ============================================================== */}
            <BlogCommentsSection comments={post.comments} postTitle={post.title} />

            {/* ============================================================== */}
            {/* RELATED POSTS                                                  */}
            {/* ============================================================== */}
            <RelatedPosts posts={relatedPosts} />

          </article>

          {/* Right Column: Sticky Sidebar on Desktop */}
          <BlogSidebar
            currentPost={post}
            relatedPosts={relatedPosts}
            onOpenConsultationModal={() => setIsHireModalOpen(true)}
          />

        </div>
      </div>

      <Footer />
      <FloatingDock onHireClick={() => setIsHireModalOpen(true)} />

      {/* HireModal — Same CRM-connected popup used across the site */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />
    </main>
  );
}

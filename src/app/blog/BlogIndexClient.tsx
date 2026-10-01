"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import HireModal from "@/components/HireModal";
import { BlogPost } from "@/types/blog";
import { 
  Search, 
  Clock, 
  Eye, 
  Heart, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BookOpen,
  Send
} from "lucide-react";

interface BlogIndexClientProps {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogIndexClient({ posts, categories }: BlogIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-slate-50/60 border-b border-slate-200/80 py-12 sm:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/90 border border-blue-200/60 rounded-full mb-4 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Staffing Playbooks & Executive Briefings
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-heading">
              Recruitment Insights & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">Pune Staffing Intelligence</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Practical guides on BPO cohort scaling, solving attrition, Versant voice vetting, and specialized lateral placement across Pune and Pan-India tech corridors.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staffing topics, cities (Pune, Kharadi, Hinjewadi), or BPO roles..."
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm focus:border-blue-600 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-semibold scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "All"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            All Articles ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Showcase Card (When no filter or 'All') */}
        {selectedCategory === "All" && !searchQuery && featuredPost && (
          <div className="mb-12">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-6 sm:p-8">
                
                {/* Image */}
                <div className="lg:col-span-6 relative w-full h-[240px] sm:h-[340px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.coverImageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Flagship Guide</span>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-blue-700 uppercase bg-blue-50 border border-blue-200/60 px-3 py-0.5 rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="text-[11px] text-slate-600 flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {featuredPost.city}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight font-heading group-hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {featuredPost.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {featuredPost.readTime}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Eye className="w-3.5 h-3.5 text-blue-600" /> {featuredPost.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {featuredPost.likes} likes
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider group-hover:bg-blue-600 transition-colors shadow-sm">
                      <span>Read Complete Staffing Playbook</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          </div>
        )}

        {/* All Articles Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <h3 className="text-lg font-black text-slate-900 tracking-tight font-heading">
              {selectedCategory === "All" ? "All Recruitment Articles" : selectedCategory} ({filteredPosts.length})
            </h3>
            <span className="text-xs text-slate-500">
              Showing {filteredPosts.length} results
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{post.city}</span>
                  </div>
                  {post.publishedAt === "Coming Soon" && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                      Upcoming Topic
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-2">
                      {post.category}
                    </span>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug font-heading mb-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-blue-600" /> {post.views}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>

      <Footer />
      <FloatingDock onHireClick={() => setIsHireModalOpen(true)} />
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </main>
  );
}

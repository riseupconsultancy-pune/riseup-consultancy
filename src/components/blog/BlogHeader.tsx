"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Check, 
  MapPin, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface BlogHeaderProps {
  post: BlogPost;
  onCommentsClick?: () => void;
}

export default function BlogHeader({ post, onCommentsClick }: BlogHeaderProps) {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <header className="mb-8">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-semibold truncate max-w-[240px] sm:max-w-md">
          {post.category}
        </span>
      </nav>

      {/* 2. Category & City Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3.5">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-blue-700 font-bold text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          {post.category}
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-semibold text-xs">
          <MapPin className="w-3 h-3 text-rose-500" />
          {post.city}
        </span>
        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
          Verified Staffing Playbook
        </span>
      </div>

      {/* 3. Main Title (H1) */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] font-heading mb-4">
        {post.title}
      </h1>

      {/* 4. Subtitle / Executive Hook */}
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6">
        {post.subtitle}
      </p>

      {/* 5. Author & Engagement Bar */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        
        {/* Author info */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200 shrink-0">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900">{post.author.name}</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">Author</span>
            </div>
            <p className="text-[11px] text-slate-500">{post.author.role}</p>
          </div>
        </div>

        {/* Essential Blog Engagement Parameters (Date, Read Time, Views, Likes, Comments, Share) */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
          
          {/* Date */}
          <div className="flex items-center gap-1.5" title="Published Date">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.publishedAt}</span>
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-1.5" title="Estimated Reading Time">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.readTime}</span>
          </div>

          {/* Views Counter */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full text-slate-700 font-medium" title="Article Views">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>{post.views.toLocaleString()} views</span>
          </div>

          {/* Interactive Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer font-semibold ${
              hasLiked
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-slate-100 hover:bg-slate-200/70 text-slate-700"
            }`}
            title="Like this article"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${hasLiked ? "fill-rose-600 scale-110" : ""}`} />
            <span>{likes}</span>
          </button>

          {/* Comments Count */}
          <button
            type="button"
            onClick={onCommentsClick}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 px-2.5 py-1 rounded-full text-slate-700 font-medium transition-colors cursor-pointer"
            title="View discussion"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>{post.commentsCount}</span>
          </button>

          {/* Share Links */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            {/* WhatsApp Share */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + (typeof window !== "undefined" ? window.location.href : ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Copy article link"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}

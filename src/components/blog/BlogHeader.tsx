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
  ChevronRight,
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
    <header className="mb-6">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-700 font-medium truncate max-w-[200px] sm:max-w-md">
          {post.category}
        </span>
      </nav>

      {/* 2. Category & City */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <span className="font-medium text-blue-600">{post.category}</span>
        <span>·</span>
        <span>{post.city}</span>
      </div>

      {/* 3. Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
        {post.title}
      </h1>

      {/* 4. Subtitle */}
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
        {post.subtitle}
      </p>

      {/* 5. Author & Engagement Bar */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">

        {/* Author info */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-900 block">{post.author.name}</span>
            <span className="text-xs text-slate-500">{post.author.role}</span>
          </div>
        </div>

        {/* Engagement metrics */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {/* Date */}
          <span className="flex items-center gap-1" title="Published">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {post.publishedAt}
          </span>

          {/* Read Time */}
          <span className="flex items-center gap-1" title="Read Time">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {post.readTime}
          </span>

          {/* Views */}
          <span className="flex items-center gap-1" title="Views">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {post.views.toLocaleString()}
          </span>

          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 cursor-pointer transition-colors ${
              hasLiked ? "text-rose-600" : "hover:text-rose-500"
            }`}
            title="Like"
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-600" : ""}`} />
            {likes}
          </button>

          {/* Comments */}
          <button
            type="button"
            onClick={onCommentsClick}
            className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors"
            title="Comments"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {post.commentsCount}
          </button>

          {/* Share */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + (typeof window !== "undefined" ? window.location.href : ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-emerald-50 text-emerald-600 transition-colors"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1 rounded hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Copy link"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="my-14 pt-8 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Explore More Insights
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
            Related Recruitment & Staffing Guides
          </h3>
        </div>
        <Link href="/blog" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
          <span>View All Articles</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-44 overflow-hidden bg-slate-100">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{post.city}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1.5 block">
                  {post.category}
                </span>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2 font-heading">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
                <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read Guide →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

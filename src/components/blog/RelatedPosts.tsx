import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { Clock } from "lucide-react";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="my-10 pt-8 border-t border-slate-200">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Related Articles
        </h2>
        <Link href="/blog" className="text-xs font-medium text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-40 overflow-hidden bg-slate-100">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-blue-600 font-medium block mb-1">
                  {post.category}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                  {post.title}
                </h3>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
                <span className="text-blue-600 font-medium">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

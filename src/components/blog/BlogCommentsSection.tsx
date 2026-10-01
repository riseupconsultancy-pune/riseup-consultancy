"use client";

import React, { useState } from "react";
import { BlogComment } from "@/types/blog";
import { Send, CheckCircle2 } from "lucide-react";

interface BlogCommentsSectionProps {
  comments: BlogComment[];
  postTitle: string;
}

export default function BlogCommentsSection({ comments: initialComments, postTitle }: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    comment: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return;

    const newComment: BlogComment = {
      id: `user-comment-${Date.now()}`,
      name: formData.name,
      role: formData.role || "Reader",
      company: formData.company || "",
      date: "Just now",
      comment: formData.comment,
    };

    setComments([newComment, ...comments]);
    setFormData({ name: "", email: "", company: "", role: "", comment: "" });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="comments-section" className="my-10">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
        Discussion ({comments.length})
      </h2>
      <p className="text-sm text-slate-500 mb-6">Share your insights or ask a question</p>

      {/* Comments List */}
      <div className="space-y-3 mb-8">
        {comments.map((comm) => (
          <div key={comm.id} className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0">
                  {comm.name.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900">{comm.name}</span>
                  {comm.company && (
                    <span className="text-xs text-slate-500 ml-1.5">{comm.role} · {comm.company}</span>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400">{comm.date}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pl-9">
              {comm.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Leave a Reply</h3>

        {isSubmitted && (
          <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Your comment has been posted.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name *"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:outline-none"
            />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email *"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <textarea
            required
            rows={3}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Write your comment..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:outline-none resize-none"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Post Comment</span>
          </button>
        </form>
      </div>
    </section>
  );
}

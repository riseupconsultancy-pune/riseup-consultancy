"use client";

import React, { useState } from "react";
import { BlogComment } from "@/types/blog";
import { MessageSquare, Send, CheckCircle2, User, Building2 } from "lucide-react";

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
      role: formData.role || "Talent Partner",
      company: formData.company || "Pune Enterprise",
      date: "Just now",
      comment: formData.comment,
    };

    setComments([newComment, ...comments]);
    setFormData({ name: "", email: "", company: "", role: "", comment: "" });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="comments-section" className="my-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-heading">
              Industry Discussion ({comments.length})
            </h3>
            <p className="text-[11px] text-slate-500">Feedback from operations heads and recruiters</p>
          </div>
        </div>
      </div>

      {/* Existing Comments List */}
      <div className="space-y-4 mb-8">
        {comments.map((comm) => (
          <div key={comm.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {comm.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{comm.name}</h4>
                  <p className="text-[10px] text-slate-500">
                    {comm.role} • <span className="font-semibold text-slate-700">{comm.company}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{comm.date}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-10">
              {comm.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Leave a Reply Form */}
      <div className="p-5 sm:p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-1">
          Share Your Operational Insights / Ask a Question
        </h4>
        <p className="text-[11px] text-slate-500 mb-4">
          Your email address will not be published. Required fields are marked *
        </p>

        {isSubmitted && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your comment has been posted to the discussion board.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Anand Joshi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="anand@company.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Company / Hub (e.g. Kharadi BPO)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Wipro EON Kharadi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Designation / Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Operations Delivery Manager"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
              Your Comment / Hiring Challenge *
            </label>
            <textarea
              required
              rows={3}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience with BPO attrition, Versant scores, or turnaround times in Pune..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Post Comment</span>
          </button>
        </form>
      </div>
    </section>
  );
}

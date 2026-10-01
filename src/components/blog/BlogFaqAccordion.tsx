"use client";

import React, { useState } from "react";
import { BlogFaq } from "@/types/blog";
import { ChevronDown, HelpCircle } from "lucide-react";

interface BlogFaqAccordionProps {
  faqs: BlogFaq[];
  topicTitle?: string;
}

export default function BlogFaqAccordion({ faqs, topicTitle }: BlogFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="my-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
        <HelpCircle className="w-4 h-4" />
        <span>Frequently Asked Questions</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading mb-6">
        {topicTitle ? `Pune BPO Staffing FAQs: Everything Employers Ask` : "Frequently Asked Questions"}
      </h3>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all ${
                isOpen 
                  ? "border-blue-300 bg-blue-50/20 shadow-2xs" 
                  : "border-slate-200 bg-slate-50/60 hover:bg-slate-50"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  {faq.question}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? "rotate-180 bg-blue-600 text-white" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-blue-100/60 mt-1">
                  <p className="pt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

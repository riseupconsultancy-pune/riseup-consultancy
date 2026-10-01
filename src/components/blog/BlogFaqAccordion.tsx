"use client";

import React, { useState } from "react";
import { BlogFaq } from "@/types/blog";
import { ChevronDown } from "lucide-react";

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
    <section className="my-10">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
        Frequently Asked Questions
      </h2>

      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-colors ${
                isOpen ? "border-slate-300 bg-slate-50" : "border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm text-slate-900 leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-200">
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

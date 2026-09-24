import React from "react";
import prisma from "@/lib/prisma";
import JobsDirectoryClient, { MinimalistJob } from "./JobsDirectoryClient";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Open Job Vacancies | RiseUp Consultancy Pune & Nigeria",
  description:
    "Apply directly for verified BPO, BPM, Back Office, IT, and Corporate positions in Pune, Mumbai, Bengaluru, Lagos, and Abuja. 100% Free placement assistance for job seekers.",
  keywords: [
    "Jobs in Pune",
    "BPO Jobs Pune",
    "Back Office vacancies",
    "RiseUp Consultancy careers",
    "Customer Support jobs",
    "Jobs in Lagos Nigeria",
    "Fresher jobs Pune",
  ],
  alternates: {
    canonical: `${SITE_URL}/jobs`,
  },
  openGraph: {
    title: "Open Job Vacancies | RiseUp Consultancy",
    description: "Browse verified corporate and BPO jobs in India & Nigeria. 100% Free candidate placement services.",
    url: `${SITE_URL}/jobs`,
    type: "website",
  },
};

// Clean default fallback jobs (Zero company names)
const FALLBACK_JOBS: MinimalistJob[] = [
  {
    id: "fallback-1",
    jobId: "RUP-JOB-1001",
    title: "Customer Support Specialist (Voice Process)",
    category: "Voice Process",
    city: "Pune",
    country: "India",
    workMode: "On-site",
    expMin: 0,
    expMax: 2,
    skills: ["English Fluency", "Customer Handling", "Day Shift"],
  },
  {
    id: "fallback-2",
    jobId: "RUP-JOB-1002",
    title: "Back Office Operations Specialist (Non-Voice)",
    category: "Back Office",
    city: "Pune",
    country: "India",
    workMode: "On-site",
    expMin: 0,
    expMax: 1,
    skills: ["Data Entry", "Typing 30 WPM", "MS Excel"],
  },
  {
    id: "fallback-3",
    jobId: "RUP-JOB-1003",
    title: "IT Support & Service Desk Analyst",
    category: "IT Support",
    city: "Bengaluru",
    country: "India",
    workMode: "Hybrid",
    expMin: 1,
    expMax: 3,
    skills: ["Hardware Support", "Networking", "Windows 11"],
  },
  {
    id: "fallback-4",
    jobId: "RUP-JOB-1004",
    title: "Operations & Logistics Associate",
    category: "Operations",
    city: "Lagos",
    country: "Nigeria",
    workMode: "On-site",
    expMin: 1,
    expMax: 3,
    skills: ["Inventory Management", "Supply Chain", "ERP"],
  },
];

export default async function JobsPage() {
  // Query active vacancies published to website
  // STRICT SECURITY & PRIVACY RULE: Company name is deliberately omitted!
  const dbVacancies = await prisma.vacancy.findMany({
    where: {
      status: "ACTIVE",
      isPostedOnWebsite: true,
    },
    select: {
      id: true,
      jobId: true,
      title: true,
      category: true,
      city: true,
      country: true,
      workMode: true,
      expMin: true,
      expMax: true,
      requirements: true,
      description: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedDbJobs: MinimalistJob[] = dbVacancies.map((v) => {
    // Extract clean tags from requirements
    const extractedSkills = v.requirements
      ? v.requirements
          .split(/[,;\n•]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 2 && s.length < 30)
          .slice(0, 4)
      : [v.category, v.workMode];

    return {
      id: v.id,
      jobId: v.jobId,
      title: v.title,
      category: v.category,
      city: v.city,
      country: v.country,
      workMode: v.workMode,
      expMin: v.expMin,
      expMax: v.expMax,
      skills: extractedSkills.length > 0 ? extractedSkills : [v.category],
      description: v.description,
      salaryMin: v.salaryMin,
      salaryMax: v.salaryMax,
      salaryCurrency: v.salaryCurrency,
      createdAt: v.createdAt.toISOString(),
    };
  });

  const jobsToDisplay = formattedDbJobs.length > 0 ? formattedDbJobs : FALLBACK_JOBS;

  // JSON-LD structured data for Google Jobs, Indeed, LinkedIn, Naukri automated scrapers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobsToDisplay.slice(0, 20).map((job, index) => {
      const datePosted = job.createdAt
        ? new Date(job.createdAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const validThroughDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const jobPostingItem: Record<string, any> = {
        "@type": "JobPosting",
        title: job.title,
        description:
          job.description ||
          `Immediate opening for ${job.title} in ${job.city}, ${job.country}. Free placement assistance provided by RiseUp Consultancy. Candidate requirements: ${job.skills.join(
            ", "
          )}.`,
        datePosted,
        validThrough: validThroughDate,
        employmentType: "FULL_TIME",
        directApply: true,
        hiringOrganization: {
          "@type": "Organization",
          name: "RiseUp Consultancy Client Partner",
          sameAs: SITE_URL,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city,
            addressCountry: job.country === "Nigeria" ? "NG" : "IN",
          },
        },
      };

      if (job.salaryMin || job.salaryMax) {
        jobPostingItem.baseSalary = {
          "@type": "MonetaryAmount",
          currency: job.salaryCurrency || (job.country === "Nigeria" ? "NGN" : "INR"),
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salaryMin || 0,
            maxValue: job.salaryMax || job.salaryMin || 0,
            unitText: "YEAR",
          },
        };
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        item: jobPostingItem,
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <React.Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
        <JobsDirectoryClient initialJobs={jobsToDisplay} />
      </React.Suspense>
    </>
  );
}
import React from "react";
import prisma from "@/lib/prisma";
import JobsDirectoryClient, { MinimalistJob } from "./JobsDirectoryClient";
import type { Metadata } from "next";

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
    canonical: "https://riseupconsultancy.in/jobs",
  },
  openGraph: {
    title: "Open Job Vacancies | RiseUp Consultancy",
    description: "Browse verified corporate and BPO jobs in India & Nigeria. 100% Free candidate placement services.",
    url: "https://riseupconsultancy.in/jobs",
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
    };
  });

  const jobsToDisplay = formattedDbJobs.length > 0 ? formattedDbJobs : FALLBACK_JOBS;

  // JSON-LD structured data for Google Jobs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobsToDisplay.slice(0, 10).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        description: `Apply for ${job.title} in ${job.city}, ${job.country}. Free placement service by RiseUp Consultancy.`,
        datePosted: "2026-09-01",
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: "RiseUp Consultancy Client Partner",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city,
            addressCountry: job.country === "Nigeria" ? "NG" : "IN",
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobsDirectoryClient initialJobs={jobsToDisplay} />
    </>
  );
}
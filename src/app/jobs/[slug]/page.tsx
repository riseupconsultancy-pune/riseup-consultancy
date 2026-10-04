import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import { findVacancyBySlugOrId, generateJobSlug } from "@/lib/job-slug";
import JobDetailClient from "./JobDetailClient";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";
import { ChevronRight, Home, Briefcase, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await findVacancyBySlugOrId(slug);

  if (!vacancy) {
    return {
      title: "Job Opening | RiseUp Consultancy",
      description: "Verified job vacancy at RiseUp Consultancy.",
    };
  }

  const canonicalUrl = `${SITE_URL}/jobs/${generateJobSlug(vacancy.title, vacancy.city, vacancy.jobId)}`;

  return {
    title: `${vacancy.title} in ${vacancy.city} (${vacancy.jobId}) | RiseUp Consultancy`,
    description: `Immediate opening for ${vacancy.title} in ${vacancy.city}. 100% Free candidate placement, direct corporate payroll, and 24-48h interview scheduling. Apply now.`,
    keywords: [
      `${vacancy.title} in ${vacancy.city}`,
      `${vacancy.category} jobs ${vacancy.city}`,
      `BPO jobs ${vacancy.city}`,
      `Direct payroll jobs ${vacancy.city}`,
      `RiseUp Consultancy ${vacancy.jobId}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${vacancy.title} in ${vacancy.city} | RiseUp Consultancy`,
      description: `Immediate opening for ${vacancy.title} in ${vacancy.city}. 100% Free candidate placement with direct corporate payroll.`,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: `${SITE_URL}/images/rise_up_consultancy_pune_logo.png`,
          width: 512,
          height: 512,
          alt: `${vacancy.title} at RiseUp Consultancy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${vacancy.title} in ${vacancy.city} | RiseUp Consultancy`,
      description: `Immediate opening for ${vacancy.title} in ${vacancy.city}. Apply with zero candidate charges.`,
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vacancy = await findVacancyBySlugOrId(slug);

  if (!vacancy) {
    notFound();
  }

  const canonicalSlug = generateJobSlug(vacancy.title, vacancy.city, vacancy.jobId);
  const canonicalUrl = `${SITE_URL}/jobs/${canonicalSlug}`;

  // Formatted date strings for Schema.org
  const datePosted = new Date(vacancy.createdAt).toISOString().split("T")[0];
  const validThroughDate = new Date(
    new Date(vacancy.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  // Description HTML for Google for Jobs rich snippet
  const htmlDescription = `
    <p><strong>Job Role:</strong> ${vacancy.title}</p>
    <p><strong>Location:</strong> ${vacancy.city}, ${vacancy.country} (${vacancy.workMode})</p>
    <p><strong>Experience:</strong> ${vacancy.expMin === 0 ? "Fresher" : `${vacancy.expMin} - ${vacancy.expMax} Years`}</p>
    <p><strong>Shift:</strong> ${vacancy.shift || "Day Shift"}</p>
    <p><strong>Role Overview:</strong></p>
    <p>${vacancy.description.replace(/\n/g, "<br/>")}</p>
    ${vacancy.requirements ? `<p><strong>Candidate Requirements & Skills:</strong></p><p>${vacancy.requirements.replace(/\n/g, "<br/>")}</p>` : ""}
    <p><strong>Placement Assurance:</strong> 100% Free Placement Assistance. Direct hiring on client corporate payroll with zero agency charges.</p>
  `.trim();

  // 1. Schema.org JobPosting Structured Data for Google for Jobs
  const jobPostingSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: htmlDescription,
    identifier: {
      "@type": "PropertyValue",
      name: "RiseUp Consultancy",
      value: vacancy.jobId,
    },
    datePosted,
    validThrough: validThroughDate,
    employmentType: "FULL_TIME",
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: "Rise Up Consultancy Client Partner",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/images/rise_up_consultancy_pune_logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: vacancy.city,
        addressCountry: vacancy.country === "Nigeria" ? "NG" : "IN",
      },
    },
  };

  if (vacancy.salaryMin || vacancy.salaryMax) {
    jobPostingSchema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: vacancy.salaryCurrency || (vacancy.country === "Nigeria" ? "NGN" : "INR"),
      value: {
        "@type": "QuantitativeValue",
        minValue: vacancy.salaryMin || 0,
        maxValue: vacancy.salaryMax || vacancy.salaryMin || 0,
        unitText: "MONTH",
      },
    };
  }

  // 2. Schema.org BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jobs",
        item: `${SITE_URL}/jobs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${vacancy.city} Jobs`,
        item: `${SITE_URL}/jobs/location/${vacancy.city.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: vacancy.title,
        item: canonicalUrl,
      },
    ],
  };

  const serializedJob = {
    id: vacancy.id,
    jobId: vacancy.jobId,
    title: vacancy.title,
    category: vacancy.category,
    city: vacancy.city,
    country: vacancy.country,
    workMode: vacancy.workMode,
    shift: vacancy.shift || "Day Shift",
    expMin: vacancy.expMin,
    expMax: vacancy.expMax,
    salaryMin: vacancy.salaryMin,
    salaryMax: vacancy.salaryMax,
    salaryCurrency: vacancy.salaryCurrency,
    description: vacancy.description,
    requirements: vacancy.requirements,
    createdAt: vacancy.createdAt.toISOString(),
    updatedAt: vacancy.updatedAt.toISOString(),
  };

  return (
    <>
      {/* Google for Jobs Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white pt-24 sm:pt-28 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/jobs" className="hover:text-blue-600 transition-colors">
              Jobs
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href={`/jobs/location/${vacancy.city.toLowerCase()}`} className="hover:text-blue-600 transition-colors">
              {vacancy.city}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {vacancy.title}
            </span>
          </nav>

          {/* Job Detail Interactive Container */}
          <JobDetailClient job={serializedJob} />
        </div>
      </main>

      <Footer />
      <FloatingDock />
    </>
  );
}

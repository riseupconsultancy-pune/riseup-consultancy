import React from "react";
import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Corporate Staffing & Recruitment Services",
  description:
    "Enterprise BPO staffing, back office manpower supply, permanent lateral recruitment, and turnkey RPO solutions across Pune, Bengaluru, Hyderabad, and Pan-India. 24–48hr turnaround SLA.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: `Corporate Staffing & Recruitment Services | ${SITE_NAME}`,
    description:
      "Enterprise BPO staffing, back office manpower supply, permanent lateral recruitment, and turnkey RPO solutions across Pune, Bengaluru, Hyderabad, and Pan-India.",
    url: `${SITE_URL}/services`,
    type: "website",
  },
};

const SERVICES_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
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
          name: "Services",
          item: `${SITE_URL}/services`,
        },
      ],
    },
    {
      "@type": "Service",
      name: "Corporate Talent Supply & Recruitment Solutions",
      serviceType: "Corporate Recruitment & Manpower Sourcing",
      provider: {
        "@type": "EmploymentAgency",
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: ["India", "Nigeria"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Recruitment Practice Pillars",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "High-Volume BPO & Call Center Cohort Staffing",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Back Office Operations & Non-Voice Manpower",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Permanent Lateral Placement & Executive Staffing",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Recruitment Process Outsourcing (RPO)",
            },
          },
        ],
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_SCHEMA) }}
      />
      <ServicesClient />
    </>
  );
}

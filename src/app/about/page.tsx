import React from "react";
import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us | Authorized Recruitment & Staffing Agency",
  description:
    "Learn about Riseup Consultancy. Established January 2025 in Chandan Nagar, Pune. Leading recruitment and staffing agency with 100% free candidate placement and verified corporate SLAs.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `About Us | Authorized Recruitment & Staffing Agency | ${SITE_NAME}`,
    description:
      "Learn about Riseup Consultancy. Established January 2025 in Chandan Nagar, Pune. Leading recruitment and staffing agency with 100% free candidate placement.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

const ABOUT_SCHEMA = {
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
          name: "About Us",
          item: `${SITE_URL}/about`,
        },
      ],
    },
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about`,
      url: `${SITE_URL}/about`,
      name: `About ${SITE_NAME}`,
      description:
        "Learn about Riseup Consultancy. Established January 2025 in Chandan Nagar, Pune. Leading recruitment and staffing agency.",
      mainEntity: {
        "@type": "EmploymentAgency",
        name: SITE_NAME,
        url: SITE_URL,
        foundingDate: "2025-01-01",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Near Kumar Megaplex, Nagar Road, Chandan Nagar",
          addressLocality: "Pune",
          addressRegion: "Maharashtra",
          postalCode: "411014",
          addressCountry: "IN",
        },
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_SCHEMA) }}
      />
      <AboutClient />
    </>
  );
}

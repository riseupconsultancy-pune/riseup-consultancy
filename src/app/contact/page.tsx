import React from "react";
import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us & Recruitment Desk",
  description:
    "Get in touch with Riseup Consultancy Pune headquarters for corporate hiring mandates, recruitment inquiries, or staffing partnerships. Direct HR phone and official address.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: `Contact Us & Recruitment Desk | ${SITE_NAME}`,
    description:
      "Get in touch with Riseup Consultancy Pune headquarters for corporate hiring mandates, recruitment inquiries, or staffing partnerships.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

const CONTACT_SCHEMA = {
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
          name: "Contact Us",
          item: `${SITE_URL}/contact`,
        },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact#webpage`,
      url: `${SITE_URL}/contact`,
      name: `Contact Us | ${SITE_NAME}`,
      description: "Official contact desk, office location, and phone channels for Riseup Consultancy Pune.",
      mainEntity: {
        "@type": "EmploymentAgency",
        name: SITE_NAME,
        url: SITE_URL,
        telephone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Chandan Nagar",
          addressLocality: "Pune",
          addressRegion: "Maharashtra",
          postalCode: "411014",
          addressCountry: "IN",
        },
      },
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_SCHEMA) }}
      />
      <ContactClient />
    </>
  );
}

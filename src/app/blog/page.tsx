import React from "react";
import type { Metadata } from "next";
import { getAllBlogPosts, getAllBlogCategories } from "@/lib/blog-service";
import BlogIndexClient from "./BlogIndexClient";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Recruitment Insights & Staffing Playbooks",
  description:
    "Explore authoritative corporate recruitment guides, BPO staffing strategies, talent acquisition benchmarks, and localized hiring playbooks across Pune and Pan-India.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Recruitment Insights & Staffing Playbooks | ${SITE_NAME}`,
    description:
      "Explore authoritative corporate recruitment guides, BPO staffing strategies, and localized hiring playbooks across Pune.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

const BLOG_COLLECTION_SCHEMA = {
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
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/blog#webpage`,
      url: `${SITE_URL}/blog`,
      name: `Recruitment Insights & Staffing Playbooks | ${SITE_NAME}`,
      description: "Authoritative recruitment playbooks and staffing guides for Pune enterprises.",
      publisher: {
        "@type": "EmploymentAgency",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  ],
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  const categories = await getAllBlogCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_COLLECTION_SCHEMA) }}
      />
      <BlogIndexClient posts={posts} categories={categories} />
    </>
  );
}

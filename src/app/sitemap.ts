import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { METRO_CITY_SEO_PROFILES } from "@/lib/seo-knowledge";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://riseupconsultancy.in";
  const now = new Date();

  // 1. Core Primary Marketing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Programmatic City Hub Pages
  const cityRoutes: MetadataRoute.Sitemap = Object.values(METRO_CITY_SEO_PROFILES).map((city) => ({
    url: `${baseUrl}/jobs/location/${city.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // 3. Dynamic Active Job Vacancies
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const activeVacancies = await prisma.vacancy.findMany({
      where: {
        status: "ACTIVE",
        isPostedOnWebsite: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    jobRoutes = activeVacancies.map((vacancy) => ({
      url: `${baseUrl}/apply/${vacancy.id}`,
      lastModified: vacancy.updatedAt,
      changeFrequency: "daily",
      priority: 0.85,
    }));
  } catch {
    // safe fallback if DB query fails during build
  }

  return [...staticRoutes, ...cityRoutes, ...jobRoutes];
}

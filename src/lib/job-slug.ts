/**
 * SEO-Optimized Job Slug Utilities
 * Creates human-readable, crawler-friendly URLs for Google for Jobs & Aggregators
 * e.g. "customer-support-specialist-voice-process-pune-rup-job-1001"
 */

import prisma from "@/lib/prisma";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start of text
    .replace(/-+$/, "");            // Trim - from end of text
}

export function generateJobSlug(title: string, city: string, jobId: string): string {
  const cleanTitle = slugify(title);
  const cleanCity = slugify(city);
  const cleanJobId = slugify(jobId);
  return `${cleanTitle}-${cleanCity}-${cleanJobId}`;
}

export function extractJobIdFromSlug(slug: string): string | null {
  // Matches RUP-JOB-1001 or rup-job-1001 or rupjob1001 at the end of the slug
  const match = slug.match(/(rup-job-\d+|rupjob\d+|job-\d+)/i);
  if (match) {
    return match[1].toUpperCase().replace("RUPJOB", "RUP-JOB-");
  }
  return null;
}

export async function findVacancyBySlugOrId(slugOrId: string) {
  // 1. Direct match on UUID id
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)) {
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        id: slugOrId,
        status: "ACTIVE",
        isPostedOnWebsite: true,
      },
      include: {
        client: {
          select: {
            companyName: true,
            city: true,
            country: true,
          },
        },
      },
    });
    if (vacancy) return vacancy;
  }

  // 2. Direct match on jobId (e.g., RUP-JOB-1001)
  if (/^RUP-JOB-\d+$/i.test(slugOrId)) {
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        jobId: slugOrId.toUpperCase(),
        status: "ACTIVE",
        isPostedOnWebsite: true,
      },
      include: {
        client: {
          select: {
            companyName: true,
            city: true,
            country: true,
          },
        },
      },
    });
    if (vacancy) return vacancy;
  }

  // 3. Extract jobId from full slug (e.g., customer-support-pune-rup-job-1001)
  const extractedJobId = extractJobIdFromSlug(slugOrId);
  if (extractedJobId) {
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        jobId: extractedJobId,
        status: "ACTIVE",
        isPostedOnWebsite: true,
      },
      include: {
        client: {
          select: {
            companyName: true,
            city: true,
            country: true,
          },
        },
      },
    });
    if (vacancy) return vacancy;
  }

  // 4. Fallback search by matching title & city from active vacancies
  const allActive = await prisma.vacancy.findMany({
    where: {
      status: "ACTIVE",
      isPostedOnWebsite: true,
    },
    include: {
      client: {
        select: {
          companyName: true,
          city: true,
          country: true,
        },
      },
    },
  });

  for (const v of allActive) {
    const generated = generateJobSlug(v.title, v.city, v.jobId);
    if (generated === slugOrId.toLowerCase()) {
      return v;
    }
  }

  return null;
}

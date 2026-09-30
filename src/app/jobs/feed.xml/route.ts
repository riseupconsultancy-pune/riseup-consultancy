import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-config";
import { generateJobSlug } from "@/lib/job-slug";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function cdata(str: string | null | undefined): string {
  if (!str) return "<![CDATA[]]>";
  const clean = String(str).replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${clean}]]>`;
}

function formatDateJooble(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export async function GET() {
  try {
    const vacancies = await prisma.vacancy.findMany({
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
      orderBy: {
        updatedAt: "desc",
      },
    });

    const jobsXml = vacancies
      .map((vacancy) => {
        const slug = generateJobSlug(vacancy.title, vacancy.city, vacancy.jobId);
        const jobUrl = `${SITE_URL}/jobs/${slug}`;

        let salaryStr = "Best in Industry";
        if (vacancy.salaryMin && vacancy.salaryMax) {
          salaryStr = `₹${Math.round(vacancy.salaryMin).toLocaleString("en-IN")} - ₹${Math.round(vacancy.salaryMax).toLocaleString("en-IN")} per month`;
        } else if (vacancy.salaryMin) {
          salaryStr = `From ₹${Math.round(vacancy.salaryMin).toLocaleString("en-IN")} per month`;
        } else if (vacancy.salaryMax) {
          salaryStr = `Up to ₹${Math.round(vacancy.salaryMax).toLocaleString("en-IN")} per month`;
        }

        const pubDate = formatDateJooble(new Date(vacancy.createdAt));
        const updatedDate = formatDateJooble(new Date(vacancy.updatedAt));
        const expireDate = formatDateJooble(
          new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        ); // 60 days expiration

        const description = `
          ${vacancy.title} (${vacancy.jobId})
          Location: ${vacancy.city}, India (${vacancy.workMode || "On-site"})
          Department: ${vacancy.category}
          Shift: ${vacancy.shift || "Day Shift"}
          Salary: ${salaryStr}
          Experience: ${vacancy.expMin === 0 ? "Fresher" : `${vacancy.expMin} - ${vacancy.expMax} Years`}
          
          About Role:
          ${vacancy.description}

          ${vacancy.requirements ? `Requirements:\n${vacancy.requirements}` : ""}

          Immediate Joiners Preferred.
          Apply directly online at RiseUp Consultancy: ${jobUrl}
        `.trim();

        return `
  <job id="${vacancy.jobId}">
    <link>${cdata(jobUrl)}</link>
    <name>${cdata(vacancy.title)}</name>
    <region>${cdata(`${vacancy.city}, India`)}</region>
    <salary>${cdata(salaryStr)}</salary>
    <description>${cdata(description)}</description>
    <company>${cdata("RiseUp Consultancy")}</company>
    <pubdate>${pubDate}</pubdate>
    <updated>${updatedDate}</updated>
    <expire>${expireDate}</expire>
    <jobtype>full-time</jobtype>
  </job>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<jobs>${jobsXml}
</jobs>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Jobs aggregator XML feed generation error:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="utf-8"?><jobs></jobs>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      }
    );
  }
}

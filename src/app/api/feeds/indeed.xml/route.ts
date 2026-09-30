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

// Maps Indian cities to their respective states
function getStateForCity(city: string): string {
  const c = city.toLowerCase().trim();
  if (c.includes("pune") || c.includes("mumbai") || c.includes("navi mumbai") || c.includes("thane") || c.includes("nagpur") || c.includes("nashik")) {
    return "Maharashtra";
  }
  if (c.includes("bengaluru") || c.includes("bangalore") || c.includes("mysuru")) {
    return "Karnataka";
  }
  if (c.includes("hyderabad") || c.includes("secunderabad")) {
    return "Telangana";
  }
  if (c.includes("gurugram") || c.includes("gurgaon") || c.includes("faridabad")) {
    return "Haryana";
  }
  if (c.includes("noida") || c.includes("greater noida") || c.includes("lucknow")) {
    return "Uttar Pradesh";
  }
  if (c.includes("delhi") || c.includes("new delhi")) {
    return "Delhi";
  }
  if (c.includes("chennai") || c.includes("coimbatore")) {
    return "Tamil Nadu";
  }
  if (c.includes("kolkata")) {
    return "West Bengal";
  }
  if (c.includes("ahmedabad") || c.includes("surat") || c.includes("vadodara")) {
    return "Gujarat";
  }
  return "Maharashtra";
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

    const now = new Date().toUTCString();

    const jobsXml = vacancies
      .map((vacancy) => {
        const slug = generateJobSlug(vacancy.title, vacancy.city, vacancy.jobId);
        const jobUrl = `${SITE_URL}/jobs/${slug}`;
        const state = getStateForCity(vacancy.city);

        // Format salary string
        let salaryStr = "Competitive / Best in Industry";
        if (vacancy.salaryMin && vacancy.salaryMax) {
          salaryStr = `₹${Math.round(vacancy.salaryMin).toLocaleString("en-IN")} - ₹${Math.round(vacancy.salaryMax).toLocaleString("en-IN")} per month`;
        } else if (vacancy.salaryMin) {
          salaryStr = `From ₹${Math.round(vacancy.salaryMin).toLocaleString("en-IN")} per month`;
        } else if (vacancy.salaryMax) {
          salaryStr = `Up to ₹${Math.round(vacancy.salaryMax).toLocaleString("en-IN")} per month`;
        }

        // Job type mapping
        const jobType = "fulltime";

        // HTML Description for Indeed
        const htmlDescription = `
          <h3>Role: ${vacancy.title}</h3>
          <p><strong>Job Reference ID:</strong> ${vacancy.jobId}</p>
          <p><strong>Location:</strong> ${vacancy.city}, ${state}, India (${vacancy.workMode || "On-site"})</p>
          <p><strong>Department / Category:</strong> ${vacancy.category}</p>
          <p><strong>Salary:</strong> ${salaryStr}</p>
          <p><strong>Shift / Work Mode:</strong> ${vacancy.shift || "Day Shift"} | ${vacancy.workMode || "On-site"}</p>
          <p><strong>Experience:</strong> ${vacancy.expMin === 0 ? "Freshers Eligible" : `${vacancy.expMin} - ${vacancy.expMax} Years`}</p>
          <p><strong>Immediate Joining:</strong> ${vacancy.availabilityRequired || "Immediate Joiners Preferred"}</p>
          
          <h4>Job Description &amp; Responsibilities:</h4>
          <div>${vacancy.description.replace(/\n/g, "<br />")}</div>

          ${
            vacancy.requirements
              ? `<h4>Key Requirements &amp; Eligibility:</h4><div>${vacancy.requirements.replace(/\n/g, "<br />")}</div>`
              : ""
          }

          ${
            vacancy.interviewInstructions
              ? `<h4>Candidate Instructions:</h4><div>${vacancy.interviewInstructions.replace(/\n/g, "<br />")}</div>`
              : ""
          }

          <h4>About RiseUp Consultancy:</h4>
          <p>RiseUp Consultancy is a premier recruitment and manpower consultancy operating across Pune, Mumbai, Bangalore, Hyderabad, Delhi NCR, and all major Indian business hubs. We specialize in BPO, Voice, Non-Voice, IT, and Corporate Staffing.</p>
          <p><strong>Direct Apply Online:</strong> <a href="${jobUrl}">${jobUrl}</a></p>
        `.trim();

        return `
    <job>
      <title>${cdata(vacancy.title)}</title>
      <date>${cdata(vacancy.createdAt.toUTCString())}</date>
      <referencenumber>${cdata(vacancy.jobId)}</referencenumber>
      <url>${cdata(jobUrl)}</url>
      <company>${cdata("RiseUp Consultancy")}</company>
      <sourcename>${cdata("RiseUp Consultancy Career Portal")}</sourcename>
      <city>${cdata(vacancy.city)}</city>
      <state>${cdata(state)}</state>
      <country>${cdata("IN")}</country>
      <postalcode>${cdata("")}</postalcode>
      <description>${cdata(htmlDescription)}</description>
      <salary>${cdata(salaryStr)}</salary>
      <education>${cdata(vacancy.requirements ? "Graduation / HSC" : "Any Graduate")}</education>
      <jobtype>${cdata(jobType)}</jobtype>
      <category>${cdata(vacancy.category)}</category>
      <experience>${cdata(vacancy.expMin === 0 ? "Fresher" : `${vacancy.expMin}-${vacancy.expMax} years`)}</experience>
    </job>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<source>
  <publisher>RiseUp Consultancy</publisher>
  <publisherurl>${SITE_URL}</publisherurl>
  <lastBuildDate>${now}</lastBuildDate>${jobsXml}
</source>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Indeed XML feed generation error:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="utf-8"?><source><publisher>RiseUp Consultancy</publisher><error>Feed generation failed</error></source>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      }
    );
  }
}

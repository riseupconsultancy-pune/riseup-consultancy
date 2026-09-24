import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/jobs",
          "/jobs/*",
          "/about",
          "/services",
          "/contact",
          "/terms",
          "/privacy",
          "/llms.txt",
          "/llms-full.txt",
          "/favicon.ico",
          "/favicon-48x48.png",
          "/icons/*",
          "/images/*",
        ],
        disallow: ["/admin/", "/client/", "/hr/", "/api/", "/login"],
      },
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
        ],
        allow: [
          "/",
          "/favicon.ico",
          "/favicon-48x48.png",
          "/icons/*",
          "/images/*",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "cohere-ai",
        ],
        allow: [
          "/",
          "/jobs",
          "/jobs/*",
          "/about",
          "/services",
          "/contact",
          "/terms",
          "/privacy",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: ["/admin/", "/client/", "/hr/", "/api/", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

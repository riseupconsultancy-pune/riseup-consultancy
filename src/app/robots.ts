import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://riseupconsultancy.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/jobs/*", "/about", "/services", "/contact", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/client/", "/hr/", "/api/", "/login"],
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
        allow: ["/", "/jobs", "/jobs/*", "/about", "/services", "/contact", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/client/", "/hr/", "/api/", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

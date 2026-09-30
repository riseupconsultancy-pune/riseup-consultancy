/**
 * Google Indexing API Integration for Google for Jobs
 * 
 * Google provides the Indexing API specifically for pages with JobPosting schema.
 * It allows RiseUp Consultancy to directly notify Google when a job posting is added,
 * updated, or deleted, triggering an immediate crawl within minutes rather than waiting
 * weeks for organic crawler passes.
 * 
 * Setup Instructions:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Enable "Web Search Indexing API"
 * 3. Create a Service Account, generate a JSON Key.
 * 4. Add the Service Account email as an "Owner" in Google Search Console for https://www.riseupconsultancyy.com
 * 5. Add the following to your .env:
 *    GOOGLE_INDEXING_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
 *    GOOGLE_INDEXING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 */

import { SITE_URL } from "@/lib/site-config";
import { generateJobSlug } from "@/lib/job-slug";

interface IndexingNotificationResult {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: unknown;
}

/**
 * Creates a signed JWT token for Google OAuth 2.0 without requiring heavy external SDKs
 */
async function getGoogleAccessToken(
  clientEmail: string,
  privateKeyPem: string
): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1 hour expiration

    const header = {
      alg: "RS256",
      typ: "JWT",
    };

    const claimSet = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      exp: exp,
      iat: now,
    };

    // Use native Node.js crypto
    const crypto = await import("crypto");

    const base64UrlEncode = (str: string) =>
      Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
    const stringToSign = `${encodedHeader}.${encodedClaimSet}`;

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(stringToSign);
    
    // Format private key properly if escaped newlines were provided in .env
    const formattedKey = privateKeyPem.replace(/\\n/g, "\n");
    const signature = sign.sign(formattedKey, "base64");
    const base64UrlSignature = signature
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const jwt = `${stringToSign}.${base64UrlSignature}`;

    // Request bearer access token from Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.warn("Failed to obtain Google Indexing API access token:", errText);
      return null;
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token as string;
  } catch (err) {
    console.warn("Error generating Google Indexing token:", err);
    return null;
  }
}

/**
 * Notify Google Search / Google for Jobs of a job URL publish or delete event.
 * @param url The full canonical URL (e.g., https://www.riseupconsultancyy.com/jobs/slug)
 * @param type "URL_UPDATED" when job is posted or modified, "URL_DELETED" when closed/fulfilled
 */
export async function notifyGoogleIndexing(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<IndexingNotificationResult> {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    // Graceful fallback when credentials aren't configured yet
    return {
      success: false,
      message: "GOOGLE_INDEXING_CLIENT_EMAIL or GOOGLE_INDEXING_PRIVATE_KEY not set in environment.",
    };
  }

  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    if (!accessToken) {
      return {
        success: false,
        message: "Failed to authenticate with Google OAuth for Indexing API.",
      };
    }

    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          url: url,
          type: type,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message: result.error?.message || "Google Indexing API call failed",
        data: result,
      };
    }

    return {
      success: true,
      statusCode: response.status,
      message: `Google Indexing API successfully notified (${type}): ${url}`,
      data: result,
    };
  } catch (error) {
    console.error("Google Indexing API ping exception:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Convenience helper to ping Google Indexing for a specific vacancy.
 */
export async function notifyGoogleOfJobVacancy(
  title: string,
  city: string,
  jobId: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
) {
  const slug = generateJobSlug(title, city, jobId);
  const jobUrl = `${SITE_URL}/jobs/${slug}`;
  return notifyGoogleIndexing(jobUrl, type);
}

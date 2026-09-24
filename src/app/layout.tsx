import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_LEGAL_NAME, SITE_ALTERNATE_NAMES } from "@/lib/site-config";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Staffing & Recruiting Services Pune`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Official website of Rise Up Consultancy Pune. Talent Aligned. Futures Elevated. Direct company payroll staffing and verified recruitment across Pune, Pan-India, and international corridors. 100% Free placement for job seekers.",
  keywords: [
    "Rise Up Consultancy Pune",
    "Best talent supply agency in pune",
    "Talent supply in pune",
    "Talent supply in pune kharadi",
    "Talent supply agency in pune hinjewadi",
    "BPO staffing agency pune",
    "Manpower supply agency pune",
    "Manpower consultancy in kharadi",
    "Viman nagar bpo recruitment agency",
    "Pimpri chinchwad manpower supplier",
    "Staffing & Recruiting Services Pune",
    "BPO Recruitment Pune",
    "Back office job in pune kharadi area",
    "Back office job in pune hinjewadi area",
    "Voice process jobs Pune",
    "Non-voice chat support jobs",
    "Corporate staffing solutions in Pune",
    "Bulk hiring consultants pune",
    "Free placement consultancy for freshers",
    "Chandan Nagar Pune recruitment agency",
    "BPO jobs in Bengaluru",
    "BPO jobs in Hyderabad",
    "Back office jobs Mumbai",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | Staffing & Recruiting Services Pune`,
    description:
      "Direct company payroll staffing and verified recruitment across Pune, Pan-India, and international corridors. 100% Free placement for job seekers.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/rise_up_consultancy_pune_logo.png",
        width: 1254,
        height: 1254,
        alt: "Rise Up Consultancy Official Brand Mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Staffing & Recruiting Services Pune`,
    description: "Direct company payroll staffing across Pune & Pan-India. 100% Free candidate placement.",
    images: ["/images/rise_up_consultancy_pune_logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EmploymentAgency",
      "@id": `${SITE_URL}/#agency`,
      name: SITE_NAME,
      legalName: SITE_LEGAL_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/images/rise_up_consultancy_pune_logo.png`,
        contentUrl: `${SITE_URL}/images/rise_up_consultancy_pune_logo.png`,
        caption: "Rise Up Consultancy Official Brand Mark",
        width: 1254,
        height: 1254,
      },
      image: `${SITE_URL}/images/rise_up_consultancy_pune_logo.png`,
      description:
        "Leading direct corporate staffing and authorized recruitment agency in Pune, India. Specializing in BPO, Voice, Non-Voice, Back Office, and KYC placements. 100% free placement for candidates.",
      foundingDate: "2025-01-01",
      telephone: "+919359892819",
      email: "contact@riseupconsultancyy.com",
      priceRange: "Free for Job Seekers / Enterprise SLA",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near Kumar Megaplex, Nagar Road, Chandan Nagar",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411014",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 18.5529,
        longitude: 73.9317,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "10:00",
          closes: "19:00",
        },
      ],
      sameAs: [
        "https://www.linkedin.com/company/rise-up-consultancy-pune",
        "https://wa.me/919359892819",
      ],
      areaServed: [
        { "@type": "City", name: "Pune" },
        { "@type": "City", name: "Bengaluru" },
        { "@type": "City", name: "Hyderabad" },
        { "@type": "City", name: "Mumbai" },
        { "@type": "City", name: "Delhi" },
        { "@type": "City", name: "Chennai" },
        { "@type": "City", name: "Kolkata" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Corporate Talent Supply & Staffing Solutions",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate Talent Supply & Manpower Solutions" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "High-Volume BPO & Call Center Cohort Staffing" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Back Office Operations & Data Entry Manpower" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Permanent Lateral Placement & Executive Staffing" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Turnkey Recruitment Process Outsourcing (RPO)" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "BFSI & KYC Verification Recruitment" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "US Healthcare AR Caller Placement" } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      description: "Direct corporate recruitment platform and verified job vacancy portal.",
      publisher: {
        "@id": `${SITE_URL}/#agency`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/jobs?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#sitelinks`,
      name: "Rise Up Consultancy Site Navigation",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Jobs Directory",
          description: "Browse verified BPO, Voice, Non-Voice, and Back Office job openings with 100% free placement.",
          url: `${SITE_URL}/jobs`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Corporate Talent Supply",
          description: "High-volume BPO staffing, back office manpower supply, and 24-48hr candidate pipelines.",
          url: `${SITE_URL}/services`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "About Us",
          description: "Learn about our zero candidate fee guarantee, Pune headquarters, and mission.",
          url: `${SITE_URL}/about`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Contact Recruiter Desk",
          description: "Get in touch with recruitment desk for corporate requisitions.",
          url: `${SITE_URL}/contact`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Terms & Conditions",
          description: "Official terms of service, candidate rights, and corporate placement SLAs.",
          url: `${SITE_URL}/terms`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Privacy Policy",
          description: "Data confidentiality, resume protection, and privacy grievance contact.",
          url: `${SITE_URL}/privacy`,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta property="og:site_name" content={SITE_NAME} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QS11NZHQ73"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QS11NZHQ73');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Outfit, Manrope } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_LEGAL_NAME, SITE_ALTERNATE_NAMES } from "@/lib/site-config";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Official Recruitment & Corporate Staffing Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Official website of Riseup Consultancy Pune. Talent Aligned. Futures Elevated. Direct company payroll staffing and verified recruitment across Pune, Pan-India, and international corridors. 100% Free placement for job seekers.",
  keywords: [
    "Riseup Consultancy",
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
    title: `${SITE_NAME} | Official Recruitment & Corporate Staffing Platform`,
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
        alt: "Riseup Consultancy Official Brand Mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Official Recruitment & Corporate Staffing Platform`,
    description: "Direct company payroll staffing across Pune & Pan-India. 100% Free candidate placement.",
    images: ["/images/rise_up_consultancy_pune_logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
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
      email: "info@riseupconsultancyy.com",
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
      hasPart: [
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/jobs`,
          url: `${SITE_URL}/jobs`,
          name: "Verified Open Job Vacancies",
          description: "Browse verified BPO, Customer Support, and Back Office job openings in Pune and Pan-India.",
        },
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/services`,
          url: `${SITE_URL}/services`,
          name: "Corporate Recruitment & Staffing Services",
          description: "High-volume BPO staffing, permanent lateral hiring, and turnkey RPO solutions.",
        },
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/about`,
          url: `${SITE_URL}/about`,
          name: "About Riseup Consultancy",
          description: "Authorized recruitment agency profile, zero candidate fee pledge, and Pune headquarters.",
        },
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/contact`,
          url: `${SITE_URL}/contact`,
          name: "Contact Recruitment Desk",
          description: "Official Pune office address, direct HR calling numbers, and mandate submission desk.",
        },
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/privacy`,
          url: `${SITE_URL}/privacy`,
          name: "Candidate Privacy Policy & Data Protection",
          description: "Candidate data confidentiality, applicant privacy rights, and security policies.",
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#sitelinks`,
      name: "Riseup Consultancy Main Sitelinks",
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
          name: "Privacy Policy",
          description: "Data confidentiality, resume protection, and privacy grievance contact.",
          url: `${SITE_URL}/privacy`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Terms & Conditions",
          description: "Official terms of service, candidate rights, and corporate placement SLAs.",
          url: `${SITE_URL}/terms`,
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
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${manrope.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-48.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/icon-96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta property="og:site_name" content={SITE_NAME} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col font-sans">
        {/* Google Analytics (Interaction & Idle Deferred Loader for Core Web Vitals) */}
        <Script
          id="google-analytics-deferred"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());

            var gtmLoaded = false;
            function loadGTM() {
              if (gtmLoaded) return;
              gtmLoaded = true;
              ['scroll', 'pointerdown', 'touchstart', 'mousemove', 'keydown'].forEach(function(ev) {
                window.removeEventListener(ev, loadGTM, { passive: true });
              });
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=G-QS11NZHQ73';
              document.head.appendChild(s);
              gtag('config', 'G-QS11NZHQ73');
            }

            ['scroll', 'pointerdown', 'touchstart', 'mousemove', 'keydown'].forEach(function(ev) {
              window.addEventListener(ev, loadGTM, { passive: true, once: true });
            });

            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(function() { setTimeout(loadGTM, 4000); });
            } else {
              setTimeout(loadGTM, 4000);
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
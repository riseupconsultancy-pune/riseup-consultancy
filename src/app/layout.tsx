import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
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
  metadataBase: new URL("https://riseupconsultancy.in"),
  title: {
    default: "Rise Up Consultancy Pune | Staffing & Recruiting Services",
    template: "%s | Rise Up Consultancy",
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
    canonical: "https://riseupconsultancy.in",
  },
  openGraph: {
    title: "Rise Up Consultancy Pune | Staffing & Recruiting Services",
    description:
      "Direct company payroll staffing and verified recruitment across Pune, Pan-India, and international corridors. 100% Free placement for job seekers.",
    url: "https://riseupconsultancy.in",
    siteName: "Rise Up Consultancy Pune",
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
    title: "Rise Up Consultancy Pune | Staffing & Recruiting Services",
    description: "Direct company payroll staffing across Pune & Pan-India. 100% Free candidate placement.",
    images: ["/images/rise_up_consultancy_pune_logo.png"],
  },
  icons: {
    icon: [
      { url: "/images/rise_up_consultancy_pune_logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/rise_up_consultancy_pune_logo.png", sizes: "192x192", type: "image/png" },
      { url: "/images/rise_up_consultancy_pune_logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/images/rise_up_consultancy_pune_logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/images/rise_up_consultancy_pune_logo.png",
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
      "@id": "https://riseupconsultancy.in/#agency",
      name: "Rise Up Consultancy Pune",
      alternateName: ["RiseUp Recruitment", "Rise Up Staffing Services", "RiseUp Consultancy"],
      url: "https://riseupconsultancy.in",
      logo: "https://riseupconsultancy.in/images/rise_up_consultancy_pune_logo.png",
      image: "https://riseupconsultancy.in/images/rise_up_consultancy_pune_logo.png",
      description:
        "Leading direct corporate staffing and authorized recruitment agency in Pune, India. Specializing in BPO, Voice, Non-Voice, Back Office, and KYC placements. 100% free placement for candidates.",
      foundingDate: "2025-01-01",
      telephone: "+919359892819",
      email: "patelmeenakshi524@gmail.com",
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
      "@id": "https://riseupconsultancy.in/#website",
      url: "https://riseupconsultancy.in",
      name: "Rise Up Consultancy Pune",
      description: "Direct corporate recruitment platform and verified job vacancy portal.",
      publisher: {
        "@id": "https://riseupconsultancy.in/#agency",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://riseupconsultancy.in/jobs?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      "@id": "https://riseupconsultancy.in/#sitelinks",
      name: "Rise Up Consultancy Site Navigation",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Jobs Directory",
          description: "Browse verified BPO, Voice, Non-Voice, and Back Office job openings with 100% free placement.",
          url: "https://riseupconsultancy.in/jobs",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Corporate Talent Supply",
          description: "High-volume BPO staffing, back office manpower supply, and 24-48hr candidate pipelines.",
          url: "https://riseupconsultancy.in/services",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "About Us",
          description: "Learn about our zero candidate fee guarantee, Pune headquarters, and mission.",
          url: "https://riseupconsultancy.in/about",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Contact Recruiter Desk",
          description: "Get in touch with Meenakshi Patel and Shaziya Khan for recruitment inquiries.",
          url: "https://riseupconsultancy.in/contact",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Terms & Conditions",
          description: "Official terms of service, candidate rights, and corporate placement SLAs.",
          url: "https://riseupconsultancy.in/terms",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Privacy Policy",
          description: "Data confidentiality, resume protection, and privacy grievance contact.",
          url: "https://riseupconsultancy.in/privacy",
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
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import prisma from "@/lib/prisma";
import { 
  METRO_CITY_SEO_PROFILES, 
  JOB_PROFILE_CLUSTERS, 
  B2B_SERVICE_OFFERINGS,
  CitySeoProfile 
} from "@/lib/seo-knowledge";
import { 
  MapPin, 
  Briefcase, 
  Building2, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2, 
  HelpCircle,
  Phone,
  ShieldCheck,
  Search,
  Users,
  Award,
  Zap,
  Clock
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return Object.keys(METRO_CITY_SEO_PROFILES).map((city) => ({
    city,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = METRO_CITY_SEO_PROFILES[resolvedParams.city.toLowerCase()];

  if (!profile) {
    return {
      title: "Jobs Directory | Rise Up Consultancy",
    };
  }

  const hubNames = profile.hubs.map((h) => h.name).slice(0, 5).join(", ");

  return {
    title: `${profile.name} Jobs & Corporate Talent Supply | BPO, Back Office & Staffing Agency in ${hubNames}`,
    description: `Verified job vacancies and B2B corporate talent supply solutions in ${profile.name} (${hubNames}). 100% Free candidate placement, 24–48hr staffing SLA, and 90-day replacement guarantee.`,
    keywords: [
      `Jobs in ${profile.name}`,
      `Back office job in ${profile.name}`,
      `BPO jobs in ${profile.name}`,
      `Non voice jobs in ${profile.name}`,
      ...profile.hubs.slice(0, 4).map((h) => `${h.name} jobs ${profile.name}`),
      `Talent supply in ${profile.name}`,
      `BPO staffing agency in ${profile.name}`,
      `Manpower consultancy in ${profile.name}`,
      `Best talent supply agency in ${profile.name}`,
      `Recruitment agency in ${profile.name}`,
      ...profile.hubs.slice(0, 3).map((h) => `Talent supply in ${profile.name} ${h.name}`),
      ...profile.hubs.slice(0, 3).map((h) => `BPO staffing agency in ${h.name}`),
      `Corporate staffing solutions in ${profile.name}`,
      `Customer care vacancy ${profile.name}`,
      `Free job consultancy in ${profile.name}`,
    ],
    alternates: {
      canonical: `https://riseupconsultancy.in/jobs/location/${profile.slug}`,
    },
    openGraph: {
      title: `${profile.name} Job Vacancies & Corporate Talent Supply | Rise Up Consultancy`,
      description: `Verified job vacancies and B2B corporate talent supply solutions in ${profile.name}. 100% Free candidate placement, 24–48hr staffing SLA.`,
      url: `https://riseupconsultancy.in/jobs/location/${profile.slug}`,
      siteName: "Rise Up Consultancy Pune",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function CityLocationJobsPage({ params }: Props) {
  const resolvedParams = await params;
  const cityKey = resolvedParams.city.toLowerCase();
  const profile: CitySeoProfile | undefined = METRO_CITY_SEO_PROFILES[cityKey];

  if (!profile) {
    notFound();
  }

  // Query active vacancies matching this city (case-insensitive)
  let dbVacancies: Array<{
    id: string;
    jobId: string;
    title: string;
    category: string;
    city: string;
    country: string;
    workMode: string;
    expMin: number;
    expMax: number;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string;
    description: string;
    createdAt: Date;
  }> = [];

  try {
    dbVacancies = await prisma.vacancy.findMany({
      where: {
        status: "ACTIVE",
        isPostedOnWebsite: true,
        city: {
          contains: profile.name,
        },
      },
      select: {
        id: true,
        jobId: true,
        title: true,
        category: true,
        city: true,
        country: true,
        workMode: true,
        expMin: true,
        expMax: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  } catch (err) {
    console.warn(`[SEO Location] Vacancies DB query skipped during static build for ${profile.name}`);
  }

  // Construct BreadcrumbList, Service with OfferCatalog, and FAQPage Schema.org
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://riseupconsultancy.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Jobs Directory",
            item: "https://riseupconsultancy.in/jobs",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${profile.name} Hub & Talent Supply`,
            item: `https://riseupconsultancy.in/jobs/location/${profile.slug}`,
          },
        ],
      },
      {
        "@type": "Service",
        name: `Corporate Talent Supply & BPO Staffing Solutions in ${profile.name}`,
        serviceType: "Corporate Recruitment & Manpower Supply",
        provider: {
          "@type": "EmploymentAgency",
          name: "Rise Up Consultancy",
          url: "https://riseupconsultancy.in",
          telephone: "+91-9359892819",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Near Kumar Megaplex, Nagar Road, Chandan Nagar",
            addressLocality: "Pune",
            addressRegion: "Maharashtra",
            postalCode: "411014",
            addressCountry: "IN",
          },
        },
        areaServed: {
          "@type": "City",
          name: profile.name,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `B2B Staffing & Talent Acquisition Offerings in ${profile.name}`,
          itemListElement: B2B_SERVICE_OFFERINGS.map((offer, idx) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: `${offer.name} (${profile.name})`,
              description: offer.shortDesc,
            },
            position: idx + 1,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: profile.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <Header />

      <main className="min-h-screen bg-[#f8fafc] text-slate-900">
        {/* 1. Breadcrumbs & Top Authority Strip */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <nav className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/jobs" className="hover:text-blue-600 transition-colors">
                Jobs
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">{profile.name} Hub</span>
            </nav>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                100% Free Candidate Placement
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Direct Payroll
              </span>
            </div>
          </div>
        </div>

        {/* 2. City Hero Banner */}
        <section className="bg-white border-b border-slate-200 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600">
                  {profile.name}, {profile.state} • IT &amp; BPO Corridor
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading leading-tight">
                {profile.headline}
              </h1>
              <p className="mt-4 text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
                {profile.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="#vacancies"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse {profile.name} Jobs</span>
                </Link>

                <Link
                  href="#corporate-staffing"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none shadow-xs border border-slate-700"
                >
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span>Corporate Talent Supply</span>
                </Link>

                <a
                  href={`https://wa.me/919359892819?text=${encodeURIComponent(
                    `Hello Meenakshi Patel, I am inquiring about recruitment and talent supply in ${profile.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Recruiter</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The 10 Primary Micro-Market Clusters */}
        <section className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Hyper-Local IT &amp; Commercial Clusters
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                Top 10 Hiring &amp; Talent Supply Hubs in {profile.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Targeted candidate placements and corporate manpower supply across premier IT business parks, SEZs, and commercial centers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.hubs.map((hub) => (
                <div
                  key={hub.name}
                  className="p-5 bg-white border border-slate-200 hover:border-slate-900 transition-colors rounded-none shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-slate-900 font-heading">
                        {hub.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5">
                        Active Hub
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mb-3 space-y-0.5">
                      <span className="font-semibold text-slate-700 block">Major Tech Parks &amp; SEZs:</span>
                      <p className="leading-snug">{hub.landmarks.join(" • ")}</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Trending Hiring Roles:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {hub.popularRoles.map((role) => (
                          <span
                            key={role}
                            className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-200"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable 50+ Corporate Search Queries Drawer */}
                    {hub.employerQueries && hub.employerQueries.length > 0 && (
                      <details className="mt-3 pt-2.5 border-t border-slate-100 group">
                        <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 list-none flex items-center justify-between">
                          <span>View 50+ Corporate Search Queries</span>
                          <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-2.5 max-h-40 overflow-y-auto space-y-1 p-2 bg-slate-50 border border-slate-200">
                          {hub.employerQueries.map((q, idx) => (
                            <div key={idx} className="text-[10px] text-slate-600 font-mono flex items-center gap-1.5 leading-snug">
                              <span className="w-1 h-1 bg-blue-500 rounded-full shrink-0" />
                              <span>{q}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/jobs?city=${encodeURIComponent(profile.name)}&q=${encodeURIComponent(hub.name)}`}
                      className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      <span>Jobs</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="#corporate-staffing"
                      className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                    >
                      <span>Talent Supply</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Talent Supply & B2B Staffing Solutions Section */}
        <section id="corporate-staffing" className="py-12 sm:py-16 bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-3">
                <Briefcase className="w-3 h-3 text-blue-400" />
                Corporate Talent Acquisition &amp; Manpower Supply
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading leading-tight">
                Hire Verified BPO, Voice &amp; Back Office Talent in {profile.name}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rise Up Consultancy partners directly with enterprise BPOs, IT shared services, and high-growth back offices across {profile.name}. We deliver pre-assessed, interview-ready candidate batches with strict SLA turnaround and contractual guarantees.
              </p>
            </div>

            {/* Corporate SLA Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="p-5 bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">24–48 Hours SLA</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">First Shortlist Turnaround</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Receive verified, pre-screened candidate batches within 24 to 48 hours of requisition receipt.
                </p>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">3-Tier Screening</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Verified Assessment</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Rigorous Voice &amp; Accent audit, 35+ WPM typing speed, and Advanced Excel test prior to interview.
                </p>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">90-Day Warranty</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Free Replacement Guarantee</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Contractual assurance providing immediate replacement at zero cost in case of early attrition.
                </p>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">0 Candidate Fee</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Direct Company Payroll</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  100% compliant placement without sub-brokering. High candidate retention and satisfaction.
                </p>
              </div>
            </div>

            {/* B2B Service Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {B2B_SERVICE_OFFERINGS.map((service) => (
                <div key={service.id} className="p-6 bg-slate-800/50 border border-slate-700">
                  <h3 className="text-base font-bold text-white font-heading mb-1.5 flex items-center justify-between">
                    <span>{service.name}</span>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5">
                      {service.turnaroundSla}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mb-3">{service.shortDesc}</p>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {service.keyDeliverables.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Corporate Requisition CTA Banner */}
            <div className="p-6 sm:p-8 bg-blue-600 border border-blue-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 block mb-1">
                  Ready to Scale Your Team in {profile.name}?
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                  Submit Your Hiring Requisition or Mandate
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  Share your headcount requirements (1 to 100+ seats). Our {profile.name} team will connect within 2 hours.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href={`/contact?subject=${encodeURIComponent(`Corporate Talent Supply Request - ${profile.name}`)}`}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors rounded-none shadow-xs inline-flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Request Talent Supply</span>
                </Link>
                <a
                  href="tel:+919359892819"
                  className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none shadow-xs inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>+91 93598 92819</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Active Live Vacancies in this City */}
        {dbVacancies.length > 0 && (
          <section id="vacancies" className="py-12 sm:py-16 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                    Verified Immediate Openings
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                    Current Jobs in {profile.name}
                  </h2>
                </div>
                <Link
                  href={`/jobs?city=${encodeURIComponent(profile.name)}`}
                  className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>View Full Directory</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dbVacancies.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 bg-slate-50 border border-slate-200 hover:border-slate-900 transition-colors rounded-none flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5">
                          {job.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {job.jobId}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {job.city}, {job.country} • {job.workMode}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <Link
                        href={`/apply/${job.id}`}
                        className="inline-flex items-center justify-center w-full py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
                      >
                        Apply Directly
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. 52 Specialized Practice Roles Indexed */}
        <section className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Standard Practice Roles
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                Specialized Profiles We Staff in {profile.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Whether you are a job seeker seeking your next role or an enterprise employer scaling a 50-person delivery team:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {JOB_PROFILE_CLUSTERS.map((cluster) => (
                <div
                  key={cluster.cluster}
                  className="p-5 bg-white border border-slate-200 rounded-none shadow-2xs"
                >
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 mb-3 border-b border-slate-100 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>{cluster.cluster}</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {cluster.roles.map((r) => (
                      <li key={r} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-none shrink-0" />
                        <Link
                          href={`/jobs?city=${encodeURIComponent(profile.name)}&q=${encodeURIComponent(r)}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {r}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Contextual FAQs (GEO / Google FAQPage Schema) */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                Common Questions About {profile.name} Placements
              </h2>
            </div>

            <div className="space-y-4">
              {profile.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-none"
                >
                  <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Bottom Direct Contact CTA */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-1">
                Authorized Recruitment Desk
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
                Ready to Accelerate Your Career or Hiring Mandate in {profile.name}?
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                100% Free candidate placement • Direct payroll hiring • Verified corporate SLAs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/jobs"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
              >
                Browse All Openings
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors rounded-none"
              >
                Contact HR Leadership
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingDock />
    </>
  );
}

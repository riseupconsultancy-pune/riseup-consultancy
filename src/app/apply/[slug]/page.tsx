import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CandidateApplicationForm from "./CandidateApplicationForm";
import { Briefcase, AlertCircle, ArrowLeft, ShieldCheck, MapPin, Clock, Building2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const link = await prisma.hrPublicLink.findUnique({
    where: { uniqueSlug: slug },
    include: { vacancy: true },
  });

  if (!link) {
    return {
      title: "Job Application | RiseUp Consultancy",
    };
  }

  return {
    title: `Apply: ${link.vacancy.title} | RiseUp Consultancy`,
    description: `Apply for ${link.vacancy.title} in ${link.vacancy.city}. 100% Free placement services for all job seekers.`,
  };
}

export default async function CandidateApplyPage({ params }: PageProps) {
  const { slug } = await params;

  const link = await prisma.hrPublicLink.findUnique({
    where: { uniqueSlug: slug },
    include: {
      vacancy: {
        include: {
          client: {
            select: {
              companyName: true,
              city: true,
              country: true,
            },
          },
        },
      },
      hr: {
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
  });

  if (!link || link.status !== "ACTIVE" || link.vacancy.status !== "ACTIVE") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-none shadow-xs p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 font-heading">
            Application Link Inactive or Mandate Filled
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            This specific job application link is no longer accepting submissions. The hiring quota may have been filled or the link has been paused by the recruiter.
          </p>
          <div className="pt-2">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-blue-700 transition-colors"
            >
              Browse Open Jobs on RiseUp
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { vacancy, hr } = link;

  const vacancyDetails = {
    id: vacancy.id,
    jobId: vacancy.jobId,
    title: vacancy.title,
    category: vacancy.category,
    city: vacancy.city,
    country: vacancy.country,
    workMode: vacancy.workMode,
    shift: vacancy.shift || "Day Shift",
    expMin: vacancy.expMin,
    expMax: vacancy.expMax,
    salaryMin: vacancy.salaryMin,
    salaryMax: vacancy.salaryMax,
    salaryCurrency: vacancy.salaryCurrency,
    availabilityRequired: vacancy.availabilityRequired,
    description: vacancy.description,
    requirements: vacancy.requirements,
  };

  const recruiterInfo = {
    hrName: hr.user.fullName,
    referralTag: `Referral: ${hr.user.fullName} | RiseUp Consultancy`,
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RiseUp Consultancy</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free Placement Service</span>
          </div>
        </div>

        {/* Job Header Card */}
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 border border-slate-200">
              {vacancyDetails.jobId}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5">
              {vacancyDetails.category}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5">
              {recruiterInfo.referralTag}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {vacancyDetails.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {vacancyDetails.city}, {vacancyDetails.country} ({vacancyDetails.workMode})
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {vacancyDetails.shift}
              </span>
              <span>&bull;</span>
              <span>
                Experience: <strong>{vacancyDetails.expMin} - {vacancyDetails.expMax} Years</strong>
              </span>
            </div>
          </div>

          {/* Job description */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {vacancyDetails.description}
          </div>

          {vacancyDetails.requirements && (
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="font-bold uppercase text-[10px] text-slate-500 block mb-1">
                Key Qualifications / Candidate Profile
              </span>
              <p className="whitespace-pre-line">{vacancyDetails.requirements}</p>
            </div>
          )}
        </div>

        {/* Candidate Application Form */}
        <CandidateApplicationForm
          slug={slug}
          vacancyDetails={vacancyDetails}
          recruiterInfo={recruiterInfo}
        />
      </div>
    </div>
  );
}

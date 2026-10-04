"use server";

import { z } from "zod";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { generateCandidateId } from "@/lib/id-generator";

// -------------------------------------------------------------
// 1. ZOD VALIDATION SCHEMA FOR PUBLIC CANDIDATE APPLICATION
// -------------------------------------------------------------

const MAX_RESUME_SIZE = 2 * 1024 * 1024; // 2MB strict ceiling
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const candidateApplicationSchema = z.object({
  slug: z.string().min(3, "Invalid application link").trim(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100).trim(),
  email: z.string().email("Please provide a valid email address").toLowerCase().trim(),
  phone: z
    .string()
    .trim()
    .transform((val) => {
      let digits = val.replace(/\D/g, "");
      if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
      if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
      return digits;
    })
    .refine((val) => INDIAN_MOBILE_REGEX.test(val), {
      message: "Mobile number must be a valid 10-digit Indian mobile number without country code (e.g., 9822011223).",
    }),
  country: z.string().default("India"),
  city: z.string().min(2, "City is required").max(100).trim(),
  qualification: z.string().min(2, "Highest qualification is required").max(100).trim(),
  totalExperience: z.string().min(1, "Experience is required").max(50).trim(),
  availability: z.enum(["Immediate Joiner", "15 Days", "30 Days"]),
  interestedRoles: z.string().default("[]"),
});

// -------------------------------------------------------------
// 2. SUBMIT CANDIDATE APPLICATION ACTION (HARDENED SECURITY)
// -------------------------------------------------------------

export async function submitCandidateApplicationAction(formData: FormData) {
  try {
    const rawData = {
      slug: formData.get("slug"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      country: formData.get("country"),
      city: formData.get("city"),
      qualification: formData.get("qualification"),
      totalExperience: formData.get("totalExperience"),
      availability: formData.get("availability") || "Immediate Joiner",
      interestedRoles: formData.get("interestedRoles") || "[]",
    };

    const parsed = candidateApplicationSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid application details." };
    }

    const {
      slug,
      fullName,
      email,
      phone,
      country,
      city,
      qualification,
      totalExperience,
      availability,
      interestedRoles,
    } = parsed.data;

    // Verify tracked link and vacancy in database
    const link = await prisma.hrPublicLink.findUnique({
      where: { uniqueSlug: slug },
      include: {
        hr: {
          include: {
            user: true,
          },
        },
        vacancy: true,
      },
    });

    if (!link) {
      return { success: false, error: "This application link is invalid or has expired." };
    }

    if (link.status !== "ACTIVE") {
      return { success: false, error: "This recruiter sourcing link is currently paused or inactive." };
    }

    if (link.vacancy.status !== "ACTIVE") {
      return { success: false, error: "This job opening has been fulfilled or closed by the employer." };
    }

    // -------------------------------------------------------------
    // DUPLICATE APPLICATION CHECK (BY EMAIL OR PHONE FOR THIS JOB)
    // -------------------------------------------------------------
    const normalizedEmail = email.toLowerCase().trim();
    const inputPhoneDigits = phone.replace(/\D/g, "");
    const inputPhoneLast10 = inputPhoneDigits.length >= 10 ? inputPhoneDigits.slice(-10) : inputPhoneDigits;

    const existingCandidatesForVacancy = await prisma.candidate.findMany({
      where: {
        vacancyId: link.vacancyId,
      },
      select: {
        id: true,
        candidateId: true,
        fullName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        hr: {
          select: {
            employeeCode: true,
            user: {
              select: {
                fullName: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        vacancy: {
          select: {
            jobId: true,
            title: true,
          },
        },
      },
    });

    const duplicateCandidate = existingCandidatesForVacancy.find((c) => {
      // 1. Email matching
      if (c.email && c.email.toLowerCase().trim() === normalizedEmail) {
        return true;
      }
      // 2. Phone matching (matches exact digits or last 10 digits)
      if (c.phone) {
        const cPhoneDigits = c.phone.replace(/\D/g, "");
        const cPhoneLast10 = cPhoneDigits.length >= 10 ? cPhoneDigits.slice(-10) : cPhoneDigits;
        if (
          cPhoneDigits === inputPhoneDigits ||
          (inputPhoneLast10.length >= 7 && cPhoneLast10 === inputPhoneLast10)
        ) {
          return true;
        }
      }
      return false;
    });

    if (duplicateCandidate) {
      // Prioritize the assigned HR recruiter from the existing record, fallback to current link's HR
      const assignedRecruiterUser = duplicateCandidate.hr?.user || link.hr.user;
      const assignedRecruiterProfile = duplicateCandidate.hr || link.hr;

      return {
        success: false,
        alreadyApplied: true,
        candidateId: duplicateCandidate.candidateId,
        candidateName: duplicateCandidate.fullName,
        jobId: link.vacancy.jobId,
        jobTitle: link.vacancy.title,
        appliedDate: duplicateCandidate.createdAt.toISOString(),
        currentStatus: duplicateCandidate.status,
        recruiter: {
          name: assignedRecruiterUser?.fullName || "RiseUp Recruitment Partner",
          phone: assignedRecruiterUser?.phone || "+91 93598 92819",
          email: assignedRecruiterUser?.email || "info@riseupconsultancyy.com",
          code: assignedRecruiterProfile?.employeeCode || "HR-RECRUITER",
        },
        message: `An active application for "${link.vacancy.title}" (${link.vacancy.jobId}) is already registered with your contact details.`,
      };
    }

    // Process and validate resume file upload
    const resumeFile = formData.get("resume");
    if (!resumeFile || typeof resumeFile === "string") {
      return { success: false, error: "Please upload your resume in PDF format." };
    }

    const file = resumeFile as File;

    // 1. File Size Verification (2MB Max)
    if (file.size <= 0) {
      return { success: false, error: "Uploaded resume file is empty." };
    }

    if (file.size > MAX_RESUME_SIZE) {
      return {
        success: false,
        error: `File size exceeds the 2MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Please compress your PDF.`,
      };
    }

    // 2. MIME Type Verification
    if (file.type !== "application/pdf") {
      return { success: false, error: "Invalid file format. Only PDF (.pdf) documents are accepted." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Strict Binary Magic Byte Inspection: First 5 bytes MUST match "%PDF-"
    const isPdfHeader =
      buffer.length >= 5 &&
      buffer[0] === 0x25 && // %
      buffer[1] === 0x50 && // P
      buffer[2] === 0x44 && // D
      buffer[3] === 0x46 && // F
      buffer[4] === 0x2d;   // -

    if (!isPdfHeader) {
      return {
        success: false,
        error: "Security Alert: The file content does not match a valid PDF header. Only genuine PDF documents are accepted.",
      };
    }

    // 4. Directory Traversal & Collision Defense: Use Cryptographic Random UUID for disk storage
    const safeDiskFileName = `${crypto.randomUUID()}.pdf`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");

    // Ensure uploads directory exists
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const targetFilePath = path.join(uploadsDir, safeDiskFileName);
    await fs.promises.writeFile(targetFilePath, buffer);

    const resumeUrl = `/uploads/resumes/${safeDiskFileName}`;
    const sanitizedOriginalName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);

    // 5. Generate Atomic Candidate ID (e.g. RUP-CAN-1004)
    const candidateId = await generateCandidateId();

    // 6. Construct Verified Server-Derived Referral Tag (Immune to client-side manipulation)
    const hrName = link.hr.user.fullName;
    const referralTag = `Referral: ${hrName} | RiseUp Consultancy`;

    // 7. Atomic Database Insertion with Status Audit
    await prisma.$transaction([
      prisma.candidate.create({
        data: {
          candidateId,
          fullName,
          email,
          phone,
          country,
          city,
          qualification,
          totalExperience,
          availability,
          interestedRoles,
          resumeUrl,
          resumeFileName: sanitizedOriginalName || "Candidate_Resume.pdf",
          resumeFileSize: file.size,
          source: "HR_LINK",
          vacancyId: link.vacancyId,
          hrId: link.hrId,
          hrPublicLinkId: link.id,
          referralTag,
          status: "APPLIED",
          statusHistory: {
            create: {
              previousStatus: null,
              newStatus: "APPLIED",
              changedByRole: "SYSTEM",
              note: `Application submitted online via recruiter link (${link.uniqueSlug})`,
            },
          },
        },
      }),
      prisma.hrPublicLink.update({
        where: { id: link.id },
        data: { clickCount: { increment: 1 } },
      }),
    ]);

    try {
      revalidatePath("/hr/candidates");
      revalidatePath("/hr/dashboard");
      revalidatePath("/admin/dashboard");
    } catch {
      // safe fallback outside Next.js request context
    }

    return {
      success: true,
      candidateId,
      referralTag,
      hrName,
      vacancyTitle: link.vacancy.title,
      companyCity: link.vacancy.city,
      message: `Your application has been successfully submitted! Your RiseUp Candidate ID is ${candidateId}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit application.";
    return { success: false, error: message };
  }
}

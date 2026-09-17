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

const candidateApplicationSchema = z.object({
  slug: z.string().min(3, "Invalid application link").trim(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100).trim(),
  email: z.string().email("Please provide a valid email address").toLowerCase().trim(),
  phone: z.string().min(7, "Phone number must be at least 7 digits").max(20).trim(),
  country: z.enum(["India", "Nigeria"]),
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

"use server";

import { z } from "zod";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { generateCandidateId } from "@/lib/id-generator";
import { getSession } from "@/lib/auth";

const MAX_RESUME_SIZE = 2 * 1024 * 1024; // 2MB

// -------------------------------------------------------------
// 1. PUBLIC DIRECT CANDIDATE APPLICATION (WEBSITE JOB CARDS)
// -------------------------------------------------------------

const directApplySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100).trim(),
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  phone: z.string().min(7, "Phone number must be at least 7 digits").max(20).trim(),
  location: z.string().min(2, "City / Location is required").max(100).trim(),
  qualification: z.string().default("Any Graduate"),
  experience: z.string().min(1, "Experience is required").default("Fresher"),
  vacancyId: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
});

export async function applyDirectJobAction(formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location") || "Pune",
      qualification: formData.get("qualification") || "Any Graduate",
      experience: formData.get("experience") || "Fresher",
      vacancyId: formData.get("vacancyId") || null,
      jobTitle: formData.get("jobTitle") || null,
    };

    const parsed = directApplySchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid application details." };
    }

    const { fullName, email, phone, location, qualification, experience, vacancyId } = parsed.data;

    // File Validation & Binary Magic Byte Check
    const resumeFile = formData.get("resume");
    if (!resumeFile || typeof resumeFile === "string") {
      return { success: false, error: "Please attach your PDF resume." };
    }

    const file = resumeFile as File;
    if (file.size <= 0) {
      return { success: false, error: "The uploaded resume file is empty." };
    }

    if (file.size > MAX_RESUME_SIZE) {
      return {
        success: false,
        error: `File size exceeds 2MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Please compress your PDF.`,
      };
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return { success: false, error: "Only PDF (.pdf) documents are accepted." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Strict Binary Magic Byte Inspection: First 5 bytes MUST match "%PDF-"
    const isPdf =
      buffer.length >= 5 &&
      buffer[0] === 0x25 && // %
      buffer[1] === 0x50 && // P
      buffer[2] === 0x44 && // D
      buffer[3] === 0x46 && // F
      buffer[4] === 0x2d;   // -

    if (!isPdf) {
      return {
        success: false,
        error: "Security Alert: Invalid file header. Only genuine PDF documents are permitted.",
      };
    }

    // Safe UUID Disk Storage
    const safeDiskFileName = `${crypto.randomUUID()}.pdf`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const targetFilePath = path.join(uploadsDir, safeDiskFileName);
    await fs.promises.writeFile(targetFilePath, buffer);

    const resumeUrl = `/uploads/resumes/${safeDiskFileName}`;
    const sanitizedOriginalName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);

    // Find target vacancy
    let targetVacancy = null;
    if (vacancyId) {
      targetVacancy = await prisma.vacancy.findUnique({ where: { id: vacancyId } });
    }

    if (!targetVacancy) {
      targetVacancy = await prisma.vacancy.findFirst({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!targetVacancy) {
      return { success: false, error: "No active vacancies currently open for direct application." };
    }

    const candidateId = await generateCandidateId();

    // Create Candidate in Admin Website Candidate Pool
    await prisma.candidate.create({
      data: {
        candidateId,
        fullName,
        email,
        phone,
        country: targetVacancy.country || "India",
        city: location,
        qualification,
        totalExperience: experience,
        availability: "Immediate Joiner",
        interestedRoles: JSON.stringify([targetVacancy.category]),
        resumeUrl,
        resumeFileName: sanitizedOriginalName || "Resume.pdf",
        resumeFileSize: file.size,
        source: "WEBSITE_CARD",
        vacancyId: targetVacancy.id,
        referralTag: "RiseUp Direct (Website Application)",
        status: "APPLIED",
        statusHistory: {
          create: {
            previousStatus: null,
            newStatus: "APPLIED",
            changedByRole: "SYSTEM",
            note: `Applied via public website job card for ${targetVacancy.title}`,
          },
        },
      },
    });

    try {
      revalidatePath("/admin/candidates");
      revalidatePath("/admin/dashboard");
      revalidatePath("/jobs");
    } catch {
      // safe fallback
    }

    return {
      success: true,
      candidateId,
      message: `Your application has been registered successfully with ID ${candidateId}. Our team will contact you for shortlisting.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register application.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 2. CORPORATE TALENT INQUIRY (HOMEPAGE "REQUEST TALENT")
// -------------------------------------------------------------

const corporateInquirySchema = z.object({
  companyName: z.string().min(2, "Company name is required").trim(),
  contactPerson: z.string().min(2, "Contact person name is required").trim(),
  email: z.string().email("Please enter a valid business email").toLowerCase().trim(),
  phone: z.string().min(7, "Phone number must be at least 7 digits").trim(),
  location: z.string().min(2, "City location is required").trim(),
  roleRequirement: z.string().min(5, "Please describe the required roles and headcount").trim(),
});

export async function submitCorporateInquiryAction(formData: FormData) {
  try {
    const rawData = {
      companyName: formData.get("companyName"),
      contactPerson: formData.get("contactPerson"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location") || "Pune",
      roleRequirement: formData.get("roleRequirement"),
    };

    const parsed = corporateInquirySchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid inquiry details." };
    }

    const { companyName, contactPerson, email, phone, location, roleRequirement } = parsed.data;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      // Create lead account in pending status for Admin sales follow-up
      const randomPassword = crypto.randomBytes(8).toString("hex");
      const { hashPassword } = await import("@/lib/auth");
      const passwordHash = await hashPassword(randomPassword);

      await prisma.user.create({
        data: {
          email,
          fullName: contactPerson,
          phone,
          passwordHash,
          role: "CLIENT",
          status: "INACTIVE", // Awaiting Admin verification & contract
          clientProfile: {
            create: {
              companyName,
              country: location.toLowerCase().includes("nigeria") || location.toLowerCase().includes("lagos") ? "Nigeria" : "India",
              city: location,
              industry: "BPO / BPM / Back Office",
              contactPerson,
              phone,
            },
          },
        },
      });
    }

    try {
      revalidatePath("/admin/clients");
      revalidatePath("/admin/dashboard");
    } catch {
      // safe fallback
    }

    return {
      success: true,
      message: "Your hiring mandate inquiry has been received! A RiseUp recruitment partner will reach out within 2 business hours.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit corporate inquiry.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 3. ADMIN ASSIGN DIRECT CANDIDATE TO HR RECRUITER
// -------------------------------------------------------------

export async function assignCandidateToHrAction(candidateId: string, hrId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      throw new Error("Unauthorized: Super Admin access required.");
    }

    const hr = await prisma.hrProfile.findUnique({
      where: { id: hrId },
      include: { user: true },
    });

    if (!hr) {
      return { success: false, error: "Recruiter not found." };
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return { success: false, error: "Candidate not found." };
    }

    const newReferralTag = `Referral: ${hr.user.fullName} | RiseUp Consultancy`;

    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateId },
        data: {
          hrId: hr.id,
          referralTag: newReferralTag,
        },
      }),
      prisma.candidateStatusHistory.create({
        data: {
          candidateId,
          previousStatus: candidate.status,
          newStatus: candidate.status,
          changedByUserId: session.userId,
          changedByRole: "SUPER_ADMIN",
          note: `Assigned to recruiter ${hr.user.fullName} (${hr.employeeCode}) by Super Admin`,
        },
      }),
    ]);

    try {
      revalidatePath("/admin/candidates");
      revalidatePath("/hr/candidates");
      revalidatePath("/hr/dashboard");
    } catch {
      // safe fallback
    }

    return {
      success: true,
      message: `Candidate successfully assigned to ${hr.user.fullName} (${hr.employeeCode}).`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to assign candidate.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 4. PUBLIC CONTACT FORM INQUIRY (CONTACT PAGE & SECTION)
// -------------------------------------------------------------

const contactInquirySchema = z.object({
  fullName: z.string().min(2, "Please provide your name (at least 2 characters)").max(100).trim(),
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  phone: z.string().min(7, "Please provide a valid phone number with at least 7 digits").max(20).trim(),
  userType: z.enum(["CANDIDATE", "EMPLOYER", "GENERAL"]).default("CANDIDATE"),
  subject: z.string().min(2, "Subject is required").max(150).trim(),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000).trim(),
});

export async function submitContactInquiryAction(formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      userType: formData.get("userType") || "CANDIDATE",
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const parsed = contactInquirySchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid contact inquiry details." };
    }

    const { fullName, email, phone, userType, subject, message } = parsed.data;

    // If it's an employer inquiry, check if user exists or register as pending client lead
    if (userType === "EMPLOYER") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        const randomPassword = crypto.randomBytes(8).toString("hex");
        const { hashPassword } = await import("@/lib/auth");
        const passwordHash = await hashPassword(randomPassword);

        await prisma.user.create({
          data: {
            email,
            fullName,
            phone,
            passwordHash,
            role: "CLIENT",
            status: "INACTIVE",
            clientProfile: {
              create: {
                companyName: subject || "Corporate Client Prospect",
                country: "India",
                city: "Pune",
                industry: "BPO / BPM / Corporate",
                contactPerson: fullName,
                phone,
              },
            },
          },
        });
      }
    }

    try {
      revalidatePath("/admin/clients");
      revalidatePath("/admin/dashboard");
    } catch {
      // safe fallback
    }

    return {
      success: true,
      message: `Thank you, ${fullName}! Your message has been received by our Pune recruitment team. A consultant will reach out via phone or WhatsApp at ${phone} shortly.`,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to submit contact inquiry.";
    return { success: false, error: errorMsg };
  }
}


"use server";

import { z } from "zod";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Guard: verify HR Recruiter session
async function assertHR() {
  const session = await getSession();
  if (!session || session.role !== "HR_RECRUITER" || !session.hrProfileId) {
    throw new Error("Unauthorized: HR Recruiter access required.");
  }
  return session;
}

// -------------------------------------------------------------
// 1. GENERATE OR RETRIEVE UNIQUE TRACKED APPLICATION LINK
// -------------------------------------------------------------

const generateLinkSchema = z.object({
  vacancyId: z.string().min(1, "Vacancy ID is required"),
});

export async function generateHrPublicLinkAction(vacancyId: string) {
  try {
    const session = await assertHR();
    const hrProfileId = session.hrProfileId!;

    const parsed = generateLinkSchema.safeParse({ vacancyId });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid vacancy ID." };
    }

    // Verify vacancy is active and broadcasted to HRs
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        id: vacancyId,
        status: "ACTIVE",
        isBroadcastedToHR: true,
      },
    });

    if (!vacancy) {
      return { success: false, error: "Vacancy is either not active or not broadcasted to recruiters." };
    }

    // Fetch HR profile for employee code
    const hrProfile = await prisma.hrProfile.findUnique({
      where: { id: hrProfileId },
      include: { user: true },
    });

    if (!hrProfile) {
      return { success: false, error: "HR Recruiter profile not found." };
    }

    // Check if an active link already exists for this recruiter & vacancy
    const existingLink = await prisma.hrPublicLink.findFirst({
      where: {
        hrId: hrProfileId,
        vacancyId,
      },
    });

    if (existingLink) {
      return {
        success: true,
        message: "Retrieved existing sourcing link.",
        link: {
          id: existingLink.id,
          uniqueSlug: existingLink.uniqueSlug,
          status: existingLink.status,
          clickCount: existingLink.clickCount,
          url: `/apply/${existingLink.uniqueSlug}`,
        },
      };
    }

    // Generate clean, secure URL slug
    // Format: job-rup-1001-rup-hr-101-a1b2c3
    const sanitizedJob = vacancy.jobId.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const sanitizedHr = hrProfile.employeeCode.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const uniqueSuffix = crypto.randomBytes(3).toString("hex");
    const uniqueSlug = `${sanitizedJob}-${sanitizedHr}-${uniqueSuffix}`;

    const newLink = await prisma.hrPublicLink.create({
      data: {
        uniqueSlug,
        hrId: hrProfileId,
        vacancyId,
        status: "ACTIVE",
      },
    });

    revalidatePath("/hr/vacancies");
    revalidatePath("/hr/dashboard");

    return {
      success: true,
      message: "Tracked sourcing link generated successfully.",
      link: {
        id: newLink.id,
        uniqueSlug: newLink.uniqueSlug,
        status: newLink.status,
        clickCount: newLink.clickCount,
        url: `/apply/${newLink.uniqueSlug}`,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate tracked link.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 2. TOGGLE HR PUBLIC LINK STATUS (ACTIVE / DISABLED)
// -------------------------------------------------------------

export async function toggleHrPublicLinkStatusAction(linkId: string, targetStatus: "ACTIVE" | "DISABLED") {
  try {
    const session = await assertHR();
    const hrProfileId = session.hrProfileId!;

    // Security check: ensure link belongs to calling recruiter
    const link = await prisma.hrPublicLink.findFirst({
      where: {
        id: linkId,
        hrId: hrProfileId,
      },
    });

    if (!link) {
      return { success: false, error: "Link not found or access denied." };
    }

    await prisma.hrPublicLink.update({
      where: { id: linkId },
      data: { status: targetStatus },
    });

    revalidatePath("/hr/vacancies");
    revalidatePath("/hr/dashboard");

    return {
      success: true,
      message: `Link has been ${targetStatus === "ACTIVE" ? "activated" : "disabled"}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update link status.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 3. CANDIDATE ATS PIPELINE STATUS UPDATE
// -------------------------------------------------------------

const updateStatusSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  newStatus: z.enum([
    "APPLIED",
    "CONNECTED",
    "GOING_FOR_INTERVIEW",
    "INTERVIEWED",
    "SELECTED",
    "REJECTED",
    "ABSENT",
  ]),
  interviewDate: z.string().optional().nullable(),
  note: z.string().max(500, "Note too long").optional().nullable(),
});

export async function updateCandidateStatusByHrAction(
  candidateId: string,
  newStatus: string,
  interviewDate?: string | null,
  note?: string | null
) {
  try {
    const session = await assertHR();
    const hrProfileId = session.hrProfileId!;

    const parsed = updateStatusSchema.safeParse({
      candidateId,
      newStatus,
      interviewDate,
      note,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid status update data." };
    }

    // Security check: Tenant isolation — candidate must belong to this HR
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        hrId: hrProfileId,
      },
      include: {
        vacancy: {
          include: { client: true },
        },
      },
    });

    if (!candidate) {
      return { success: false, error: "Candidate not found in your candidate pool." };
    }

    const previousStatus = candidate.status;
    const updateData: {
      status: string;
      interviewDate?: Date | null;
    } = {
      status: parsed.data.newStatus,
    };

    if (parsed.data.newStatus === "GOING_FOR_INTERVIEW") {
      updateData.interviewDate = parsed.data.interviewDate
        ? new Date(parsed.data.interviewDate)
        : new Date();
    }

    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateId },
        data: updateData,
      }),
      prisma.candidateStatusHistory.create({
        data: {
          candidateId,
          previousStatus,
          newStatus: parsed.data.newStatus,
          changedByUserId: session.userId,
          changedByRole: "HR_RECRUITER",
          note: parsed.data.note || `Stage updated by recruiter to ${parsed.data.newStatus}`,
        },
      }),
    ]);

    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/client/candidates");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Candidate ${candidate.fullName} stage updated to ${parsed.data.newStatus}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update candidate status.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 4. SAVE HR WHATSAPP MESSAGE TEMPLATE
// -------------------------------------------------------------

const templateSchema = z.object({
  whatsappTemplate: z.string().min(10, "Template must be at least 10 characters").max(1000, "Template must be under 1000 characters"),
});

export async function saveHrWhatsAppTemplateAction(templateText: string) {
  try {
    const session = await assertHR();
    const hrProfileId = session.hrProfileId!;

    const parsed = templateSchema.safeParse({ whatsappTemplate: templateText });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid template content." };
    }

    await prisma.hrProfile.update({
      where: { id: hrProfileId },
      data: {
        whatsappTemplate: parsed.data.whatsappTemplate,
      },
    });

    revalidatePath("/hr/settings");
    revalidatePath("/hr/candidates");

    return {
      success: true,
      message: "WhatsApp interview invitation template updated successfully.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save template.";
    return { success: false, error: message };
  }
}

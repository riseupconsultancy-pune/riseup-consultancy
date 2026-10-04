"use server";

import { z } from "zod";
import crypto from "crypto";
import fs from "fs";
import path from "path";
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

// Guard: verify HR Recruiter or Super Admin session
async function assertHRorAdmin() {
  const session = await getSession();
  if (!session || (session.role !== "HR_RECRUITER" && session.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized: Recruiter or Admin access required.");
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
    "PLACED_OUTSIDE",
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
    const session = await assertHRorAdmin();
    const hrProfileId = session.role === "HR_RECRUITER" ? session.hrProfileId! : null;

    const parsed = updateStatusSchema.safeParse({
      candidateId,
      newStatus,
      interviewDate,
      note,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid status update data." };
    }

    // Security check: Candidate exists and accessible
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        vacancy: {
          include: { client: true },
        },
      },
    });

    if (!candidate) {
      return { success: false, error: "Candidate not found." };
    }

    if (session.role === "HR_RECRUITER" && candidate.hrId !== hrProfileId) {
      return { success: false, error: "Unauthorized: Candidate is not assigned to your recruiter pool." };
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
          changedByRole: session.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "HR_RECRUITER",
          note: parsed.data.note || `Stage updated to ${parsed.data.newStatus}`,
        },
      }),
    ]);

    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/client/candidates");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/candidates");

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
// 3B. DISPATCH CANDIDATE TO TARGET VACANCY (CROSS-JOB SOURCING)
// -------------------------------------------------------------

const dispatchInterviewSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  targetVacancyId: z.string().min(1, "Target Vacancy is required"),
  interviewDate: z.string().min(1, "Interview date is required"),
  note: z.string().max(500, "Note too long").optional().nullable(),
});

export async function dispatchCandidateToInterviewAction(params: {
  candidateId: string;
  targetVacancyId: string;
  interviewDate: string;
  note?: string | null;
}) {
  try {
    const session = await assertHRorAdmin();
    const hrProfileId = session.role === "HR_RECRUITER" ? session.hrProfileId! : null;

    const parsed = dispatchInterviewSchema.safeParse(params);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid dispatch data." };
    }

    const { candidateId, targetVacancyId, interviewDate, note } = parsed.data;

    // Verify target vacancy is ACTIVE and approved for broadcast
    const targetVacancy = await prisma.vacancy.findFirst({
      where: {
        id: targetVacancyId,
        status: "ACTIVE",
        isBroadcastedToHR: true,
      },
      include: { client: true },
    });

    if (!targetVacancy) {
      return {
        success: false,
        error: "Target vacancy is either closed, disabled, or not approved for recruiter broadcast.",
      };
    }

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        vacancy: {
          include: { client: true },
        },
      },
    });

    if (!candidate) {
      return { success: false, error: "Candidate record not found." };
    }

    if (session.role === "HR_RECRUITER" && candidate.hrId !== hrProfileId) {
      return { success: false, error: "Unauthorized: Candidate is not assigned to your recruiter pool." };
    }

    const previousStatus = candidate.status;
    const isReassigned = candidate.vacancyId !== targetVacancyId;
    const dateObj = new Date(interviewDate);

    const updateData: {
      vacancyId: string;
      status: string;
      interviewDate: Date;
    } = {
      vacancyId: targetVacancyId,
      status: "GOING_FOR_INTERVIEW",
      interviewDate: dateObj,
    };

    const historyNote = note
      ? note
      : isReassigned
      ? `Reassigned from ${candidate.vacancy.jobId} (${candidate.vacancy.title}) and scheduled for interview with ${targetVacancy.client.companyName} on ${dateObj.toLocaleDateString()}`
      : `Scheduled for interview with ${targetVacancy.client.companyName} on ${dateObj.toLocaleDateString()}`;

    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateId },
        data: updateData,
      }),
      prisma.candidateStatusHistory.create({
        data: {
          candidateId,
          previousStatus,
          newStatus: "GOING_FOR_INTERVIEW",
          changedByUserId: session.userId,
          changedByRole: session.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "HR_RECRUITER",
          note: historyNote,
        },
      }),
    ]);

    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/client/candidates");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/candidates");

    return {
      success: true,
      message: `Candidate ${candidate.fullName} successfully dispatched to ${targetVacancy.jobId}: ${targetVacancy.title} (${targetVacancy.client.companyName}).`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to dispatch candidate.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 3C. BULK DISPATCH CANDIDATES TO TARGET VACANCY
// -------------------------------------------------------------

export async function bulkDispatchCandidatesToInterviewAction(params: {
  candidateIds: string[];
  targetVacancyId: string;
  interviewDate: string;
  note?: string | null;
}) {
  try {
    const session = await assertHRorAdmin();
    const hrProfileId = session.role === "HR_RECRUITER" ? session.hrProfileId! : null;

    if (!params.candidateIds || params.candidateIds.length === 0) {
      return { success: false, error: "Please select at least one candidate." };
    }

    if (!params.targetVacancyId) {
      return { success: false, error: "Target active vacancy is required." };
    }

    // Verify target vacancy is ACTIVE
    const targetVacancy = await prisma.vacancy.findFirst({
      where: {
        id: params.targetVacancyId,
        status: "ACTIVE",
        isBroadcastedToHR: true,
      },
      include: { client: true },
    });

    if (!targetVacancy) {
      return {
        success: false,
        error: "Target vacancy is closed, disabled, or not approved for broadcast.",
      };
    }

    const dateObj = new Date(params.interviewDate);

    // Fetch all candidates
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: params.candidateIds },
      },
    });

    const validCandidates = candidates.filter((c) => {
      if (session.role === "SUPER_ADMIN") return true;
      return c.hrId === hrProfileId;
    });

    if (validCandidates.length === 0) {
      return { success: false, error: "No accessible candidates found in selection." };
    }

    // Process transactions
    await prisma.$transaction(
      validCandidates.flatMap((c) => [
        prisma.candidate.update({
          where: { id: c.id },
          data: {
            vacancyId: targetVacancy.id,
            status: "GOING_FOR_INTERVIEW",
            interviewDate: dateObj,
          },
        }),
        prisma.candidateStatusHistory.create({
          data: {
            candidateId: c.id,
            previousStatus: c.status,
            newStatus: "GOING_FOR_INTERVIEW",
            changedByUserId: session.userId,
            changedByRole: session.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "HR_RECRUITER",
            note:
              params.note ||
              `Bulk dispatched for interview to ${targetVacancy.jobId}: ${targetVacancy.title} (${targetVacancy.client.companyName})`,
          },
        }),
      ])
    );

    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/client/candidates");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/candidates");

    return {
      success: true,
      count: validCandidates.length,
      message: `Successfully dispatched ${validCandidates.length} candidate(s) for interview to ${targetVacancy.jobId}: ${targetVacancy.title}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bulk dispatch failed.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 3D. CANDIDATE ARCHIVAL & "PLACED OUTSIDE" MANAGEMENT
// -------------------------------------------------------------

export async function setCandidatePlacedOutsideAction(candidateId: string, note?: string | null) {
  try {
    const session = await assertHRorAdmin();
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });

    if (!candidate) {
      return { success: false, error: "Candidate not found." };
    }

    if (session.role === "HR_RECRUITER" && candidate.hrId !== session.hrProfileId) {
      return { success: false, error: "Unauthorized: Candidate is not assigned to your recruiter pool." };
    }

    const previousStatus = candidate.status;

    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateId },
        data: { status: "PLACED_OUTSIDE" },
      }),
      prisma.candidateStatusHistory.create({
        data: {
          candidateId,
          previousStatus,
          newStatus: "PLACED_OUTSIDE",
          changedByUserId: session.userId,
          changedByRole: session.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "HR_RECRUITER",
          note: note || "Candidate marked as Placed Outside / Inactive to prevent repeat outreach.",
        },
      }),
    ]);

    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/client/candidates");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/candidates");

    return {
      success: true,
      message: `Candidate ${candidate.fullName} marked as Placed Outside. Removed from active outreach queues.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to mark candidate as placed outside.";
    return { success: false, error: message };
  }
}

export async function reactivateCandidateAction(candidateId: string) {
  try {
    const session = await assertHRorAdmin();
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });

    if (!candidate) {
      return { success: false, error: "Candidate not found." };
    }

    if (session.role === "HR_RECRUITER" && candidate.hrId !== session.hrProfileId) {
      return { success: false, error: "Unauthorized: Candidate is not assigned to your recruiter pool." };
    }

    const previousStatus = candidate.status;

    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateId },
        data: { status: "APPLIED" },
      }),
      prisma.candidateStatusHistory.create({
        data: {
          candidateId,
          previousStatus,
          newStatus: "APPLIED",
          changedByUserId: session.userId,
          changedByRole: session.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "HR_RECRUITER",
          note: "Candidate profile reactivated into candidate talent pool.",
        },
      }),
    ]);

    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/candidates");

    return {
      success: true,
      message: `Candidate ${candidate.fullName} profile reactivated as New Lead in talent pool.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reactivate candidate.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 3E. PERMANENT CANDIDATE DELETION WITH RESUME DISK CLEANUP
// -------------------------------------------------------------

export async function deleteCandidateAction(candidateId: string) {
  try {
    const session = await assertHRorAdmin();
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });

    if (!candidate) {
      return { success: false, error: "Candidate not found." };
    }

    if (session.role === "HR_RECRUITER" && candidate.hrId !== session.hrProfileId) {
      return { success: false, error: "Unauthorized: Candidate is not assigned to your recruiter pool." };
    }

    // Delete uploaded resume PDF from disk if it exists
    if (candidate.resumeUrl && candidate.resumeUrl.startsWith("/uploads/resumes/")) {
      try {
        const filePath = path.join(process.cwd(), "public", candidate.resumeUrl);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (err) {
        console.error("Failed to delete resume file from disk:", err);
      }
    }

    // Delete candidate record (cascade removes CandidateStatusHistory)
    await prisma.candidate.delete({
      where: { id: candidateId },
    });

    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/client/candidates");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/candidates");

    return {
      success: true,
      message: `Candidate ${candidate.fullName} and associated resume document permanently deleted.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete candidate.";
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

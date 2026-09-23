"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateJobId } from "@/lib/id-generator";

// Guard: verify Corporate Client session
async function assertClient() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientProfileId) {
    throw new Error("Unauthorized: Corporate Client access required.");
  }
  return session;
}

// -------------------------------------------------------------
// 1. VACANCY CREATION (MULTI-STEP WIZARD)
// -------------------------------------------------------------

const createVacancySchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters").trim(),
  category: z.string().min(2, "Department / Category is required").trim(),
  headcount: z.coerce.number().int().min(1, "Headcount must be at least 1"),
  country: z.enum(["India", "Nigeria"]),
  city: z.string().min(2, "City is required").trim(),
  workMode: z.enum(["On-site", "Hybrid", "Remote"]),
  shift: z.string().trim().default("Day Shift"),
  expMin: z.coerce.number().int().min(0, "Minimum experience must be 0 or more"),
  expMax: z.coerce.number().int().min(0, "Maximum experience must be 0 or more"),
  salaryMin: z.coerce.number().optional().nullable(),
  salaryMax: z.coerce.number().optional().nullable(),
  salaryCurrency: z.string().trim().default("INR"),
  availabilityRequired: z.string().trim().default("Immediate Joiner"),
  description: z
    .string()
    .min(50, "Job description must be at least two sentences (minimum 50 characters) for portal indexing.")
    .trim()
    .refine((val) => {
      const sentences = val.split(/[.!?]+/).filter((s) => s.trim().length >= 5);
      return sentences.length >= 2;
    }, "Job description must contain at least two complete sentences for search engine indexing (Indeed, LinkedIn, Google for Jobs, Naukri)."),
  requirements: z.string().optional().nullable(),
  interviewVenue: z.string().optional().nullable(),
  interviewLocationUrl: z.string().optional().nullable(),
  interviewContactPerson: z.string().optional().nullable(),
  interviewContactPhone: z.string().optional().nullable(),
  interviewInstructions: z.string().optional().nullable(),
});

export async function createClientVacancyAction(formData: FormData) {
  try {
    const session = await assertClient();
    const clientProfileId = session.clientProfileId!;

    const rawData = {
      title: formData.get("title"),
      category: formData.get("category"),
      headcount: formData.get("headcount"),
      country: formData.get("country"),
      city: formData.get("city"),
      workMode: formData.get("workMode"),
      shift: formData.get("shift") || "Day Shift",
      expMin: formData.get("expMin") || 0,
      expMax: formData.get("expMax") || 5,
      salaryMin: formData.get("salaryMin") ? Number(formData.get("salaryMin")) : null,
      salaryMax: formData.get("salaryMax") ? Number(formData.get("salaryMax")) : null,
      salaryCurrency: formData.get("salaryCurrency") || (formData.get("country") === "Nigeria" ? "NGN" : "INR"),
      availabilityRequired: formData.get("availabilityRequired") || "Immediate Joiner",
      description: formData.get("description"),
      requirements: formData.get("requirements") || null,
      interviewVenue: formData.get("interviewVenue") ? String(formData.get("interviewVenue")).trim() : null,
      interviewLocationUrl: formData.get("interviewLocationUrl") ? String(formData.get("interviewLocationUrl")).trim() : null,
      interviewContactPerson: formData.get("interviewContactPerson") ? String(formData.get("interviewContactPerson")).trim() : null,
      interviewContactPhone: formData.get("interviewContactPhone") ? String(formData.get("interviewContactPhone")).trim() : null,
      interviewInstructions: formData.get("interviewInstructions") ? String(formData.get("interviewInstructions")).trim() : null,
    };

    const parsed = createVacancySchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid vacancy details." };
    }

    const {
      title,
      category,
      headcount,
      country,
      city,
      workMode,
      shift,
      expMin,
      expMax,
      salaryMin,
      salaryMax,
      salaryCurrency,
      availabilityRequired,
      description,
      requirements,
      interviewVenue,
      interviewLocationUrl,
      interviewContactPerson,
      interviewContactPhone,
      interviewInstructions,
    } = parsed.data;

    if (expMax < expMin) {
      return { success: false, error: "Maximum experience cannot be less than minimum experience." };
    }

    const jobId = await generateJobId();

    const vacancy = await prisma.vacancy.create({
      data: {
        jobId,
        title,
        category,
        headcount,
        country,
        city,
        workMode,
        shift,
        expMin,
        expMax,
        salaryMin,
        salaryMax,
        salaryCurrency,
        availabilityRequired,
        description,
        requirements: requirements || "",
        interviewVenue: interviewVenue || null,
        interviewLocationUrl: interviewLocationUrl || null,
        interviewContactPerson: interviewContactPerson || null,
        interviewContactPhone: interviewContactPhone || null,
        interviewInstructions: interviewInstructions || null,
        status: "PENDING_REVIEW",
        clientId: clientProfileId,
        isBroadcastedToHR: false,
        isPostedOnWebsite: false,
      },
    });

    revalidatePath("/client/vacancies");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/vacancies");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Vacancy request submitted successfully (${jobId}). It is now in RiseUp Admin review.`,
      jobId: vacancy.jobId,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create vacancy.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 2. TOGGLE CLIENT VACANCY STATUS (ACTIVE / CLOSED / DISABLED)
// -------------------------------------------------------------

export async function toggleClientVacancyStatusAction(vacancyId: string, targetStatus: "ACTIVE" | "CLOSED" | "DISABLED") {
  try {
    const session = await assertClient();
    const clientProfileId = session.clientProfileId!;

    // Ensure vacancy belongs to this client
    const vacancy = await prisma.vacancy.findFirst({
      where: { id: vacancyId, clientId: clientProfileId },
    });

    if (!vacancy) {
      return { success: false, error: "Vacancy not found or unauthorized." };
    }

    await prisma.vacancy.update({
      where: { id: vacancyId },
      data: { status: targetStatus },
    });

    revalidatePath("/client/vacancies");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin/vacancies");
    revalidatePath("/hr/vacancies");

    return {
      success: true,
      message: `Vacancy status updated to ${targetStatus}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update vacancy status.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 3. CANDIDATE EVALUATION & DUAL-STATUS UPDATES
// -------------------------------------------------------------

const updateCandidateStatusSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  newStatus: z.enum(["INTERVIEWED", "SELECTED", "REJECTED", "ABSENT"]),
  feedbackNote: z.string().max(500, "Feedback note too long").optional().nullable(),
});

export async function updateCandidateStatusByClientAction(
  candidateId: string,
  newStatus: "INTERVIEWED" | "SELECTED" | "REJECTED" | "ABSENT",
  feedbackNote?: string | null
) {
  try {
    const session = await assertClient();
    const clientProfileId = session.clientProfileId!;

    const parsed = updateCandidateStatusSchema.safeParse({
      candidateId,
      newStatus,
      feedbackNote,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid status update data." };
    }

    // Verify candidate belongs to a vacancy owned by this client
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        vacancy: {
          clientId: clientProfileId,
        },
      },
      include: {
        vacancy: true,
      },
    });

    if (!candidate) {
      return { success: false, error: "Candidate record not found or access denied." };
    }

    const previousStatus = candidate.status;

    // Update candidate
    const updateData: {
      status: string;
      clientFeedback?: string | null;
      selectedAt?: Date | null;
    } = {
      status: newStatus,
      clientFeedback: feedbackNote || candidate.clientFeedback,
    };

    if (newStatus === "SELECTED") {
      updateData.selectedAt = new Date();
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
          newStatus,
          changedByUserId: session.userId,
          changedByRole: "CLIENT",
          note: feedbackNote || `Updated by client to ${newStatus}`,
        },
      }),
    ]);

    revalidatePath("/client/candidates");
    revalidatePath("/client/dashboard");
    revalidatePath("/hr/candidates");
    revalidatePath("/hr/dashboard");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Candidate ${candidate.fullName} successfully marked as ${newStatus}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update candidate status.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 4. CLIENT AGREEMENT DIGITAL E-SIGNATURE
// -------------------------------------------------------------

const signAgreementSchema = z.object({
  agreementId: z.string().min(1, "Agreement ID is required"),
  signedByName: z.string().min(2, "Full legal name is required").trim(),
  signedByDesignation: z.string().min(2, "Official designation is required").trim(),
});

export async function signClientAgreementAction(formData: FormData) {
  try {
    const session = await assertClient();
    const clientProfileId = session.clientProfileId!;

    const rawData = {
      agreementId: formData.get("agreementId"),
      signedByName: formData.get("signedByName"),
      signedByDesignation: formData.get("signedByDesignation"),
    };

    const parsed = signAgreementSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid signature data." };
    }

    const { agreementId, signedByName, signedByDesignation } = parsed.data;

    // Verify agreement belongs to this client
    const agreement = await prisma.clientAgreement.findFirst({
      where: {
        id: agreementId,
        clientId: clientProfileId,
      },
    });

    if (!agreement) {
      return { success: false, error: "Agreement not found or unauthorized." };
    }

    if (agreement.status === "SIGNED") {
      return { success: false, error: "This agreement has already been signed." };
    }

    // Get client IP address from headers
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const signerIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    await prisma.clientAgreement.update({
      where: { id: agreementId },
      data: {
        status: "SIGNED",
        signedByName,
        signedByDesignation,
        signedAt: new Date(),
        signerIp,
      },
    });

    revalidatePath("/client/agreements");
    revalidatePath("/admin/agreements");

    return {
      success: true,
      message: `Agreement ${agreement.agreementNumber} signed successfully. A formal copy has been archived.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to sign agreement.";
    return { success: false, error: message };
  }
}

// -------------------------------------------------------------
// 5. PUBLIC AGREEMENT SIGNATURE (VIA HASH TOKEN)
// -------------------------------------------------------------

const publicSignSchema = z.object({
  hashToken: z.string().min(10, "Invalid agreement hash token"),
  signedByName: z.string().min(2, "Full legal name is required").trim(),
  signedByDesignation: z.string().min(2, "Official designation is required").trim(),
});

export async function signPublicAgreementAction(formData: FormData) {
  try {
    const rawData = {
      hashToken: formData.get("hashToken"),
      signedByName: formData.get("signedByName"),
      signedByDesignation: formData.get("signedByDesignation"),
    };

    const parsed = publicSignSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid signature details." };
    }

    const { hashToken, signedByName, signedByDesignation } = parsed.data;

    const agreement = await prisma.clientAgreement.findUnique({
      where: { hashToken },
      include: { client: true },
    });

    if (!agreement) {
      return { success: false, error: "Agreement not found or expired." };
    }

    if (agreement.status === "SIGNED") {
      return { success: false, error: "This agreement has already been executed." };
    }

    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const signerIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    await prisma.clientAgreement.update({
      where: { hashToken },
      data: {
        status: "SIGNED",
        signedByName,
        signedByDesignation,
        signedAt: new Date(),
        signerIp,
      },
    });

    revalidatePath(`/agreement/sign/${hashToken}`);
    revalidatePath("/client/agreements");
    revalidatePath("/admin/agreements");

    return {
      success: true,
      message: `Agreement ${agreement.agreementNumber} successfully executed for ${agreement.client.companyName}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to execute agreement.";
    return { success: false, error: message };
  }
}

"use server";

import { z } from "zod";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { generateHREmployeeCode, generateAgreementId } from "@/lib/id-generator";
import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/templates";
import { notifyGoogleOfJobVacancy } from "@/lib/google-indexing";

// Guard: verify Super Admin session
async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required.");
  }
  return session;
}

// -------------------------------------------------------------
// 1. CLIENT MANAGEMENT ACTIONS
// -------------------------------------------------------------

const createClientSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters").trim(),
  country: z.string().min(2, "Country is required").trim(),
  city: z.string().min(2, "City is required").trim(),
  industry: z.string().trim().default("BPO / BPM / Back Office"),
  contactPerson: z.string().min(2, "Contact person name is required").trim(),
  email: z.string().email("Please enter a valid official email address").toLowerCase().trim(),
  phone: z.string().min(7, "Phone number must be at least 7 digits").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function createClientAction(formData: FormData) {
  try {
    await assertAdmin();

    const rawData = {
      companyName: formData.get("companyName"),
      country: formData.get("country"),
      city: formData.get("city"),
      industry: formData.get("industry") || "BPO / BPM / Back Office",
      contactPerson: formData.get("contactPerson"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
    };

    const parsed = createClientSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input data." };
    }

    const { companyName, country, city, industry, contactPerson, email, phone, password } = parsed.data;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        fullName: contactPerson,
        phone,
        passwordHash,
        role: "CLIENT",
        status: "ACTIVE",
        clientProfile: {
          create: {
            companyName,
            country,
            city,
            industry,
            contactPerson,
            phone,
          },
        },
      },
    });

    revalidatePath("/admin/clients");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("createClientAction error:", error);
    return { success: false, error: error.message || "Failed to create client account." };
  }
}

// -------------------------------------------------------------
// 2. HR RECRUITER MANAGEMENT ACTIONS
// -------------------------------------------------------------

const createHrSchema = z.object({
  fullName: z.string().min(2, "Recruiter name must be at least 2 characters").trim(),
  email: z.string().email("Please enter a valid official email address").toLowerCase().trim(),
  phone: z.string().min(7, "Phone number must be at least 7 digits").trim(),
  commissionRate: z.coerce.number().min(0).max(100).default(5.0),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function createHrAction(formData: FormData) {
  try {
    await assertAdmin();

    const rawData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      commissionRate: formData.get("commissionRate") || 5.0,
      password: formData.get("password"),
    };

    const parsed = createHrSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input data." };
    }

    const { fullName, email, phone, commissionRate, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const employeeCode = await generateHREmployeeCode();
    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        fullName,
        phone,
        passwordHash,
        role: "HR_RECRUITER",
        status: "ACTIVE",
        hrProfile: {
          create: {
            employeeCode,
            commissionRate,
            whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
          },
        },
      },
    });

    revalidatePath("/admin/recruiters");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("createHrAction error:", error);
    return { success: false, error: error.message || "Failed to create HR account." };
  }
}

// -------------------------------------------------------------
// 3. COMMON USER ACTIONS (PASSWORD RESET & STATUS TOGGLE)
// -------------------------------------------------------------

export async function resetPasswordAction(userId: string, newPassword: string) {
  try {
    await assertAdmin();
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters." };
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reset password." };
  }
}

export async function toggleUserStatusAction(userId: string) {
  try {
    await assertAdmin();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found." };

    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    revalidatePath("/admin/clients");
    revalidatePath("/admin/recruiters");
    revalidatePath("/admin/dashboard");
    return { success: true, newStatus };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user status." };
  }
}

// -------------------------------------------------------------
// 4. VACANCY BROADCAST & PUBLISH ACTIONS
// -------------------------------------------------------------

export async function broadcastVacancyToHRsAction(vacancyId: string) {
  try {
    await assertAdmin();
    await prisma.vacancy.update({
      where: { id: vacancyId },
      data: {
        isBroadcastedToHR: true,
        broadcastedAt: new Date(),
        status: "ACTIVE",
      },
    });

    revalidatePath("/admin/vacancies");
    revalidatePath("/admin/dashboard");
    revalidatePath("/hr/vacancies");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to broadcast vacancy." };
  }
}

export async function publishVacancyToWebsiteAction(vacancyId: string) {
  try {
    await assertAdmin();
    const updated = await prisma.vacancy.update({
      where: { id: vacancyId },
      data: {
        isPostedOnWebsite: true,
        status: "ACTIVE",
        createdAt: new Date(), // Always refresh job posted timestamp when publishing to website
      },
    });

    // Notify Google Indexing in background for immediate Google for Jobs discovery
    notifyGoogleOfJobVacancy(updated.title, updated.city, updated.jobId, "URL_UPDATED").catch((err) => {
      console.warn("Background Google Indexing ping failed:", err);
    });

    revalidatePath("/admin/vacancies");
    revalidatePath("/admin/dashboard");
    revalidatePath("/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to publish vacancy to website." };
  }
}

export async function unpublishVacancyFromWebsiteAction(vacancyId: string) {
  try {
    await assertAdmin();
    const updated = await prisma.vacancy.update({
      where: { id: vacancyId },
      data: {
        isPostedOnWebsite: false,
      },
    });

    notifyGoogleOfJobVacancy(updated.title, updated.city, updated.jobId, "URL_DELETED").catch((err) => {
      console.warn("Background Google Indexing ping failed:", err);
    });

    revalidatePath("/admin/vacancies");
    revalidatePath("/admin/dashboard");
    revalidatePath("/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to remove vacancy from website." };
  }
}

export async function toggleVacancyStatusAction(vacancyId: string, status: string) {
  try {
    await assertAdmin();
    const dataToUpdate: any = { status };
    if (status === "ACTIVE") {
      // When admin re-enables an ongoing vacancy, refresh timestamp to now
      dataToUpdate.createdAt = new Date();
    }

    const updated = await prisma.vacancy.update({
      where: { id: vacancyId },
      data: dataToUpdate,
    });

    // Notify Google Indexing if page is public on website
    if (updated.isPostedOnWebsite) {
      const type = status === "ACTIVE" ? "URL_UPDATED" : "URL_DELETED";
      notifyGoogleOfJobVacancy(updated.title, updated.city, updated.jobId, type).catch((err) => {
        console.warn("Background Google Indexing ping failed:", err);
      });
    }

    revalidatePath("/admin/vacancies");
    revalidatePath("/admin/dashboard");
    revalidatePath("/client/vacancies");
    revalidatePath("/hr/vacancies");
    revalidatePath("/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to change vacancy status." };
  }
}

const updateVacancyVenueSchema = z.object({
  vacancyId: z.string().min(1, "Vacancy ID is required"),
  interviewVenue: z.string().min(3, "Interview venue is required").trim(),
  interviewLocationUrl: z.string().optional().nullable(),
  interviewContactPerson: z.string().optional().nullable(),
  interviewContactPhone: z.string().optional().nullable(),
  interviewInstructions: z.string().optional().nullable(),
});

export async function updateVacancyVenueAction(params: {
  vacancyId: string;
  interviewVenue: string;
  interviewLocationUrl?: string | null;
  interviewContactPerson?: string | null;
  interviewContactPhone?: string | null;
  interviewInstructions?: string | null;
}) {
  try {
    await assertAdmin();
    const parsed = updateVacancyVenueSchema.safeParse(params);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid venue data." };
    }

    const {
      vacancyId,
      interviewVenue,
      interviewLocationUrl,
      interviewContactPerson,
      interviewContactPhone,
      interviewInstructions,
    } = parsed.data;

    const updated = await prisma.vacancy.update({
      where: { id: vacancyId },
      data: {
        interviewVenue,
        interviewLocationUrl: interviewLocationUrl || null,
        interviewContactPerson: interviewContactPerson || null,
        interviewContactPhone: interviewContactPhone || null,
        interviewInstructions: interviewInstructions || null,
      },
    });

    revalidatePath("/admin/vacancies");
    revalidatePath("/hr/candidates");
    revalidatePath("/hr/vacancies");
    return { success: true, vacancy: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update vacancy venue." };
  }
}

// -------------------------------------------------------------
// 5. AGREEMENT GENERATION ACTIONS
// -------------------------------------------------------------

const createAgreementSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  placementFeePercent: z.coerce.number().min(1).max(100).default(8.33),
  paymentTermDays: z.coerce.number().min(1).max(365).default(30),
  replacementGuaranteeDays: z.coerce.number().min(0).max(365).default(90),
  termsText: z.string().min(20, "Contract terms must be specified"),
});

export async function createAgreementAction(formData: FormData) {
  try {
    const adminSession = await assertAdmin();

    const rawData = {
      clientId: formData.get("clientId"),
      placementFeePercent: formData.get("placementFeePercent") || 8.33,
      paymentTermDays: formData.get("paymentTermDays") || 30,
      replacementGuaranteeDays: formData.get("replacementGuaranteeDays") || 90,
      termsText: formData.get("termsText"),
    };

    const parsed = createAgreementSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input data." };
    }

    const { clientId, placementFeePercent, paymentTermDays, replacementGuaranteeDays, termsText } = parsed.data;

    const agreementNumber = await generateAgreementId();
    const hashToken = crypto.randomBytes(24).toString("hex");

    const agreement = await prisma.clientAgreement.create({
      data: {
        agreementNumber,
        clientId,
        adminId: adminSession.userId,
        placementFeePercent,
        paymentTermDays,
        replacementGuaranteeDays,
        termsText,
        hashToken,
        status: "SENT",
      },
    });

    revalidatePath("/admin/agreements");
    revalidatePath("/client/agreements");
    return { success: true, agreementId: agreement.id, hashToken };
  } catch (error: any) {
    console.error("createAgreementAction error:", error);
    return { success: false, error: error.message || "Failed to create agreement." };
  }
}

// -------------------------------------------------------------
// 6. GOOGLE INDEXING API BULK NOTIFICATION
// -------------------------------------------------------------

export async function syncAllVacanciesToGoogleIndexingAction() {
  try {
    await assertAdmin();
    const activeVacancies = await prisma.vacancy.findMany({
      where: {
        status: "ACTIVE",
        isPostedOnWebsite: true,
      },
      select: {
        title: true,
        city: true,
        jobId: true,
      },
    });

    const results = [];
    for (const v of activeVacancies) {
      const res = await notifyGoogleOfJobVacancy(v.title, v.city, v.jobId, "URL_UPDATED");
      results.push({ jobId: v.jobId, ...res });
    }

    return {
      success: true,
      count: activeVacancies.length,
      results,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to sync vacancies to Google Indexing API.",
    };
  }
}
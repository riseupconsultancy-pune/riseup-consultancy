"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

// Guard: verify Super Admin session
async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required.");
  }
  return session;
}

export type InquiryStatus = "NEW" | "IN_PROGRESS" | "CONNECTED" | "CONVERTED" | "CLOSED";

const VALID_STATUSES: InquiryStatus[] = ["NEW", "IN_PROGRESS", "CONNECTED", "CONVERTED", "CLOSED"];

export async function updateInquiryStatusAction(inquiryId: string, status: string, adminNotes?: string) {
  try {
    await assertAdmin();

    if (!VALID_STATUSES.includes(status as InquiryStatus)) {
      return { success: false, error: `Invalid status: ${status}` };
    }

    const dataToUpdate: { status: string; adminNotes?: string } = { status };
    if (typeof adminNotes === "string") {
      dataToUpdate.adminNotes = adminNotes;
    }

    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: dataToUpdate,
    });

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/dashboard");

    return { success: true, inquiry: updated };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update inquiry status.";
    return { success: false, error: message };
  }
}

export async function saveInquiryNotesAction(inquiryId: string, adminNotes: string) {
  try {
    await assertAdmin();

    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { adminNotes },
    });

    revalidatePath("/admin/inquiries");
    return { success: true, inquiry: updated };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save inquiry notes.";
    return { success: false, error: message };
  }
}

export async function convertInquiryToClientAction(inquiryId: string) {
  try {
    await assertAdmin();

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      return { success: false, error: "Inquiry not found." };
    }

    const email = inquiry.email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { clientProfile: true },
    });

    const companyName = inquiry.companyName || inquiry.subject || "Corporate Client";
    const city = inquiry.city || "Pune";
    const country = inquiry.country || "India";

    let tempPasswordNotice = "";

    if (existingUser) {
      if (!existingUser.clientProfile) {
        await prisma.clientProfile.create({
          data: {
            userId: existingUser.id,
            companyName,
            country,
            city,
            industry: "BPO / BPM / Back Office",
            contactPerson: inquiry.fullName,
            phone: inquiry.phone,
          },
        });
      }

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: "CLIENT",
          status: "ACTIVE",
        },
      });

      tempPasswordNotice = "Client user account verified and activated.";
    } else {
      const defaultPassword = "Client@" + Math.floor(1000 + Math.random() * 9000);
      const passwordHash = await hashPassword(defaultPassword);

      await prisma.user.create({
        data: {
          email,
          fullName: inquiry.fullName,
          phone: inquiry.phone,
          passwordHash,
          role: "CLIENT",
          status: "ACTIVE",
          clientProfile: {
            create: {
              companyName,
              country,
              city,
              industry: "BPO / BPM / Back Office",
              contactPerson: inquiry.fullName,
              phone: inquiry.phone,
            },
          },
        },
      });

      tempPasswordNotice = `Client account created. Credentials: Email: ${email} | Temporary Password: ${defaultPassword}`;
    }

    // Update inquiry status
    const currentNotes = inquiry.adminNotes ? `${inquiry.adminNotes}\n` : "";
    const updatedNotes = `${currentNotes}[CONVERTED TO CLIENT]: ${tempPasswordNotice} (${new Date().toLocaleDateString("en-IN")})`;

    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        status: "CONVERTED",
        adminNotes: updatedNotes,
      },
    });

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/clients");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Inquiry successfully converted to Client! ${tempPasswordNotice}`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to convert inquiry to client.";
    return { success: false, error: message };
  }
}

export async function deleteInquiryAction(inquiryId: string) {
  try {
    await assertAdmin();

    await prisma.inquiry.delete({
      where: { id: inquiryId },
    });

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Inquiry record deleted successfully." };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete inquiry.";
    return { success: false, error: message };
  }
}

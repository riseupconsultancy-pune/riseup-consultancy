"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid official email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  expectedRole: z.enum(["SUPER_ADMIN", "HR_RECRUITER", "CLIENT"]).optional(),
});

export interface AuthResponse {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  try {
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
      expectedRole: formData.get("expectedRole") || undefined,
    };

    const parsed = loginSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { email, password, expectedRole } = parsed.data;

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientProfile: true,
        hrProfile: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password credentials.",
      };
    }

    if (user.status !== "ACTIVE") {
      return {
        success: false,
        error: "Your account is inactive. Please contact the Super Admin.",
      };
    }

    // Role check if user selected a role tab
    if (expectedRole && user.role !== expectedRole) {
      return {
        success: false,
        error: `Account found, but it does not have ${expectedRole.replace("_", " ")} privileges. Please select your correct role tab.`,
      };
    }

    // Verify password hash
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password credentials.",
      };
    }

    // Update login timestamp and activity heartbeat
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
      },
    });

    // Set secure HTTP-only session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as "SUPER_ADMIN" | "HR_RECRUITER" | "CLIENT",
      clientProfileId: user.clientProfile?.id,
      hrProfileId: user.hrProfile?.id,
    });

    // Determine redirect route based on role
    let redirectTo = "/admin/dashboard";
    if (user.role === "CLIENT") {
      redirectTo = "/client/dashboard";
    } else if (user.role === "HR_RECRUITER") {
      redirectTo = "/hr/dashboard";
    }

    return {
      success: true,
      redirectTo,
    };
  } catch (error) {
    console.error("Login server action error:", error);
    return {
      success: false,
      error: "An unexpected authentication error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  revalidatePath("/", "layout");
}
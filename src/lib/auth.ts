import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_SECRET = process.env.SESSION_SECRET || "riseup-consultancy-ultra-secure-key-2026-pune-nigeria";
const COOKIE_NAME = "rup_session";

export interface SessionUser {
  userId: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "HR_RECRUITER" | "CLIENT";
  clientProfileId?: string;
  hrProfileId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(data: SessionUser): string {
  const payload = {
    ...data,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(encodedPayload)
    .digest("hex");
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(encodedPayload)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature);
    const actualBuf = Buffer.from(signature);
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return {
      userId: payload.userId,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
      clientProfileId: payload.clientProfileId,
      hrProfileId: payload.hrProfileId,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(sessionUser: SessionUser) {
  const token = signToken(sessionUser);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
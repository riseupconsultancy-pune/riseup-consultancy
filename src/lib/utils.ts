import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a phone number into an international E.164-compatible digit string for WhatsApp wa.me links.
 * Automatically prepends the Indian country code (+91) for standard 10-digit mobile numbers or numbers
 * with leading zeros, while respecting international numbers and country presets.
 */
export function formatWhatsAppPhone(phone?: string | null, country: string = "India"): string {
  if (!phone) return "";

  const rawTrimmed = phone.trim();
  const digits = rawTrimmed.replace(/\D/g, "");
  if (!digits) return "";

  const isNigeria = country && country.toLowerCase().includes("nigeria");

  if (isNigeria) {
    if (digits.startsWith("234") && digits.length >= 13) {
      return digits;
    }
    if (digits.startsWith("0") && digits.length === 11) {
      return `234${digits.slice(1)}`;
    }
    if (digits.length === 10) {
      return `234${digits}`;
    }
    return digits;
  }

  // Already starts with 91 and has 12 digits (91 + 10 digits)
  if (digits.startsWith("91") && digits.length === 12) {
    return digits;
  }

  // Dialed with leading 0 (e.g. 09876543210 -> 11 digits)
  if (digits.startsWith("0") && digits.length === 11) {
    return `91${digits.slice(1)}`;
  }

  // Standard 10-digit Indian mobile number (e.g. 9876543210)
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // Explicit international format with leading + (e.g. +1 555 123 4567 -> 15551234567)
  if (rawTrimmed.startsWith("+")) {
    return digits;
  }

  // If already longer than 10 digits and not starting with 0, assume it includes country code
  if (digits.length > 10) {
    return digits;
  }

  // Fallback for short numbers: prepend 91
  return `91${digits}`;
}
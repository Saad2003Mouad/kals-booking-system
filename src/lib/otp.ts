/**
 * OTP Service Layer
 * NOTE: sendOtpEmail is now provided by src/lib/email.ts (shared singleton transporter).
 * This file only exports the OTP generation helper and TTL constant.
 */
import { randomInt } from "crypto";

export const OTP_TTL = 10; // minutes

/** Generate a cryptographically secure 6-digit OTP */
export function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

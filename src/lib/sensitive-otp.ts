/**
 * Sensitive Action OTP Utility
 * 
 * Wraps the OTP send/verify flow for high-risk admin actions:
 * - Permission changes
 * - User deletion / deactivation
 * - SMTP / API key changes
 * - Customer data export
 * - Cron manual execution
 * - Critical SEO/settings changes
 *
 * Usage:
 *   1. Call requireSensitiveActionOtp("ACTION_NAME", req) before executing action
 *   2. If otpRequired: true is returned, send OTP email and prompt user to enter code
 *   3. Client submits with X-Sensitive-OTP header
 *   4. Call again — if verified, proceed with action
 */
import { NextRequest } from "next/server";
import { getSessionUser } from "./rbac";
import { prisma } from "./prisma";
import { generateOtp } from "./otp";
import { sendSensitiveActionOtpEmail } from "./email";

const OTP_TTL_MINUTES = 5; // Shorter TTL for sensitive actions
const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 30;

/**
 * Actions that require OTP verification.
 * Keys are action codes; values are human-readable descriptions.
 */
export const SENSITIVE_ACTIONS: Record<string, string> = {
  "users.delete": "Delete Staff Account",
  "users.deactivate": "Deactivate Staff Account",
  "roles.update": "Change User Role/Permissions",
  "settings.smtp": "Change SMTP Email Settings",
  "settings.apikey": "Regenerate API Key",
  "customers.export": "Export Customer Data",
  "cron.manual": "Manual Cron Execution",
  "seo.settings": "Change Critical SEO Settings",
};

/**
 * Check if a sensitive OTP has been verified in the current request.
 * Returns { verified: true } if the OTP header is present and valid,
 * or { verified: false, otpRequired: true, error } if OTP is needed.
 */
export async function requireSensitiveActionOtp(
  action: keyof typeof SENSITIVE_ACTIONS,
  req: NextRequest
): Promise<{ verified: boolean; otpRequired?: boolean; error?: string; sent?: boolean }> {
  const user = await getSessionUser(req);
  if (!user) return { verified: false, error: "Unauthenticated" };

  const otpHeader = req.headers.get("X-Sensitive-OTP");

  // No OTP provided — send one
  if (!otpHeader) {
    const existing = await prisma.otpCode.findFirst({
      where: { email: user.email, purpose: "SETTINGS", verified: false },
      orderBy: { createdAt: "desc" },
    });

    // Respect cooldown
    if (existing && Date.now() - existing.createdAt.getTime() < 60000) {
      return { verified: false, otpRequired: true, error: "OTP already sent. Please check your email." };
    }

    // Clean old codes
    await prisma.otpCode.deleteMany({ where: { email: user.email, purpose: "SETTINGS", verified: false } });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await prisma.otpCode.create({ data: { email: user.email, code, expiresAt, verified: false, purpose: "SETTINGS" } });

    const actionLabel = SENSITIVE_ACTIONS[action] || action;
    await sendSensitiveActionOtpEmail(user.email, code, actionLabel);

    return { verified: false, otpRequired: true, sent: true, error: "Verification required. A one-time code has been sent to your email." };
  }

  // OTP provided — verify it
  const otpRecord = await prisma.otpCode.findFirst({
    where: { email: user.email, purpose: "SETTINGS", verified: false },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) return { verified: false, error: "No active verification code. Please request a new one." };

  if (otpRecord.lockedUntil && otpRecord.lockedUntil > new Date()) {
    const mins = Math.ceil((otpRecord.lockedUntil.getTime() - Date.now()) / 60000);
    return { verified: false, error: `Too many attempts. Locked for ${mins} minutes.` };
  }

  if (otpRecord.expiresAt < new Date()) {
    return { verified: false, error: "Code expired. Please request a new one." };
  }

  if (otpRecord.code !== otpHeader.trim()) {
    const attempts = (otpRecord.attempts || 0) + 1;
    const updates: any = { attempts };
    if (attempts >= MAX_ATTEMPTS) {
      updates.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
      await prisma.otpCode.update({ where: { id: otpRecord.id }, data: updates });
      return { verified: false, error: `Too many invalid attempts. Locked for ${LOCK_MINUTES} minutes.` };
    }
    await prisma.otpCode.update({ where: { id: otpRecord.id }, data: updates });
    return { verified: false, error: `Invalid code. ${MAX_ATTEMPTS - attempts} attempts remaining.` };
  }

  // ✅ Valid — consume OTP
  await prisma.otpCode.delete({ where: { id: otpRecord.id } });

  // Log the sensitive action
  await prisma.auditLog.create({
    data: {
      entityType: "USER",
      entityId: user.id,
      action: `SENSITIVE_OTP_VERIFIED:${action}`,
      metadataJson: JSON.stringify({ action, at: new Date().toISOString() }),
      actorId: user.id,
    },
  });

  return { verified: true };
}

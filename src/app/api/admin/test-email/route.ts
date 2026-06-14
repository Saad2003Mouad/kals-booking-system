import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthenticated, unauthorized, hasPermission } from "@/lib/rbac";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/test-email
 * Sends a test email to verify SMTP configuration is working.
 * Admin-only. Body: { to?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();
    if (!hasPermission(user.role, "settings.manage")) return unauthorized();

    const body = await req.json().catch(() => ({}));
    const to: string = body.to || process.env.SMTP_USER || "";

    if (!to) {
      return NextResponse.json({ success: false, error: "No recipient email specified and SMTP_USER not set" }, { status: 400 });
    }

    // Log the SMTP config state (never log the actual password)
    const smtpState = {
      SMTP_USER: process.env.SMTP_USER ? `${process.env.SMTP_USER.slice(0, 4)}...` : "NOT SET",
      SMTP_PASS: process.env.SMTP_PASS ? "SET (hidden)" : "NOT SET",
    };
    console.log("[Test Email] SMTP config state:", smtpState);

    const html = `
      <h2 style="color:#000223;font-size:24px;font-weight:900;">Test Email ✅</h2>
      <p style="color:#4B5563;font-size:16px;">This is a test email sent from the Boston Legend admin panel to verify SMTP configuration.</p>
      <table style="margin-top:16px;font-size:14px;" cellpadding="8">
        <tr><td style="font-weight:bold;color:#6B7280;">Sent to</td><td>${to}</td></tr>
        <tr><td style="font-weight:bold;color:#6B7280;">SMTP User</td><td>${process.env.SMTP_USER || "NOT SET"}</td></tr>
        <tr><td style="font-weight:bold;color:#6B7280;">Timestamp</td><td>${new Date().toISOString()}</td></tr>
      </table>
      <p style="margin-top:24px;color:#10B981;font-weight:700;">✓ If you received this email, SMTP is working correctly.</p>
    `;

    const sent = await sendEmail({
      to,
      subject: "Boston Legend — SMTP Test Email",
      html,
      title: "SMTP Test",
    });

    if (sent) {
      return NextResponse.json({ success: true, message: `Test email sent to ${to}`, smtpState });
    } else {
      return NextResponse.json({ success: false, error: "sendEmail() returned false — check Vercel/server logs for SMTP error details", smtpState }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[Test Email] Error:", error?.message || error);
    return NextResponse.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 });
  }
}

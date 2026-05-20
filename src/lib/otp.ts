/**
 * OTP Service Layer — Phase 1: Nodemailer / Gmail SMTP
 * Upgrade path: swap sendOtpEmail() to Resend or Twilio
 */

import nodemailer from "nodemailer";

const OTP_TTL_MINUTES = 10;

/** Generate a 6-digit OTP */
export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Send OTP email via SMTP (Gmail App Password) */
export async function sendOtpEmail(to: string, otp: string, firstName?: string): Promise<boolean> {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
      },
    });

    const html = `
      <h2 style="margin:0 0 16px;color:#000223;font-size:26px;font-weight:900;">Hey ${firstName ?? "there"}! 👋</h2>
      <p style="margin:0 0 32px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
        Thanks for choosing **Boston Legend**. Use the code below to verify your email and complete your reservation.
      </p>

      <div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFFDE7 100%);border:2px solid #FFA000;border-radius:20px;padding:40px;text-align:center;margin-bottom:32px;">
        <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Verification Code</p>
        <p style="margin:0 0 8px;font-size:48px;font-weight:900;letter-spacing:12px;color:#000223;font-family:monospace;">${otp}</p>
        <p style="margin:0;color:#9CA3AF;font-size:12px;font-weight:700;">⏱ Expires in ${OTP_TTL_MINUTES} minutes</p>
      </div>

      <div style="background:#F8F9FC;border-radius:12px;padding:20px;">
        <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.6;font-weight:500;">
          🔒 <strong>Security notice:</strong> We will never ask for this code by phone or chat. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `;

    // Import the base template logic or just use the same style here
    const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
      <body style="margin:0;padding:0;background-color:#F4F4F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Nunito',Helvetica,Arial,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F4F4F5;padding:40px 16px;">
          <tr><td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.05);">
              <tr><td style="background:linear-gradient(135deg,#000223 0%,#001a4c 100%);padding:40px;text-align:center;">
                <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" width="180" alt="BL"/>
              </td></tr>
              <tr><td style="padding:48px 48px 40px;">${html}</td></tr>
              <tr><td style="background:#F8F9FC;padding:32px;text-align:center;border-top:1px solid #EEEEEE;color:#9CA3AF;font-size:12px;">
                Boston Legend Ice Cream Truck · Greater Boston, MA · 617-999-3803
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

    await transport.sendMail({
      from: `"Boston Legend Ice Cream" <${process.env.SMTP_USER}>`,
      to,
      subject: `${otp} — Your Boston Legend Verification Code`,
      html: finalHtml,
    });
    return true;
  } catch (err) {
    console.error("[OTP Email Error]", err);
    return false;
  }
}

export const OTP_TTL = OTP_TTL_MINUTES;

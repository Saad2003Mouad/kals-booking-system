import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, OTP_TTL } from "@/lib/otp";
import nodemailer from "nodemailer";

const GENERIC_RESPONSE = {
  success: true,
  message:
    "If we find a matching booking, we'll send a secure verification code to the email on file.",
};

/** Send a booking-lookup OTP email with custom subject/body */
async function sendBookingLookupOtp(
  to: string,
  otp: string,
  firstName: string
): Promise<boolean> {
  try {
    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    if (!smtpConfigured) {
      console.log(`[DEV OTP - booking lookup] ${to} → ${otp}`);
      return true;
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const OTP_TTL_MINUTES = OTP_TTL;

    const bodyHtml = `
      <h2 style="margin:0 0 16px;color:#000223;font-size:26px;font-weight:900;">Hi ${firstName},</h2>
      <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
        We received a request to access your Boston Legend booking. Use the code below to verify your identity and view your booking details.
      </p>

      <div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFFDE7 100%);border:2px solid #FFA000;border-radius:20px;padding:40px;text-align:center;margin-bottom:32px;">
        <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Verification Code</p>
        <p style="margin:0 0 8px;font-size:48px;font-weight:900;letter-spacing:12px;color:#000223;font-family:monospace;">${otp}</p>
        <p style="margin:0;color:#9CA3AF;font-size:12px;font-weight:700;">⏱ Expires in ${OTP_TTL_MINUTES} minutes</p>
      </div>

      <div style="background:#F8F9FC;border-radius:12px;padding:20px;">
        <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.6;font-weight:500;">
          🔒 <strong>Security notice:</strong> We will never ask for this code by phone or chat. If you did not request access to your booking, you can safely ignore this email.
        </p>
      </div>
    `;

    const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
      <body style="margin:0;padding:0;background-color:#F4F4F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Nunito',Helvetica,Arial,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F4F4F5;padding:40px 16px;">
          <tr><td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.05);">
              <tr><td style="background:linear-gradient(135deg,#000223 0%,#001a4c 100%);padding:40px;text-align:center;">
                <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" width="180" alt="Boston Legend"/>
              </td></tr>
              <tr><td style="padding:40px 32px;">${bodyHtml}</td></tr>
              <tr><td style="background:#F8F9FC;padding:24px 20px;text-align:center;border-top:1px solid #EEEEEE;color:#9CA3AF;font-size:12px;">
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
      subject: `Your Boston Legend Booking Verification Code — ${otp}`,
      html: finalHtml,
    });

    return true;
  } catch (err) {
    console.error("[Booking Lookup OTP Email Error]", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingNumber, email } = body;

    // Basic validation — still return generic response on invalid input
    if (!bookingNumber || !email || !email.includes("@")) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedBookingNumber = String(bookingNumber).trim().toUpperCase();

    // Cooldown check: prevent OTP spam (regardless of whether booking exists)
    const lastOtp = await prisma.otpCode.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < 60000) {
      // Still generic — don't reveal cooldown to prevent enumeration
      return NextResponse.json(GENERIC_RESPONSE);
    }

    // Look up booking — match bookingNumber AND email (case-insensitive)
    const booking = await prisma.booking.findFirst({
      where: {
        bookingNumber: normalizedBookingNumber,
        customer: {
          email: {
            equals: normalizedEmail,
            mode: "insensitive",
          },
        },
      },
      include: { customer: true },
    });

    // Even if no booking found, we don't reveal that. We just don't send an OTP.
    if (booking) {
      // Invalidate previous unused OTPs for this email
      await prisma.otpCode.deleteMany({ where: { email: normalizedEmail } });

      const code = generateOtp();
      const expiresAt = new Date(Date.now() + OTP_TTL * 60 * 1000);

      // Save OTP to DB
      await prisma.otpCode.create({
        data: { email: normalizedEmail, code, expiresAt, verified: false },
      });

      // Send email (fire and forget errors — always return generic)
      const firstName = booking.customer.firstName || "there";
      const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

      if (smtpConfigured) {
        await sendBookingLookupOtp(normalizedEmail, code, firstName);
      } else {
        console.log(`[DEV OTP - booking lookup] ${normalizedEmail} → ${code}`);
      }
    }
    // If no booking: we still return the same generic message

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (err) {
    // Log error safely without exposing details
    console.error("[Booking Lookup] Internal error");
    // Return generic even on error
    return NextResponse.json(GENERIC_RESPONSE);
  }
}

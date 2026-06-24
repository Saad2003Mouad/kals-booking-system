import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, OTP_TTL } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const GENERIC_RESPONSE = {
  success: true,
  message:
    "If we find a matching booking, we'll send a secure verification code to the email on file.",
};

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

    // Cooldown and Lock check
    const lastOtp = await prisma.otpCode.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp) {
      if (lastOtp.lockedUntil && lastOtp.lockedUntil > new Date()) {
        return NextResponse.json(GENERIC_RESPONSE);
      }
      if (Date.now() - lastOtp.createdAt.getTime() < 60000) {
        return NextResponse.json(GENERIC_RESPONSE);
      }
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
      // Invalidate previous unused OTPs for this email that are not locked
      await prisma.otpCode.deleteMany({ 
        where: { 
          email: normalizedEmail,
          OR: [
            { lockedUntil: null },
            { lockedUntil: { lte: new Date() } }
          ]
        } 
      });

      const code = generateOtp();
      const expiresAt = new Date(Date.now() + OTP_TTL * 60 * 1000);

      // Save OTP to DB
      await prisma.otpCode.create({
        data: { email: normalizedEmail, code, expiresAt, verified: false, purpose: "PORTAL" },
      });

      // Send email (fire and forget errors — always return generic)
      const firstName = booking.customer.firstName || "there";
      const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

      if (smtpConfigured) {
        // We do not await to avoid blocking the response unnecessarily if email is slow,
        // but Next.js might require await in serverless functions.
        await sendOtpEmail(normalizedEmail, code, firstName, "PORTAL");
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

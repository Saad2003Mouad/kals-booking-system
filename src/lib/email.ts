import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const BRAND_NAVY = "#000223";
const BRAND_GOLD = "#FFA000";
const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

// ─── SINGLETON TRANSPORTER ──────────────────────────────────────
// One transporter instance per process lifecycle. Prevents connection
// exhaustion and eliminates duplicate transport creation in otp.ts.
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
  });
  return _transporter;
}

// ─── BASE TEMPLATE ───────────────────────────────────────────────
function baseTemplate(content: string, title: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');
      </style>
    </head>
    <body style="margin:0;padding:0;background-color:#F4F4F5;font-family:'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F4F4F5;padding:20px 10px;">
        <tr><td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);margin:0 auto;">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,${BRAND_NAVY} 0%,#001a4c 100%);padding:48px 40px;text-align:center;">
                <img src="${LOGO}" alt="Boston Legend" width="200" style="height:auto;display:block;margin:0 auto 12px;"/>
                <div style="height:2px;width:40px;background:${BRAND_GOLD};margin:0 auto;border-radius:2px;"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 20px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#F8F9FC;padding:24px 20px;text-align:center;border-top:1px solid #EEEEEE;">
                <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Boston Legend Ice Cream Truck</p>
                <p style="margin:0 0 16px;color:#6B7280;font-size:13px;font-weight:600;">Greater Boston, MA · 617-999-3803</p>
                <div style="margin-bottom:20px;">
                  <a href="https://www.facebook.com/bostonlegendicecream" style="display:inline-block;margin:0 8px;"><img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f9407e01489f8f216_boston-legend-ice-cream-truck-facebook.png" width="20" height="20" alt="FB"/></a>
                  <a href="https://www.instagram.com/bostonlegendicecream" style="display:inline-block;margin:0 8px;"><img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f63235d7e7fa1c200_boston-legend-ice-cream-truck-truck-instagram.png" width="20" height="20" alt="IG"/></a>
                </div>
                <p style="margin:0;color:#D1D5DB;font-size:11px;font-weight:600;">© ${new Date().getFullYear()} Boston Legend. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

// ─── CORE SEND WITH RETRY ──────────────────────────────────────
export async function sendEmail({ to, subject, html, title }: { to: string; subject: string; html: string; title?: string }) {
  const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  if (!smtpConfigured) {
    console.warn("[Email] SMTP not configured — skipping send for:", subject, "→", to);
    return false;
  }

  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 2000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"Boston Legend Ice Cream" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: baseTemplate(html, title || subject),
      });
      console.log(`[Email] ✅ Sent "${subject}" → ${to} (attempt ${attempt})`);
      return true;
    } catch (err) {
      console.error(`[Email] ❌ Attempt ${attempt}/${MAX_RETRIES} failed for "${subject}" → ${to}:`, err);
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        // Reset singleton on failure so it gets recreated
        _transporter = null;
      }
    }
  }
  console.error(`[Email] 🔴 All ${MAX_RETRIES} attempts exhausted for "${subject}" → ${to}`);
  return false;
}

// ─── OTP EMAIL ───────────────────────────────────────────────────
// Unified OTP email — used by booking, portal login, forgot password,
// staff invite, and sensitive action flows. Previously duplicated in otp.ts.
export async function sendOtpEmail(
  to: string,
  otp: string,
  firstName?: string,
  purpose: "BOOKING" | "PORTAL" | "PASSWORD_RESET" | "EMAIL_CHANGE" | "SETTINGS" | "STAFF_INVITE" | "GENERAL" = "GENERAL"
) {
  const purposeLabels: Record<string, string> = {
    BOOKING: "Booking Verification",
    PORTAL: "Booking Portal Access",
    PASSWORD_RESET: "Password Reset",
    EMAIL_CHANGE: "Email Change Verification",
    SETTINGS: "Sensitive Action Verification",
    STAFF_INVITE: "Staff Account Setup",
    GENERAL: "Verification",
  };
  const label = purposeLabels[purpose] || "Verification";
  const TTL = 10;

  const html = `
    <h2 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Hey ${firstName ?? "there"}! 👋</h2>
    <p style="margin:0 0 32px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
      Use the code below to complete your <strong>${label}</strong>.
    </p>

    <div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFFDE7 100%);border:2px solid ${BRAND_GOLD};border-radius:20px;padding:40px;text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">${label} Code</p>
      <p style="margin:0 0 8px;font-size:48px;font-weight:900;letter-spacing:12px;color:${BRAND_NAVY};font-family:monospace;">${otp}</p>
      <p style="margin:0;color:#9CA3AF;font-size:12px;font-weight:700;">⏱ Expires in ${TTL} minutes</p>
    </div>

    <div style="background:#F8F9FC;border-radius:12px;padding:20px;">
      <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.6;font-weight:500;">
        🔒 <strong>Security notice:</strong> We will never ask for this code by phone or chat. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `${otp} — Your Boston Legend ${label} Code`,
    html,
    title: `Boston Legend ${label}`,
  });
}

// ─── WELCOME EMAIL ────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, firstName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bostonlegendicecreamtruck.com";
  const html = `
    <div style="text-align:center;padding:24px 0 20px;">
      <div style="font-size:56px;line-height:1;margin-bottom:16px;">🍦🎉</div>
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:28px;font-weight:900;">Welcome to Boston Legend, ${firstName}!</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Greater Boston's premium ice cream truck service.</p>
    </div>

    <div style="background:#ECFDF5;border:2px solid #10B981;border-radius:16px;padding:24px;margin:24px 0;text-align:center;">
      <p style="margin:0;color:#065F46;font-size:15px;font-weight:700;">✅ Your email has been verified. Your account is now active.</p>
    </div>

    <p style="color:#4B5563;font-size:15px;font-weight:600;line-height:1.7;">
      Thank you for choosing Boston Legend! We're excited to bring the ice cream truck experience to your next event. 
      Browse our packages and book your sweet experience today.
    </p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/packages" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_NAVY};padding:16px 40px;border-radius:50px;text-decoration:none;font-weight:900;font-size:16px;box-shadow:0 8px 20px rgba(255,160,0,0.3);">
        Browse Our Packages →
      </a>
    </div>

    <div style="margin-top:24px;padding:16px;background:#F9FAFB;border-radius:12px;text-align:center;">
      <p style="font-size:13px;color:#6B7280;font-weight:600;margin:0 0 4px;">Questions? We're here to help.</p>
      <a href="tel:617-999-3803" style="color:${BRAND_GOLD};font-weight:800;font-size:14px;">Call us: 617-999-3803</a>
    </div>
  `;
  return sendEmail({ to, subject: "Welcome to Boston Legend Ice Cream! 🍦", html, title: "Welcome to Boston Legend" });
}

// ─── FORGOT PASSWORD EMAIL ────────────────────────────────────
export async function sendForgotPasswordEmail(to: string, otp: string, firstName?: string) {
  const TTL = 10;
  const html = `
    <div style="text-align:center;padding:24px 0 20px;">
      <div style="font-size:48px;line-height:1;margin-bottom:16px;">🔐</div>
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Password Reset Request</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Hi ${firstName ?? "there"} — we received a request to reset your password.</p>
    </div>

    <div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFFDE7 100%);border:2px solid ${BRAND_GOLD};border-radius:20px;padding:40px;text-align:center;margin:24px 0;">
      <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Reset Code</p>
      <p style="margin:0 0 8px;font-size:48px;font-weight:900;letter-spacing:12px;color:${BRAND_NAVY};font-family:monospace;">${otp}</p>
      <p style="margin:0;color:#9CA3AF;font-size:12px;font-weight:700;">⏱ Expires in ${TTL} minutes</p>
    </div>

    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#991B1B;font-size:13px;font-weight:700;">
        🔒 If you did NOT request a password reset, ignore this email. Your password will not change.
      </p>
    </div>

    <p style="color:#6B7280;font-size:13px;font-weight:600;text-align:center;">
      Need help? Call us at <a href="tel:617-999-3803" style="color:${BRAND_NAVY};font-weight:800;">617-999-3803</a>
    </p>
  `;
  return sendEmail({ to, subject: `${otp} — Boston Legend Password Reset Code`, html, title: "Password Reset" });
}

// ─── STAFF INVITE EMAIL ──────────────────────────────────────
export async function sendStaffInviteEmail(to: string, inviterName: string, inviteToken: string, role: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bostonlegendicecreamtruck.com";
  const acceptUrl = `${siteUrl}/admin/accept-invite?token=${inviteToken}`;
  const EXPIRES_HOURS = 48;

  const html = `
    <div style="text-align:center;padding:24px 0 20px;">
      <div style="font-size:48px;line-height:1;margin-bottom:16px;">🤝</div>
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">You've Been Invited!</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">${inviterName} has invited you to join the Boston Legend team.</p>
    </div>

    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:16px;padding:20px 24px;margin:24px 0;">
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td style="font-weight:800;color:${BRAND_NAVY};font-size:14px;">Your Role</td>
          <td style="font-weight:700;color:#1E40AF;font-size:14px;">${role}</td>
        </tr>
        <tr>
          <td style="font-weight:800;color:${BRAND_NAVY};font-size:14px;">Invited By</td>
          <td style="font-weight:700;color:#1E40AF;font-size:14px;">${inviterName}</td>
        </tr>
        <tr>
          <td style="font-weight:800;color:${BRAND_NAVY};font-size:14px;">Expires</td>
          <td style="font-weight:700;color:#1E40AF;font-size:14px;">In ${EXPIRES_HOURS} hours</td>
        </tr>
      </table>
    </div>

    <p style="color:#4B5563;font-size:15px;font-weight:600;line-height:1.7;margin-bottom:24px;">
      Click the button below to accept your invitation and set up your password. This link expires in ${EXPIRES_HOURS} hours.
    </p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${acceptUrl}" style="display:block;width:100%;box-sizing:border-box;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:18px 24px;border-radius:12px;text-decoration:none;font-weight:900;font-size:16px;text-transform:uppercase;">
        Accept Invitation & Set Password
      </a>
    </div>

    <div style="background:#F9FAFB;border-radius:12px;padding:16px;margin-top:16px;">
      <p style="margin:0;color:#9CA3AF;font-size:12px;font-weight:600;">
        If the button doesn't work, copy and paste this link: <br/>
        <span style="color:${BRAND_NAVY};word-break:break-all;">${acceptUrl}</span>
      </p>
    </div>
  `;
  return sendEmail({ to, subject: `You've been invited to join Boston Legend Staff`, html, title: "Staff Invitation" });
}

// ─── SENSITIVE ACTION OTP EMAIL ──────────────────────────────
export async function sendSensitiveActionOtpEmail(to: string, otp: string, action: string, userName?: string) {
  const TTL = 5;
  const html = `
    <div style="text-align:center;padding:24px 0 20px;">
      <div style="font-size:48px;line-height:1;margin-bottom:16px;">🛡️</div>
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Security Verification Required</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Hi ${userName ?? "Admin"} — a sensitive action requires your verification.</p>
    </div>

    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:16px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:900;text-transform:uppercase;color:#D97706;">Action Requested</p>
      <p style="margin:0;color:#92400E;font-size:15px;font-weight:700;">${action}</p>
    </div>

    <div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFFDE7 100%);border:2px solid ${BRAND_GOLD};border-radius:20px;padding:40px;text-align:center;margin:24px 0;">
      <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Verification Code</p>
      <p style="margin:0 0 8px;font-size:48px;font-weight:900;letter-spacing:12px;color:${BRAND_NAVY};font-family:monospace;">${otp}</p>
      <p style="margin:0;color:#9CA3AF;font-size:12px;font-weight:700;">⏱ Expires in ${TTL} minutes — single use only</p>
    </div>

    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px 20px;">
      <p style="margin:0;color:#991B1B;font-size:13px;font-weight:700;">
        🚨 If you did NOT initiate this action, your account may be compromised. Contact support immediately.
      </p>
    </div>
  `;
  return sendEmail({ to, subject: `${otp} — Boston Legend Admin Security Code`, html, title: "Security Verification" });
}

// ─── BOOKING DETAIL FORMATTER ─────────────────────────────────
function formatBookingDetailsHtml(booking: any) {
  if (!booking) return "";
  
  const formatEnDate = (d: Date) => {
    if (!d) return "";
    try {
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch { return String(d); }
  };

  const quote = booking.quote;
  const pkg = booking.package;

  let breakdown: any = {};
  try {
    if (quote?.snapshotJson) {
      breakdown = JSON.parse(quote.snapshotJson);
    }
  } catch (e) {
    console.error("Failed to parse quote snapshot JSON in email:", e);
  }

  const pkgDurationMins = breakdown.includedServiceMins ?? ((pkg as any)?.durationMins ?? pkg?.includedMinutes ?? booking.durationMins);
  const pkgServings = breakdown.includedGuests ?? (pkg?.servings ?? 50);
  const extraPiecePrice = breakdown.extraGuestPrice ?? ((pkg as any)?.extraGuestPrice ?? pkg?.extraPiecePrice ?? 5);
  const extraGuestsCount = breakdown.additionalGuests ?? Math.max(0, booking.guests - pkgServings);
  const extraGuestsFee = breakdown.additionalGuestsFee ?? (extraGuestsCount * extraPiecePrice);
  const distanceMiles = breakdown.distanceMiles ?? (quote?.distanceMiles ?? 0);
  const travelFee = breakdown.travelFee ?? (quote?.travelFee ?? 0);
  const overtimeFee = quote?.overtimeFee ?? 0;
  const extraServiceFee = breakdown.additionalServiceFee ?? (quote?.additionalServiceFee ?? (booking.extraServiceFee || 0));
  const extraServiceMins = breakdown.additionalServiceMins ?? (quote?.extraServiceMins ?? (booking.extraServiceMins || 0));
  const basePrice = breakdown.packagePrice ?? (quote?.basePrice ?? (booking.totalAmount - travelFee - overtimeFee - extraServiceFee - extraGuestsFee));
  const billableMiles = breakdown.billableMiles ?? Math.max(0, distanceMiles - 10);
  const additionalStopsCount = breakdown.additionalStopsCount ?? (booking.additionalStops || 0);
  const additionalStopsFee = breakdown.additionalStopsFee ?? (booking.additionalStopsFee || 0);
  const estimatedTotal = breakdown.estimatedTotal ?? booking.totalAmount;
  const additionalVehicleSetupFee = breakdown.additionalVehicleSetupFee ?? 0;
  const weekendFee = breakdown.weekendFee ?? 0;

  return `
    <!-- Event Summary -->
    <h3 style="margin:24px 0 12px;color:${BRAND_NAVY};font-size:20px;font-weight:900;border-bottom:2px solid #F3F4F6;padding-bottom:8px;">Event Summary</h3>
    <table width="100%" cellpadding="10" cellspacing="0" style="margin-bottom:24px;font-size:16px;color:#4B5563;">
      <tr><td width="40%" style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Event Type</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${booking.eventType}</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Package</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${pkg?.name || 'Custom Package'}</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Date &amp; Time</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${formatEnDate(booking.eventDate)} at ${booking.startTime}</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Included Service Time</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${pkgDurationMins} minutes</td></tr>
      ${extraServiceMins > 0 ? `<tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Additional Service Time</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">+${extraServiceMins} minutes</td></tr>` : ''}
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Included Guests</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${pkgServings} guests</td></tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Location</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">
          ${booking.address}, ${booking.city} ${booking.zip}
          ${booking.stops && booking.stops.length > 0 ? `<br/><br/>
            <strong style="color:${BRAND_GOLD}">Additional Stops:</strong><br/>
            ${booking.stops.map((s: any, i: number) => `Stop ${i+1}: ${s.street}, ${s.city} ${s.state} ${s.zipCode}`).join('<br/>')}
          ` : ''}
        </td>
      </tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Garage Origin</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">Boston Revere — 84 Fernwood Ave</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Total Distance</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${distanceMiles.toFixed(1)} miles</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Free Travel Zone</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">First 10.0 miles FREE</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Billable Distance</td><td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${billableMiles.toFixed(1)} miles</td></tr>
    </table>

    <!-- Pricing Breakdown -->
    <h3 style="margin:0 0 12px;color:${BRAND_NAVY};font-size:20px;font-weight:900;border-bottom:2px solid #F3F4F6;padding-bottom:8px;">Pricing &amp; Travel Fee</h3>
    ${(booking.package?.slug === "custom-event-package" || booking.packageId === "custom-event-package" || booking.package?.name === "Custom Event Package") ? `
    <div style="background:#FFF9F0;border:1px dashed #FFA000;border-radius:12px;padding:16px 20px;margin-bottom:24px;font-size:16px;color:#92400E;font-weight:700;">
      Custom Quote Pending — our team will review your guest count, vehicle needs, route, timing, and event details before preparing your final quote.
    </div>
    ` : `
    <table width="100%" cellpadding="10" cellspacing="0" style="margin-bottom:24px;font-size:16px;color:#4B5563;background:#F8F9FC;border-radius:12px;">
      <tr><td width="65%" style="font-weight:600;">Base Package Price</td><td width="35%" align="right" style="font-weight:800;color:${BRAND_NAVY};">$${basePrice.toFixed(2)}</td></tr>
      <tr><td style="font-weight:600;color:#6B7280;font-size:14px;">Included: ${pkgServings} guests, ${pkgDurationMins} min</td><td></td></tr>
      ${extraGuestsFee > 0 ? `<tr><td style="font-weight:600;">Extra Guests Fee (${extraGuestsCount} × $${extraPiecePrice})</td><td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${extraGuestsFee.toFixed(2)}</td></tr>` : ''}
      ${additionalStopsFee > 0 ? `<tr><td style="font-weight:600;">Additional Stops (${additionalStopsCount})</td><td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${additionalStopsFee.toFixed(2)}</td></tr>` : ''}
      ${extraServiceFee > 0 ? `<tr><td style="font-weight:600;">Additional Service Time (${extraServiceMins} min)</td><td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${extraServiceFee.toFixed(2)}</td></tr>` : ''}
      ${overtimeFee > 0 ? `<tr><td style="font-weight:600;">Overtime Fee</td><td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${overtimeFee.toFixed(2)}</td></tr>` : ''}
      ${travelFee > 0 ? `<tr><td style="font-weight:600;">Travel Fee</td><td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${travelFee.toFixed(2)}</td></tr>` : ''}
      ${additionalVehicleSetupFee > 0 ? `<tr><td style="font-weight:600;">Additional Vehicle Setup Fee</td><td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${additionalVehicleSetupFee.toFixed(2)}</td></tr>` : ''}
      ${weekendFee > 0 ? `<tr><td style="font-weight:600;">Weekend Event Fee</td><td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${weekendFee.toFixed(2)}</td></tr>` : ''}
      <tr><td style="font-weight:900;color:${BRAND_NAVY};border-top:2px solid #E5E7EB;padding-top:16px;">Total Estimated Price</td><td align="right" style="font-weight:900;color:${BRAND_GOLD};font-size:22px;border-top:2px solid #E5E7EB;padding-top:16px;">$${estimatedTotal.toFixed(2)}</td></tr>
    </table>
    `}

    ${additionalVehicleSetupFee > 0 ? `
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#1E40AF;font-weight:600;">
      🚚 Additional Vehicle Setup Fee: If your event requires another truck/van for the same package at the same time, each additional vehicle includes a $200 setup and dispatch fee.
    </div>
    ` : ''}

    ${weekendFee > 0 ? `
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#1E40AF;font-weight:600;">
      📅 Weekend Event Fee: Saturday and Sunday bookings include an additional $25 weekend event fee.
    </div>
    ` : ''}

    <!-- Payment Policy -->
    <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:700;">💳 Payment Policy: Payment is collected after the service. We accept multiple payment methods.</p>
    </div>
  `;
}

// ─── BOOKING APPROVED ─────────────────────────────────────────
export async function sendBookingApprovedEmail(to: string, firstName: string, bookingNumber: string, paymentUrl: string, amount: string, bookingId: string) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/customer/booking/${bookingId}`;
  let bookingDetailsHtml = "";
  let isCustom = false;
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } } });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
    if (booking?.package?.slug === "custom-event-package" || booking?.packageId === "custom-event-package" || booking?.package?.name === "Custom Event Package") isCustom = true;
  } catch (e) { console.error("Error formatting booking details for approved email:", e); }

  const subject = isCustom ? `Approved: Your Boston Legend Custom Quote #${bookingNumber}` : `Approved: Your Boston Legend Booking #${bookingNumber}`;
  const headerText = isCustom ? `Your Custom Quote is Approved! 🎉` : `Legendary News, ${firstName}! 🎉`;
  const bodyText = isCustom
    ? `Your custom quote request **#${bookingNumber}** has been approved with a finalized price.`
    : `Your reservation **#${bookingNumber}** has been officially **APPROVED**. We can't wait to sweeten your event!`;

  const html = `
    <h2 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:28px;font-weight:900;">${headerText}</h2>
    <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">${bodyText}</p>
    <div style="background:#ECFDF5;border:2px solid #10B981;border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;">
      <p style="margin:0 0 4px;color:#065F46;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Approved Price Total</p>
      <p style="margin:0 0 10px;color:${BRAND_NAVY};font-size:36px;font-weight:900;">$${amount}</p>
      <p style="margin:0;color:#047857;font-size:14px;font-weight:700;">Payment is collected after the service. We accept multiple payment methods.</p>
    </div>
    ${bookingDetailsHtml}
    <div style="text-align:center;margin-top:24px;padding:24px 16px;background:#F8F9FC;border-radius:16px;">
      <p style="margin:0 0 16px;font-size:16px;font-weight:800;color:${BRAND_NAVY};">Need to check details or manage your booking?</p>
      <a href="${portalUrl}" style="display:block;width:100%;box-sizing:border-box;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:18px 24px;border-radius:12px;text-decoration:none;font-weight:900;font-size:16px;text-transform:uppercase;">Access Booking Portal</a>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

// ─── BOOKING PENDING ──────────────────────────────────────────
export async function sendBookingPendingEmail(to: string, firstName: string, bookingNumber: string, details: any, bookingId: string) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/customer/booking/${bookingId}`;
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } } });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) { console.error("Error formatting booking details for pending email:", e); }

  const html = `
    <h2 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:24px;font-weight:900;">Your Boston Legend Booking Request</h2>
    <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
      Hello ${firstName},<br/><br/>
      We've received your request for a Boston Legend ice cream truck. Our concierge team is currently reviewing the details to ensure a flawless experience.
    </p>
    <div style="background:#FFFBEB;border:1px solid ${BRAND_GOLD};border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 4px;color:#92400E;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
      <p style="margin:0;color:${BRAND_NAVY};font-size:24px;font-weight:900;">#${bookingNumber}</p>
    </div>
    ${bookingDetailsHtml}
    <div style="background:#FFFBEB;border:1px solid ${BRAND_GOLD};border-radius:12px;padding:20px;margin-bottom:24px;font-size:13px;line-height:1.6;color:#92400E;text-align:left;">
      <p style="margin:0 0 8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${BRAND_NAVY};">📍 Travel &amp; Distance Policy</p>
      <p style="margin:0 0 12px;font-weight:600;">The first 10 miles are free. Any additional miles will be calculated based on the travel distance from our garage at Boston Revere, 84 Fernwood Ave to your event location.</p>
      <p style="margin:0 0 8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${BRAND_NAVY};">👥 Extra Guests Policy</p>
      <p style="margin:0 0 12px;font-weight:600;">Extra guests beyond the included package count are calculated at $5 per person.</p>
      <p style="margin:0 0 8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${BRAND_NAVY};">💳 Payment Policy</p>
      <p style="margin:0;font-weight:600;">Payment is collected after the service. We accept multiple payment methods.</p>
    </div>
    <div style="text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 20px;color:#4B5563;font-size:16px;font-weight:700;">You will hear from us shortly with an official update.</p>
      <a href="${portalUrl}" style="display:block;width:100%;box-sizing:border-box;background:${BRAND_NAVY};color:white;padding:18px 24px;border-radius:12px;text-decoration:none;font-weight:900;font-size:16px;text-transform:uppercase;">View Request Status &amp; Portal</a>
    </div>
    <div style="background:#F3F4F6;border-radius:12px;padding:20px;text-align:center;">
      <p style="margin:0;color:#6B7280;font-size:13px;font-weight:600;">Questions? Call us directly at <a href="tel:617-999-3803" style="color:${BRAND_NAVY};text-decoration:none;font-weight:800;">617-999-3803</a>.</p>
    </div>
  `;
  return sendEmail({ to, subject: `Your Boston Legend Booking Request #${bookingNumber}`, html });
}

// ─── BOOKING REJECTED ─────────────────────────────────────────
export async function sendBookingRejectedEmail(to: string, firstName: string, bookingNumber: string, reason: string, bookingId: string) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/customer/booking/${bookingId}`;
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } } });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) { console.error("Error formatting booking details for rejected email:", e); }

  const html = `
    <div style="text-align:center;padding:32px 0 24px;">
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Update Needed for Your Request</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Hi ${firstName}, your request needs a quick adjustment before we can confirm it.</p>
    </div>
    <div style="background:#F3F4F6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:900;text-transform:uppercase;color:#9CA3AF;">Booking Reference</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:900;color:${BRAND_NAVY};">#${bookingNumber}</p>
    </div>
    <div style="background:#FFF7ED;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;color:#D97706;">Details / Reason</p>
      <p style="margin:0;color:#92400E;font-size:15px;font-weight:600;">${reason}</p>
    </div>
    ${bookingDetailsHtml}
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${portalUrl}" style="display:block;width:100%;box-sizing:border-box;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:18px 24px;border-radius:12px;text-decoration:none;font-weight:900;font-size:16px;text-transform:uppercase;">Update My Booking Request</a>
    </div>
  `;
  return sendEmail({ to, subject: `Update Needed: Your Boston Legend Booking Request #${bookingNumber}`, html });
}

// ─── BOOKING PENDING REVIEW ───────────────────────────────────
export async function sendBookingPendingReviewEmail(to: string, firstName: string, bookingNumber: string, reason: string, bookingId: string) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/customer/booking/${bookingId}`;
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } } });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) { console.error("Error formatting booking details for pending review email:", e); }

  const html = `
    <div style="text-align:center;padding:32px 0 24px;">
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Booking Under Review</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Hi ${firstName}, your booking request is currently under review by our team.</p>
    </div>
    <div style="background:#F3F4F6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:900;text-transform:uppercase;color:#9CA3AF;">Booking Reference</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:900;color:${BRAND_NAVY};">#${bookingNumber}</p>
    </div>
    <div style="background:#FFF7ED;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;color:#D97706;">Review Reason</p>
      <p style="margin:0;color:#92400E;font-size:15px;font-weight:600;">${reason}</p>
    </div>
    ${bookingDetailsHtml}
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${portalUrl}" style="display:block;width:100%;box-sizing:border-box;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:18px 24px;border-radius:12px;text-decoration:none;font-weight:900;font-size:16px;text-transform:uppercase;">View or Manage Your Booking</a>
    </div>
  `;
  return sendEmail({ to, subject: `Booking Under Review: Your Boston Legend Request #${bookingNumber}`, html });
}

// ─── CUSTOM QUOTE ─────────────────────────────────────────────
export async function sendCustomQuoteEmail(to: string, firstName: string, bookingNumber: string, bookingId: string) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/customer/booking/${bookingId}`;
  let bookingDetailsHtml = "";
  let bookingDateStr = "";
  let bookingStartTime = "";
  let bookingGuests = "200+";
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } } });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
    if (booking) { bookingDateStr = booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-US") : ""; bookingStartTime = booking.startTime || ""; bookingGuests = String(booking.guests); }
  } catch (e) { console.error("Error formatting booking details for custom quote email:", e); }

  const getWaLink = (waNumber: string) => {
    const msg = `Hello! I just submitted a Custom Quote request (Ref: #${bookingNumber}) for my event on ${bookingDateStr} at ${bookingStartTime} with ${bookingGuests} guests. Please review and provide the custom quote.`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  };

  const html = `
    <div style="text-align:center;padding:32px 0 24px;">
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Custom Quote Request Received</h2>
      <p style="margin:8px 0 0;color:#4B5563;font-size:16px;font-weight:600;line-height:1.5;">Hi ${firstName}, thank you for requesting a custom Boston Legend event package. Because your event is for more than 200 guests, our team will personally review your request before preparing your final quote.</p>
    </div>
    <div style="background:#F3F4F6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:900;text-transform:uppercase;color:#9CA3AF;">Booking Reference</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:900;color:${BRAND_NAVY};">#${bookingNumber}</p>
    </div>
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;color:#2563EB;">WhatsApp Contact</p>
      <p style="margin:0 0 16px;color:#1E3A8A;font-size:15px;font-weight:600;line-height:1.4;">We will contact you through WhatsApp: 📞 617-999-3803 · 📞 617-866-2727</p>
      <a href="${getWaLink('16179993803')}" style="display:block;background:#25D366;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:950;font-size:15px;margin-bottom:10px;text-align:center;">WhatsApp 617-999-3803</a>
      <a href="${getWaLink('16178662727')}" style="display:block;background:#25D366;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:950;font-size:15px;text-align:center;">WhatsApp 617-866-2727</a>
    </div>
    ${bookingDetailsHtml}
    <div style="text-align:center;margin:32px 0 24px;">
      <a href="${portalUrl}" style="display:block;width:100%;box-sizing:border-box;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:18px 24px;border-radius:12px;text-decoration:none;font-weight:950;font-size:16px;text-transform:uppercase;">View or Manage Your Request</a>
    </div>
  `;
  return sendEmail({ to, subject: `Custom Quote Request Received — Boston Legend`, html });
}

// ─── OWNER NOTIFICATIONS ────────────────────────────────────────
function formatEventDate(dateObj: Date | string | null | undefined) {
  if (!dateObj) return "";
  try { return new Date(dateObj).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }); } catch { return String(dateObj); }
}

export async function sendOwnerNewBookingEmail(booking: any) {
  const to = "info@bostonlegendicecreamtruck.com";
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/admin/bookings/${booking.id}`;
  const dateStr = formatEventDate(booking.eventDate);
  const subject = `New Booking Received – ${booking.customer?.firstName} ${booking.customer?.lastName} – ${dateStr}`;
  const html = `
    <h2 style="color:${BRAND_NAVY};margin-top:0;">New Booking Received</h2>
    <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;font-size:15px;color:#374151;">
      <tr><td width="35%" style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Customer Name</td><td style="border-bottom:1px solid #E5E7EB;">${booking.customer?.firstName} ${booking.customer?.lastName}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Phone Number</td><td style="border-bottom:1px solid #E5E7EB;">${booking.customer?.phone || 'N/A'}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Email Address</td><td style="border-bottom:1px solid #E5E7EB;">${booking.customer?.email || 'N/A'}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Event Date</td><td style="border-bottom:1px solid #E5E7EB;">${dateStr}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Start Time</td><td style="border-bottom:1px solid #E5E7EB;">${booking.startTime}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Package Selected</td><td style="border-bottom:1px solid #E5E7EB;">${booking.package?.name || 'Custom Package'}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Location</td><td style="border-bottom:1px solid #E5E7EB;">${booking.address}, ${booking.city} ${booking.zip}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Guest Count</td><td style="border-bottom:1px solid #E5E7EB;">${booking.guests}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Status</td><td style="border-bottom:1px solid #E5E7EB;">${booking.status}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Special Requests</td><td style="border-bottom:1px solid #E5E7EB;">${booking.notes || 'None'}</td></tr>
    </table>
    <br/>
    <div style="text-align:center;">
      <a href="${portalUrl}" style="display:inline-block;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View Booking</a>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendOwnerRequiresApprovalEmail(booking: any) {
  const to = "info@bostonlegendicecreamtruck.com";
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/admin/bookings/${booking.id}`;
  const html = `
    <h2 style="color:${BRAND_NAVY};margin-top:0;">Booking Awaiting Approval</h2>
    <p>The following booking requires manual approval:</p>
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:15px;color:#374151;">
      <tr><td width="35%" style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Customer Name</td><td style="border-bottom:1px solid #E5E7EB;">${booking.customer?.firstName} ${booking.customer?.lastName}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Date</td><td style="border-bottom:1px solid #E5E7EB;">${formatEventDate(booking.eventDate)}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Package</td><td style="border-bottom:1px solid #E5E7EB;">${booking.package?.name || 'Custom Package'}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Booking ID</td><td style="border-bottom:1px solid #E5E7EB;">${booking.bookingNumber}</td></tr>
    </table>
    <br/><div style="text-align:center;"><a href="${portalUrl}" style="display:inline-block;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Approve Booking</a></div>
  `;
  return sendEmail({ to, subject: `Booking Awaiting Approval`, html });
}

export async function sendOwnerLateBookingAlert(booking: any) {
  const to = "info@bostonlegendicecreamtruck.com";
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/admin/bookings/${booking.id}`;
  const html = `
    <h2 style="color:#DC2626;margin-top:0;">⚠️ URGENT – Last Minute Booking</h2>
    <p>A booking was just created for an event starting in less than 24 hours.</p>
    <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;font-size:15px;color:#374151;">
      <tr><td width="35%" style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Customer Name</td><td style="border-bottom:1px solid #E5E7EB;">${booking.customer?.firstName} ${booking.customer?.lastName}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Event Date</td><td style="border-bottom:1px solid #E5E7EB;">${formatEventDate(booking.eventDate)}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Start Time</td><td style="border-bottom:1px solid #E5E7EB;">${booking.startTime}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Location</td><td style="border-bottom:1px solid #E5E7EB;">${booking.address}, ${booking.city} ${booking.zip}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Package</td><td style="border-bottom:1px solid #E5E7EB;">${booking.package?.name || 'Custom Package'}</td></tr>
    </table>
    <br/><div style="text-align:center;"><a href="${portalUrl}" style="display:inline-block;background:#DC2626;color:#FFFFFF;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View Urgent Booking</a></div>
  `;
  return sendEmail({ to, subject: `URGENT – Last Minute Booking`, html });
}

export async function sendOwnerEventReminderEmail(booking: any) {
  const to = "info@bostonlegendicecreamtruck.com";
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com'}/admin/bookings/${booking.id}`;
  const html = `
    <h2 style="color:${BRAND_NAVY};margin-top:0;">Upcoming Event Tomorrow</h2>
    <p>This is a 24-hour reminder for the following upcoming event:</p>
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:15px;color:#374151;">
      <tr><td width="35%" style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Customer Name</td><td style="border-bottom:1px solid #E5E7EB;">${booking.customer?.firstName} ${booking.customer?.lastName}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Date</td><td style="border-bottom:1px solid #E5E7EB;">${formatEventDate(booking.eventDate)}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Time</td><td style="border-bottom:1px solid #E5E7EB;">${booking.startTime}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Address</td><td style="border-bottom:1px solid #E5E7EB;">${booking.address}, ${booking.city} ${booking.zip}</td></tr>
      <tr><td style="font-weight:bold;border-bottom:1px solid #E5E7EB;">Package</td><td style="border-bottom:1px solid #E5E7EB;">${booking.package?.name || 'Custom Package'}</td></tr>
    </table>
    <br/><div style="text-align:center;"><a href="${portalUrl}" style="display:inline-block;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Review Booking Details</a></div>
  `;
  return sendEmail({ to, subject: `Upcoming Event Tomorrow`, html });
}

// ─── INQUIRY REPLY / ESCALATION ──────────────────────────────
export async function sendChatEscalationOwnerEmail(inquiry: { id: string; name: string; email: string; phone?: string | null; notes?: string | null; pageUrl?: string | null; createdAt?: Date | string; }) {
  const OWNER_EMAIL = "info@bostonlegendicecreamtruck.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonlegendicecreamtruck.com';
  const inquiryUrl = `${siteUrl}/admin/inquiries`;
  const timestamp = inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  const html = `
    <div style="text-align:center;padding:24px 0 20px;">
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Human Support Requested</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">A customer needs live assistance via the AI Chat Widget.</p>
    </div>
    <table width="100%" cellpadding="12" cellspacing="0" style="font-size:15px;color:#374151;border-collapse:collapse;margin-bottom:24px;background:#F8F9FC;border-radius:12px;">
      <tr><td width="35%" style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #E5E7EB;">Customer Name</td><td style="border-bottom:1px solid #E5E7EB;font-weight:600;">${inquiry.name}</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #E5E7EB;">Email</td><td style="border-bottom:1px solid #E5E7EB;font-weight:600;"><a href="mailto:${inquiry.email}" style="color:${BRAND_NAVY};font-weight:700;">${inquiry.email}</a></td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #E5E7EB;">Phone</td><td style="border-bottom:1px solid #E5E7EB;font-weight:600;">${inquiry.phone || 'Not provided'}</td></tr>
      <tr><td style="font-weight:800;color:${BRAND_NAVY};">Timestamp</td><td style="font-weight:600;">${timestamp}</td></tr>
    </table>
    ${inquiry.notes ? `<div style="background:#FFFBEB;border:1px solid ${BRAND_GOLD};border-radius:12px;padding:16px 20px;margin-bottom:24px;"><p style="margin:0 0 8px;font-size:12px;font-weight:900;text-transform:uppercase;color:#92400E;">Chat Context</p><p style="margin:0;color:#374151;font-size:14px;font-weight:600;white-space:pre-wrap;">${inquiry.notes}</p></div>` : ''}
    <div style="text-align:center;margin-top:16px;">
      <a href="${inquiryUrl}" style="display:block;width:100%;box-sizing:border-box;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:18px 24px;border-radius:12px;text-decoration:none;font-weight:900;font-size:16px;text-transform:uppercase;">View Conversation in Admin Inbox</a>
    </div>
  `;
  return sendEmail({ to: OWNER_EMAIL, subject: `🚨 Human Support Requested — ${inquiry.name}`, html, title: "Human Support Requested" });
}

// ─── GOOGLE REVIEW REQUEST ────────────────────────────────────
const GOOGLE_REVIEW_URL = "https://g.page/r/CWDhxc3sMbFAEAI/review";

export async function sendGoogleReviewRequestEmail(booking: { id: string; bookingNumber: string; eventDate: Date; eventType: string; customer: { firstName: string; lastName: string; email: string }; package?: { name: string } | null; }) {
  const customerName = `${booking.customer.firstName}`;
  const packageName = booking.package?.name ?? "Ice Cream Truck";
  const eventDate = new Date(booking.eventDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const html = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:56px;line-height:1;margin-bottom:16px;">🍦⭐</div>
      <h1 style="font-size:26px;font-weight:900;color:${BRAND_NAVY};margin:0 0 8px;">Thank You, ${customerName}!</h1>
      <p style="font-size:15px;color:#6B7280;font-weight:600;margin:0;">We hope your event was absolutely delicious.</p>
    </div>
    <div style="background:#FFFBEB;border:2px solid #FEF3C7;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:15px;color:#92400E;font-weight:700;margin:0 0 4px;">Your recent event</p>
      <p style="font-size:20px;font-weight:900;color:${BRAND_NAVY};margin:0;">${packageName} — ${eventDate}</p>
    </div>
    <p style="font-size:16px;color:#374151;font-weight:600;line-height:1.7;margin-bottom:20px;">
      It was a pleasure serving your event! If you enjoyed your Boston Legend experience, we'd be incredibly grateful if you could take 30 seconds to leave us a review on Google. It really helps other families and businesses discover us!
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${GOOGLE_REVIEW_URL}" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_NAVY};padding:18px 40px;border-radius:50px;text-decoration:none;font-weight:900;font-size:17px;box-shadow:0 8px 20px rgba(255,160,0,0.35);">⭐ Leave a Google Review</a>
    </div>
    <p style="font-size:13px;color:#9CA3AF;font-weight:600;text-align:center;margin-top:20px;">Takes less than 30 seconds — and it means the world to our small business! 🙏</p>
    <div style="margin-top:24px;padding:16px;background:#F9FAFB;border-radius:12px;text-align:center;">
      <p style="font-size:13px;color:#6B7280;font-weight:600;margin:0 0 4px;">Need anything else?</p>
      <a href="https://www.bostonlegendicecreamtruck.com/packages" style="color:${BRAND_GOLD};font-weight:800;font-size:14px;">Book your next event →</a>
    </div>
  `;
  return sendEmail({ to: booking.customer.email, subject: `${customerName}, thank you for choosing Boston Legend! ⭐`, html, title: "Thank You — Boston Legend Ice Cream Truck" });
}

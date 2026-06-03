import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const BRAND_NAVY = "#000223";
const BRAND_GOLD = "#FFA000";
const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

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
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F4F4F5;padding:40px 16px;">
        <tr><td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.05);">
            
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

export async function sendEmail({ to, subject, html, title }: { to: string; subject: string; html: string; title?: string }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Boston Legend Ice Cream" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: baseTemplate(html, title || subject),
    });
    return true;
  } catch (err) {
    console.error("[Email Error]", err);
    return false;
  }
}

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

  // Try to use the unified snapshotJson first
  let breakdown: any = {};
  try {
    if (quote?.snapshotJson) {
      breakdown = JSON.parse(quote.snapshotJson);
    }
  } catch (e) {
    console.error("Failed to parse quote snapshot JSON in email:", e);
  }

  // Fallbacks if not present in snapshot
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
  const additionalLocationServiceFee = breakdown.additionalLocationServiceFee ?? additionalStopsFee;

  return `
    <!-- Event Summary -->
    <h3 style="margin:24px 0 12px;color:${BRAND_NAVY};font-size:18px;font-weight:800;border-bottom:2px solid #F3F4F6;padding-bottom:8px;">Event Summary</h3>
    <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom:24px;font-size:14px;color:#4B5563;">
      <tr>
        <td width="35%" style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Event Type</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${booking.eventType}</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Package</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${pkg?.name || 'Custom Package'}</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Date & Time</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${formatEnDate(booking.eventDate)} at ${booking.startTime}</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Included Service Time</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${pkgDurationMins} minutes</td>
      </tr>
      ${extraServiceMins > 0 ? `
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Additional Service Time</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">+${extraServiceMins} minutes</td>
      </tr>` : ''}
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Included Guests</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${pkgServings} guests</td>
      </tr>
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
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Garage Origin</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">Boston Revere — 84 Fernwood Ave</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Total Distance</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${distanceMiles.toFixed(1)} miles</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Free Travel Zone</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">First 10.0 miles FREE</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Billable Distance</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${billableMiles.toFixed(1)} miles</td>
      </tr>
    </table>

    <!-- Pricing Breakdown -->
    <h3 style="margin:0 0 12px;color:${BRAND_NAVY};font-size:18px;font-weight:800;border-bottom:2px solid #F3F4F6;padding-bottom:8px;">Pricing & Travel Fee</h3>
    ${(booking.package?.slug === "custom-event-package" || booking.packageId === "custom-event-package" || booking.package?.name === "Custom Event Package") ? `
    <div style="background:#FFF9F0;border:1px dashed #FFA000;border-radius:12px;padding:16px 20px;margin-bottom:24px;font-size:15px;color:#92400E;font-weight:700;">
      Custom Quote Pending — our team will review your guest count, vehicle needs, route, timing, and event details before preparing your final quote.
    </div>
    ` : `
    <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom:24px;font-size:14px;color:#4B5563;background:#F8F9FC;border-radius:12px;">
      <tr>
        <td width="70%" style="font-weight:600;">Base Package Price</td>
        <td width="30%" align="right" style="font-weight:800;color:${BRAND_NAVY};">$${basePrice.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight:600;color:#6B7280;font-size:13px;">Included: ${pkgServings} guests, ${pkgDurationMins} min</td>
        <td align="right" style="font-weight:700;color:#6B7280;font-size:13px;"></td>
      </tr>
      ${extraGuestsFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Extra Guests Fee (${extraGuestsCount} × $${extraPiecePrice})</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${extraGuestsFee.toFixed(2)}</td>
      </tr>` : ''}
      ${additionalStopsFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Additional Stops (${additionalStopsCount})</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${additionalStopsFee.toFixed(2)}</td>
      </tr>` : ''}
      ${extraServiceFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Additional Service Time (${extraServiceMins} min)</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${extraServiceFee.toFixed(2)}</td>
      </tr>` : ''}
      ${overtimeFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Overtime Fee</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${overtimeFee.toFixed(2)}</td>
      </tr>` : ''}
      ${travelFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Travel Fee</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${travelFee.toFixed(2)}</td>
      </tr>` : ''}
      ${additionalVehicleSetupFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Additional Vehicle Setup Fee</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${additionalVehicleSetupFee.toFixed(2)}</td>
      </tr>` : ''}
      ${weekendFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Weekend Event Fee</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${weekendFee.toFixed(2)}</td>
      </tr>` : ''}
      <tr>
        <td style="font-weight:900;color:${BRAND_NAVY};border-top:2px solid #E5E7EB;padding-top:12px;">Total Estimated Price</td>
        <td align="right" style="font-weight:900;color:${BRAND_GOLD};font-size:18px;border-top:2px solid #E5E7EB;padding-top:12px;">$${estimatedTotal.toFixed(2)}</td>
      </tr>
    </table>
    `}

    ${weekendFee > 0 ? `
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#1E40AF;font-weight:600;">
      📅 Weekend Event Fee applies because your event is scheduled on Saturday or Sunday.
    </div>
    ` : ''}

    <!-- Payment Policy -->
    <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:700;">💳 Payment Policy: Payment is collected after the service. We accept multiple payment methods.</p>
    </div>
  `;
}

export async function sendBookingApprovedEmail(to: string, firstName: string, bookingNumber: string, paymentUrl: string, amount: string, bookingId: string) {
  const portalUrl = `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/customer/booking/${bookingId}`;
  
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } }
    });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) {
    console.error("Error formatting booking details for approved email:", e);
  }

  const html = `
    <h2 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:28px;font-weight:900;">Legendary News, ${firstName}! 🎉</h2>
    <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
      Your reservation **#${bookingNumber}** has been officially **APPROVED**. We can't wait to sweeten your event!
    </p>
    
    <div style="background:#ECFDF5;border:2px solid #10B981;border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;">
      <p style="margin:0 0 4px;color:#065F46;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Estimated Total</p>
      <p style="margin:0 0 10px;color:${BRAND_NAVY};font-size:36px;font-weight:900;">$${amount}</p>
      <p style="margin:0;color:#047857;font-size:14px;font-weight:700;">Payment is collected after the service. We accept multiple payment methods.</p>
    </div>
    
    ${bookingDetailsHtml}
    
    <div style="text-align:center;margin-top:20px;padding:15px;background:#F8F9FC;border-radius:12px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${BRAND_NAVY};">Need to change or cancel details?</p>
      <a href="${portalUrl}" style="color:${BRAND_GOLD};font-weight:900;text-decoration:underline;font-size:14px;">Access Your Booking Portal →</a>
    </div>
  `;
  return sendEmail({ to, subject: `Approved: Your Boston Legend Booking #${bookingNumber}`, html });
}

export async function sendBookingPendingEmail(
  to: string, 
  firstName: string, 
  bookingNumber: string, 
  details: any,
  bookingId: string
) {
  const portalUrl = `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/customer/booking/${bookingId}`;
  
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } }
    });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) {
    console.error("Error formatting booking details for pending email:", e);
  }

  const html = `
    <h2 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:24px;font-weight:900;">Your Boston Legend Booking Request</h2>
    <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
      Hello ${firstName},<br/><br/>
      We've received your request for a Boston Legend ice cream truck. Our concierge team is currently reviewing the details to ensure a flawless experience.
    </p>

    <!-- Booking Number Badge -->
    <div style="background:#FFFBEB;border:1px solid ${BRAND_GOLD};border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 4px;color:#92400E;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
      <p style="margin:0;color:${BRAND_NAVY};font-size:24px;font-weight:900;">#${bookingNumber}</p>
    </div>

    ${bookingDetailsHtml}

    <!-- Policies & Call to Action -->
    <div style="background:#FFFBEB;border:1px solid ${BRAND_GOLD};border-radius:12px;padding:20px;margin-bottom:24px;font-size:13px;line-height:1.6;color:#92400E;text-align:left;">
      <p style="margin:0 0 8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${BRAND_NAVY};">📍 Travel & Distance Policy</p>
      <p style="margin:0 0 12px;font-weight:600;">The first 10 miles are free. Any additional miles will be calculated based on the travel distance from our garage at Boston Revere, 84 Fernwood Ave to your event location.</p>
      
      <p style="margin:0 0 8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${BRAND_NAVY};">👥 Extra Guests Policy</p>
      <p style="margin:0 0 12px;font-weight:600;">If your guest count increases, we’ll be prepared. Extra guests beyond the included package count are calculated at $5 per person.</p>
      
      <p style="margin:0 0 8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${BRAND_NAVY};">💳 Payment Policy</p>
      <p style="margin:0;font-weight:600;">Payment is collected after the service. We accept multiple payment methods.</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 16px;color:#4B5563;font-size:14px;font-weight:600;">
        You will hear from us shortly with final confirmation.
      </p>
      <a href="${portalUrl}" style="display:inline-block;background:${BRAND_NAVY};color:white;padding:14px 28px;border-radius:24px;text-decoration:none;font-weight:800;font-size:14px;">View Request Status & Portal</a>
    </div>

    <div style="background:#F3F4F6;border-radius:12px;padding:20px;text-align:center;">
      <p style="margin:0;color:#6B7280;font-size:13px;font-weight:600;">
        Questions? Call us directly at <a href="tel:617-999-3803" style="color:${BRAND_NAVY};text-decoration:none;font-weight:800;">617-999-3803</a>.
      </p>
    </div>
  `;
  return sendEmail({ to, subject: `Your Boston Legend Booking Request #${bookingNumber}`, html });
}

export async function sendBookingRejectedEmail(
  to: string,
  firstName: string,
  bookingNumber: string,
  reason: string,
  bookingId: string
) {
  const portalUrl = `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/customer/booking/${bookingId}`;
  
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } }
    });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) {
    console.error("Error formatting booking details for rejected email:", e);
  }

  const html = `
    <div style="text-align:center;padding:32px 0 24px;">
      <div style="width:72px;height:72px;border-radius:50%;background:#FEF2F2;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        <span style="font-size:32px;">ℹ️</span>
      </div>
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Update Needed for Your Request</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Hi ${firstName}, thank you for choosing Boston Legend. We reviewed your request and it needs a quick adjustment before we can confirm it.</p>
    </div>

    <div style="background:#F3F4F6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;">Booking Reference</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:900;color:${BRAND_NAVY};">#${bookingNumber}</p>
    </div>

    <div style="background:#FFF7ED;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#D97706;">Details / Reason</p>
      <p style="margin:0;color:#92400E;font-size:15px;font-weight:600;">${reason}</p>
    </div>

    ${bookingDetailsHtml}

    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 16px;color:#4B5563;font-size:14px;font-weight:600;">
        You can still update your request using the link below, and our team will be happy to review it again.
      </p>
      <a href="${portalUrl}" style="display:inline-block;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:16px 32px;border-radius:32px;text-decoration:none;font-weight:900;font-size:15px;box-shadow:0 10px 20px rgba(0,2,35,0.15);">Update My Booking Request →</a>
    </div>
  `;
  return sendEmail({ to, subject: `Update Needed: Your Boston Legend Booking Request #${bookingNumber}`, html });
}

export async function sendBookingPendingReviewEmail(
  to: string,
  firstName: string,
  bookingNumber: string,
  reason: string,
  bookingId: string
) {
  const portalUrl = `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/customer/booking/${bookingId}`;
  
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } }
    });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) {
    console.error("Error formatting booking details for pending review email:", e);
  }

  const html = `
    <div style="text-align:center;padding:32px 0 24px;">
      <div style="width:72px;height:72px;border-radius:50%;background:#FFFBEB;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        <span style="font-size:32px;">⏳</span>
      </div>
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Booking Under Review</h2>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Hi ${firstName}, thank you for choosing Boston Legend. Your booking request is currently under review by our team.</p>
    </div>

    <div style="background:#F3F4F6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;">Booking Reference</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:900;color:${BRAND_NAVY};">#${bookingNumber}</p>
    </div>

    <div style="background:#FFF7ED;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#D97706;">Review Reason</p>
      <p style="margin:0;color:#92400E;font-size:15px;font-weight:600;">${reason}</p>
    </div>

    ${bookingDetailsHtml}

    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 16px;color:#4B5563;font-size:14px;font-weight:600;">
        You can check the current status, update details, or message our team using the link below.
      </p>
      <a href="${portalUrl}" style="display:inline-block;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:16px 32px;border-radius:32px;text-decoration:none;font-weight:900;font-size:15px;box-shadow:0 10px 20px rgba(0,2,35,0.15);">View or Manage Your Booking →</a>
    </div>
  `;
  return sendEmail({ to, subject: `Booking Under Review: Your Boston Legend Request #${bookingNumber}`, html });
}

export async function sendCustomQuoteEmail(
  to: string,
  firstName: string,
  bookingNumber: string,
  bookingId: string
) {
  const portalUrl = `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/customer/booking/${bookingId}`;
  
  let bookingDetailsHtml = "";
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, package: true, quote: true, stops: { orderBy: { stopOrder: 'asc' } } }
    });
    bookingDetailsHtml = formatBookingDetailsHtml(booking);
  } catch (e) {
    console.error("Error formatting booking details for custom quote email:", e);
  }

  const html = `
    <div style="text-align:center;padding:32px 0 24px;">
      <div style="width:72px;height:72px;border-radius:50%;background:#FFFBEB;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        <span style="font-size:32px;">🍦</span>
      </div>
      <h2 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Custom Quote Request Received</h2>
      <p style="margin:0;color:#6B7280;font-size:16px;font-weight:600;line-height:1.5;">Hi ${firstName},</p>
      <p style="margin:8px 0 0;color:#4B5563;font-size:16px;font-weight:600;line-height:1.5;">
        Thank you for requesting a custom Boston Legend event package.
      </p>
      <p style="margin:8px 0 0;color:#4B5563;font-size:16px;font-weight:600;line-height:1.5;">
        Because your event is for more than 200 guests, our team will personally review your guest count, location, route, timing, vehicle needs, and any special notes before preparing your final quote.
      </p>
    </div>

    <div style="background:#F3F4F6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;">Booking Reference</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:900;color:${BRAND_NAVY};">#${bookingNumber}</p>
    </div>

    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#2563EB;">WhatsApp Contact</p>
      <p style="margin:0 0 12px;color:#1E3A8A;font-size:15px;font-weight:600;line-height:1.4;">
        We will contact you through WhatsApp using one of our official numbers:
      </p>
      <p style="margin:0 0 16px;color:#1E3A8A;font-size:15px;font-weight:700;line-height:1.4;">
        📞 617-999-3803<br/>
        📞 781-921-3233<br/>
        📞 617-866-2727
      </p>
      <p style="margin:0 0 12px;color:#1E3A8A;font-size:15px;font-weight:600;line-height:1.4;">
        You can also message us anytime using the WhatsApp buttons below:
      </p>
      <div style="text-align:center;">
        <a href="https://wa.me/16179993803" style="display:block;background:#25D366;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:950;font-size:15px;margin-bottom:10px;text-align:center;">WhatsApp 617-999-3803</a>
        <a href="https://wa.me/17819213233" style="display:block;background:#25D366;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:950;font-size:15px;margin-bottom:10px;text-align:center;">WhatsApp 781-921-3233</a>
        <a href="https://wa.me/16178662727" style="display:block;background:#25D366;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:950;font-size:15px;margin-bottom:10px;text-align:center;">WhatsApp 617-866-2727</a>
      </div>
    </div>

    ${bookingDetailsHtml}

    <div style="text-align:center;margin:32px 0 24px;">
      <p style="margin:0 0 16px;color:#4B5563;font-size:14px;font-weight:600;">
        You can check the current status, update details, or message our team using the link below.
      </p>
      <a href="${portalUrl}" style="display:inline-block;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:16px 32px;border-radius:32px;text-decoration:none;font-weight:900;font-size:15px;box-shadow:0 10px 20px rgba(0,2,35,0.15);">View or Manage Your Request →</a>
    </div>
  `;
  return sendEmail({ to, subject: `Custom Quote Request Received — Boston Legend`, html });
}



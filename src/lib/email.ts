import nodemailer from "nodemailer";

const BRAND_NAVY = "#000223";
const BRAND_GOLD = "#FFA000";
const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
              <td style="padding:48px 48px 40px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#F8F9FC;padding:32px 48px;text-align:center;border-top:1px solid #EEEEEE;">
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

export async function sendBookingApprovedEmail(to: string, firstName: string, bookingNumber: string, paymentUrl: string, amount: string) {
  const html = `
    <h2 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:28px;font-weight:900;">Legendary News, ${firstName}! 🎉</h2>
    <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
      Your ice cream truck reservation **#${bookingNumber}** has been officially **APPROVED**. We can't wait to sweeten your event!
    </p>
    
    <div style="background:#FFFBEB;border:2px solid ${BRAND_GOLD};border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;">
      <p style="margin:0 0 4px;color:#92400E;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Total Amount Due</p>
      <p style="margin:0 0 20px;color:${BRAND_NAVY};font-size:36px;font-weight:900;">$${amount}</p>
      <a href="${paymentUrl}" style="display:inline-block;background:${BRAND_NAVY};color:${BRAND_GOLD};padding:16px 32px;border-radius:32px;text-decoration:none;font-weight:900;font-size:15px;box-shadow:0 10px 20px rgba(0,2,35,0.15);">Complete Secure Payment →</a>
    </div>

    <p style="margin:0;color:#6B7280;font-size:14px;font-weight:500;">
      Please complete the payment within 24 hours to finalize your date. Once paid, you'll receive a final confirmation with driver details.
    </p>
  `;
  return sendEmail({ to, subject: `Approved: Your Boston Legend Booking #${bookingNumber}`, html });
}

export async function sendBookingPendingEmail(
  to: string, 
  firstName: string, 
  bookingNumber: string, 
  details: {
    eventDate: string;
    startTime: string;
    durationMins: number;
    guests: number;
    eventType: string;
    address: string;
    city: string;
    zip: string;
    packageName: string;
    basePrice: number;
    extraServingsFee: number;
    travelFee: number;
    overtimeFee: number;
    totalAmount: number;
  }
) {
  const formatEnDate = (d: string) => {
    if (!d) return "";
    try {
      const parts = typeof d === 'string' ? d.split("T")[0].split("-") : [];
      if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
      return new Date(d).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch { return String(d); }
  };

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

    <!-- Event Details -->
    <h3 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:18px;font-weight:800;border-bottom:2px solid #F3F4F6;padding-bottom:8px;">Event Summary</h3>
    <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom:24px;font-size:14px;color:#4B5563;">
      <tr>
        <td width="35%" style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Event Type</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${details.eventType}</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Package</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${details.packageName || 'Custom Package'}</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Date & Time</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${formatEnDate(details.eventDate)} at ${details.startTime}</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Duration</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${details.durationMins} minutes</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Guests</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${details.guests}</td>
      </tr>
      <tr>
        <td style="font-weight:800;color:${BRAND_NAVY};border-bottom:1px solid #F3F4F6;">Location</td>
        <td style="border-bottom:1px solid #F3F4F6;font-weight:600;">${details.address}, ${details.city} ${details.zip}</td>
      </tr>
    </table>

    <!-- Pricing Breakdown -->
    <h3 style="margin:0 0 16px;color:${BRAND_NAVY};font-size:18px;font-weight:800;border-bottom:2px solid #F3F4F6;padding-bottom:8px;">Pricing Estimate</h3>
    <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom:32px;font-size:14px;color:#4B5563;background:#F8F9FC;border-radius:12px;">
      <tr>
        <td width="70%" style="font-weight:600;">Base Package</td>
        <td width="30%" align="right" style="font-weight:800;color:${BRAND_NAVY};">$${details.basePrice.toFixed(2)}</td>
      </tr>
      ${details.extraServingsFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Extra Servings</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${details.extraServingsFee.toFixed(2)}</td>
      </tr>` : ''}
      ${details.overtimeFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Overtime Fee</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${details.overtimeFee.toFixed(2)}</td>
      </tr>` : ''}
      ${details.travelFee > 0 ? `
      <tr>
        <td style="font-weight:600;">Travel Fee</td>
        <td align="right" style="font-weight:800;color:${BRAND_NAVY};">+$${details.travelFee.toFixed(2)}</td>
      </tr>` : ''}
      <tr>
        <td style="font-weight:900;color:${BRAND_NAVY};border-top:2px solid #E5E7EB;padding-top:12px;">Total Estimate</td>
        <td align="right" style="font-weight:900;color:${BRAND_GOLD};font-size:18px;border-top:2px solid #E5E7EB;padding-top:12px;">$${details.totalAmount.toFixed(2)}</td>
      </tr>
    </table>

    <!-- Status & Call to Action -->
    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 16px;color:#4B5563;font-size:14px;font-weight:600;">
        You will hear from us within <strong>2-4 hours</strong> with final approval. No payment is required until then.
      </p>
      <a href="https://boston-legend.vercel.app/booking/status/${bookingNumber}" style="display:inline-block;background:${BRAND_NAVY};color:white;padding:14px 28px;border-radius:24px;text-decoration:none;font-weight:800;font-size:14px;">View Request Status</a>
    </div>

    <div style="background:#F3F4F6;border-radius:12px;padding:20px;text-align:center;">
      <p style="margin:0;color:#6B7280;font-size:13px;font-weight:600;">
        Questions? Call us directly at <a href="tel:617-999-3803" style="color:${BRAND_NAVY};text-decoration:none;font-weight:800;">617-999-3803</a> or <a href="tel:781-921-3233" style="color:${BRAND_NAVY};text-decoration:none;font-weight:800;">781-921-3233</a>.
      </p>
    </div>
  `;
  return sendEmail({ to, subject: `Your Boston Legend Booking Request #${bookingNumber}`, html });
}

// ─── Booking Rejected (Admin Decision) ─────────────────────────────────────
export async function sendBookingRejectedEmail(
  to: string,
  firstName: string,
  bookingNumber: string,
  reason: string
) {
  const html = baseTemplate(`
    <div style="text-align:center;padding:32px 0 24px;">
      <div style="width:72px;height:72px;border-radius:50%;background:#FEF2F2;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        <span style="font-size:32px;">❌</span>
      </div>
      <h1 style="margin:0 0 8px;color:${BRAND_NAVY};font-size:26px;font-weight:900;">Booking Not Available</h1>
      <p style="margin:0;color:#6B7280;font-size:15px;font-weight:600;">Hi ${firstName}, we're sorry we couldn't accommodate your request.</p>
    </div>

    <div style="background:#FEF2F2;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;">Booking Reference</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:900;color:${BRAND_NAVY};">#${bookingNumber}</p>
    </div>

    <div style="background:#FFF7ED;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#D97706;">Reason</p>
      <p style="margin:0;color:#92400E;font-size:15px;font-weight:600;">${reason}</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 16px;color:#4B5563;font-size:14px;font-weight:600;">
        We'd love to find an alternative that works for you. Please contact us to discuss other options.
      </p>
      <a href="https://boston-legend.com/booking" style="display:inline-block;background:${BRAND_NAVY};color:white;padding:14px 28px;border-radius:24px;text-decoration:none;font-weight:800;font-size:14px;">Book Again</a>
    </div>

    <div style="background:#F3F4F6;border-radius:12px;padding:20px;text-align:center;">
      <p style="margin:0;color:#6B7280;font-size:13px;font-weight:600;">
        Questions? Call us at <a href="tel:617-999-3803" style="color:${BRAND_NAVY};text-decoration:none;font-weight:800;">617-999-3803</a>
      </p>
    </div>
  `, `Boston Legend Booking Update #${bookingNumber}`);
  return sendEmail({ to, subject: `Update on Your Boston Legend Booking #${bookingNumber}`, html });
}


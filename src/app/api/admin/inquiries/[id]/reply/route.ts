export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "bookings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { subject, body } = await req.json();

    const inquiry = await prisma.inquiry.findUnique({ where: { id: params.id } });
    if (!inquiry) return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });

    // Ensure we have a real email address
    if (!inquiry.email || inquiry.email === "Not provided") {
      return NextResponse.json({ 
        success: false, 
        error: "No valid email address found for this inquiry. The customer did not provide an email." 
      }, { status: 400 });
    }

    const replySubject = subject || "Boston Legend Support Response";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bostonlegendicecreamtruck.com";
    
    const emailSent = await sendEmail({
      to: inquiry.email,
      subject: replySubject,
      html: `
        <h2 style="margin:0 0 8px;color:#000223;font-size:24px;font-weight:900;">Hi ${inquiry.name}, 👋</h2>
        <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6;font-weight:600;">
          Thank you for reaching out to Boston Legend Ice Cream Truck. Here is our response to your inquiry:
        </p>

        <div style="background:#F8F9FC;border-left:4px solid #FFA000;border-radius:4px 12px 12px 4px;padding:20px 24px;margin-bottom:28px;">
          <p style="margin:0;color:#1F2937;font-size:16px;font-weight:600;white-space:pre-wrap;line-height:1.7;">${body}</p>
        </div>

        <div style="background:#FFFBEB;border:1px solid #FFA000;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;color:#92400E;font-size:14px;font-weight:700;">
            💬 Need more help? Reply to this email or contact us directly:
            <br/>📞 <a href="tel:6179993803" style="color:#000223;font-weight:900;">617-999-3803</a>
            &nbsp;|&nbsp;
            📞 <a href="tel:6178662727" style="color:#000223;font-weight:900;">617-866-2727</a>
          </p>
        </div>

        <div style="text-align:center;">
          <a href="${siteUrl}/packages" style="display:inline-block;background:#000223;color:#FFA000;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:900;font-size:15px;">
            View Our Packages →
          </a>
        </div>

        <p style="margin:24px 0 0;color:#9CA3AF;font-size:13px;font-weight:700;text-align:center;">
          Boston Legend Ice Cream Concierge Team
        </p>
      `,
      title: replySubject,
    });

    if (!emailSent) {
      return NextResponse.json({ success: false, error: "Failed to send email. SMTP transporter returned failure." }, { status: 500 });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        entityType: "INQUIRY",
        entityId: inquiry.id,
        action: "REPLY_SENT_VIA_EMAIL",
        metadataJson: JSON.stringify({ subject: replySubject, bodyLength: body.length }),
      }
    });

    // Update status to IN_PROGRESS after reply
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json({ success: true, message: "Email sent successfully", data: updatedInquiry });
  } catch (error) {
    console.error("Failed to send email reply", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}


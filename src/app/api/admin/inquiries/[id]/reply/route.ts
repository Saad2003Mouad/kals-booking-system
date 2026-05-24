export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPermission, unauthorized } from "@/lib/rbac";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hasAccess = await checkPermission(req, "manage_inquiries");
    if (!hasAccess) return unauthorized();

    const { subject, body } = await req.json();

    const inquiry = await prisma.inquiry.findUnique({ where: { id: params.id } });
    if (!inquiry) return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });

    // Ensure we have an email
    if (!inquiry.email) {
      return NextResponse.json({ success: false, error: "No email address found for this inquiry" }, { status: 400 });
    }

    // Send email using Nodemailer
    const emailSent = await sendEmail({
      to: inquiry.email,
      subject: subject || "Reply from Boston Legend",
      html: `
        <div style="font-family: 'Nunito', sans-serif; font-size: 16px; color: #000223; line-height: 1.6;">
          <p>Hi ${inquiry.name},</p>
          <div style="white-space: pre-wrap; color: #4B5563; margin-top: 15px; margin-bottom: 25px;">
            ${body}
          </div>
          <p style="margin: 0; font-size: 14px; color: #9CA3AF; font-weight: 700;">
            Boston Legend Ice Cream Concierge Team
          </p>
        </div>
      `,
      title: subject || "Reply from Boston Legend"
    });

    if (!emailSent) {
      return NextResponse.json({ success: false, error: "Failed to send email. SMTP transporter returned failure." }, { status: 500 });
    }

    // Create an audit log of the reply
    await prisma.auditLog.create({
      data: {
        entityType: "INQUIRY",
        entityId: inquiry.id,
        action: "REPLY_SENT_VIA_EMAIL",
        metadataJson: JSON.stringify({ subject, bodyLength: body.length })
      }
    });

    // Optionally update inquiry status to IN_PROGRESS or RESOLVED
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { status: "IN_PROGRESS" }
    });

    return NextResponse.json({ success: true, message: "Email sent successfully", data: updatedInquiry });
  } catch (error) {
    console.error("Failed to send email reply", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}

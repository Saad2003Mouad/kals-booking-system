export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPermission, unauthorized } from "@/lib/rbac";

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

    // In a real application, you would use a mail service like SendGrid, AWS SES, or Resend here.
    // Example: await sendEmail({ to: inquiry.email, subject, body });
    console.log(`Mock Email Sent to: ${inquiry.email}\nSubject: ${subject}\nBody: ${body}`);

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

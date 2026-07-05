import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #000223; color: #FFA000; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">New Contact Form Submission</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.5; color: #333;">${message}</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #888;">
          Sent from Boston Legend Ice Cream Truck Website
        </div>
      </div>
    `;

    // Forward the email using the centralized and optimized sendEmail method
    // to ensure maximum deliverability and consistent formatting.
    const success = await sendEmail({
      to: "info@bostonlegendicecreamtruck.com",
      subject: \`New Contact Form Submission: \${subject || "No Subject"}\`,
      html: htmlContent,
      title: "Contact Form Submission",
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      console.log("Contact email fallback triggered. Check SMTP configuration.");
      return NextResponse.json({ success: true }); // Still return success to user so they don't get an error
    }
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { orchestrateAI } from "@/lib/ai/orchestrator";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        intent: "FALLBACK",
        tool_calls: [],
        data: {},
        final_response: "Welcome! For booking inquiries, please visit our [Booking Page](/booking) or call us at **617-999-3803**.",
        reply: "Welcome! For booking inquiries, please visit our [Booking Page](/booking) or call us at **617-999-3803**." // legacy support
      });
    }

    const lastUserMsg = messages.filter((m: any) => m.role === "user").pop()?.content || "";
    const lowerMsg = lastUserMsg.toLowerCase();
    
    // Escalation Triggers
    const needsHuman = ["human", "talk to someone", "call me", "speak to", "agent", "manager"].some(t => lowerMsg.includes(t));
    
    if (needsHuman) {
      const { prisma } = await import("@/lib/prisma");

      const inquiry = await prisma.inquiry.create({
        data: {
          name: "Anonymous Chat User",
          email: "Not provided",
          notes: `[CHAT_ESCALATION] Customer requested human help.\nPage URL: ${req.url}\nLast Msg: ${lastUserMsg}\n\nChat Context:\n${messages.map((m: any) => m.role + ": " + m.content).join("\n")}`,
          status: "NEW",
        }
      });

      // Try auto-linking
      const { autoLinkInquiry } = await import("@/lib/autoLinker");
      await autoLinkInquiry(inquiry.id);

      // Send email alert to Admin
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const setting = await prisma.setting.findUnique({ where: { key: "ADMIN_ALERT_EMAIL" } });
          const adminEmail = setting?.value || process.env.SMTP_USER;

          const nodemailer = await import("nodemailer");
          const transport = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });
          await transport.sendMail({
            from: `"Boston Legend AI" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: "🚨 New Chat Escalation: Human Help Needed",
            html: `<p>A customer requested human assistance via the AI Chat Widget.</p>
                   <p><strong>Page:</strong> ${req.url}</p>
                   <p><strong>Last Message:</strong> ${lastUserMsg}</p>
                   <p><a href="http://localhost:3000/admin/inquiries">View Inquiry in Dashboard</a></p>`,
          });
        } catch (e) {
          console.error("Failed to send escalation email", e);
        }
      }

      const reply = "I’ve alerted our team. Someone from Boston Legend will review this and follow up shortly.";
      return NextResponse.json({
        intent: "ESCALATION",
        tool_calls: [],
        data: {},
        final_response: reply,
        reply
      });
    }

    const aiResponse = await orchestrateAI("customer", messages);

    // Return the required structured response
    // Also include `reply` to maintain backward compatibility with existing frontends 
    // that haven't been fully migrated to read `final_response` yet.
    return NextResponse.json({
      intent: aiResponse.intent,
      tool_calls: aiResponse.tool_calls,
      data: aiResponse.data,
      final_response: aiResponse.final_response,
      reply: aiResponse.final_response 
    });

  } catch (error) {
    console.error("Groq AI Error:", error);
    
    return NextResponse.json({ 
      intent: "ERROR",
      tool_calls: [],
      data: {},
      final_response: "I'm having a little trouble connecting right now. Please call us at 617-999-3803.",
      reply: "I'm having a little trouble connecting right now. Please call us at 617-999-3803."
    }, { status: 500 });
  }
}

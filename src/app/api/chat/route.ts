import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { orchestrateAI } from "@/lib/ai/orchestrator";
import { sendChatEscalationOwnerEmail } from "@/lib/email";

const OWNER_EMAIL = "info@bostonlegendicecreamtruck.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, currentPage, customerInfo } = body;

    if (!process.env.GROQ_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ 
        intent: "FALLBACK",
        tool_calls: [],
        data: {},
        final_response: "Welcome! For booking inquiries, please visit our [Booking Page](/booking) or call us at **617-999-3803**.",
        reply: "Welcome! For booking inquiries, please visit our [Booking Page](/booking) or call us at **617-999-3803**."
      });
    }

    const lastUserMsg = messages.filter((m: any) => m.role === "user").pop()?.content || "";
    const lowerMsg = lastUserMsg.toLowerCase();
    
    // Escalation Triggers — keyword detection
    const needsHuman = ["human", "talk to someone", "talk to human", "call me", "speak to",
      "agent", "manager", "payment issue", "need help", "representative"].some(t => lowerMsg.includes(t));
    
    if (needsHuman) {
      // If customerInfo not yet provided, ask the widget to collect it first
      if (!customerInfo?.email) {
        return NextResponse.json({
          intent: "COLLECT_INFO",
          tool_calls: [],
          data: {},
          final_response: "I'd love to connect you with our team! Please share your contact information so we can follow up with you directly.",
          reply: "I'd love to connect you with our team! Please share your contact information so we can follow up with you directly.",
          requiresInfo: true,
        });
      }

      const { prisma } = await import("@/lib/prisma");

      // Build a clean conversation transcript for the notes field
      const transcript = messages.map((m: any) => `${m.role === "user" ? "Customer" : "AI"}: ${m.content}`).join("\n");
      
      // Create inquiry with real customer info
      const inquiry = await prisma.inquiry.create({
        data: {
          name: customerInfo.name || "Chat User",
          email: customerInfo.email,
          phone: customerInfo.phone || null,
          notes: `[CHAT_ESCALATION] Customer requested human help.\nPage URL: ${currentPage || "Unknown"}\n\n--- Chat Transcript ---\n${transcript}`,
          status: "NEW",
          priority: "HIGH",
          source: "CHAT_WIDGET",
          pageUrl: currentPage || null,
        }
      });

      // Try auto-linking to existing customer by email
      try {
        const { autoLinkInquiry } = await import("@/lib/autoLinker");
        await autoLinkInquiry(inquiry.id);
      } catch (e) {
        console.error("[Chat] Auto-link failed:", e);
      }

      // Send branded owner email — always to info@bostonlegendicecreamtruck.com
      try {
        await sendChatEscalationOwnerEmail({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          notes: inquiry.notes,
          pageUrl: inquiry.pageUrl,
          createdAt: inquiry.createdAt,
        });
      } catch (e) {
        console.error("[Chat] Failed to send escalation email to owner:", e);
        // Don't fail the request if email fails — inquiry is already saved
      }

      const reply = `Thanks ${customerInfo.name?.split(" ")[0] || ""}! 🙌 We've received your request and our team at Boston Legend will reach out to **${customerInfo.email}** shortly. You can also call us directly at **617-999-3803**.`;
      return NextResponse.json({
        intent: "ESCALATION",
        tool_calls: [],
        data: { inquiryId: inquiry.id },
        final_response: reply,
        reply,
      });
    }

    const aiResponse = await orchestrateAI("customer", messages);

    return NextResponse.json({
      intent: aiResponse.intent,
      tool_calls: aiResponse.tool_calls,
      data: aiResponse.data,
      final_response: aiResponse.final_response,
      reply: aiResponse.final_response 
    });

  } catch (error: any) {
    console.error("Chat Route Error:", error?.stack || error);
    
    return NextResponse.json({ 
      intent: "ERROR",
      tool_calls: [],
      data: {},
      final_response: "Sorry, I'm having trouble right now. Please try again or call us at **617-999-3803**.",
      reply: "Sorry, I'm having trouble right now. Please try again or call us at **617-999-3803**."
    }, { status: 500 });
  }
}

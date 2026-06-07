import { NextResponse } from "next/server";
import { orchestrateAI } from "@/lib/ai/orchestrator";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const auth = await requirePermission(req, "ai.use");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ 
        intent: "FALLBACK",
        tool_calls: [],
        data: {},
        final_response: "AI Concierge is in offline mode (No AI API key configured). Please check the dashboard directly for live data.",
        reply: "AI Concierge is in offline mode (No AI API key configured). Please check the dashboard directly for live data."
      });
    }

    const aiResponse = await orchestrateAI("admin", messages);

    return NextResponse.json({
      intent: aiResponse.intent,
      tool_calls: aiResponse.tool_calls,
      data: aiResponse.data,
      final_response: aiResponse.final_response,
      reply: aiResponse.final_response
    });

  } catch (error: any) {
    console.error("Admin Groq AI Error:", error);
    
    return NextResponse.json({ 
      intent: "ERROR",
      tool_calls: [],
      data: {},
      final_response: "Service unavailable.",
      reply: "Service unavailable."
    }, { status: 500 });
  }
}

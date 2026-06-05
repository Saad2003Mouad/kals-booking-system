import { NextResponse } from "next/server";
import { orchestrateAI } from "@/lib/ai/orchestrator";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requirePermission(req, "ai.view");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const prompts = [
      "Show today's bookings",
      "Summarize pending reviews",
      "Show unpaid bookings",
      "What bookings need action?",
      "Summarize new inquiries",
      "Show open tasks",
      "Analyze revenue this week"
    ];

    const results = [];

    for (const prompt of prompts) {
      const startTime = Date.now();
      const res = await orchestrateAI("admin", [{ role: "user", content: prompt }]);
      const duration = Date.now() - startTime;

      results.push({
        prompt,
        intent: res.intent,
        tool_calls: res.tool_calls?.map((t: any) => ({
          name: t.toolName,
          args: t.args
        })) || [],
        data: res.data || [],
        final_response: res.final_response,
        durationMs: duration
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

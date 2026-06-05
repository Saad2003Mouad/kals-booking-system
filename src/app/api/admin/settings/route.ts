export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } 
    catch (error) {
      lastError = error;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw lastError;
}

export async function GET(req: Request) {
  try {
    const auth = await requirePermission(req, "settings.view");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const settings = await withRetry(() => prisma.setting.findMany());
    const dict = settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string,string>);
    return NextResponse.json(dict);
  } catch (error: any) {
    console.error("Settings API GET error:", error.message);
    return NextResponse.json({ error: "Failed to fetch settings", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requirePermission(req, "settings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    await withRetry(async () => {
      for (const [key, value] of Object.entries(body)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string }
        });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings API POST error:", error.message);
    return NextResponse.json({ error: "Failed to update settings", details: error.message }, { status: 500 });
  }
}

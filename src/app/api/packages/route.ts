import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw lastError;
}

export async function GET() {
  try {
    const packages = await withRetry(() =>
      prisma.package.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      })
    );
    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    console.error("Packages API error:", error.message);
    return NextResponse.json({ success: false, data: [], error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requirePermission(req, "customers.view");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const customers = await prisma.customer.findMany({
      include: {
        bookings: {
          select: { totalAmount: true } // booking's total amount
        }
      },
      orderBy: { firstName: "asc" }
    });

    const formatted = customers.map((c: any) => ({
      ...c,
      bookingsCount: c.bookings.length,
      totalSpent: c.bookings.reduce((sum: number, b: any) => sum + (b.totalAmount ?? 0), 0)
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

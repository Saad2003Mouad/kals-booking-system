import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        bookings: {
          select: { quote: { select: { totalAmount: true } } }
        }
      },
      orderBy: { firstName: "asc" }
    });

    const formatted = customers.map((c: any) => ({
      ...c,
      bookingsCount: c.bookings.length,
      totalSpent: c.bookings.reduce((sum: number, b: any) => sum + (b.quote?.totalAmount ?? 0), 0)
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

function escapeCSV(val: any) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "bookings.view");
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  let csvContent = "";
  let filename = "export.csv";

  if (type === "customers") {
    filename = "customers_export.csv";
    const customers = await prisma.customer.findMany({
      include: { bookings: true },
      orderBy: { firstName: 'asc' }
    });

    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Address", "City", "Zip", "Bookings Count", "Lifetime Spent", "Created At"];
    const rows = customers.map(c => {
      const spent = c.bookings.reduce((sum, b) => sum + (b.totalAmount ?? 0), 0);
      return [
        c.id,
        c.firstName,
        c.lastName,
        c.email || "",
        c.phone || "",
        c.address || "",
        c.city || "",
        c.zip || "",
        c.bookings.length,
        spent.toFixed(2),
        c.createdAt.toISOString()
      ];
    });

    csvContent = [headers, ...rows].map(row => row.map(escapeCSV).join(",")).join("\n");

  } else if (type === "bookings") {
    filename = "bookings_export.csv";
    const bookings = await prisma.booking.findMany({
      include: { customer: true },
      orderBy: { eventDate: 'desc' }
    });

    const headers = ["ID", "Booking Number", "Customer Name", "Customer Email", "Event Date", "Event Type", "Status", "Total Amount", "Created At"];
    const rows = bookings.map(b => [
      b.id,
      b.bookingNumber,
      b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : "N/A",
      b.customer?.email || "",
      b.eventDate.toISOString().split("T")[0],
      b.eventType,
      b.status,
      (b.totalAmount ?? 0).toFixed(2),
      b.createdAt.toISOString()
    ]);

    csvContent = [headers, ...rows].map(row => row.map(escapeCSV).join(",")).join("\n");

  } else if (type === "inquiries") {
    filename = "inquiries_export.csv";
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const headers = ["ID", "Name", "Email", "Phone", "Status", "Source", "Priority", "Notes", "Created At"];
    const rows = inquiries.map(i => [
      i.id,
      i.name,
      i.email || "",
      i.phone || "",
      i.status,
      i.source,
      i.priority,
      i.notes || "",
      i.createdAt.toISOString()
    ]);

    csvContent = [headers, ...rows].map(row => row.map(escapeCSV).join(",")).join("\n");
  } else {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}

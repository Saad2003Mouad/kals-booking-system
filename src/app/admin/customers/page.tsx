import { prisma } from "@/lib/prisma";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      bookings: {
        include: { quote: true },
        orderBy: { eventDate: 'desc' }
      }
    },
    orderBy: { firstName: 'asc' },
    take: 50
  });

  return <CustomersClient initialCustomers={customers as any} />;
}

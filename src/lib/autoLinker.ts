import { prisma } from "./prisma";

export async function autoLinkInquiry(inquiryId: string) {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    if (!inquiry) return null;

    let customerId = inquiry.customerId;
    let bookingId = inquiry.bookingId;

    const email = inquiry.email?.trim().toLowerCase();
    const phone = inquiry.phone?.replace(/\D/g, '');

    // 1. Try to find a matching Customer
    if (!customerId && (email || phone)) {
      const customer = await prisma.customer.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone: { contains: phone } }] : [])
          ]
        },
        orderBy: { createdAt: "desc" }
      });
      if (customer) customerId = customer.id;
    }

    // 2. Try to find a matching Booking
    if (!bookingId) {
      // First, try extracting a booking number from notes
      const notes = inquiry.notes || "";
      const bookingNumMatch = notes.match(/BL-\d{5}/i);
      
      if (bookingNumMatch) {
        const booking = await prisma.booking.findUnique({
          where: { bookingNumber: bookingNumMatch[0].toUpperCase() }
        });
        if (booking) bookingId = booking.id;
      }

      // If still no booking, try getting the most recent booking for the matched customer
      if (!bookingId && customerId) {
        const recentBooking = await prisma.booking.findFirst({
          where: { customerId },
          orderBy: { createdAt: "desc" }
        });
        if (recentBooking) bookingId = recentBooking.id;
      }
    }

    // 3. Update if anything was found
    if (customerId !== inquiry.customerId || bookingId !== inquiry.bookingId) {
      return await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { customerId, bookingId }
      });
    }

    return inquiry;
  } catch (error) {
    console.error("AutoLink Error:", error);
    return null;
  }
}

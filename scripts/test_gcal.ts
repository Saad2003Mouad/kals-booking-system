import { PrismaClient } from '@prisma/client';
import { googleCalendarService } from './src/lib/google-calendar';

const prisma = new PrismaClient();

async function test() {
  console.log('Fetching booking...');
  const booking = await prisma.booking.findUnique({
    where: { bookingNumber: 'BL-20260616-4923' },
    include: { customer: true, package: true }
  });
  if (!booking) {
    console.log('Booking not found');
    return;
  }
  
  console.log('Creating Google Calendar event for booking:', booking.bookingNumber);
  const id = await googleCalendarService.createBookingEvent(booking);
  console.log('Created Google Calendar Event ID:', id);
  
  if (id) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { googleEventId: id }
    });
    console.log('Saved to DB successfully.');
  }
}

test().catch(console.error).finally(() => prisma.$disconnect());

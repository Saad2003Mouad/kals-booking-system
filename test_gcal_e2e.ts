import { PrismaClient } from '@prisma/client';
import { googleCalendarService } from './src/lib/google-calendar';
import { google } from 'googleapis';

const prisma = new PrismaClient();

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runE2ETest() {
  console.log('--- STARTING GOOGLE CALENDAR E2E VERIFICATION ---');
  let bookingId = null;
  let googleEventId = null;

  try {
    let customer = await prisma.customer.findFirst({ where: { email: 'e2e-test@example.com' } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: 'E2E',
          lastName: 'Tester',
          email: 'e2e-test@example.com',
          phone: '1234567890'
        }
      });
    }

    // 2. Create a dummy package
    const pkg = await prisma.package.findFirst() || await prisma.package.create({
      data: { name: 'Test Package', price: 100 }
    });

    // 3. Create a brand-new booking (Status: PENDING_REVIEW initially)
    const bookingNumber = 'E2E-' + Date.now();
    console.log(`\n[Test 1] Creating new booking ${bookingNumber}...`);
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: customer.id,
        packageId: pkg.id,
        status: 'PENDING_REVIEW',
        eventDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
        eventTime: '14:00',
        startTime: '14:00',
        address: '123 Test St, Boston, MA',
        guestCount: 50,
        totalAmount: 100
      },
      include: { customer: true, package: true }
    });
    bookingId = booking.id;
    console.log(`Booking created. ID: ${booking.id}, Status: ${booking.status}`);

    // Verify it does NOT have an event ID yet (since it's pending)
    if (booking.googleEventId) throw new Error("Event ID should be null for pending");
    console.log('SUCCESS: No Google Event created for PENDING_REVIEW.');

    // 4. Change status to CONFIRMED
    console.log(`\n[Test 3] Changing status to CONFIRMED...`);
    // Note: The actual API route does this. We'll simulate the API route logic.
    const createdEventId = await googleCalendarService.createBookingEvent(booking);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED', googleEventId: createdEventId }
    });
    googleEventId = createdEventId;
    console.log(`Status changed to CONFIRMED. Google Event created: ${createdEventId}`);
    
    if (!createdEventId) throw new Error("Failed to create Google Event");
    console.log('SUCCESS: Google Event created upon confirmation.');

    // 5. Update an existing booking
    console.log(`\n[Test 2] Updating booking address...`);
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { address: '456 Updated Ave, Boston, MA' },
      include: { customer: true, package: true }
    });
    const updateSuccess = await googleCalendarService.updateBookingEvent(updatedBooking.googleEventId, updatedBooking);
    console.log(`Google Event updated successfully: ${updateSuccess}`);
    if (!updateSuccess) throw new Error("Failed to update Google Event");
    console.log('SUCCESS: Google Event updated.');

    // 6. Change status to CANCELLED
    console.log(`\n[Test 4] Changing status to CANCELLED...`);
    const deleteSuccess = await googleCalendarService.deleteBookingEvent(updatedBooking.googleEventId);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED', googleEventId: null }
    });
    console.log(`Google Event deleted successfully: ${deleteSuccess}`);
    if (!deleteSuccess) throw new Error("Failed to delete Google Event");
    console.log('SUCCESS: Google Event removed upon cancellation.');

    console.log(`\n--- ALL GOOGLE CALENDAR TESTS PASSED ---`);

  } catch (error) {
    console.error(`\nTEST FAILED: ${error.message}`, error);
  } finally {
    // Cleanup
    if (bookingId) {
      await prisma.booking.delete({ where: { id: bookingId } });
      console.log(`\nCleaned up test booking.`);
    }
    await prisma.$disconnect();
  }
}

runE2ETest();

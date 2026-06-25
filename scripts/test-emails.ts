import { 
  sendOtpEmail,
  sendWelcomeEmail,
  sendStaffInviteEmail,
  sendGoogleReviewRequestEmail,
  sendChatEscalationOwnerEmail,
  sendOwnerNewBookingEmail,
  sendBookingPendingEmail,
  sendBookingApprovedEmail,
  sendBookingRejectedEmail,
  sendForgotPasswordEmail,
} from '../src/lib/email';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const testEmail = 'info@bostonlegendicecreamtruck.com';

async function verifyTransporter() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
    pool: true,
  });
  
  return new Promise((resolve) => {
    transporter.verify((error) => {
      if (error) {
        console.error('SMTP Verify Failed:', error);
        resolve(false);
      } else {
        console.log('✅ SMTP VERIFIED: Server is ready to take our messages');
        resolve(true);
      }
    });
  });
}

async function runTests() {
  console.log('--- EMAIL INFRASTRUCTURE CERTIFICATION ---');
  const isVerified = await verifyTransporter();
  if (!isVerified) process.exit(1);

  const mockBooking = {
    id: 'test-booking-123',
    bookingNumber: 'BL-TEST-001',
    status: 'PENDING' as any,
    eventDate: new Date(),
    startTime: '14:00',
    endTime: '16:00',
    address: '123 Test St',
    city: 'Boston',
    zip: '02108',
    guests: 50,
    totalAmount: 500,
    eventType: 'Birthday',
    customer: {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      phone: '555-0100'
    },
    package: {
      name: 'Test Package',
      price: 500,
      servings: 50,
      durationMins: 60
    },
    items: [],
    stops: []
  };

  const tests = [
    { name: 'OTP Booking', fn: () => sendOtpEmail(testEmail, '123456', 'Test', 'BOOKING') },
    { name: 'OTP Portal', fn: () => sendOtpEmail(testEmail, '123456', 'Test', 'PORTAL') },
    { name: 'OTP Reset Password', fn: () => sendForgotPasswordEmail(testEmail, '123456', 'Test') },
    { name: 'Staff Invite', fn: () => sendStaffInviteEmail(testEmail, 'Inviter', 'token123', 'STAFF') },
    { name: 'Welcome Email', fn: () => sendWelcomeEmail(testEmail, 'Test') },
    { name: 'Inquiry / Chat Escalation', fn: () => sendChatEscalationOwnerEmail({ id: 'inq-123', name: 'Test', email: testEmail, phone: '555-0100', notes: 'Test message', createdAt: new Date() }) },
    { name: 'Admin Notification (New Booking)', fn: () => sendOwnerNewBookingEmail(mockBooking as any) },
    { name: 'Booking Pending', fn: () => sendBookingPendingEmail(testEmail, 'Test', 'BL-TEST-001', null, 'test-booking-123') },
    { name: 'Booking Approved', fn: () => sendBookingApprovedEmail(testEmail, 'Test', 'BL-TEST-001', 'http://pay', '500.00', 'test-booking-123') },
    { name: 'Booking Rejected', fn: () => sendBookingRejectedEmail(testEmail, 'Test', 'BL-TEST-001', 'Out of stock', 'test-booking-123') },
    { name: 'Booking Completed (Review Request)', fn: () => sendGoogleReviewRequestEmail(mockBooking as any) },
  ];

  let passed = 0;
  for (const test of tests) {
    console.log(`\\nTesting: ${test.name}`);
    try {
      const result = await test.fn();
      if (result) {
        console.log(`✅ PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${test.name}`);
      }
    } catch (e) {
      console.log(`❌ FAIL: ${test.name}`, e);
    }
    await new Promise(r => setTimeout(r, 1000)); // Delay to prevent rate limit
  }

  console.log(`\\n--- RESULTS: ${passed}/${tests.length} EMAILS PASSED ---`);
  if (passed !== tests.length) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();

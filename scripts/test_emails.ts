import { sendEmail, sendBookingApprovedEmail, sendBookingPendingEmail, sendBookingRejectedEmail, sendBookingPendingReviewEmail, sendCustomQuoteEmail, sendOwnerNewBookingEmail, sendOwnerRequiresApprovalEmail, sendOwnerLateBookingAlert, sendOwnerEventReminderEmail } from "../src/lib/email";
import { sendOtpEmail } from "../src/lib/otp";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const TEST_EMAIL = process.env.SMTP_USER || "info@bostonlegendicecreamtruck.com";

async function testEmails() {
  console.log("Starting Email Verification Test...\n");
  console.log(`SMTP_USER: ${process.env.SMTP_USER ? "SET" : "NOT SET"}`);
  console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? "SET" : "NOT SET"}`);
  console.log(`Sending tests to: ${TEST_EMAIL}\n`);

  const results: any[] = [];

  const dummyBooking = {
    id: "test-booking-id",
    bookingNumber: "BL-TEST-123",
    customer: { firstName: "Test", lastName: "User", email: TEST_EMAIL, phone: "123-456-7890" },
    package: { name: "Test Package", durationMins: 60, servings: 50 },
    quote: { basePrice: 200, travelFee: 20 },
    eventDate: new Date(),
    startTime: "12:00 PM",
    address: "123 Test St",
    city: "Boston",
    zip: "02111",
    guests: 50,
    status: "PENDING",
    totalAmount: 220,
    stops: [],
  };

  async function runTest(name: string, fn: () => Promise<any>) {
    process.stdout.write(`Testing [${name}]... `);
    try {
      const res = await fn();
      if (res) {
        console.log("✅ SUCCESS");
        results.push({ type: name, status: "Delivered", error: null });
      } else {
        console.log("❌ FAILED (sendMail returned false)");
        results.push({ type: name, status: "Failed", error: "sendMail returned false" });
      }
    } catch (e: any) {
      console.log(`❌ ERROR: ${e.message}`);
      results.push({ type: name, status: "Failed", error: e.message });
    }
  }

  await runTest("OTP Email", () => sendOtpEmail(TEST_EMAIL, "123456", "Test"));
  await runTest("Booking Pending", () => sendBookingPendingEmail(TEST_EMAIL, "Test", "BL-TEST-123", {}, "test-booking-id"));
  await runTest("Booking Approved", () => sendBookingApprovedEmail(TEST_EMAIL, "Test", "BL-TEST-123", "http://test", "220", "test-booking-id"));
  await runTest("Booking Rejected", () => sendBookingRejectedEmail(TEST_EMAIL, "Test", "BL-TEST-123", "Needs a different time", "test-booking-id"));
  await runTest("Booking Review", () => sendBookingPendingReviewEmail(TEST_EMAIL, "Test", "BL-TEST-123", "Reviewing route", "test-booking-id"));
  await runTest("Custom Quote", () => sendCustomQuoteEmail(TEST_EMAIL, "Test", "BL-TEST-123", "test-booking-id"));
  await runTest("Owner New Booking", () => sendOwnerNewBookingEmail(dummyBooking));
  await runTest("Owner Requires Approval", () => sendOwnerRequiresApprovalEmail(dummyBooking));
  await runTest("Owner Late Booking Alert", () => sendOwnerLateBookingAlert(dummyBooking));
  await runTest("Owner Event Reminder", () => sendOwnerEventReminderEmail(dummyBooking));
  
  // Directly test the base sendEmail to simulate Inquiry Reply
  await runTest("Inquiry Reply", () => sendEmail({ to: TEST_EMAIL, subject: "Re: Inquiry", html: "Test Reply", title: "Inquiry Reply" }));

  console.log("\n=== SUMMARY ===");
  console.table(results);
}

testEmails();

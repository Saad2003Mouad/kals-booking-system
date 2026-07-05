/**
 * RC3.1 Email Verification & Deliverability Test
 * Run with: npx tsx scripts/verify-emails.ts
 */
import { sendEmail, sendBookingApprovedEmail, sendOtpEmail, sendWelcomeEmail } from "../src/lib/email";

async function verifyDeliverability() {
  console.log("=========================================");
  console.log("RC3.1 Email Deliverability Audit");
  console.log("=========================================\n");

  const targetEmail = "saadmouad2004@gmail.com";
  
  console.log("[Test 1] Latency & Connection Test (Welcome Email)");
  const start = Date.now();
  const res1 = await sendWelcomeEmail(targetEmail, "Saad");
  const latency = Date.now() - start;
  
  if (res1) {
    console.log(`✓ Welcome Email sent successfully. Latency: ${latency}ms`);
  } else {
    console.error("❌ Welcome Email failed to send.");
  }

  console.log("\n[Test 2] Apology Email (Inbox Placement Priority)");
  const apologyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: #000223; margin-bottom: 10px;">We Sincerly Apologize</h2>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hi Saad,</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We sincerely apologize for the inconvenience. It appears one of our previous emails may not have reached your inbox correctly. 
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We'd still love the opportunity to serve you. If you're still interested in booking the Boston Legend Ice Cream Truck for your event, you can easily complete your reservation using the link below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.bostonlegendicecreamtruck.com/booking" style="background-color: #000223; color: #FFA000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Book Your Event</a>
        </div>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
          Warmly,<br>
          <strong>The Boston Legend Team</strong>
        </p>
      </div>
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} Boston Legend Ice Cream Truck. All rights reserved.<br>
        <a href="https://www.bostonlegendicecreamtruck.com" style="color: #888; text-decoration: underline;">Visit our website</a>
      </div>
    </div>
  `;
  
  const startApology = Date.now();
  const res2 = await sendEmail({
    to: targetEmail,
    subject: "Update Regarding Your Boston Legend Request",
    html: apologyHtml,
    title: "Update from Boston Legend"
  });
  const latencyApology = Date.now() - startApology;
  
  if (res2) {
    console.log(`✓ Apology Email sent successfully. Latency: ${latencyApology}ms`);
  } else {
    console.error("❌ Apology Email failed to send.");
  }

  console.log("\n[Test 3] OTP Email");
  const startOtp = Date.now();
  const res3 = await sendOtpEmail(targetEmail, "842910", "Saad", "BOOKING");
  const latencyOtp = Date.now() - startOtp;
  
  if (res3) {
    console.log(`✓ OTP Email sent successfully. Latency: ${latencyOtp}ms`);
  } else {
    console.error("❌ OTP Email failed to send.");
  }

  console.log("\n=========================================");
  console.log("DNS Authentication Requirements (Action Required)");
  console.log("=========================================");
  console.log("To guarantee Inbox placement in Gmail, Outlook, and Yahoo, you MUST add these records to your domain provider (e.g., GoDaddy, Namecheap):\n");
  
  console.log("1. SPF Record (TXT)");
  console.log("   Name: @");
  console.log("   Value: v=spf1 include:_spf.google.com ~all\n");
  
  console.log("2. DKIM Record (TXT)");
  console.log("   Name: google._domainkey");
  console.log("   Value: [Generate this value in Google Workspace Admin -> Apps -> Google Workspace -> Gmail -> Authenticate email]\n");
  
  console.log("3. DMARC Record (TXT)");
  console.log("   Name: _dmarc");
  console.log("   Value: v=DMARC1; p=none; rua=mailto:admin@bostonlegendicecreamtruck.com;\n");
  
  console.log("Note: Outlook and Yahoo are extremely strict. Without SPF and DKIM configured on your domain DNS, emails will almost always go to Junk/Spam.");
}

verifyDeliverability().catch(console.error);

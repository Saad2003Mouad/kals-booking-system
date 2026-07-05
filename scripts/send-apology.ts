/**
 * Single Apology Email
 * Run with: npx tsx scripts/send-apology.ts
 */
import { sendEmail } from "../src/lib/email";

async function run() {
  const targetEmail = "ricky.Masotta@bestbuy.com";
  
  const apologyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: #000223; margin-bottom: 10px;">We Sincerely Apologize</h2>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hi Ricky,</p>
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
  
  console.log(`Sending apology email to ${targetEmail}...`);
  const success = await sendEmail({
    to: targetEmail,
    subject: "Update Regarding Your Boston Legend Request",
    html: apologyHtml,
    title: "Update from Boston Legend"
  });
  
  if (success) {
    console.log("✓ Apology Email sent successfully!");
  } else {
    console.error("❌ Failed to send apology email.");
  }
}

run().catch(console.error);

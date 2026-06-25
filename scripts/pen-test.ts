import { prisma } from '../src/lib/prisma';
import { generateOtp, verifyOtp } from '../src/lib/otp';

async function runPenTest() {
  console.log('\\n🛡️  STARTING PENETRATION TEST: OTP BRUTE FORCE & LOGIC VERIFICATION');

  const testEmail = 'hacker@example.com';
  const purpose = 'PORTAL';

  try {
    // 1. Generate an OTP
    console.log('\\n[1] Generating OTP for victim...');
    const result = await generateOtp(testEmail, purpose);
    console.log('OTP Generated successfully');
    
    // 2. Attempt brute force
    console.log('\\n[2] Attempting Brute Force Attack (Max Attempts = 5)...');
    let blocked = false;
    
    for (let i = 1; i <= 6; i++) {
      const wrongCode = String(100000 + i);
      const res = await verifyOtp(testEmail, wrongCode, purpose);
      
      console.log(`Attempt ${i}: [Code: ${wrongCode}] Result -> valid: ${res.valid}, error: ${res.error || 'none'}`);
      
      if (res.error?.includes('locked out') || res.error?.includes('Too many failed')) {
        console.log('✅ PASS: Lockout mechanism activated successfully at attempt ' + i);
        blocked = true;
        break;
      }
    }

    if (!blocked) {
      console.log('❌ FAIL: Lockout mechanism failed. System allowed more than 5 attempts.');
      process.exit(1);
    }

    // 3. Verify single-use mechanism
    console.log('\\n[3] Testing Single-Use Mechanism...');
    const realCode = (await prisma.otpCode.findFirst({ where: { email: testEmail } }))?.code;
    
    // We generated a new one because the previous got locked out
    await prisma.otpCode.deleteMany({ where: { email: testEmail } });
    const newOtp = await generateOtp(testEmail, purpose);
    const newCode = (await prisma.otpCode.findFirst({ where: { email: testEmail } }))?.code;

    console.log('Generated new valid code:', newCode);
    const firstUse = await verifyOtp(testEmail, newCode!, purpose);
    console.log('First Use:', firstUse.valid ? 'SUCCESS' : 'FAIL');
    
    const secondUse = await verifyOtp(testEmail, newCode!, purpose);
    console.log('Second Use Attempt:', secondUse.valid ? 'SUCCESS (FAIL)' : `BLOCKED (${secondUse.error})`);

    if (firstUse.valid && !secondUse.valid && secondUse.error === 'Invalid or expired OTP') {
      console.log('✅ PASS: Single-use (replay protection) verified. Code deleted after use.');
    } else {
      console.log('❌ FAIL: Replay protection failed.');
      process.exit(1);
    }

    console.log('\\n🛡️ PENETRATION TEST COMPLETE: PASSED');
    process.exit(0);

  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPenTest();

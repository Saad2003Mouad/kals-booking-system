-- ============================================================
-- BOSTON LEGEND — SUPABASE ROW LEVEL SECURITY POLICIES
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================
-- NOTE: This project uses Application-Layer security (Prisma +
-- NextAuth JWT). RLS below adds an extra DB-level safety net.
-- The service_role key (used by Prisma) bypasses RLS, so all
-- app operations continue normally.
-- ============================================================

-- Enable RLS on all critical tables
ALTER TABLE "Booking"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OtpCode"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Inquiry"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaffInvite"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quote"        ENABLE ROW LEVEL SECURITY;

-- ── BOOKING ──────────────────────────────────────────────────
-- Block all direct anon access. App uses service_role which bypasses.
CREATE POLICY "booking_deny_anon"
  ON "Booking"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "booking_service_role_all"
  ON "Booking"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── OTP CODES ─────────────────────────────────────────────────
CREATE POLICY "otp_deny_anon"
  ON "OtpCode"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "otp_service_role_all"
  ON "OtpCode"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── USERS ─────────────────────────────────────────────────────
CREATE POLICY "users_deny_anon"
  ON "User"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "users_service_role_all"
  ON "User"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── CUSTOMERS ─────────────────────────────────────────────────
CREATE POLICY "customers_deny_anon"
  ON "Customer"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "customers_service_role_all"
  ON "Customer"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── INQUIRIES ─────────────────────────────────────────────────
-- Allow anon INSERT only (contact form submission)
CREATE POLICY "inquiries_anon_insert"
  ON "Inquiry"
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "inquiries_anon_no_select"
  ON "Inquiry"
  FOR SELECT
  TO anon
  USING (false);

CREATE POLICY "inquiries_service_role_all"
  ON "Inquiry"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── AUDIT LOGS ────────────────────────────────────────────────
CREATE POLICY "auditlog_deny_anon"
  ON "AuditLog"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "auditlog_service_role_all"
  ON "AuditLog"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── STAFF INVITES ─────────────────────────────────────────────
CREATE POLICY "staffinvite_deny_anon"
  ON "StaffInvite"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "staffinvite_service_role_all"
  ON "StaffInvite"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── QUOTES ────────────────────────────────────────────────────
CREATE POLICY "quotes_deny_anon"
  ON "Quote"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "quotes_service_role_all"
  ON "Quote"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── VERIFY RLS IS ACTIVE ─────────────────────────────────────
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('Booking','OtpCode','User','Customer','Inquiry','AuditLog','StaffInvite','Quote')
ORDER BY tablename;
-- Expected: rowsecurity = true for all tables

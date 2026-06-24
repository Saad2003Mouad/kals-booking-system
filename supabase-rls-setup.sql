-- ============================================================
-- Boston Legend — Supabase RLS (Row Level Security) Setup
-- Final Production Script — RC-1
-- ============================================================
--
-- CRITICAL NOTES:
-- 1. This script must be executed MANUALLY in the Supabase SQL Editor
--    or via `psql` with the service role connection string.
--
-- 2. Prisma uses the SERVICE ROLE key (DATABASE_URL) which BYPASSES
--    all RLS policies entirely. This is by design for server-side
--    operations. These policies only affect client-side Supabase SDK
--    requests (e.g., direct browser access attempts).
--
-- 3. DO NOT use the anon key in any server-side code.
--    The service role key is for server use only and must never
--    be exposed to the browser.
--
-- 4. All tables are locked down to DENY ALL by default.
--    Granular access can be added per table if needed for
--    future Supabase client SDK features.
--
-- HOW TO RUN:
--   Option A: Supabase Dashboard → SQL Editor → New Query → Paste & Run
--   Option B: psql "postgresql://postgres:PASSWORD@HOST:5432/postgres" -f supabase-rls-setup.sql
-- ============================================================

-- ─── ENABLE RLS ON ALL TABLES ───────────────────────────────────

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vehicle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Driver" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Package" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingStop" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AvailabilityBlock" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VehicleAssignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Inquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssistantMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OtpCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaffInvite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceZipCode" ENABLE ROW LEVEL SECURITY;

-- ─── DROP EXISTING POLICIES (idempotent re-run) ─────────────────

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ─── DENY ALL PUBLIC ACCESS (Default Deny) ──────────────────────
-- These policies block ALL direct client-side access to every table.
-- Server-side Prisma (service role) bypasses these automatically.

-- User table
CREATE POLICY "deny_all_public_User" ON "User"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Vehicle table
CREATE POLICY "deny_all_public_Vehicle" ON "Vehicle"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Driver table
CREATE POLICY "deny_all_public_Driver" ON "Driver"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Package table
-- NOTE: Packages are PUBLIC data (visible on /packages page).
-- If you want to allow public read access for packages via Supabase client,
-- uncomment the SELECT policy below and comment the deny policy.
CREATE POLICY "deny_all_public_Package" ON "Package"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);
-- OPTIONAL: Allow public read of active packages
-- CREATE POLICY "allow_public_read_active_Package" ON "Package"
--     FOR SELECT TO anon, authenticated
--     USING ("isActive" = true);

-- Customer table
CREATE POLICY "deny_all_public_Customer" ON "Customer"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Booking table
CREATE POLICY "deny_all_public_Booking" ON "Booking"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- BookingItem table
CREATE POLICY "deny_all_public_BookingItem" ON "BookingItem"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- BookingStop table
CREATE POLICY "deny_all_public_BookingStop" ON "BookingStop"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Quote table
CREATE POLICY "deny_all_public_Quote" ON "Quote"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- AvailabilityBlock table
CREATE POLICY "deny_all_public_AvailabilityBlock" ON "AvailabilityBlock"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- VehicleAssignment table
CREATE POLICY "deny_all_public_VehicleAssignment" ON "VehicleAssignment"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Payment table
CREATE POLICY "deny_all_public_Payment" ON "Payment"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Inquiry table
CREATE POLICY "deny_all_public_Inquiry" ON "Inquiry"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- AssistantMessage table
CREATE POLICY "deny_all_public_AssistantMessage" ON "AssistantMessage"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Task table
CREATE POLICY "deny_all_public_Task" ON "Task"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- AuditLog table
CREATE POLICY "deny_all_public_AuditLog" ON "AuditLog"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- Setting table (especially sensitive — SMTP, API keys, etc.)
CREATE POLICY "deny_all_public_Setting" ON "Setting"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- OtpCode table (extremely sensitive — never expose)
CREATE POLICY "deny_all_public_OtpCode" ON "OtpCode"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- StaffInvite table
CREATE POLICY "deny_all_public_StaffInvite" ON "StaffInvite"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);

-- ServiceZipCode table
-- NOTE: These are public service area data. If you want public read access,
-- uncomment the SELECT policy below.
CREATE POLICY "deny_all_public_ServiceZipCode" ON "ServiceZipCode"
    AS RESTRICTIVE FOR ALL
    TO anon, authenticated
    USING (false);
-- OPTIONAL: Allow public read of active service zip codes
-- CREATE POLICY "allow_public_read_active_ServiceZipCode" ON "ServiceZipCode"
--     FOR SELECT TO anon, authenticated
--     USING ("isActive" = true);

-- ─── VERIFICATION QUERY ─────────────────────────────────────────
-- Run this after applying to confirm all tables have RLS enabled:

SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled,
    (SELECT COUNT(*) FROM pg_policies p WHERE p.schemaname = t.schemaname AND p.tablename = t.tablename) AS policy_count
FROM pg_tables t
WHERE schemaname = 'public'
    AND tablename IN (
        'User', 'Vehicle', 'Driver', 'Package', 'Customer', 'Booking',
        'BookingItem', 'BookingStop', 'Quote', 'AvailabilityBlock',
        'VehicleAssignment', 'Payment', 'Inquiry', 'AssistantMessage',
        'Task', 'AuditLog', 'Setting', 'OtpCode', 'StaffInvite', 'ServiceZipCode'
    )
ORDER BY tablename;

-- Expected output: rls_enabled = true, policy_count = 1 for all rows.
-- ============================================================
-- END OF SCRIPT
-- ============================================================

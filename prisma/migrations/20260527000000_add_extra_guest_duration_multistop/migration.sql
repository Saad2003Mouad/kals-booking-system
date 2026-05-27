-- Migration: add_extra_guest_duration_multistop
-- Adds extraGuestPrice and durationMins to Package
-- Adds additionalStops and additionalStopsFee to Booking

ALTER TABLE "Package" ADD COLUMN IF NOT EXISTS "extraGuestPrice" DOUBLE PRECISION NOT NULL DEFAULT 5;
ALTER TABLE "Package" ADD COLUMN IF NOT EXISTS "durationMins" INTEGER NOT NULL DEFAULT 60;

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "additionalStops" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "additionalStopsFee" DOUBLE PRECISION NOT NULL DEFAULT 0;

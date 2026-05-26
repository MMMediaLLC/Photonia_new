-- ============================================================
-- Migration: Remove 'extended' license type
-- Date: 2026-05-26
-- Description: Simplify license system from 3 to 2 types.
--              Remove price_extended column from photos.
--              Update license check constraint on order_items.
-- SAFE: Only run after confirming no extended order_items exist.
-- ============================================================

-- 1. Safety check — abort if any extended orders exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM order_items WHERE license = 'extended') THEN
    RAISE EXCEPTION 'Cannot migrate: order_items with license=extended exist. Handle them first.';
  END IF;
END $$;

-- 2. Drop old license constraint on order_items
ALTER TABLE order_items
  DROP CONSTRAINT IF EXISTS order_items_license_check;

-- 3. Add new constraint — only personal | commercial
ALTER TABLE order_items
  ADD CONSTRAINT order_items_license_check
  CHECK (license IN ('personal', 'commercial'));

-- 4. Drop price_extended column from photos
ALTER TABLE photos
  DROP COLUMN IF EXISTS price_extended;

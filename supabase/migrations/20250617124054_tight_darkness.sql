/*
  # Add Plus One and Enhanced Guest Fields

  1. Changes
    - Add `is_plus_one` boolean field to track plus-one guests
    - Add `primary_guest_id` to link plus-one guests to their primary guest
    - Ensure dietary_restrictions field exists
    - Add indexes for efficient queries

  2. Security
    - No changes to existing RLS policies needed
    - Fields inherit existing guest security rules
*/

-- Add is_plus_one column to guests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guests' AND column_name = 'is_plus_one'
  ) THEN
    ALTER TABLE guests ADD COLUMN is_plus_one boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Add primary_guest_id column to guests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guests' AND column_name = 'primary_guest_id'
  ) THEN
    ALTER TABLE guests ADD COLUMN primary_guest_id uuid REFERENCES guests(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure dietary_restrictions column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guests' AND column_name = 'dietary_restrictions'
  ) THEN
    ALTER TABLE guests ADD COLUMN dietary_restrictions text;
  END IF;
END $$;

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_guests_primary_guest_id ON guests(primary_guest_id);
CREATE INDEX IF NOT EXISTS idx_guests_is_plus_one ON guests(is_plus_one);
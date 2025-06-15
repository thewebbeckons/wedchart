/*
  # Add Wedding Name to Profiles Table

  1. Changes
    - Add `wedding_name` column to profiles table
    - Column is nullable to allow users to set it later
    - Remove phone_number column as it's being replaced

  2. Security
    - No changes to existing RLS policies needed
    - Column inherits existing profile security rules
*/

-- Add wedding_name column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'wedding_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wedding_name text;
  END IF;
END $$;

-- Remove phone_number column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles DROP COLUMN phone_number;
  END IF;
END $$;
/*
  # Add Wedding Date to Profiles Table

  1. Changes
    - Add `wedding_date` column to profiles table
    - Column is nullable to allow users to set it later
    - Uses date type for proper date handling

  2. Security
    - No changes to existing RLS policies needed
    - Column inherits existing profile security rules
*/

-- Add wedding_date column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'wedding_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wedding_date date;
  END IF;
END $$;
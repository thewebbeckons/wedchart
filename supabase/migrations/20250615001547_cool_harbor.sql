/*
  # Add Guest List Sharing Feature

  1. Changes
    - Add `guest_list_id` column to profiles table for sharing functionality
    - Column stores unique alphanumeric ID for public guest list access
    - Add index for efficient lookups

  2. Security
    - No changes to existing RLS policies needed
    - Column inherits existing profile security rules
*/

-- Add guest_list_id column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'guest_list_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN guest_list_id text UNIQUE;
  END IF;
END $$;

-- Create index for guest_list_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_guest_list_id ON profiles(guest_list_id);
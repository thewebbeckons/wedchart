/*
  # Add Privacy Preferences to Profiles Table

  1. Changes
    - Add `email_notifications` column to profiles table (default true)
    - Add `marketing_emails` column to profiles table (default false)
    - Both columns are boolean and not null

  2. Security
    - No changes to existing RLS policies needed
    - Columns inherit existing profile security rules
*/

-- Add email_notifications column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email_notifications'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_notifications boolean DEFAULT true NOT NULL;
  END IF;
END $$;

-- Add marketing_emails column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'marketing_emails'
  ) THEN
    ALTER TABLE profiles ADD COLUMN marketing_emails boolean DEFAULT false NOT NULL;
  END IF;
END $$;
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

-- Update the handle_new_user function to set default privacy preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    full_name, 
    wedding_name, 
    wedding_date,
    email_notifications,
    marketing_emails
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    NULLIF(new.raw_user_meta_data->>'wedding_name', ''),
    CASE 
      WHEN new.raw_user_meta_data->>'wedding_date' IS NOT NULL 
      AND new.raw_user_meta_data->>'wedding_date' != ''
      THEN (new.raw_user_meta_data->>'wedding_date')::date
      ELSE NULL
    END,
    true,  -- email_notifications default to true
    false  -- marketing_emails default to false
  );
  RETURN new;
END;
$$ language plpgsql security definer;
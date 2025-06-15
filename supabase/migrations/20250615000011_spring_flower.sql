/*
  # Add Wedding Name Column and Update User Creation Function

  1. Changes
    - Add `wedding_name` column to profiles table
    - Update `handle_new_user` function to handle wedding information from signup
    - Column is nullable to allow users to set it later

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

-- Update function to handle new user signup with wedding information
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, wedding_name, wedding_date)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'wedding_name',
    CASE 
      WHEN new.raw_user_meta_data->>'wedding_date' IS NOT NULL 
      AND new.raw_user_meta_data->>'wedding_date' != ''
      THEN (new.raw_user_meta_data->>'wedding_date')::date
      ELSE NULL
    END
  );
  RETURN new;
END;
$$ language plpgsql security definer;
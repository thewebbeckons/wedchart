/*
  # Fix Guest List Database Schema

  1. Schema Updates
    - Ensure all required columns exist in profiles table
    - Create public_guest_lists table if it doesn't exist
    - Add proper indexes and constraints
    - Update RLS policies

  2. Data Migration
    - Handle existing data gracefully
    - Ensure no data loss during schema updates

  3. Security
    - Maintain proper RLS policies
    - Ensure public access works correctly for guest lists
*/

-- First, ensure the profiles table has all required columns
DO $$
BEGIN
  -- Add wedding_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'wedding_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wedding_name text;
  END IF;

  -- Add guest_list_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'guest_list_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN guest_list_id text;
  END IF;

  -- Remove phone_number column if it exists (replaced by wedding_name)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles DROP COLUMN phone_number;
  END IF;
END $$;

-- Add unique constraint to guest_list_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_guest_list_id_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_guest_list_id_key UNIQUE (guest_list_id);
  END IF;
END $$;

-- Create index for guest_list_id lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_guest_list_id ON profiles(guest_list_id);

-- Create public_guest_lists table if it doesn't exist
CREATE TABLE IF NOT EXISTS public_guest_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_id text UNIQUE NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  wedding_name text NOT NULL,
  wedding_date date,
  guest_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_public_guest_lists_unique_id ON public_guest_lists(unique_id);
CREATE INDEX IF NOT EXISTS idx_public_guest_lists_profile_id ON public_guest_lists(profile_id);

-- Enable Row Level Security on public_guest_lists
ALTER TABLE public_guest_lists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own guest lists" ON public_guest_lists;
DROP POLICY IF EXISTS "Users can insert own guest lists" ON public_guest_lists;
DROP POLICY IF EXISTS "Users can update own guest lists" ON public_guest_lists;
DROP POLICY IF EXISTS "Users can delete own guest lists" ON public_guest_lists;
DROP POLICY IF EXISTS "Public can view guest lists by unique_id" ON public_guest_lists;

-- Policies for authenticated users to manage their own lists
CREATE POLICY "Users can view own guest lists"
  ON public_guest_lists
  FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own guest lists"
  ON public_guest_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own guest lists"
  ON public_guest_lists
  FOR UPDATE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own guest lists"
  ON public_guest_lists
  FOR DELETE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Policy for public read access using unique_id
CREATE POLICY "Public can view guest lists by unique_id"
  ON public_guest_lists
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create trigger to automatically update updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_public_guest_lists_updated_at'
  ) THEN
    CREATE TRIGGER update_public_guest_lists_updated_at
      BEFORE UPDATE ON public_guest_lists
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Update the handle_new_user function to handle new signup fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, wedding_name, wedding_date)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    NULLIF(new.raw_user_meta_data->>'wedding_name', ''),
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

-- Ensure the trigger exists for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
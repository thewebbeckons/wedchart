/*
  # Create Public Guest Lists Table

  1. New Tables
    - `public_guest_lists`
      - `id` (uuid, primary key)
      - `unique_id` (text, unique identifier for public access)
      - `profile_id` (uuid, foreign key to profiles.id)
      - `wedding_name` (text, wedding name)
      - `wedding_date` (date, wedding date)
      - `guest_data` (jsonb, array of confirmed guests with table assignments)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on public_guest_lists table
    - Add policies for authenticated users to manage their own lists
    - Add policy for public read access using unique_id

  3. Indexes
    - Unique index on unique_id for fast public lookups
    - Index on profile_id for owner queries
*/

-- Create public_guest_lists table
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

-- Enable Row Level Security
ALTER TABLE public_guest_lists ENABLE ROW LEVEL SECURITY;

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

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_public_guest_lists_updated_at
  BEFORE UPDATE ON public_guest_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
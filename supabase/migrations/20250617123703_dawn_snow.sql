/*
  # Add Dietary Restrictions to Guests Table

  1. Changes
    - Add `dietary_restrictions` column to guests table
    - Column is nullable to allow guests without dietary restrictions
    - Uses text type for flexible input

  2. Security
    - No changes to existing RLS policies needed
    - Column inherits existing guest security rules
*/

-- Add dietary_restrictions column to guests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guests' AND column_name = 'dietary_restrictions'
  ) THEN
    ALTER TABLE guests ADD COLUMN dietary_restrictions text;
  END IF;
END $$;
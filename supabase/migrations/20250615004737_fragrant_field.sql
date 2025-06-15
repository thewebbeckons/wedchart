/*
  # Update User Signup Handler for Wedding Information

  1. Changes
    - Update the handle_new_user function to properly handle wedding_name and wedding_date
    - Ensure proper data type casting for wedding_date
    - Handle null/empty values gracefully

  2. Security
    - Maintains existing security definer context
    - No changes to RLS policies needed
*/

-- Update function to handle new user signup with wedding information
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
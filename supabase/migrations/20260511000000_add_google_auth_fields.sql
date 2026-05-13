-- Add new columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS provider TEXT;

-- Update the handle_new_user function to extract new fields and handle conflicts safely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  extracted_avatar TEXT;
  extracted_provider TEXT;
BEGIN
  -- Extract avatar from Google meta (usually 'picture' or 'avatar_url')
  extracted_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    ''
  );

  -- Extract provider from app_meta_data
  extracted_provider := COALESCE(
    NEW.raw_app_meta_data->>'provider',
    'unknown'
  );

  INSERT INTO public.profiles (user_id, full_name, email, phone, avatar_url, provider)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.phone, ''),
    extracted_avatar,
    extracted_provider
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    provider = EXCLUDED.provider;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Prevent the transaction from failing completely if profile insert fails
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

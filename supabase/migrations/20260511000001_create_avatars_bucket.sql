-- Create the 'avatars' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up access controls for the 'avatars' bucket

-- Allow public read access to avatars
CREATE POLICY "Avatar Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatars
CREATE POLICY "Avatar Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

-- Allow authenticated users to update avatars
CREATE POLICY "Avatar Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to delete avatars
CREATE POLICY "Avatar Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' );

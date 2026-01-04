-- Create a storage bucket for user avatars
INSERT INTO
    storage.buckets (id, name, public)
VALUES (
        'user-avatars',
        'user-avatars',
        true
    );

-- Set up storage policies for user avatars
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT TO authenticated
WITH
    CHECK (
        bucket_id = 'user-avatars'
        AND (storage.foldername (name)) [1] = 'avatars'
    );

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE
    TO authenticated USING (
        bucket_id = 'user-avatars'
        AND (storage.foldername (name)) [1] = 'avatars'
    );

-- Allow anyone to view avatars (public read)
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'user-avatars');

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'user-avatars'
    AND (storage.foldername (name)) [1] = 'avatars'
);
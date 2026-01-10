-- Storage bucket setup for cottage images
-- Run this in your Supabase SQL Editor or Dashboard

-- Create the storage bucket for cottage images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cottage-images', 'cottage-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public access
CREATE POLICY "Public Access for cottage images"
ON storage.objects FOR SELECT
USING (bucket_id = 'cottage-images');

CREATE POLICY "Allow authenticated uploads to cottage images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cottage-images');

CREATE POLICY "Allow authenticated updates to cottage images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cottage-images');

CREATE POLICY "Allow authenticated deletes from cottage images"
ON storage.objects FOR DELETE
USING (bucket_id = 'cottage-images');

-- Note: You can also create the bucket from the Supabase Dashboard:
-- 1. Go to Storage in your Supabase project
-- 2. Click "New bucket"
-- 3. Name it "cottage-images"
-- 4. Make it "Public bucket" (check the box)
-- 5. Click "Create bucket"

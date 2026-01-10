-- Migration: Add admin_name column to rooms table
-- Run this in your Supabase SQL Editor

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS admin_name VARCHAR(100);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_admin_name ON rooms(admin_name);

-- Update RLS policies to allow public insert/update on rooms
CREATE POLICY IF NOT EXISTS "Allow public insert on rooms" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public update on rooms" ON rooms FOR UPDATE USING (true);

-- Migration: Add multi-room support to existing database
-- This migration is for databases that already have data
-- Run this in your Supabase SQL Editor AFTER the initial schema has been set up

-- Step 1: Create the rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "joinCode" VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create default room
INSERT INTO rooms (id, "joinCode", name) VALUES
('00000000-0000-0000-0000-000000000001'::UUID, 'cottage2026', 'Cottage 2026 - Default Room')
ON CONFLICT ("joinCode") DO NOTHING;

-- Step 3: Add roomId column to options table (nullable initially)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'options' AND column_name = 'roomId'
  ) THEN
    ALTER TABLE options ADD COLUMN "roomId" UUID;
  END IF;
END $$;

-- Step 4: Add roomId column to votes table (nullable initially)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'roomId'
  ) THEN
    ALTER TABLE votes ADD COLUMN "roomId" UUID;
  END IF;
END $$;

-- Step 5: Set default room for all existing options
UPDATE options SET "roomId" = '00000000-0000-0000-0000-000000000001'::UUID
WHERE "roomId" IS NULL;

-- Step 6: Set default room for all existing votes
UPDATE votes SET "roomId" = '00000000-0000-0000-0000-000000000001'::UUID
WHERE "roomId" IS NULL;

-- Step 7: Make roomId NOT NULL and add foreign keys
ALTER TABLE options
  ALTER COLUMN "roomId" SET NOT NULL,
  ADD CONSTRAINT fk_options_room FOREIGN KEY ("roomId") REFERENCES rooms(id) ON DELETE CASCADE;

ALTER TABLE votes
  ALTER COLUMN "roomId" SET NOT NULL,
  ADD CONSTRAINT fk_votes_room FOREIGN KEY ("roomId") REFERENCES rooms(id) ON DELETE CASCADE;

-- Step 8: Drop old unique constraint on options.code and create new composite constraint
ALTER TABLE options DROP CONSTRAINT IF EXISTS options_code_key;
ALTER TABLE options ADD CONSTRAINT unique_room_code UNIQUE ("roomId", code);

-- Step 9: Drop old unique constraint on votes and create new composite constraint
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_voterName_optionId_key;
ALTER TABLE votes ADD CONSTRAINT unique_room_voter_option UNIQUE ("roomId", "voterName", "optionId");

-- Step 10: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_join_code ON rooms("joinCode");
CREATE INDEX IF NOT EXISTS idx_options_room_id ON options("roomId");
CREATE INDEX IF NOT EXISTS idx_votes_room_id ON votes("roomId");

-- Step 11: Enable RLS on rooms table
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Step 12: Create policy for public read access on rooms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Allow public read access on rooms'
  ) THEN
    CREATE POLICY "Allow public read access on rooms" ON rooms FOR SELECT USING (true);
  END IF;
END $$;

-- Step 13: Grant necessary permissions
GRANT ALL ON rooms TO anon, authenticated;

-- Migration complete!
-- All existing data is now in the default room (joinCode: 'cottage2026')
-- You can now create new rooms and they will have isolated options and votes

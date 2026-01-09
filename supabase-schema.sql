-- Cottage 2026 Voting App Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Options table
CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(1) NOT NULL UNIQUE CHECK (code IN ('A', 'B', 'C', 'D', 'E', 'F')),
  nickname VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  location VARCHAR(200) NOT NULL,
  "priceNight" INTEGER NOT NULL,
  "totalEstimate" INTEGER NOT NULL,
  guests INTEGER NOT NULL,
  beds INTEGER NOT NULL,
  baths NUMERIC(3,1) NOT NULL,
  perks TEXT[] NOT NULL DEFAULT '{}',
  "airbnbUrl" TEXT NOT NULL,
  "imageUrls" TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "voterName" VARCHAR(100) NOT NULL,
  "optionId" UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  "voteValue" VARCHAR(10) NOT NULL CHECK ("voteValue" IN ('yes', 'maybe', 'no')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("voterName", "optionId")
);

-- Rankings table
CREATE TABLE IF NOT EXISTS rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "voterName" VARCHAR(100) NOT NULL UNIQUE,
  "firstOptionId" UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  "secondOptionId" UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ("firstOptionId" != "secondOptionId")
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_votes_voter_name ON votes("voterName");
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON votes("optionId");
CREATE INDEX IF NOT EXISTS idx_rankings_voter_name ON rankings("voterName");
CREATE INDEX IF NOT EXISTS idx_rankings_first_option ON rankings("firstOptionId");
CREATE INDEX IF NOT EXISTS idx_rankings_second_option ON rankings("secondOptionId");

-- Insert sample data (6 cottage options with placeholder data)
-- You can update these via the admin panel later
INSERT INTO options (code, nickname, title, location, "priceNight", "totalEstimate", guests, beds, baths, perks, "airbnbUrl", "imageUrls", notes) VALUES
('A', 'Lakeview', 'Lakeview Cottage with Private Beach', 'Muskoka, ON', 450, 1800, 8, 4, 2.0, ARRAY['Private beach', 'Kayaks included', 'Fire pit', 'BBQ'], 'https://airbnb.com', ARRAY['/options/A.jpg'], 'Beautiful lakefront property with stunning sunset views'),
('B', 'Sauna Cabin', 'Modern Cabin with Finnish Sauna', 'Haliburton, ON', 380, 1520, 6, 3, 2.0, ARRAY['Finnish sauna', 'Hot tub', 'Forest trails', 'Game room'], 'https://airbnb.com', ARRAY['/options/B.jpg'], 'Perfect for relaxation with premium sauna experience'),
('C', 'Forest Lodge', 'Rustic Forest Lodge', 'Algonquin, ON', 420, 1680, 10, 5, 3.0, ARRAY['Near hiking trails', 'Large deck', 'Fireplace', 'Sleeps 10'], 'https://airbnb.com', ARRAY['/options/C.jpg'], 'Spacious lodge ideal for large groups'),
('D', 'River House', 'Riverside Retreat', 'Kawartha Lakes, ON', 400, 1600, 8, 4, 2.5, ARRAY['River access', 'Canoe included', 'Fishing dock', 'Screened porch'], 'https://airbnb.com', ARRAY['/options/D.jpg'], 'Great for water activities and fishing enthusiasts'),
('E', 'Ski Chalet', 'Luxury Ski Chalet', 'Blue Mountain, ON', 550, 2200, 8, 4, 3.0, ARRAY['Ski in/out', 'Heated floors', 'Wine cellar', 'Mountain views'], 'https://airbnb.com', ARRAY['/options/E.jpg'], 'Premium winter getaway with ski access'),
('F', 'Island Cottage', 'Private Island Cottage', 'Georgian Bay, ON', 500, 2000, 6, 3, 1.5, ARRAY['Private island', 'Boat included', 'Solar powered', 'Secluded'], 'https://airbnb.com', ARRAY['/options/F.jpg'], 'Ultimate privacy on your own island')
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on options" ON options FOR SELECT USING (true);
CREATE POLICY "Allow public read access on votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on rankings" ON rankings FOR SELECT USING (true);

-- Create policies for public insert/update access (with name-based protection)
CREATE POLICY "Allow public insert on votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update their own votes" ON votes FOR UPDATE USING ("voterName" = "voterName");
CREATE POLICY "Allow public delete on votes" ON votes FOR DELETE USING (true);

CREATE POLICY "Allow public insert on rankings" ON rankings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update their own rankings" ON rankings FOR UPDATE USING ("voterName" = "voterName");
CREATE POLICY "Allow public delete on rankings" ON rankings FOR DELETE USING (true);

-- For admin operations on options (you'll need to handle admin auth separately)
CREATE POLICY "Allow public insert on options" ON options FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on options" ON options FOR UPDATE USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON options TO anon, authenticated;
GRANT ALL ON votes TO anon, authenticated;
GRANT ALL ON rankings TO anon, authenticated;

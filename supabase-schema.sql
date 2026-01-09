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

-- Insert sample data (6 cottage options)
-- Updated with actual Airbnb listings for June 26-29, 2026
-- NOTE: Options A and B currently share the same Airbnb URL - B is marked as TBD until correct link is provided
INSERT INTO options (code, nickname, title, location, "priceNight", "totalEstimate", guests, beds, baths, perks, "airbnbUrl", "imageUrls", notes) VALUES
('A', 'Maple Gateway', 'The Maple Gateway', 'Ontario, Canada', 450, 1800, 7, 4, 2.0, ARRAY['Sleeps 7', 'Lakefront', 'Private beach', 'Fire pit'], 'https://www.airbnb.ca/rooms/50855351?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P30G3hzmZG8xA0pQ&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34', ARRAY['/options/A.jpg'], 'Beautiful gateway cottage'),
('B', 'Family Retreat', 'Lakefront Family Retreat', 'Ontario, Canada - TBD', 0, 0, 7, 4, 2.0, ARRAY['Details pending'], 'https://airbnb.com/tbd', ARRAY['/options/B.jpg'], 'WARNING: This listing shares the same URL as Option A. Awaiting correct Airbnb link.'),
('C', 'Pines & Paddles', 'Pines and Paddles Family Cottage', 'Ontario, Canada', 420, 1680, 7, 4, 2.0, ARRAY['Sleeps 7', 'Waterfront', 'Kayaks', 'Family-friendly'], 'https://www.airbnb.ca/rooms/1047994884766848427?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3P8WKivwuvKMWse&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34', ARRAY['/options/C.jpg'], 'Perfect for family adventures'),
('D', 'Paradise Lake', 'Paradise Lake House, all seasons.', 'Ontario, Canada', 400, 1600, 7, 4, 2.0, ARRAY['Sleeps 7', 'All-season', 'Lake access', 'Year-round'], 'https://www.airbnb.ca/rooms/39502464?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3vpS2cFSOgLqSMw&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34', ARRAY['/options/D.jpg'], 'Beautiful all-season lake house'),
('E', 'Eagle Point', 'Eagle Point, Eagle Lake', 'Ontario, Canada', 480, 1920, 7, 4, 2.0, ARRAY['Sleeps 7', 'Eagle Lake', 'Scenic views', 'Waterfront'], 'https://www.airbnb.ca/rooms/1426867684446395623?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3fG2MkJ1fv8rexl&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34', ARRAY['/options/E.jpg'], 'Stunning Eagle Lake property'),
('F', 'TBD', 'TBD - Additional Option', 'To Be Determined', 0, 0, 0, 0, 0.0, ARRAY['Coming soon'], 'https://airbnb.com/placeholder', ARRAY['/options/F.jpg'], 'Placeholder for future cottage option')
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

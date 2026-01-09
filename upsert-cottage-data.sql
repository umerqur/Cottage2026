-- Upsert Cottage Options - June 2026
-- Run this in your Supabase SQL Editor to update the cottage listings
-- Uses INSERT ... ON CONFLICT to either insert or update records by code
-- Updated with actual Airbnb listings for June 26-29, 2026

-- NOTE: Options A and B currently share the same Airbnb URL (both point to room 50855351)

-- Upsert all cottage options
INSERT INTO options (code, nickname, title, location, "priceNight", "totalEstimate", guests, beds, baths, perks, "airbnbUrl", "imageUrls", notes)
VALUES
  (
    'A',
    'Maple Gateway',
    'The Maple Gateway',
    'Ontario, Canada',
    450,
    1800,
    7,
    4,
    2.0,
    ARRAY['Sleeps 7', 'Lakefront', 'Private beach', 'Fire pit'],
    'https://www.airbnb.ca/rooms/50855351?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P30G3hzmZG8xA0pQ&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
    ARRAY['/options/Maple_Getaway.png'],
    'Beautiful gateway cottage'
  ),
  (
    'B',
    'Family Retreat',
    'Lakefront Family Retreat',
    'Ontario, Canada',
    450,
    1800,
    7,
    4,
    2.0,
    ARRAY['Sleeps 7', 'Lakefront', 'Private beach', 'Fire pit'],
    'https://www.airbnb.ca/rooms/50855351?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P30G3hzmZG8xA0pQ&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
    ARRAY['/options/Lakefront_Family_Retreat.png'],
    'NOTE: Shares same Airbnb URL as Option A'
  ),
  (
    'C',
    'Pines & Paddles',
    'Pines and Paddles Family Cottage',
    'Ontario, Canada',
    420,
    1680,
    7,
    4,
    2.0,
    ARRAY['Sleeps 7', 'Waterfront', 'Kayaks', 'Family-friendly'],
    'https://www.airbnb.ca/rooms/1047994884766848427?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3P8WKivwuvKMWse&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
    ARRAY['/options/Pines_Paddles_Family_Cottage.png'],
    'Perfect for family adventures'
  ),
  (
    'D',
    'Paradise Lake',
    'Paradise Lake House, all seasons.',
    'Ontario, Canada',
    400,
    1600,
    7,
    4,
    2.0,
    ARRAY['Sleeps 7', 'All-season', 'Lake access', 'Year-round'],
    'https://www.airbnb.ca/rooms/39502464?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3vpS2cFSOgLqSMw&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
    ARRAY['/options/Paradise_Lake_House.png'],
    'Beautiful all-season lake house'
  ),
  (
    'E',
    'Eagle Point',
    'Eagle Point, Eagle Lake',
    'Ontario, Canada',
    480,
    1920,
    7,
    4,
    2.0,
    ARRAY['Sleeps 7', 'Eagle Lake', 'Scenic views', 'Waterfront'],
    'https://www.airbnb.ca/rooms/1426867684446395623?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3fG2MkJ1fv8rexl&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
    ARRAY['/options/placeholder.png'],
    'Stunning Eagle Lake property - Image coming soon'
  )
ON CONFLICT (code)
DO UPDATE SET
  nickname = EXCLUDED.nickname,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  "priceNight" = EXCLUDED."priceNight",
  "totalEstimate" = EXCLUDED."totalEstimate",
  guests = EXCLUDED.guests,
  beds = EXCLUDED.beds,
  baths = EXCLUDED.baths,
  perks = EXCLUDED.perks,
  "airbnbUrl" = EXCLUDED."airbnbUrl",
  "imageUrls" = EXCLUDED."imageUrls",
  notes = EXCLUDED.notes;

-- Verify the updates
SELECT code, nickname, title, location, "priceNight", "totalEstimate", "airbnbUrl", "imageUrls"[1] as "primaryImage"
FROM options
WHERE code IN ('A', 'B', 'C', 'D', 'E')
ORDER BY code;

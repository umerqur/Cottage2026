-- Update Cottage Options - June 2026
-- Run this in your Supabase SQL Editor to update the cottage listings
-- Updated with actual Airbnb listings for June 26-29, 2026

-- NOTE: Options A and B currently share the same Airbnb URL (both point to room 50855351)

-- Update Option A: The Maple Gateway
UPDATE options
SET
  nickname = 'Maple Gateway',
  title = 'The Maple Gateway',
  location = 'Ontario, Canada',
  "priceNight" = 450,
  "totalEstimate" = 1800,
  guests = 7,
  beds = 4,
  baths = 2.0,
  perks = ARRAY['Sleeps 7', 'Lakefront', 'Private beach', 'Fire pit'],
  "airbnbUrl" = 'https://www.airbnb.ca/rooms/50855351?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P30G3hzmZG8xA0pQ&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
  "imageUrls" = ARRAY['/options/Maple_Getaway.png'],
  notes = 'Beautiful gateway cottage'
WHERE code = 'A';

-- Update Option B: Lakefront Family Retreat (shares URL with Option A)
UPDATE options
SET
  nickname = 'Family Retreat',
  title = 'Lakefront Family Retreat',
  location = 'Ontario, Canada',
  "priceNight" = 450,
  "totalEstimate" = 1800,
  guests = 7,
  beds = 4,
  baths = 2.0,
  perks = ARRAY['Sleeps 7', 'Lakefront', 'Private beach', 'Fire pit'],
  "airbnbUrl" = 'https://www.airbnb.ca/rooms/50855351?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P30G3hzmZG8xA0pQ&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
  "imageUrls" = ARRAY['/options/Lakefront_Family_Retreat.png'],
  notes = 'NOTE: Shares same Airbnb URL as Option A'
WHERE code = 'B';

-- Update Option C: Pines and Paddles Family Cottage
UPDATE options
SET
  nickname = 'Pines & Paddles',
  title = 'Pines and Paddles Family Cottage',
  location = 'Ontario, Canada',
  "priceNight" = 420,
  "totalEstimate" = 1680,
  guests = 7,
  beds = 4,
  baths = 2.0,
  perks = ARRAY['Sleeps 7', 'Waterfront', 'Kayaks', 'Family-friendly'],
  "airbnbUrl" = 'https://www.airbnb.ca/rooms/1047994884766848427?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3P8WKivwuvKMWse&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
  "imageUrls" = ARRAY['/options/Pines_Paddles_Family_Cottage.png'],
  notes = 'Perfect for family adventures'
WHERE code = 'C';

-- Update Option D: Paradise Lake House, all seasons.
UPDATE options
SET
  nickname = 'Paradise Lake',
  title = 'Paradise Lake House, all seasons.',
  location = 'Ontario, Canada',
  "priceNight" = 400,
  "totalEstimate" = 1600,
  guests = 7,
  beds = 4,
  baths = 2.0,
  perks = ARRAY['Sleeps 7', 'All-season', 'Lake access', 'Year-round'],
  "airbnbUrl" = 'https://www.airbnb.ca/rooms/39502464?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3vpS2cFSOgLqSMw&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
  "imageUrls" = ARRAY['/options/Paradise_Lake_House.png'],
  notes = 'Beautiful all-season lake house'
WHERE code = 'D';

-- Update Option E: Eagle Point, Eagle Lake
UPDATE options
SET
  nickname = 'Eagle Point',
  title = 'Eagle Point, Eagle Lake',
  location = 'Ontario, Canada',
  "priceNight" = 480,
  "totalEstimate" = 1920,
  guests = 7,
  beds = 4,
  baths = 2.0,
  perks = ARRAY['Sleeps 7', 'Eagle Lake', 'Scenic views', 'Waterfront'],
  "airbnbUrl" = 'https://www.airbnb.ca/rooms/1426867684446395623?adults=7&check_in=2026-06-26&check_out=2026-06-29&search_mode=regular_search&source_impression_id=p3_1767886134_P3fG2MkJ1fv8rexl&previous_page_section_name=1000&federated_search_id=3372d947-ab47-40b4-867d-065ec45afc34',
  "imageUrls" = ARRAY['/options/placeholder.png'],
  notes = 'Stunning Eagle Lake property - Image coming soon'
WHERE code = 'E';

-- Update Option F: TBD Placeholder
UPDATE options
SET
  nickname = 'TBD',
  title = 'TBD - Additional Option',
  location = 'To Be Determined',
  "priceNight" = 0,
  "totalEstimate" = 0,
  guests = 0,
  beds = 0,
  baths = 0.0,
  perks = ARRAY['Coming soon'],
  "airbnbUrl" = 'https://airbnb.com/placeholder',
  "imageUrls" = ARRAY['/options/F.jpg'],
  notes = 'Placeholder for future cottage option'
WHERE code = 'F';

-- Verify the updates
SELECT code, nickname, title, location, "airbnbUrl" FROM options ORDER BY code;

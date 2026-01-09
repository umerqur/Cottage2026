-- Delete options E (Ski Chalet) and F (Island Cottage) from database
-- Run this in your Supabase SQL Editor

-- First, delete any votes associated with options E and F
DELETE FROM votes
WHERE "optionId" IN (
  SELECT id FROM options WHERE code IN ('E', 'F')
);

-- Delete any rankings that reference options E or F
DELETE FROM rankings
WHERE "firstOptionId" IN (
  SELECT id FROM options WHERE code IN ('E', 'F')
)
OR "secondOptionId" IN (
  SELECT id FROM options WHERE code IN ('E', 'F')
);

-- Finally, delete the options themselves
DELETE FROM options WHERE code IN ('E', 'F');

-- Verify deletion
SELECT code, nickname, title FROM options ORDER BY code;

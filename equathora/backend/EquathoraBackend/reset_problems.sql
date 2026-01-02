-- Delete all problems except the first 5 seeded ones
-- Run this in Supabase SQL Editor

DELETE FROM problems WHERE id > 5;

-- Reset the sequence to continue from 5
SELECT setval('problems_id_seq', (SELECT MAX(id) FROM problems));

-- Verify only 5 problems remain
SELECT COUNT(*) as total_problems FROM problems;
SELECT * FROM problems ORDER BY id;

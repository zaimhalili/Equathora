-- Reset all user progress data
-- Run this in Supabase SQL Editor to clear all user progress

-- Delete all user submissions
DELETE FROM user_submissions;

-- Delete all user streak data
DELETE FROM user_streak_data;

-- Delete all user favorites
DELETE FROM user_favorites;

-- Delete all completed problems
DELETE FROM user_completed_problems;

-- Delete all difficulty breakdowns
DELETE FROM user_difficulty_breakdown;

-- Delete all weekly progress
DELETE FROM user_weekly_progress;

-- Delete all topic frequency
DELETE FROM user_topic_frequency;

-- Delete all user progress
DELETE FROM user_progress;

-- Verify all tables are empty
SELECT 'user_progress' AS table_name, COUNT(*) AS count FROM user_progress
UNION ALL
SELECT 'user_completed_problems', COUNT(*) FROM user_completed_problems
UNION ALL
SELECT 'user_favorites', COUNT(*) FROM user_favorites
UNION ALL
SELECT 'user_streak_data', COUNT(*) FROM user_streak_data
UNION ALL
SELECT 'user_submissions', COUNT(*) FROM user_submissions;

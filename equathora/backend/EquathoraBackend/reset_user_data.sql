-- Reset all user problem-solving data
-- This will clear all progress, submissions, favorites, streaks, etc.
-- Users can start fresh with accurate tracking

BEGIN;

-- Delete all user submission records
DELETE FROM user_submissions;

-- Delete all streak data
DELETE FROM user_streak_data;

-- Delete all favorites
DELETE FROM user_favorites;

-- Delete all completed problems (this is where duplicates were happening)
DELETE FROM user_completed_problems;

-- Delete difficulty breakdown
DELETE FROM user_difficulty_breakdown;

-- Delete weekly progress
DELETE FROM user_weekly_progress;

-- Delete topic frequency
DELETE FROM user_topic_frequency;

-- Reset user progress table
DELETE FROM user_progress;

COMMIT;

-- Refresh the leaderboard materialized view (optional - ignore if it doesn't exist)
DO $$
BEGIN
    REFRESH MATERIALIZED VIEW leaderboard_view;
EXCEPTION
    WHEN undefined_table THEN
        NULL; -- View doesn't exist, that's fine
END $$;

-- Verify all data has been cleared
SELECT 'user_progress' AS table_name, COUNT(*) AS count
FROM user_progress
UNION ALL
SELECT 'user_completed_problems', COUNT(*)
FROM user_completed_problems
UNION ALL
SELECT 'user_favorites', COUNT(*)
FROM user_favorites
UNION ALL
SELECT 'user_streak_data', COUNT(*)
FROM user_streak_data
UNION ALL
SELECT 'user_submissions', COUNT(*)
FROM user_submissions
UNION ALL
SELECT 'user_difficulty_breakdown', COUNT(*)
FROM user_difficulty_breakdown
UNION ALL
SELECT 'user_weekly_progress', COUNT(*)
FROM user_weekly_progress
UNION ALL
SELECT 'user_topic_frequency', COUNT(*)
FROM user_topic_frequency;
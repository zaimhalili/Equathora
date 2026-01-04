DELETE FROM user_submissions;

DELETE FROM user_streak_data;

DELETE FROM user_favorites;

DELETE FROM user_completed_problems;

DELETE FROM user_difficulty_breakdown;

DELETE FROM user_weekly_progress;

DELETE FROM user_topic_frequency;

DELETE FROM user_progress;

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
FROM user_submissions;
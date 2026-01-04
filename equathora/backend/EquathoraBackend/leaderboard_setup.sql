-- ============================================================================
-- LEADERBOARD DATABASE POLICIES
-- Run this in Supabase SQL Editor to enable public leaderboard access
-- ============================================================================

-- Allow public read access to user_progress for leaderboard
-- Users can see others' progress data (but not modify)
DROP POLICY IF EXISTS "Public users can view leaderboard data" ON user_progress;

CREATE POLICY "Public users can view leaderboard data" ON user_progress FOR
SELECT TO authenticated USING (true);

-- Allow public read access to user_streak_data for leaderboard
DROP POLICY IF EXISTS "Public users can view streak leaderboard data" ON user_streak_data;

CREATE POLICY "Public users can view streak leaderboard data" ON user_streak_data FOR
SELECT TO authenticated USING (true);

-- Keep existing policies for INSERT/UPDATE (users can only modify own data)
-- These should already exist from database_schema.sql

-- ============================================================================
-- VERIFY POLICIES
-- ============================================================================

-- Check all policies on user_progress
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE
    tablename = 'user_progress';

-- Check all policies on user_streak_data
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE
    tablename = 'user_streak_data';

-- ============================================================================
-- OPTIONAL: ADD XP COLUMN TO USER_PROGRESS
-- This can store pre-calculated XP for better performance
-- ============================================================================

-- Add XP column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'total_xp'
    ) THEN
        ALTER TABLE user_progress ADD COLUMN total_xp INTEGER DEFAULT 0;

END IF;

END $$;

-- ============================================================================
-- FUNCTION TO CALCULATE AND UPDATE XP (Optional)
-- This can be called periodically or after problem completions
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_user_xp(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_xp INTEGER;
    v_solved_count INTEGER;
    v_correct_answers INTEGER;
    v_total_attempts INTEGER;
    v_reputation INTEGER;
    v_perfect_streak INTEGER;
    v_current_streak INTEGER;
    v_base_xp INTEGER;
    v_accuracy_bonus INTEGER;
    v_streak_bonus INTEGER;
    v_perfect_streak_bonus INTEGER;
BEGIN
    -- Get user progress data
    SELECT 
        array_length(solved_problems, 1),
        correct_answers,
        total_attempts,
        reputation,
        perfect_streak
    INTO 
        v_solved_count,
        v_correct_answers,
        v_total_attempts,
        v_reputation,
        v_perfect_streak
    FROM user_progress
    WHERE user_id = p_user_id;

    -- Get current streak
    SELECT current_streak INTO v_current_streak
    FROM user_streak_data
    WHERE user_id = p_user_id;

    -- Handle NULL values
    v_solved_count := COALESCE(v_solved_count, 0);
    v_correct_answers := COALESCE(v_correct_answers, 0);
    v_total_attempts := COALESCE(v_total_attempts, 0);
    v_reputation := COALESCE(v_reputation, 0);
    v_perfect_streak := COALESCE(v_perfect_streak, 0);
    v_current_streak := COALESCE(v_current_streak, 0);

    -- Calculate XP components
    v_base_xp := v_solved_count * 50;
    
    IF v_total_attempts > 0 THEN
        v_accuracy_bonus := ROUND((v_correct_answers::DECIMAL / v_total_attempts) * 500);
    ELSE
        v_accuracy_bonus := 0;
    END IF;
    
    v_streak_bonus := v_current_streak * 10;
    v_perfect_streak_bonus := v_perfect_streak * 20;

    -- Calculate total XP
    v_xp := v_base_xp + v_accuracy_bonus + v_streak_bonus + v_reputation + v_perfect_streak_bonus;

    -- Update the user_progress table with calculated XP
    UPDATE user_progress
    SET total_xp = v_xp,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN v_xp;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER TO AUTO-UPDATE XP (Optional)
-- Automatically recalculate XP when user_progress is updated
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_calculate_xp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_xp := (
        SELECT calculate_user_xp(NEW.user_id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS auto_calculate_xp ON user_progress;

-- Create trigger (optional - may impact performance)
-- Comment out if you prefer to calculate XP on-demand
/*
CREATE TRIGGER auto_calculate_xp
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION trigger_calculate_xp();
*/

-- ============================================================================
-- BULK XP CALCULATION (Run once to initialize)
-- Calculate XP for all existing users
-- ============================================================================

-- Uncomment and run this to initialize XP for all users:
/*
DO $$
DECLARE
user_record RECORD;
BEGIN
FOR user_record IN (SELECT user_id FROM user_progress)
LOOP
PERFORM calculate_user_xp(user_record.user_id);
END LOOP;
END $$;
*/

-- ============================================================================
-- LEADERBOARD VIEW (Optional - for better performance)
-- Create a materialized view for leaderboard data
-- ============================================================================

-- Drop if exists
DROP MATERIALIZED VIEW IF EXISTS leaderboard_view;

-- Create materialized view
CREATE MATERIALIZED VIEW leaderboard_view AS
SELECT
    up.user_id,
    up.solved_problems,
    up.correct_answers,
    up.wrong_submissions,
    up.total_attempts,
    up.reputation,
    up.perfect_streak,
    up.total_xp,
    COALESCE(
        array_length(up.solved_problems, 1),
        0
    ) as problems_solved_count,
    CASE
        WHEN up.total_attempts > 0 THEN ROUND(
            (
                up.correct_answers::DECIMAL / up.total_attempts
            ) * 100
        )
        ELSE 0
    END as accuracy_percentage,
    sd.current_streak,
    sd.longest_streak,
    ROW_NUMBER() OVER (
        ORDER BY up.total_xp DESC, up.reputation DESC, problems_solved_count DESC
    ) as rank
FROM
    user_progress up
    LEFT JOIN user_streak_data sd ON up.user_id = sd.user_id
ORDER BY up.total_xp DESC;

-- Create index on materialized view
CREATE INDEX idx_leaderboard_view_rank ON leaderboard_view (rank);

CREATE INDEX idx_leaderboard_view_user_id ON leaderboard_view (user_id);

-- Refresh the materialized view (run this periodically or after updates)
-- REFRESH MATERIALIZED VIEW leaderboard_view;

-- ============================================================================
-- SCHEDULED REFRESH (Optional - requires pg_cron extension)
-- Auto-refresh leaderboard every 5 minutes
-- ============================================================================

/*
-- Enable pg_cron extension first (run as postgres superuser)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule refresh every 5 minutes
SELECT cron.schedule(
'refresh-leaderboard',
'*/
5 * * * *',
    'REFRESH MATERIALIZED VIEW leaderboard_view'
);

-- To unschedule:
-- SELECT cron.unschedule('refresh-leaderboard');
*/

-- ============================================================================
-- USAGE NOTES
-- ============================================================================

/*
IMPLEMENTATION STEPS:

1. Run the policy statements at the top to enable leaderboard access
2. Optionally add total_xp column for performance
3. Optionally create calculate_user_xp function for pre-calculation
4. Optionally create materialized view for better performance
5. In your application, either:
   - Calculate XP on-the-fly (current approach in leaderboardService.js)
   - Call calculate_user_xp() function from database
   - Query from materialized view if created

PERFORMANCE CONSIDERATIONS:

- On-the-fly calculation: Simple, always accurate, but slower for large user bases
- Stored XP column: Fast queries, but needs periodic updates
- Materialized view: Fastest queries, but needs scheduled refreshes

For current user base size (< 1000 users), on-the-fly calculation is fine.
For larger scale (10k+ users), consider materialized view approach.
*/
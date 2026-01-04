DROP POLICY IF EXISTS "Public users can view leaderboard data" ON user_progress;

CREATE POLICY "Public users can view leaderboard data" ON user_progress FOR
SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public users can view streak leaderboard data" ON user_streak_data;

CREATE POLICY "Public users can view streak leaderboard data" ON user_streak_data FOR
SELECT TO authenticated USING (true);

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

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'total_xp'
    ) THEN
        ALTER TABLE user_progress ADD COLUMN total_xp INTEGER DEFAULT 0;

END IF;

END $$;

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

    SELECT current_streak INTO v_current_streak
    FROM user_streak_data
    WHERE user_id = p_user_id;

    v_solved_count := COALESCE(v_solved_count, 0);
    v_correct_answers := COALESCE(v_correct_answers, 0);
    v_total_attempts := COALESCE(v_total_attempts, 0);
    v_reputation := COALESCE(v_reputation, 0);
    v_perfect_streak := COALESCE(v_perfect_streak, 0);
    v_current_streak := COALESCE(v_current_streak, 0);

    v_base_xp := v_solved_count * 50;
    
    IF v_total_attempts > 0 THEN
        v_accuracy_bonus := ROUND((v_correct_answers::DECIMAL / v_total_attempts) * 500);
    ELSE
        v_accuracy_bonus := 0;
    END IF;
    
    v_streak_bonus := v_current_streak * 10;
    v_perfect_streak_bonus := v_perfect_streak * 20;

    v_xp := v_base_xp + v_accuracy_bonus + v_streak_bonus + v_reputation + v_perfect_streak_bonus;

    UPDATE user_progress
    SET total_xp = v_xp,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN v_xp;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_calculate_xp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_xp := (
        SELECT calculate_user_xp(NEW.user_id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_calculate_xp ON user_progress;

/*
CREATE TRIGGER auto_calculate_xp
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION trigger_calculate_xp();
*/

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

CREATE INDEX idx_leaderboard_view_rank ON leaderboard_view (rank);

CREATE INDEX idx_leaderboard_view_user_id ON leaderboard_view (user_id);

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
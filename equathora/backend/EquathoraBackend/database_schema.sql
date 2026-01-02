-- User Progress Database Schema for Equathora
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User progress table (main progress tracking)
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    total_problems INTEGER DEFAULT 30,
    solved_problems TEXT [] DEFAULT '{}',
    correct_answers INTEGER DEFAULT 0,
    wrong_submissions INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    concepts_learned INTEGER DEFAULT 0,
    perfect_streak INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5, 2) DEFAULT 0,
    last_reputation_streak INTEGER DEFAULT 0,
    account_created BIGINT DEFAULT EXTRACT(
        EPOCH
        FROM NOW()
    )::BIGINT * 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id)
);

-- Topic frequency tracking
CREATE TABLE IF NOT EXISTS user_topic_frequency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    topic VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, topic)
);

-- Weekly progress tracking
CREATE TABLE IF NOT EXISTS user_weekly_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    day_index INTEGER NOT NULL CHECK (
        day_index >= 0
        AND day_index <= 6
    ),
    count INTEGER DEFAULT 0,
    week_start_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (
        user_id,
        day_index,
        week_start_date
    )
);

-- Difficulty breakdown
CREATE TABLE IF NOT EXISTS user_difficulty_breakdown (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (
        difficulty IN ('easy', 'medium', 'hard')
    ),
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, difficulty)
);

-- Completed problems
CREATE TABLE IF NOT EXISTS user_completed_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    problem_id VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent_seconds INTEGER,
    difficulty VARCHAR(20),
    topic VARCHAR(255),
    UNIQUE (user_id, problem_id)
);

-- Favorite problems
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    problem_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, problem_id)
);

-- Streak data
CREATE TABLE IF NOT EXISTS user_streak_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    streak_start_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id)
);

-- Problem submissions
CREATE TABLE IF NOT EXISTS user_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    problem_id VARCHAR(255) NOT NULL,
    submitted_answer TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    time_spent_seconds INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_topic_frequency ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_weekly_progress ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_difficulty_breakdown ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_completed_problems ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_streak_data ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own progress" ON user_progress FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY "Users can view own topics" ON user_topic_frequency FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own topics" ON user_topic_frequency FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own topics" ON user_topic_frequency
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY "Users can view own weekly progress" ON user_weekly_progress FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own weekly progress" ON user_weekly_progress FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own weekly progress" ON user_weekly_progress
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY "Users can view own difficulty" ON user_difficulty_breakdown FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own difficulty" ON user_difficulty_breakdown FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own difficulty" ON user_difficulty_breakdown
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY "Users can view own completed" ON user_completed_problems FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own completed" ON user_completed_problems FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can delete own completed" ON user_completed_problems FOR DELETE USING (auth.uid () = user_id);

CREATE POLICY "Users can view own favorites" ON user_favorites FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites FOR DELETE USING (auth.uid () = user_id);

CREATE POLICY "Users can view own streak" ON user_streak_data FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own streak" ON user_streak_data FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own streak" ON user_streak_data
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY "Users can view own submissions" ON user_submissions FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own submissions" ON user_submissions FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress (user_id);

CREATE INDEX IF NOT EXISTS idx_user_topic_user_id ON user_topic_frequency (user_id);

CREATE INDEX IF NOT EXISTS idx_user_weekly_user_id ON user_weekly_progress (user_id);

CREATE INDEX IF NOT EXISTS idx_user_difficulty_user_id ON user_difficulty_breakdown (user_id);

CREATE INDEX IF NOT EXISTS idx_user_completed_user_id ON user_completed_problems (user_id);

CREATE INDEX IF NOT EXISTS idx_user_completed_problem_id ON user_completed_problems (problem_id);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites (user_id);

CREATE INDEX IF NOT EXISTS idx_user_streak_user_id ON user_streak_data (user_id);

CREATE INDEX IF NOT EXISTS idx_user_submissions_user_id ON user_submissions (user_id);

CREATE INDEX IF NOT EXISTS idx_user_submissions_problem_id ON user_submissions (problem_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_topic_updated_at BEFORE UPDATE ON user_topic_frequency FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_weekly_updated_at BEFORE UPDATE ON user_weekly_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_difficulty_updated_at BEFORE UPDATE ON user_difficulty_breakdown FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_streak_updated_at BEFORE UPDATE ON user_streak_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
BEGIN;

ALTER TABLE public.user_streak_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_completed_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_solution_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_submissions
    ADD COLUMN IF NOT EXISTS steps jsonb NOT NULL DEFAULT '[]'::jsonb;

GRANT SELECT, INSERT, UPDATE ON TABLE public.user_streak_data TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_completed_problems TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_solution_views TO authenticated;

DROP POLICY IF EXISTS "Users can view own solution views" ON public.user_solution_views;
CREATE POLICY "Users can view own solution views"
ON public.user_solution_views
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own solution views" ON public.user_solution_views;
CREATE POLICY "Users can insert own solution views"
ON public.user_solution_views
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own solution views" ON public.user_solution_views;
CREATE POLICY "Users can update own solution views"
ON public.user_solution_views
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own submissions" ON public.user_submissions;
CREATE POLICY "Users can view own submissions"
ON public.user_submissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own submissions" ON public.user_submissions;
CREATE POLICY "Users can insert own submissions"
ON public.user_submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own submissions" ON public.user_submissions;
CREATE POLICY "Users can update own submissions"
ON public.user_submissions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own streak" ON public.user_streak_data;
CREATE POLICY "Users can insert own streak"
ON public.user_streak_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streak" ON public.user_streak_data;
CREATE POLICY "Users can update own streak"
ON public.user_streak_data
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own completed" ON public.user_completed_problems;
CREATE POLICY "Users can insert own completed"
ON public.user_completed_problems
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own completed" ON public.user_completed_problems;
CREATE POLICY "Users can update own completed"
ON public.user_completed_problems
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

COMMIT;

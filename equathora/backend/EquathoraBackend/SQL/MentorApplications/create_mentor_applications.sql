BEGIN;

CREATE TABLE IF NOT EXISTS public.mentor_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
    full_name text NOT NULL CHECK (CHAR_LENGTH(BTRIM(full_name)) BETWEEN 2 AND 120),
    email text NOT NULL CHECK (
        CHAR_LENGTH(email) <= 255
        AND email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'
    ),
    phone text NOT NULL CHECK (CHAR_LENGTH(BTRIM(phone)) BETWEEN 5 AND 40),
    role text NOT NULL CHECK (
        role IN ('Teacher', 'Tutor', 'School administrator', 'Parent or guardian', 'Learning supporter')
    ),
    subjects text[] NOT NULL CHECK (
        CARDINALITY(subjects) > 0
        AND subjects <@ ARRAY[
            'General math', 'Algebra', 'Geometry', 'Precalculus', 'Calculus', 'SAT / ACT', 'AP math'
        ]::text[]
    ),
    teaching_experience text NOT NULL CHECK (
        teaching_experience IN ('Less than 1 year', '1–3 years', '4–7 years', '8+ years', 'I support learners in another way')
    ),
    platforms text[] NOT NULL DEFAULT '{}',
    school_lms text[] NOT NULL DEFAULT '{}',
    interested_features text[] NOT NULL DEFAULT '{}',
    additional_notes text NOT NULL DEFAULT '' CHECK (CHAR_LENGTH(additional_notes) <= 2000),
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (platforms <@ ARRAY['Khan Academy', 'IXL', 'ALEKS', 'Desmos', 'Quizlet', 'Other']::text[]),
    CHECK (school_lms <@ ARRAY['Google Classroom', 'Canvas', 'Schoology', 'Microsoft Teams', 'No LMS', 'Other']::text[]),
    CHECK (interested_features <@ ARRAY[
        'Practice questions',
        'Full-length practice tests',
        'Assigning homework or tests',
        'Student analytics and progress tracking',
        'Reports for students and families',
        'Personalized study plans',
        'Other'
    ]::text[])
);

-- Keep this script safe to rerun and upgrade the earlier draft if it was partially applied.
ALTER TABLE public.mentor_applications
    ADD COLUMN IF NOT EXISTS phone text;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.mentor_applications
        WHERE phone IS NULL
           OR CHAR_LENGTH(BTRIM(phone)) NOT BETWEEN 5 AND 40
    ) THEN
        RAISE EXCEPTION 'Existing mentor applications need valid phone numbers before this migration can continue.';
    END IF;
END;
$$;

ALTER TABLE public.mentor_applications
    ALTER COLUMN phone SET NOT NULL;

ALTER TABLE public.mentor_applications
    DROP COLUMN IF EXISTS has_whatsapp;

ALTER TABLE public.mentor_applications
    DROP CONSTRAINT IF EXISTS mentor_applications_phone_check;

ALTER TABLE public.mentor_applications
    ADD CONSTRAINT mentor_applications_phone_check
    CHECK (CHAR_LENGTH(BTRIM(phone)) BETWEEN 5 AND 40);

ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO authenticated;
REVOKE ALL ON TABLE public.mentor_applications FROM PUBLIC, anon, authenticated;
GRANT INSERT, SELECT ON TABLE public.mentor_applications TO authenticated;

DROP POLICY IF EXISTS mentor_applications_insert_own ON public.mentor_applications;
CREATE POLICY mentor_applications_insert_own
    ON public.mentor_applications
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS mentor_applications_admin_select ON public.mentor_applications;
CREATE POLICY mentor_applications_admin_select
    ON public.mentor_applications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.profiles AS profile
            WHERE profile.id = (SELECT auth.uid())
              AND profile.role = 'admin'
        )
    );

COMMIT;

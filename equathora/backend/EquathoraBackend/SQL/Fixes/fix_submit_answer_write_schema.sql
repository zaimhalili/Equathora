BEGIN;

CREATE OR REPLACE FUNCTION public.submit_answer_write(
    p_user_id uuid,
    p_problem_id integer,
    p_is_correct boolean,
    p_user_answer text,
    p_xp_reward integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
    v_already_completed boolean := false;
    v_newly_completed boolean := false;
    v_xp_gained integer := 0;
    v_today date := CURRENT_DATE;
    v_last_activity date;
    v_current_streak integer := 0;
    v_longest_streak integer := 0;
    v_new_streak integer := 0;
BEGIN
    IF p_user_id IS NULL OR p_problem_id IS NULL OR p_is_correct IS NULL THEN
        RAISE EXCEPTION 'Submission is missing required values'
            USING ERRCODE = '22004';
    END IF;

    IF COALESCE(auth.role(), '') <> 'service_role'
       AND auth.uid() IS DISTINCT FROM p_user_id THEN
        RAISE EXCEPTION 'Cannot record a submission for another user'
            USING ERRCODE = '42501';
    END IF;

    INSERT INTO public.user_submissions (
        user_id,
        problem_id,
        problem_id_int,
        is_correct,
        submitted_answer,
        submitted_at
    )
    VALUES (
        p_user_id,
        p_problem_id::text,
        p_problem_id,
        p_is_correct,
        p_user_answer,
        NOW()
    );

    SELECT EXISTS (
        SELECT 1
        FROM public.user_completed_problems
        WHERE user_id = p_user_id
          AND (problem_id_int = p_problem_id OR problem_id = p_problem_id::text)
    )
    INTO v_already_completed;

    IF p_is_correct AND NOT v_already_completed THEN
        INSERT INTO public.user_completed_problems (
            user_id,
            problem_id,
            problem_id_int,
            completed_at
        )
        VALUES (
            p_user_id,
            p_problem_id::text,
            p_problem_id,
            NOW()
        );

        v_newly_completed := true;
        v_xp_gained := GREATEST(COALESCE(p_xp_reward, 0), 0);
    END IF;

    INSERT INTO public.user_progress (
        user_id,
        total_attempts,
        correct_answers,
        wrong_submissions,
        solved_problems,
        total_xp,
        updated_at
    )
    VALUES (
        p_user_id,
        1,
        CASE WHEN p_is_correct THEN 1 ELSE 0 END,
        CASE WHEN p_is_correct THEN 0 ELSE 1 END,
        CASE WHEN v_newly_completed THEN ARRAY[p_problem_id::text] ELSE ARRAY[]::text[] END,
        v_xp_gained,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_attempts = COALESCE(public.user_progress.total_attempts, 0) + 1,
        correct_answers = COALESCE(public.user_progress.correct_answers, 0)
            + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
        wrong_submissions = COALESCE(public.user_progress.wrong_submissions, 0)
            + CASE WHEN p_is_correct THEN 0 ELSE 1 END,
        solved_problems = CASE
            WHEN v_newly_completed THEN ARRAY(
                SELECT DISTINCT solution_ids.solved_id
                FROM unnest(
                    COALESCE(public.user_progress.solved_problems, ARRAY[]::text[])
                    || ARRAY[p_problem_id::text]
                ) AS solution_ids(solved_id)
            )
            ELSE COALESCE(public.user_progress.solved_problems, ARRAY[]::text[])
        END,
        total_xp = COALESCE(public.user_progress.total_xp, 0) + v_xp_gained,
        updated_at = NOW();

    IF v_newly_completed THEN
        SELECT last_activity_date, current_streak, longest_streak
        INTO v_last_activity, v_current_streak, v_longest_streak
        FROM public.user_streak_data
        WHERE user_id = p_user_id
        FOR UPDATE;

        IF v_last_activity IS NULL THEN
            v_new_streak := 1;
        ELSIF v_last_activity = v_today THEN
            v_new_streak := GREATEST(COALESCE(v_current_streak, 0), 1);
        ELSIF v_last_activity = v_today - 1 THEN
            v_new_streak := COALESCE(v_current_streak, 0) + 1;
        ELSE
            v_new_streak := 1;
        END IF;

        INSERT INTO public.user_streak_data (
            user_id,
            current_streak,
            longest_streak,
            last_activity_date,
            streak_start_date,
            updated_at
        )
        VALUES (
            p_user_id,
            v_new_streak,
            GREATEST(COALESCE(v_longest_streak, 0), v_new_streak),
            v_today,
            v_today,
            NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            current_streak = EXCLUDED.current_streak,
            longest_streak = GREATEST(
                COALESCE(public.user_streak_data.longest_streak, 0),
                EXCLUDED.current_streak
            ),
            last_activity_date = EXCLUDED.last_activity_date,
            streak_start_date = CASE
                WHEN public.user_streak_data.last_activity_date IS NULL
                     OR public.user_streak_data.last_activity_date < v_today - 1
                THEN v_today
                ELSE public.user_streak_data.streak_start_date
            END,
            updated_at = NOW();

        DELETE FROM public.user_in_progress_problems
        WHERE user_id = p_user_id
          AND problem_id = p_problem_id::text;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', v_already_completed,
        'xp_gained', v_xp_gained,
        'current_streak', CASE
            WHEN v_newly_completed THEN v_new_streak
            ELSE COALESCE(v_current_streak, 0)
        END
    );
END;
$function$;

REVOKE ALL ON FUNCTION public.submit_answer_write(uuid, integer, boolean, text, integer)
    FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_answer_write(uuid, integer, boolean, text, integer)
    TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;

-- Persist leaderboard visibility on profiles so leaderboard readers can enforce it.
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS privacy_show_leaderboard BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE public.profiles AS profile
SET privacy_show_leaderboard = CASE
    WHEN lower(COALESCE(settings.settings ->> 'privacy_show_leaderboard', 'true')) IN ('true', 'false')
        THEN lower(settings.settings ->> 'privacy_show_leaderboard')::BOOLEAN
    ELSE TRUE
END
FROM public.user_settings AS settings
WHERE settings.user_id = profile.id;

CREATE OR REPLACE FUNCTION public.save_leaderboard_privacy(
    p_enabled BOOLEAN,
    p_settings JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    UPDATE public.profiles
    SET privacy_show_leaderboard = p_enabled
    WHERE id = auth.uid();

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    INSERT INTO public.user_settings (user_id, settings, updated_at)
    VALUES (auth.uid(), COALESCE(p_settings, '{}'::JSONB), now())
    ON CONFLICT (user_id)
    DO UPDATE SET
        settings = EXCLUDED.settings,
        updated_at = EXCLUDED.updated_at;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.save_leaderboard_privacy(BOOLEAN, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_leaderboard_privacy(BOOLEAN, JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_public_leaderboard_rank()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_rank INTEGER;
    visible_rank INTEGER;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    SELECT leaderboard.rank
    INTO current_rank
    FROM public.leaderboard_view AS leaderboard
    WHERE leaderboard.user_id = auth.uid();

    IF current_rank IS NULL OR NOT EXISTS (
        SELECT 1
        FROM public.profiles AS profile
        WHERE profile.id = auth.uid()
          AND profile.privacy_show_leaderboard IS TRUE
    ) THEN
        RETURN NULL;
    END IF;

    SELECT COUNT(*) + 1
    INTO visible_rank
    FROM public.leaderboard_view AS leaderboard
    JOIN public.profiles AS profile ON profile.id = leaderboard.user_id
    WHERE profile.privacy_show_leaderboard IS TRUE
      AND leaderboard.rank < current_rank;

    RETURN visible_rank;
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_leaderboard_rank() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_leaderboard_rank() TO authenticated;

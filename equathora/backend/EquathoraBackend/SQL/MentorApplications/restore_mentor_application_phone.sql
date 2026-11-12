BEGIN;

ALTER TABLE public.mentor_applications
    ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.mentor_applications
    DROP CONSTRAINT IF EXISTS mentor_applications_phone_check;

ALTER TABLE public.mentor_applications
    ADD CONSTRAINT mentor_applications_phone_check
    CHECK (
        phone IS NOT NULL
        AND CHAR_LENGTH(BTRIM(phone)) BETWEEN 5 AND 40
    ) NOT VALID;

COMMIT;

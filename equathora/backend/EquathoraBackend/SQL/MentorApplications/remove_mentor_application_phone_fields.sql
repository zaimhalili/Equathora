BEGIN;

ALTER TABLE public.mentor_applications
    DROP COLUMN IF EXISTS has_whatsapp;

COMMIT;

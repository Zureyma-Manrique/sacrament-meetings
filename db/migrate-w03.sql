-- One-time migration for databases created from the earlier schema.sql
-- (meeting_type without 'special', announcements stored as JSONB).
-- Run once: psql "$DATABASE_URL" -f db/migrate-w03.sql (or paste into the Neon SQL editor).

BEGIN;

ALTER TABLE meetings DROP CONSTRAINT IF EXISTS meetings_meeting_type_check;
ALTER TABLE meetings ADD CONSTRAINT meetings_meeting_type_check
  CHECK (meeting_type IN ('testimony', 'regular', 'stake', 'general', 'special'));

-- Postgres doesn't allow subqueries in ALTER COLUMN ... USING, so copy into a new column.
ALTER TABLE meetings ADD COLUMN announcements_new TEXT[] NOT NULL DEFAULT '{}';
UPDATE meetings SET announcements_new = ARRAY(SELECT jsonb_array_elements_text(announcements));
ALTER TABLE meetings DROP COLUMN announcements;
ALTER TABLE meetings RENAME COLUMN announcements_new TO announcements;

COMMIT;

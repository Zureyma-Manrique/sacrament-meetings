import { neon } from '@neondatabase/serverless';
import { currentSundayIso, todayIso } from './dates';
import type { SacramentMeeting } from './types';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to .env.local (see db/schema.sql).');
}

const sql = neon(process.env.DATABASE_URL);

export const ITEMS_PER_PAGE = 5;

/** Largest value a Postgres `integer` column can hold; larger ids can never match a row. */
const MAX_INT = 2_147_483_647;

/**
 * Column list shared by every SELECT: maps snake_case columns to the camelCase
 * fields of `SacramentMeeting`. `date::text` keeps the value as 'YYYY-MM-DD'
 * instead of letting the driver turn it into a time-zone-shifted Date.
 */
const MEETING_COLUMNS = sql.unsafe(`
  id,
  date::text AS date,
  meeting_type AS "meetingType",
  presiding,
  conducting,
  announcements,
  opening_hymn AS "openingHymn",
  opening_prayer AS "openingPrayer",
  ward_business AS "wardBusiness",
  stake_business AS "stakeBusiness",
  sacrament_hymn AS "sacramentHymn",
  speakers,
  closing_hymn AS "closingHymn",
  closing_prayer AS "closingPrayer"
`);

/** Parses a route/query id; returns null unless it is a plain positive integer that fits the id column. */
export function parseMeetingId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return id >= 1 && id <= MAX_INT ? id : null;
}

/**
 * One page of meetings, newest first, matching `query` (case-insensitive) in the
 * presiding or conducting leader, meeting type, speakers, or date.
 */
export async function getMeetings(query = '', currentPage = 1): Promise<SacramentMeeting[]> {
  const pattern = `%${query}%`;
  const offset = (Math.max(1, currentPage) - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT ${MEETING_COLUMNS}
    FROM meetings
    WHERE
      presiding ILIKE ${pattern} OR
      conducting ILIKE ${pattern} OR
      meeting_type ILIKE ${pattern} OR
      speakers::text ILIKE ${pattern} OR
      date::text ILIKE ${pattern}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
  return rows as SacramentMeeting[];
}

/** Number of pages `getMeetings` can return for `query` (0 when nothing matches). */
export async function getMeetingsTotalPages(query = ''): Promise<number> {
  const pattern = `%${query}%`;

  const rows = await sql`
    SELECT COUNT(*) AS count
    FROM meetings
    WHERE
      presiding ILIKE ${pattern} OR
      conducting ILIKE ${pattern} OR
      meeting_type ILIKE ${pattern} OR
      speakers::text ILIKE ${pattern} OR
      date::text ILIKE ${pattern}
  `;
  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | undefined> {
  const rows = await sql`SELECT ${MEETING_COLUMNS} FROM meetings WHERE id = ${id}`;
  return rows[0] as SacramentMeeting | undefined;
}

/**
 * The meeting for the current Sunday (today on Sundays, otherwise the upcoming
 * one). If none was planned for that Sunday, falls back to the latest meeting
 * on or before today.
 */
export async function getCurrentMeeting(now: Date = new Date()): Promise<SacramentMeeting | undefined> {
  const rows = await sql`
    SELECT ${MEETING_COLUMNS}
    FROM meetings
    WHERE date = ${currentSundayIso(now)} OR date <= ${todayIso(now)}
    ORDER BY date = ${currentSundayIso(now)} DESC, date DESC
    LIMIT 1
  `;
  return rows[0] as SacramentMeeting | undefined;
}

// Mutations are implemented in Week 04; the parameters document the planned signatures.
/* eslint-disable @typescript-eslint/no-unused-vars */

export async function addMeeting(_meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  throw new Error('addMeeting is not implemented yet (Week 04).');
}

export async function updateMeeting(
  _id: number,
  _meeting: Omit<SacramentMeeting, 'id'>,
): Promise<SacramentMeeting> {
  throw new Error('updateMeeting is not implemented yet (Week 04).');
}

export async function deleteMeeting(_id: number): Promise<void> {
  throw new Error('deleteMeeting is not implemented yet (Week 04).');
}
/* eslint-enable @typescript-eslint/no-unused-vars */

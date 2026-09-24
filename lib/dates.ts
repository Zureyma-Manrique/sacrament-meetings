/** Time zone the ward meets in; "today" and "this Sunday" are computed here, not in the server's zone. */
export const WARD_TIME_ZONE = 'America/Denver';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True when the value is a real calendar date in 'YYYY-MM-DD' form. */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Today's date in the ward's time zone as 'YYYY-MM-DD'. */
export function todayIso(now: Date = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: WARD_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** The most recent Sunday on or before today (ward time zone) as 'YYYY-MM-DD'. */
export function mostRecentSundayIso(now: Date = new Date()): string {
  const [year, month, day] = todayIso(now).split('-').map(Number);
  const today = new Date(Date.UTC(year, month - 1, day));
  today.setUTCDate(today.getUTCDate() - today.getUTCDay());
  return today.toISOString().slice(0, 10);
}

/** Formats a 'YYYY-MM-DD' date for display, e.g. "Sunday, September 20, 2026". */
export function formatMeetingDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Formats an instant as a long date in the ward's time zone. */
export function formatToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: WARD_TIME_ZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

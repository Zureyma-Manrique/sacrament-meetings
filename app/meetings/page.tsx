import type { Metadata } from 'next';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import { formatMeetingDate, isIsoDate } from '@/lib/dates';
import { getMeetings } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Meeting Programs',
};

export default async function MeetingsPage({ searchParams }: PageProps<'/meetings'>) {
  const { date: rawDate } = await searchParams;
  const requestedDate = typeof rawDate === 'string' && rawDate !== '' ? rawDate : undefined;
  const invalidDate = requestedDate !== undefined && !isIsoDate(requestedDate);
  const date = invalidDate ? undefined : requestedDate;

  const meetings = invalidDate ? [] : getMeetings(date);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl font-bold">Meeting Programs</h1>

      <form method="get" action="/meetings" className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium">
            Filter by date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={requestedDate}
            className="input"
            aria-describedby={invalidDate ? 'date-error' : undefined}
            aria-invalid={invalidDate || undefined}
          />
        </div>
        <button type="submit" className="btn">
          Apply filter
        </button>
        {requestedDate && (
          <Link href="/meetings" className="btn-secondary">
            Clear filter
          </Link>
        )}
      </form>

      {invalidDate && (
        <p id="date-error" role="alert" className="text-sm font-medium text-red-700">
          &ldquo;{requestedDate}&rdquo; is not a valid date. Use the YYYY-MM-DD format.
        </p>
      )}

      <section aria-labelledby="results-heading" className="flex flex-col gap-4">
        <h2 id="results-heading" className="font-heading text-xl font-semibold">
          {date ? `Programs for ${formatMeetingDate(date)}` : 'All programs'}
        </h2>
        {meetings.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {meetings.map((meeting) => (
              <li key={meeting.id}>
                <MeetingCard meeting={meeting} />
              </li>
            ))}
          </ul>
        ) : (
          !invalidDate && <p className="text-muted">No meetings found for that date.</p>
        )}
      </section>
    </div>
  );
}

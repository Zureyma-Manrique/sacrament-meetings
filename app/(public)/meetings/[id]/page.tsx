import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { auth } from '@/auth';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { formatMeetingDate, currentSundayIso } from '@/lib/dates';
import { MEETING_TYPE_LABELS } from '@/lib/meeting-labels';
import { getMeetingById, parseMeetingId } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

// Cached so generateMetadata and the page share one database query per request.
const loadMeeting = cache(async (rawId: string): Promise<SacramentMeeting> => {
  // Malformed, out-of-range, and unknown IDs all have no program page.
  const id = parseMeetingId(rawId);
  const meeting = id === null ? undefined : await getMeetingById(id);
  if (!meeting) notFound();
  return meeting;
});

export async function generateMetadata(
  { params }: PageProps<'/meetings/[id]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const meeting = await loadMeeting(id);
  const title = `Program for ${formatMeetingDate(meeting.date)}`;
  const speakers = meeting.speakers.filter((item) => item.type === 'speaker').map((item) => item.name);
  const description = [
    `${MEETING_TYPE_LABELS[meeting.meetingType]} on ${formatMeetingDate(meeting.date)}, conducted by ${meeting.conducting}.`,
    speakers.length > 0 ? `Speakers: ${speakers.join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    title,
    description,
    // Setting openGraph replaces the root layout's, so carry over its site name and preview image.
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: (await parent).openGraph?.siteName,
      images: (await parent).openGraph?.images,
    },
  };
}

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  const { id } = await params;
  const [meeting, session] = await Promise.all([loadMeeting(id), auth()]);

  const currentSunday = currentSundayIso();
  const timing =
    meeting.date === currentSunday ? 'Current' : meeting.date < currentSunday ? 'Past' : 'Upcoming';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <p className="text-sm text-muted">{timing} program</p>
          <h1 className="font-heading text-3xl font-bold">Sacrament Meeting Program</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/meetings" className="btn-secondary">
            Back to all programs
          </Link>
          {session?.user && (
            <Link href={`/meetings/${meeting.id}/edit`} className="btn-secondary">
              Edit program
            </Link>
          )}
          <PrintButton />
        </div>
      </div>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { formatMeetingDate, currentSundayIso } from '@/lib/dates';
import { getMeetingById } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

function loadMeeting(id: string): SacramentMeeting {
  // Only plain positive integers are valid IDs; malformed and unknown IDs both have no program page.
  const meeting = /^\d+$/.test(id) ? getMeetingById(Number(id)) : undefined;
  if (!meeting) notFound();
  return meeting;
}

export async function generateMetadata({ params }: PageProps<'/meetings/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const meeting = loadMeeting(id);
  return { title: `Program for ${formatMeetingDate(meeting.date)}` };
}

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  const { id } = await params;
  const meeting = loadMeeting(id);

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
        <div className="flex gap-3">
          <Link href="/meetings" className="btn-secondary">
            Back to all programs
          </Link>
          <PrintButton />
        </div>
      </div>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}

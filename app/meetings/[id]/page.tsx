import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { getBaseUrl } from '@/lib/api';
import { formatMeetingDate, mostRecentSundayIso } from '@/lib/dates';
import type { SacramentMeeting } from '@/lib/types';

async function fetchMeeting(id: string): Promise<SacramentMeeting> {
  const url = new URL(`/api/meetings/${encodeURIComponent(id)}`, await getBaseUrl());
  const response = await fetch(url, { cache: 'no-store' });

  // 400 (malformed id) and 404 (unknown id) both mean there is no such program page.
  if (response.status === 400 || response.status === 404) notFound();
  if (!response.ok) {
    throw new Error(`Failed to load meeting ${id} (HTTP ${response.status}).`);
  }
  return (await response.json()) as SacramentMeeting;
}

export async function generateMetadata({ params }: PageProps<'/meetings/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const meeting = await fetchMeeting(id);
  return { title: `Program for ${formatMeetingDate(meeting.date)}` };
}

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  const { id } = await params;
  const meeting = await fetchMeeting(id);

  const currentSunday = mostRecentSundayIso();
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

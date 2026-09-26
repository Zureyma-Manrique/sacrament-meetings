import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { formatMeetingDate } from '@/lib/dates';
import { meetingToFormValues } from '@/lib/meeting-form';
import { getMeetingById, parseMeetingId } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

// Cached so generateMetadata and the page share one database query per request.
const loadMeeting = cache(async (rawId: string): Promise<SacramentMeeting> => {
  const id = parseMeetingId(rawId);
  const meeting = id === null ? undefined : await getMeetingById(id);
  // Malformed, out-of-range, and unknown IDs all render not-found.tsx.
  if (!meeting) notFound();
  return meeting;
});

export async function generateMetadata({ params }: PageProps<'/meetings/[id]/edit'>): Promise<Metadata> {
  const { id } = await params;
  const meeting = await loadMeeting(id);
  return { title: `Edit Program for ${formatMeetingDate(meeting.date)}` };
}

export default async function EditMeetingPage({ params }: PageProps<'/meetings/[id]/edit'>) {
  const { id } = await params;
  const meeting = await loadMeeting(id);
  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Edit Meeting</h1>
        <p className="mt-2 text-muted">
          Program for <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
        </p>
      </div>
      <MeetingForm
        action={updateMeetingWithId}
        defaultValues={meetingToFormValues(meeting)}
        submitLabel="Save changes"
        pendingLabel="Saving…"
      />
    </div>
  );
}

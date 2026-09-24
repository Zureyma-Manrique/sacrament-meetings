import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentMeeting } from '@/lib/meetings-db';

export default async function CurrentMeetingPage() {
  // Resolve "current" at request time, not at build time.
  await connection();

  const meeting = await getCurrentMeeting();
  redirect(meeting ? `/meetings/${meeting.id}` : '/meetings');
}

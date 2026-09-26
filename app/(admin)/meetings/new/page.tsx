import type { Metadata } from 'next';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export const metadata: Metadata = {
  title: 'Create Meeting',
};

export default function NewMeetingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Create Meeting</h1>
        <p className="mt-2 text-muted">Plan a new sacrament meeting program.</p>
      </div>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" pendingLabel="Creating…" />
    </div>
  );
}

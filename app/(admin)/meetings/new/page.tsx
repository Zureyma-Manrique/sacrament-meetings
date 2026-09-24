import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create Meeting',
};

export default function NewMeetingPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-3xl font-bold">Create Meeting — Coming in Week 04</h1>
      <p className="text-muted">
        The form for planning a new sacrament meeting program will be added here.
      </p>
      <Link href="/meetings" className="btn-secondary self-start">
        Back to all programs
      </Link>
    </div>
  );
}

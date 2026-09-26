import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="font-heading text-3xl font-bold">Meeting not found</h1>
      <p className="text-muted">
        We couldn&rsquo;t find that meeting. It may have been deleted, or the link may be wrong.
      </p>
      <Link href="/meetings" className="btn">
        Back to all programs
      </Link>
    </div>
  );
}

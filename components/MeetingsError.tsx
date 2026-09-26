'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  /** Clears the error and re-renders the segment. */
  reset: () => void;
  /** Like reset, but also re-fetches the segment's server data (Next.js 16+). */
  retry?: () => void;
}

/** Error boundary UI shared by the public and admin meetings routes (their error.tsx files). */
export default function MeetingsError({ error, reset, retry }: MeetingsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="card flex flex-col items-start gap-4">
      <h1 className="font-heading text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted">
        We couldn&rsquo;t load or save the meeting program. This is usually temporary &mdash; please
        try again. If the problem continues, contact the ward clerk.
      </p>
      {error.digest && <p className="text-xs text-muted">Error reference: {error.digest}</p>}
      <div className="flex flex-wrap gap-3">
        {/* A database error is usually on the server, so retry re-fetches when available. */}
        <button type="button" onClick={() => (retry ?? reset)()} className="btn">
          Try again
        </button>
        <Link href="/meetings" className="btn-secondary">
          Back to all programs
        </Link>
      </div>
    </div>
  );
}

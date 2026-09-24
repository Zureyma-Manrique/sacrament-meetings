export default function MeetingsLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading meetings…</span>
      <div className="h-8 w-64 animate-pulse rounded bg-primary-soft" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="card h-40 animate-pulse bg-primary-soft/40" />
        ))}
      </div>
    </div>
  );
}

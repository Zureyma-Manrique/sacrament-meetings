export default function MeetingsListSkeleton() {
  return (
    <div role="status" aria-live="polite" className="grid gap-4 sm:grid-cols-2">
      <span className="sr-only">Loading meetings…</span>
      {[0, 1, 2, 3].map((key) => (
        <div key={key} className="card h-40 animate-pulse bg-primary-soft/40" />
      ))}
    </div>
  );
}

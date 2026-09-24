import { WARD_NAME } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface print:hidden">
      <div className="container-page py-6 text-sm text-muted">
        <p>
          {WARD_NAME} Sacrament Meeting Planner. Sacrament meeting is held each Sunday at 10:00 AM in
          the chapel.
        </p>
        <p className="mt-1">Questions about the program? Contact the ward executive secretary.</p>
      </div>
    </footer>
  );
}

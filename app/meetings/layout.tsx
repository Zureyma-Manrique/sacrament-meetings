import { connection } from 'next/server';
import NavLinks, { type NavLink } from '@/components/NavLinks';
import { getCurrentMeetingHref } from '@/lib/routes';

export default async function MeetingsLayout({ children }: LayoutProps<'/meetings'>) {
  // "Current program" depends on today's date, so resolve it per request.
  await connection();

  const meetingLinks: NavLink[] = [
    { href: '/meetings', label: 'All programs', exact: true },
    { href: getCurrentMeetingHref(), label: 'Current program', exact: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-muted">
          Sacrament Meetings
        </p>
        <NavLinks links={meetingLinks} label="Meetings" />
      </div>
      {children}
    </div>
  );
}

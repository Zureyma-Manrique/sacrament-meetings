import NavLinks, { type NavLink } from '@/components/NavLinks';

const MEETING_LINKS: NavLink[] = [
  { href: '/meetings', label: 'All programs', exact: true },
  { href: '/meetings/current', label: 'Current program' },
];

export default function MeetingsLayout({ children }: LayoutProps<'/meetings'>) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-muted">
          Sacrament Meetings
        </p>
        <NavLinks links={MEETING_LINKS} label="Meetings" />
      </div>
      {children}
    </div>
  );
}

import Link from 'next/link';
import { connection } from 'next/server';
import { formatToday, todayIso } from '@/lib/dates';
import { WARD_NAME } from '@/lib/site';

export default async function Header() {
  // Render per request so the displayed date is today's, not the build date.
  await connection();

  return (
    <header className="bg-primary text-primary-foreground print:hidden">
      <div className="container-page flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="focus-ring rounded-sm font-heading text-xl font-bold">
          {WARD_NAME}
        </Link>
        <p className="text-sm opacity-90">
          <time dateTime={todayIso()}>{formatToday()}</time>
        </p>
      </div>
    </header>
  );
}

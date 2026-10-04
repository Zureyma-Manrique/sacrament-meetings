import Link from 'next/link';
import { connection } from 'next/server';
import { auth } from '@/auth';
import SignOutButton from '@/components/SignOutButton';
import { formatToday, todayIso } from '@/lib/dates';
import { WARD_NAME } from '@/lib/site';

export default async function Header() {
  // Render per request so the displayed date is today's, not the build date.
  await connection();
  const session = await auth();

  return (
    <header className="bg-primary text-primary-foreground print:hidden">
      <div className="container-page flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="focus-ring rounded-sm font-heading text-xl font-bold">
          {WARD_NAME}
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <p className="opacity-90">
            <time dateTime={todayIso()}>{formatToday()}</time>
          </p>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span>
                <span className="sr-only">Signed in as </span>
                {session.user.name}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="focus-ring rounded-md border border-primary-foreground/60 px-3 py-1 font-medium hover:bg-primary-foreground/10"
            >
              Bishopric sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

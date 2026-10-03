import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const metadata: Metadata = {
  // Management pages are for the bishopric only; keep them out of search results.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already redirects signed-out visitors; this is a second check on the server.
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-4 print:hidden">
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-muted">
          Bishopric Admin
        </p>
      </div>
      {children}
    </div>
  );
}

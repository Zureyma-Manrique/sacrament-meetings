import type { Metadata } from 'next';
import { Suspense } from 'react';
import MeetingSearch from '@/components/MeetingSearch';
import MeetingsList from '@/components/MeetingsList';
import MeetingsListSkeleton from '@/components/MeetingsListSkeleton';
import Pagination from '@/components/Pagination';
import { getMeetingsTotalPages } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Meeting Programs',
};

export default async function MeetingsPage({ searchParams }: PageProps<'/meetings'>) {
  const { query: rawQuery, page: rawPage } = await searchParams;
  const query = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  // Anything that isn't a positive integer ("abc", "0", "-1") falls back to the first page.
  const currentPage = typeof rawPage === 'string' && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1;

  const totalPages = await getMeetingsTotalPages(query);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl font-bold">Meeting Programs</h1>

      <MeetingSearch placeholder="Try “Reyes”, “testimony”, or “2026-09”" />

      <section aria-labelledby="results-heading" className="flex flex-col gap-4">
        <h2 id="results-heading" className="font-heading text-xl font-semibold">
          {query ? <>Programs matching &ldquo;{query}&rdquo;</> : 'All programs'}
        </h2>
        {/* Keyed so the skeleton shows again while each new search or page loads. */}
        <Suspense key={`${query}:${currentPage}`} fallback={<MeetingsListSkeleton />}>
          <MeetingsList query={query} currentPage={currentPage} />
        </Suspense>
        <Pagination totalPages={totalPages} />
      </section>
    </div>
  );
}

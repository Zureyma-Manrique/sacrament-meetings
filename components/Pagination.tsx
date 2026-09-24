'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  // Keep every other parameter (such as `query`) so paging doesn't drop the active search.
  function pageHref(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const linkClass = 'focus-ring inline-block rounded-md px-3 py-2 text-sm font-medium';

  return (
    <nav aria-label="Pagination" className="print:hidden">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {currentPage > 1 ? (
            <Link href={pageHref(currentPage - 1)} className={`${linkClass} hover:bg-primary-soft`}>
              Previous
            </Link>
          ) : (
            <span className={`${linkClass} text-muted`} aria-disabled="true">
              Previous
            </span>
          )}
        </li>
        {pages.map((page) => {
          const active = page === currentPage;
          return (
            <li key={page}>
              <Link
                href={pageHref(page)}
                aria-current={active ? 'page' : undefined}
                aria-label={`Page ${page}`}
                className={`${linkClass} ${
                  active ? 'bg-primary text-primary-foreground' : 'hover:bg-primary-soft'
                }`}
              >
                {page}
              </Link>
            </li>
          );
        })}
        <li>
          {currentPage < totalPages ? (
            <Link href={pageHref(currentPage + 1)} className={`${linkClass} hover:bg-primary-soft`}>
              Next
            </Link>
          ) : (
            <span className={`${linkClass} text-muted`} aria-disabled="true">
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

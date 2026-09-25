'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface MeetingSearchProps {
  placeholder?: string;
}

export default function MeetingSearch({ placeholder = 'Search meetings…' }: MeetingSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const urlQuery = searchParams.get('query') ?? '';
  const inputRef = useRef<HTMLInputElement>(null);

  // The input is uncontrolled, so update it when the URL changes from outside
  // (back/forward, a shared link) but never while the user is typing in it.
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input) input.value = urlQuery;
  }, [urlQuery]);

  // Wait until typing pauses so each keystroke doesn't trigger a new database query.
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    // A new search starts over at the first page of results.
    params.delete('page');
    if (term.trim()) {
      params.set('query', term.trim());
    } else {
      params.delete('query');
    }
    const queryString = params.toString();
    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, 300);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="meeting-search" className="text-sm font-medium">
        Search programs
      </label>
      <input
        ref={inputRef}
        id="meeting-search"
        type="search"
        placeholder={placeholder}
        defaultValue={urlQuery}
        onChange={(event) => handleSearch(event.target.value)}
        className="input w-full sm:max-w-md"
        aria-describedby="meeting-search-hint"
      />
      <p id="meeting-search-hint" className="text-xs text-muted">
        Matches presiding or conducting leader, meeting type, speakers, topics, or date (YYYY-MM-DD).
      </p>
    </div>
  );
}

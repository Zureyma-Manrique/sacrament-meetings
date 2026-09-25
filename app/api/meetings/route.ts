import { NextResponse, type NextRequest } from 'next/server';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

const MAX_PAGE = 100_000;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') ?? '';
  const rawPage = searchParams.get('page') ?? '1';

  // Cap the page so the SQL OFFSET can't overflow.
  if (!/^\d+$/.test(rawPage) || Number(rawPage) < 1 || Number(rawPage) > MAX_PAGE) {
    return NextResponse.json(
      { error: `The "page" query parameter must be an integer from 1 to ${MAX_PAGE}.` },
      { status: 400 },
    );
  }

  const page = Number(rawPage);
  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, page),
    getMeetingsTotalPages(query),
  ]);

  return NextResponse.json({ meetings, page, totalPages });
}

import { NextResponse, type NextRequest } from 'next/server';
import { isIsoDate } from '@/lib/dates';
import { getMeetings } from '@/lib/meetings-db';

export function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? undefined;

  if (date !== undefined && !isIsoDate(date)) {
    return NextResponse.json(
      { error: 'The "date" query parameter must be a valid date in YYYY-MM-DD format.' },
      { status: 400 },
    );
  }

  return NextResponse.json(getMeetings(date));
}

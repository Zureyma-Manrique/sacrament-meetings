import { NextResponse, type NextRequest } from 'next/server';
import { getMeetingById, parseMeetingId } from '@/lib/meetings-db';

export async function GET(_request: NextRequest, ctx: RouteContext<'/api/meetings/[id]'>) {
  const { id: rawId } = await ctx.params;

  // Only plain positive integers are valid IDs ("abc", "1.5", "-2" and "1e3" are rejected).
  const id = parseMeetingId(rawId);
  if (id === null) {
    return NextResponse.json({ error: `Invalid meeting id "${rawId}".` }, { status: 400 });
  }

  const meeting = await getMeetingById(id);
  if (!meeting) {
    return NextResponse.json({ error: `Meeting ${rawId} not found.` }, { status: 404 });
  }

  return NextResponse.json(meeting);
}

import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';

interface MeetingsListProps {
  query: string;
  currentPage: number;
}

export default async function MeetingsList({ query, currentPage }: MeetingsListProps) {
  const meetings = await getMeetings(query, currentPage);

  if (meetings.length === 0) {
    return (
      <p className="text-muted">
        {query ? <>No programs match &ldquo;{query}&rdquo;.</> : 'No programs on this page.'}
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {meetings.map((meeting) => (
        <li key={meeting.id}>
          <MeetingCard meeting={meeting} />
        </li>
      ))}
    </ul>
  );
}

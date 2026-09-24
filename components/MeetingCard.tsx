import Link from 'next/link';
import { formatMeetingDate } from '@/lib/dates';
import { MEETING_TYPE_LABELS } from '@/lib/meeting-labels';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const speakerCount = meeting.speakers.filter((item) => item.type === 'speaker').length;

  return (
    <article className="card flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold">
          <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
        </h3>
        <span className="badge">{MEETING_TYPE_LABELS[meeting.meetingType]}</span>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted">Conducting</dt>
        <dd>{meeting.conducting}</dd>
        <dt className="text-muted">Opening hymn</dt>
        <dd>
          #{meeting.openingHymn.number} {meeting.openingHymn.title}
        </dd>
        <dt className="text-muted">Speakers</dt>
        <dd>{speakerCount > 0 ? speakerCount : 'None scheduled'}</dd>
      </dl>
      <Link
        href={`/meetings/${meeting.id}`}
        className="focus-ring mt-4 self-start rounded-md font-medium text-primary underline-offset-4 hover:underline"
      >
        View program
        <span className="sr-only"> for {formatMeetingDate(meeting.date)}</span>
      </Link>
    </article>
  );
}

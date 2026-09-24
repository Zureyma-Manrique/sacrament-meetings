import type { ReactNode } from 'react';
import { formatMeetingDate } from '@/lib/dates';
import { MEETING_TYPE_LABELS } from '@/lib/meeting-labels';
import type { Hymn, SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function HymnText({ hymn }: { hymn: Hymn }) {
  return (
    <>
      <span className="font-medium">#{hymn.number}</span> {hymn.title}
    </>
  );
}

function ProgramRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-2 last:border-b-0 sm:flex-row sm:gap-4 print:flex-row print:gap-4">
      <dt className="text-muted sm:w-40 sm:shrink-0 print:w-40 print:shrink-0">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ProgramSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 print:mt-4 print:block print:break-inside-avoid">
      <h3 className="font-heading text-lg font-semibold text-primary print:text-black">{title}</h3>
      {children}
    </section>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const isTestimonyMeeting = meeting.meetingType === 'testimony';

  return (
    <article className="card print:block print:border-0 print:p-0 print:shadow-none">
      <header className="border-b border-border pb-4 text-center">
        <p className="text-sm uppercase tracking-wide text-muted">
          {MEETING_TYPE_LABELS[meeting.meetingType]}
        </p>
        <h2 className="font-heading text-2xl font-bold">
          <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
        </h2>
      </header>

      <ProgramSection title="Leadership">
        <dl>
          <ProgramRow label="Presiding">{meeting.presiding}</ProgramRow>
          <ProgramRow label="Conducting">{meeting.conducting}</ProgramRow>
        </dl>
      </ProgramSection>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <ProgramSection title="Announcements">
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {meeting.announcements.map((announcement) => (
              <li key={announcement}>{announcement}</li>
            ))}
          </ul>
        </ProgramSection>
      )}

      <ProgramSection title="Opening">
        <dl>
          <ProgramRow label="Opening hymn">
            <HymnText hymn={meeting.openingHymn} />
          </ProgramRow>
          <ProgramRow label="Invocation">{meeting.openingPrayer}</ProgramRow>
        </dl>
      </ProgramSection>

      <ProgramSection title="Business">
        {meeting.wardBusiness.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {meeting.wardBusiness.map((item) => (
              <li key={item.description}>{item.description}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted">No ward business.</p>
        )}
        <p className="mt-2 text-sm">
          <span className="text-muted">Stake business: </span>
          {meeting.stakeBusiness ? 'Yes — stake business will be presented.' : 'None'}
        </p>
      </ProgramSection>

      <ProgramSection title="Administration of the Sacrament">
        <dl>
          <ProgramRow label="Sacrament hymn">
            <HymnText hymn={meeting.sacramentHymn} />
          </ProgramRow>
        </dl>
      </ProgramSection>

      <ProgramSection title={isTestimonyMeeting ? 'Testimonies' : 'Speakers & Music'}>
        {meeting.speakers.length > 0 ? (
          <ol className="mt-2 space-y-2">
            {meeting.speakers.map((item) => (
              <li key={`${item.type}-${item.name}-${item.topic}`} className="flex flex-col sm:flex-row sm:gap-4">
                <span className="text-muted sm:w-40 sm:shrink-0">
                  {item.type === 'musical-number' ? 'Musical number' : 'Speaker'}
                </span>
                <span>
                  <span className="font-medium">{item.name}</span>
                  {item.topic && <span className="text-muted"> — {item.topic}</span>}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-muted">
            {isTestimonyMeeting
              ? 'The pulpit is open for members to bear testimony.'
              : 'No speakers assigned.'}
          </p>
        )}
      </ProgramSection>

      <ProgramSection title="Closing">
        <dl>
          <ProgramRow label="Closing hymn">
            <HymnText hymn={meeting.closingHymn} />
          </ProgramRow>
          <ProgramRow label="Benediction">{meeting.closingPrayer}</ProgramRow>
        </dl>
      </ProgramSection>
    </article>
  );
}

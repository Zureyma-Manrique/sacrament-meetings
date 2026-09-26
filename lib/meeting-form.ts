import type { SacramentMeeting, SpeakerItem } from './types';

/**
 * Raw values of the meeting form, as the user typed them. Returned with a
 * failed submission so the form can show what was entered next to the errors.
 */
export interface MeetingFormValues {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  /** One announcement per line. */
  announcements: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  /** One business item per line. */
  wardBusiness: string;
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: { name: string; topic: string; type: string }[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
}

/**
 * Result of a create or update action. `errors` is keyed by field name, or by
 * path for speaker rows (e.g. "speakers.1.name").
 */
export interface MeetingFormState {
  message: string | null;
  errors: Record<string, string[]>;
  values?: MeetingFormValues;
}

export const initialMeetingFormState: MeetingFormState = { message: null, errors: {} };

export const EMPTY_SPEAKER: SpeakerItem = { name: '', topic: '', type: 'speaker' };

export const EMPTY_MEETING_FORM_VALUES: MeetingFormValues = {
  date: '',
  meetingType: 'regular',
  presiding: '',
  conducting: '',
  announcements: '',
  openingHymnNumber: '',
  openingHymnTitle: '',
  openingPrayer: '',
  wardBusiness: '',
  stakeBusiness: false,
  sacramentHymnNumber: '',
  sacramentHymnTitle: '',
  speakers: [],
  closingHymnNumber: '',
  closingHymnTitle: '',
  closingPrayer: '',
};

/** Form values that prefill the edit form with an existing meeting. */
export function meetingToFormValues(meeting: SacramentMeeting): MeetingFormValues {
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join('\n'),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join('\n'),
    stakeBusiness: meeting.stakeBusiness,
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers.map((item) => ({ ...item })),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

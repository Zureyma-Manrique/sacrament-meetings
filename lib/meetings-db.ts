import { currentSundayIso, todayIso } from './dates';
import type { SacramentMeeting } from './types';

const BISHOP = 'Bishop Daniel Reyes';
const FIRST_COUNSELOR = 'Brother Samuel Ortega';
const SECOND_COUNSELOR = 'Brother Michael Chen';

const meetings: readonly SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-08-30',
    meetingType: 'regular',
    presiding: BISHOP,
    conducting: FIRST_COUNSELOR,
    announcements: [
      'Ward temple night is Thursday, September 3 at 7:00 PM.',
      'Youth back-to-school activity Wednesday at the church.',
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Ana Morales',
    wardBusiness: [
      { description: 'Release of Sister Laura Kim as Primary pianist, with a vote of thanks.' },
      { description: 'Sustaining of Brother Jacob Price as Sunday School teacher.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
    speakers: [
      { name: 'Sister Emily Tanner', topic: 'Ministering like the Savior', type: 'speaker' },
      { name: 'Brother Carlos Vega', topic: 'Faith in hard times', type: 'speaker' },
      { name: 'Primary children', topic: 'I Am a Child of God', type: 'musical-number' },
      { name: 'Brother Samuel Ortega', topic: 'The blessings of covenants', type: 'speaker' },
    ],
    closingHymn: { number: 85, title: 'How Firm a Foundation' },
    closingPrayer: 'Brother Thomas Lee',
  },
  {
    id: 2,
    date: '2026-09-06',
    meetingType: 'testimony',
    presiding: BISHOP,
    conducting: BISHOP,
    announcements: ['Fast offerings may be given to any member of the bishopric.'],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Sister Grace Walker',
    wardBusiness: [
      { description: 'Confirmation of Olivia Martinez as a member of the Church.' },
      { description: 'Baby blessing: Noah James Harris.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [],
    closingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    closingPrayer: 'Brother David Nguyen',
  },
  {
    id: 3,
    date: '2026-09-13',
    meetingType: 'stake',
    presiding: 'President Robert Allen, Stake President',
    conducting: 'President James Holt, First Counselor',
    announcements: ['Stake conference is held at the stake center; there are no ward meetings today.'],
    openingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    openingPrayer: 'Sister Rebecca Young',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 181, title: 'Jesus of Nazareth, Savior and King' },
    speakers: [
      { name: 'Sister Hannah Brooks, Stake Relief Society President', topic: 'Gathering Israel', type: 'speaker' },
      { name: 'Stake choir', topic: 'Come, Thou Fount of Every Blessing', type: 'musical-number' },
      { name: 'President Robert Allen', topic: 'Following living prophets', type: 'speaker' },
    ],
    closingHymn: { number: 27, title: 'Praise to the Man' },
    closingPrayer: 'Brother Kevin Wright',
  },
  {
    id: 4,
    date: '2026-09-20',
    meetingType: 'regular',
    presiding: BISHOP,
    conducting: SECOND_COUNSELOR,
    announcements: [
      'General Conference will be broadcast October 3–4; there will be no ward meetings on October 4.',
      'The Relief Society service project is Saturday at 9:00 AM.',
    ],
    openingHymn: { number: 98, title: 'I Need Thee Every Hour' },
    openingPrayer: 'Sister Maria Lopez',
    wardBusiness: [
      { description: 'Sustaining of Sister Rachel Adams as Young Women president.' },
      { description: 'Ordination of Ethan Clark to the office of priest.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Ethan Clark', topic: 'Preparing to serve a mission', type: 'speaker' },
      { name: 'Sister Rachel Adams', topic: 'Strengthening the rising generation', type: 'speaker' },
      { name: 'Sister Kim and Sister Patel', topic: 'Where Can I Turn for Peace?', type: 'musical-number' },
      { name: 'Brother Joseph Bennett', topic: 'The Atonement of Jesus Christ', type: 'speaker' },
    ],
    closingHymn: { number: 301, title: 'I Am a Child of God' },
    closingPrayer: 'Brother Andrew Scott',
  },
  {
    id: 5,
    date: '2026-09-27',
    meetingType: 'regular',
    presiding: BISHOP,
    conducting: FIRST_COUNSELOR,
    announcements: ['Tithing declaration appointments begin in November; sign-ups are in the foyer.'],
    openingHymn: { number: 5, title: 'High on the Mountain Top' },
    openingPrayer: 'Sister Julia Ramirez',
    wardBusiness: [{ description: 'Sustaining of Brother Nathan Hill as ward clerk.' }],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: 'O God, the Eternal Father' },
    speakers: [
      { name: 'Sister Sophia Turner', topic: 'Gratitude', type: 'speaker' },
      { name: 'Brother Nathan Hill', topic: 'The Book of Mormon', type: 'speaker' },
    ],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'Brother Isaac Moore',
  },
  {
    id: 6,
    date: '2026-10-04',
    meetingType: 'general',
    presiding: 'President of the Church',
    conducting: 'A member of the First Presidency',
    announcements: ['General Conference Sunday morning session broadcast; no ward sacrament meeting.'],
    openingHymn: { number: 21, title: 'Come, Listen to a Prophet’s Voice' },
    openingPrayer: 'As assigned',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 196, title: 'Jesus, Once of Humble Birth' },
    speakers: [],
    closingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    closingPrayer: 'As assigned',
  },
];

function byDateDescending(a: SacramentMeeting, b: SacramentMeeting): number {
  return b.date.localeCompare(a.date);
}

/** All meetings, newest first. When `date` is given, only meetings on that date. */
export function getMeetings(date?: string): SacramentMeeting[] {
  const matches = date ? meetings.filter((meeting) => meeting.date === date) : meetings;
  return [...matches].sort(byDateDescending);
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}

/**
 * The meeting for the current Sunday (today on Sundays, otherwise the upcoming
 * one). If none was planned for that Sunday, falls back to the latest meeting
 * on or before today.
 */
export function getCurrentMeeting(now: Date = new Date()): SacramentMeeting | undefined {
  const sunday = currentSundayIso(now);
  const exact = meetings.find((meeting) => meeting.date === sunday);
  if (exact) return exact;

  const today = todayIso(now);
  return getMeetings().find((meeting) => meeting.date <= today);
}

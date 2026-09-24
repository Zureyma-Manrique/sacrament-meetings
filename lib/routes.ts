import { getCurrentMeeting } from './meetings-db';

/**
 * Direct URL of the current Sunday's program. Nav links use this instead of
 * `/meetings/current` so they skip the redirect and can show as active on that page.
 */
export function getCurrentMeetingHref(): string {
  const meeting = getCurrentMeeting();
  return meeting ? `/meetings/${meeting.id}` : '/meetings/current';
}

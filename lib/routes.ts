import { getCurrentMeeting } from './meetings-db';

/**
 * Direct URL of the current Sunday's program. Nav links use this instead of
 * `/meetings/current` so they skip the redirect and can show as active on that page.
 */
export async function getCurrentMeetingHref(): Promise<string> {
  const meeting = await getCurrentMeeting();
  return meeting ? `/meetings/${meeting.id}` : '/meetings/current';
}

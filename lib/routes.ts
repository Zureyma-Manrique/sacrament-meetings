import { cache } from 'react';
import { getCurrentMeeting } from './meetings-db';

/**
 * Direct URL of the current Sunday's program. Nav links use this instead of
 * `/meetings/current` so they skip the redirect and can show as active on that page.
 * Cached so the layouts and home page that all need it share one query per request.
 */
export const getCurrentMeetingHref = cache(async (): Promise<string> => {
  const meeting = await getCurrentMeeting();
  return meeting ? `/meetings/${meeting.id}` : '/meetings/current';
});

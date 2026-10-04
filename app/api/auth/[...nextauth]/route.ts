import { handlers } from '@/auth';

// Auth.js endpoints (session, CSRF token, sign-out) used by next-auth.
export const { GET, POST } = handlers;

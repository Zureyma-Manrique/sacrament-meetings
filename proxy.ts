import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Runs the `authorized` callback in auth.config.ts before these pages render,
// redirecting signed-out visitors to /login. Server Actions check the session too.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/meetings/new', '/meetings/:id/edit', '/login'],
};

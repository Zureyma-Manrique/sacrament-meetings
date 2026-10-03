import type { NextAuthConfig } from 'next-auth';

/** Meeting management pages: creating a meeting and editing one. */
export function isProtectedPath(pathname: string): boolean {
  return pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit\/?$/.test(pathname);
}

/**
 * Settings that are safe to run in proxy.ts: no database or bcrypt imports.
 * auth.ts adds the Credentials provider on top of these.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  // The app is served from Vercel or localhost, and Auth.js should trust that host.
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);

      // Returning false sends the visitor to /login?callbackUrl=<this page>.
      if (isProtectedPath(nextUrl.pathname)) return isLoggedIn;

      // Someone already signed in has no reason to see the login form.
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }
      return true;
    },
    // Keep the database id on the session so it's available to Server Actions.
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

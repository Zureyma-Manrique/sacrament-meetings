import type { Metadata } from 'next';
import { connection } from 'next/server';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NavLinks, { type NavLink } from '@/components/NavLinks';
import { getCurrentMeetingHref } from '@/lib/routes';
import { WARD_NAME } from '@/lib/site';
// Self-hosted from npm rather than next/font/google, which fails in Vercel builds.
import '@fontsource-variable/inter/wght.css';
import '@fontsource/merriweather/latin-400.css';
import '@fontsource/merriweather/latin-700.css';
import './globals.css';

const SITE_DESCRIPTION = `Plan, view, and print sacrament meeting programs for the ${WARD_NAME}: hymns, prayers, speakers, announcements, and ward business.`;

const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: `${WARD_NAME} Sacrament Meeting Planner: plan, view, and print weekly sacrament meeting programs, with an illustration of a white chapel.`,
};

// Absolute base for Open Graph image URLs. Vercel sets the production domain; locally it's localhost.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Sacrament Meeting Planner | ${WARD_NAME}`,
    template: `%s | ${WARD_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Sacrament Meeting Planner',
  keywords: ['sacrament meeting', 'program', 'bishopric', 'ward', WARD_NAME],
  // Preview image for shared links (public/og-image.png). Child pages that set their own openGraph carry it over.
  openGraph: {
    type: 'website',
    siteName: `${WARD_NAME} Sacrament Meeting Planner`,
    title: `Sacrament Meeting Planner | ${WARD_NAME}`,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  // "This Sunday" depends on today's date, so resolve it per request.
  await connection();

  const mainLinks: NavLink[] = [
    { href: '/', label: 'Home', exact: true },
    { href: '/meetings', label: 'Meetings' },
    { href: await getCurrentMeetingHref(), label: 'This Sunday', exact: true },
  ];

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main-content"
          className="focus-ring sr-only rounded-md bg-surface px-3 py-2 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to main content
        </a>
        <Header />
        <div className="border-b border-border bg-surface print:hidden">
          <div className="container-page py-2">
            <NavLinks links={mainLinks} />
          </div>
        </div>
        <main id="main-content" className="container-page flex-1 py-8 print:py-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

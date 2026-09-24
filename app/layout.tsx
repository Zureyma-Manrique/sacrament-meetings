import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NavLinks from '@/components/NavLinks';
import { WARD_NAME } from '@/lib/site';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: `Sacrament Meeting Planner | ${WARD_NAME}`,
    template: `%s | ${WARD_NAME}`,
  },
  description: `Plan, view, and print sacrament meeting programs for the ${WARD_NAME}.`,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} h-full antialiased`}>
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
            <NavLinks />
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
